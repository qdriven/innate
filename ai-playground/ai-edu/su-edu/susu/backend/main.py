"""
Susu Backend API Service
Provides APIs for topic management, content updates, and AI-powered content generation.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from datetime import datetime
import uuid

app = FastAPI(
    title="Susu API",
    description="Backend service for Susu interactive learning platform",
    version="0.1.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Formula(BaseModel):
    id: str
    name: str
    latex: str
    description: str

class QuizQuestion(BaseModel):
    id: str
    question: str
    options: List[str]
    correctIndex: int
    explanation: str

class VisualizationControl(BaseModel):
    id: str
    label: str
    type: str  # slider, toggle, select
    min: Optional[float] = None
    max: Optional[float] = None
    step: Optional[float] = None
    defaultValue: float | bool | str
    options: Optional[List[dict]] = None

class VisualizationConfig(BaseModel):
    type: str
    parameters: dict
    controls: List[VisualizationControl]

class TopicContent(BaseModel):
    learningObjectives: List[str] = []
    formulas: Optional[List[Formula]] = None
    principles: List[str] = []
    realWorldApplications: Optional[List[str]] = None
    extendedReading: Optional[List[str]] = None
    quizQuestions: Optional[List[QuizQuestion]] = None
    visualization: Optional[VisualizationConfig] = None
    markdownContent: Optional[str] = None
    htmlContent: Optional[str] = None

class Flashcard(BaseModel):
    id: str
    question: str
    answer: str
    difficulty: Optional[str] = None

class Topic(BaseModel):
    id: str
    name: str
    nameEn: Optional[str] = None
    icon: str
    description: str
    subject: str
    renderMode: str
    content: TopicContent
    flashcards: List[Flashcard] = []
    videoUrl: Optional[str] = None
    createdAt: str
    updatedAt: str
    version: int

class TopicCreate(BaseModel):
    name: str
    nameEn: Optional[str] = None
    icon: str = "📚"
    description: str = ""
    subject: Optional[str] = None
    videoUrl: Optional[str] = None

class GenerateFlashcardsRequest(BaseModel):
    topic_name: str
    count: int = 10

class GenerateQuizRequest(BaseModel):
    topic_name: str
    content_summary: str
    count: int = 5

class UpdateManifest(BaseModel):
    version: str
    releaseDate: str
    changes: List[str]
    topics: List[dict]

# Data storage
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
TOPICS_FILE = os.path.join(DATA_DIR, "topics.json")

def ensure_data_dir():
    """Ensure data directory exists"""
    os.makedirs(DATA_DIR, exist_ok=True)

def load_topics() -> List[Topic]:
    """Load topics from JSON file"""
    ensure_data_dir()
    if os.path.exists(TOPICS_FILE):
        with open(TOPICS_FILE, "r", encoding="utf-8") as f:
            return [Topic(**t) for t in json.load(f)]
    return []

def save_topics(topics: List[Topic]):
    """Save topics to JSON file"""
    ensure_data_dir()
    with open(TOPICS_FILE, "w", encoding="utf-8") as f:
        json.dump([t.model_dump() for t in topics], f, ensure_ascii=False, indent=2)

def detect_subject(topic_name: str) -> str:
    """Detect subject from topic name"""
    keywords = {
        "physics": ["力学", "运动", "牛顿", "电磁", "波动", "量子", "相对论", "force", "motion", "newton"],
        "chemistry": ["化学", "分子", "反应", "酸碱", "氧化", "元素", "chemistry", "molecule"],
        "biology": ["生物", "细胞", "DNA", "基因", "光合", "呼吸", "biology", "cell", "gene"],
        "math": ["数学", "函数", "方程", "几何", "微积分", "三角", "math", "function", "equation"],
        "astronomy": ["天文", "星球", "宇宙", "黑洞", "行星", "astronomy", "planet", "universe"],
        "programming": ["编程", "算法", "数据结构", "代码", "programming", "algorithm"],
    }

    lower_name = topic_name.lower()
    for subject, words in keywords.items():
        if any(word in lower_name for word in words):
            return subject
    return "general"

def detect_render_mode(topic_name: str) -> str:
    """Detect render mode from topic name"""
    three_keywords = ["运动", "粒子", "碰撞", "旋转", "天体", "分子", "机械", "力", "磁场"]
    svg_keywords = ["函数", "图像", "曲线", "图表", "统计", "证明", "几何", "坐标"]
    hybrid_keywords = ["牛顿", "运动定律", "波动", "振动", "电磁", "能量"]

    lower_name = topic_name.lower()
    has_three = any(k in lower_name for k in three_keywords)
    has_svg = any(k in lower_name for k in svg_keywords)
    has_hybrid = any(k in lower_name for k in hybrid_keywords)

    if has_hybrid or (has_three and has_svg):
        return "hybrid"
    if has_svg:
        return "svg"
    return "three"

# API endpoints
@app.get("/")
async def root():
    return {"message": "Susu API", "version": "0.1.0"}

@app.get("/topics", response_model=List[Topic])
async def get_topics():
    """Get all topics"""
    return load_topics()

@app.get("/topics/{topic_id}", response_model=Topic)
async def get_topic(topic_id: str):
    """Get a specific topic by ID"""
    topics = load_topics()
    for topic in topics:
        if topic.id == topic_id:
            return topic
    raise HTTPException(status_code=404, detail="Topic not found")

@app.post("/topics", response_model=Topic)
async def create_topic(topic_data: TopicCreate):
    """Create a new topic"""
    topics = load_topics()

    new_topic = Topic(
        id=str(uuid.uuid4()),
        name=topic_data.name,
        nameEn=topic_data.nameEn,
        icon=topic_data.icon,
        description=topic_data.description or f"学习{topic_data.name}",
        subject=topic_data.subject or detect_subject(topic_data.name),
        renderMode=detect_render_mode(topic_data.name),
        content=TopicContent(
            learningObjectives=[],
            principles=[],
        ),
        flashcards=[],
        videoUrl=topic_data.videoUrl,
        createdAt=datetime.utcnow().isoformat(),
        updatedAt=datetime.utcnow().isoformat(),
        version=1
    )

    topics.append(new_topic)
    save_topics(topics)
    return new_topic

@app.put("/topics/{topic_id}", response_model=Topic)
async def update_topic(topic_id: str, topic_data: Topic):
    """Update a topic"""
    topics = load_topics()

    for i, topic in enumerate(topics):
        if topic.id == topic_id:
            topic_data.updatedAt = datetime.utcnow().isoformat()
            topic_data.version = topic.version + 1
            topics[i] = topic_data
            save_topics(topics)
            return topic_data

    raise HTTPException(status_code=404, detail="Topic not found")

@app.delete("/topics/{topic_id}")
async def delete_topic(topic_id: str):
    """Delete a topic"""
    topics = load_topics()

    for i, topic in enumerate(topics):
        if topic.id == topic_id:
            topics.pop(i)
            save_topics(topics)
            return {"message": "Topic deleted"}

    raise HTTPException(status_code=404, detail="Topic not found")

@app.post("/topics/{topic_id}/flashcards")
async def add_flashcard(topic_id: str, flashcard: Flashcard):
    """Add a flashcard to a topic"""
    topics = load_topics()

    for topic in topics:
        if topic.id == topic_id:
            topic.flashcards.append(flashcard)
            topic.updatedAt = datetime.utcnow().isoformat()
            topic.version += 1
            save_topics(topics)
            return {"message": "Flashcard added", "flashcard": flashcard}

    raise HTTPException(status_code=404, detail="Topic not found")

@app.post("/generate/flashcards")
async def generate_flashcards(request: GenerateFlashcardsRequest):
    """
    Generate flashcards for a topic using AI.
    This endpoint would typically call an AI service like Gemini.
    For now, it returns a placeholder response.
    """
    # In production, this would call an AI service
    # For now, return placeholder flashcards
    flashcards = []
    for i in range(request.count):
        flashcards.append({
            "id": str(uuid.uuid4()),
            "question": f"关于 {request.topic_name} 的问题 {i+1}",
            "answer": f"这是关于 {request.topic_name} 的答案 {i+1}",
            "difficulty": "medium"
        })

    return {"flashcards": flashcards}

@app.post("/generate/quiz")
async def generate_quiz(request: GenerateQuizRequest):
    """
    Generate quiz questions for a topic using AI.
    """
    # In production, this would call an AI service
    questions = []
    for i in range(request.count):
        questions.append({
            "id": str(uuid.uuid4()),
            "question": f"关于 {request.topic_name} 的测验题 {i+1}",
            "options": ["选项A", "选项B", "选项C", "选项D"],
            "correctIndex": 0,
            "explanation": "这是答案的解释"
        })

    return {"questions": questions}

@app.get("/updates/manifest")
async def get_update_manifest():
    """Get the update manifest for checking updates"""
    manifest_path = os.path.join(DATA_DIR, "manifest.json")
    if os.path.exists(manifest_path):
        with open(manifest_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "version": "0.1.0",
        "releaseDate": datetime.utcnow().isoformat(),
        "changes": [],
        "topics": []
    }

@app.get("/updates/check")
async def check_updates(current_version: str):
    """Check if updates are available"""
    manifest = await get_update_manifest()
    return {
        "hasUpdate": manifest["version"] != current_version,
        "latestVersion": manifest["version"],
        "releaseDate": manifest["releaseDate"],
        "changes": manifest["changes"]
    }

@app.post("/import")
async def import_topics(topics: List[Topic]):
    """Import topics from JSON"""
    existing_topics = load_topics()
    existing_ids = {t.id for t in existing_topics}

    added = 0
    updated = 0

    for topic in topics:
        if topic.id in existing_ids:
            # Update if newer version
            for i, existing in enumerate(existing_topics):
                if existing.id == topic.id and topic.version > existing.version:
                    existing_topics[i] = topic
                    updated += 1
                    break
        else:
            existing_topics.append(topic)
            added += 1

    save_topics(existing_topics)
    return {"added": added, "updated": updated, "total": len(existing_topics)}

@app.get("/export")
async def export_topics():
    """Export all topics as JSON"""
    return load_topics()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)