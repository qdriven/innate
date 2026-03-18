from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from datetime import datetime

app = FastAPI(
    title="Learn Together API",
    description="Backend API for Learn Together application",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "data/learn_together_data.json"

class Flashcard(BaseModel):
    id: str
    question: str
    answer: str

class TopicContent(BaseModel):
    id: str
    title: str
    type: str
    content: str
    order: int

class Topic(BaseModel):
    id: str
    name: str
    icon: str
    description: str
    videoUrl: Optional[str] = None
    category: str
    tags: List[str] = []
    difficulty: str = "beginner"
    contents: List[TopicContent] = []
    flashcards: List[Flashcard] = []
    createdAt: str
    updatedAt: str
    version: int = 1

class Category(BaseModel):
    id: str
    name: str
    icon: str
    description: str
    topics: List[Topic] = []

class AppData(BaseModel):
    categories: List[Category]
    version: str = "1.0.0"
    lastUpdated: str

def load_data() -> dict:
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"categories": [], "version": "1.0.0", "lastUpdated": datetime.now().isoformat()}

def save_data(data: dict):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    data["lastUpdated"] = datetime.now().isoformat()
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@app.get("/")
async def root():
    return {"message": "Learn Together API", "version": "1.0.0"}

@app.get("/api/data")
async def get_data():
    return load_data()

@app.post("/api/data")
async def update_data(data: AppData):
    save_data(data.dict())
    return {"message": "Data saved successfully", "lastUpdated": datetime.now().isoformat()}

@app.get("/api/categories")
async def get_categories():
    data = load_data()
    return data.get("categories", [])

@app.post("/api/categories")
async def add_category(category: Category):
    data = load_data()
    data["categories"].append(category.dict())
    save_data(data)
    return {"message": "Category added successfully", "category": category}

@app.put("/api/categories/{category_id}")
async def update_category(category_id: str, category: Category):
    data = load_data()
    for i, c in enumerate(data["categories"]):
        if c["id"] == category_id:
            data["categories"][i] = category.dict()
            save_data(data)
            return {"message": "Category updated successfully", "category": category}
    raise HTTPException(status_code=404, detail="Category not found")

@app.delete("/api/categories/{category_id}")
async def delete_category(category_id: str):
    data = load_data()
    data["categories"] = [c for c in data["categories"] if c["id"] != category_id]
    save_data(data)
    return {"message": "Category deleted successfully"}

@app.get("/api/topics/{topic_id}")
async def get_topic(topic_id: str):
    data = load_data()
    for category in data["categories"]:
        for topic in category.get("topics", []):
            if topic["id"] == topic_id:
                return topic
    raise HTTPException(status_code=404, detail="Topic not found")

@app.post("/api/topics/generate-flashcards")
async def generate_flashcards(topic: str, count: int = 10):
    return {
        "message": "Flashcard generation requires Gemini API",
        "topic": topic,
        "count": count
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
