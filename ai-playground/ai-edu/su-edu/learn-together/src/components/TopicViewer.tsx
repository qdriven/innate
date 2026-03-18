
"use client";

import { useState } from "react";
import { Topic } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { extractVideoInfo, detectSubjectTheme } from "@/lib/utils";
import { interactiveLessons, getLessonsBySubject } from "@/lib/lessons";
import { Play, FileText, Layers, BookOpen, ExternalLink, Box } from "lucide-react";

interface TopicViewerProps {
  topic: Topic;
}

function VideoPlayer({ url }: { url?: string }) {
  const videoInfo = extractVideoInfo(url || "");

  if (!videoInfo.type || !videoInfo.idOrUrl) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No video available for this topic</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-lg overflow-hidden bg-black">
      {videoInfo.type === "youtube" && (
        <iframe
          src={`https://www.youtube.com/embed/${videoInfo.idOrUrl}?rel=0&modestbranding=1`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
      {videoInfo.type === "bilibili" && (
        <iframe
          src={`//player.bilibili.com/player.html?bvid=${videoInfo.idOrUrl}&page=1&high_quality=1&danmaku=0`}
          className="w-full h-full"
          scrolling="no"
          allowFullScreen
        />
      )}
    </div>
  );
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

function InteractiveContent({ content }: { content: string }) {
  return (
    <div
      className="w-full min-h-[400px] rounded-lg overflow-hidden"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

function LessonCard({ lesson, onSelect }: { lesson: typeof interactiveLessons[0]; onSelect: () => void }) {
  const subjectColors: Record<string, string> = {
    physics: "from-blue-500 to-cyan-500",
    chemistry: "from-orange-500 to-red-500",
    biology: "from-green-500 to-emerald-500",
    math: "from-yellow-500 to-amber-500",
    astronomy: "from-indigo-500 to-purple-500",
  };

  const subjectIcons: Record<string, string> = {
    physics: "⚛️",
    chemistry: "🧪",
    biology: "🧬",
    math: "📐",
    astronomy: "🌌",
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]" onClick={onSelect}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${subjectColors[lesson.subject]} flex items-center justify-center text-2xl`}>
            {subjectIcons[lesson.subject]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{lesson.title}</h3>
              <span className="text-xs text-muted-foreground">{lesson.titleEn}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {lesson.description}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="secondary" className="text-xs capitalize">{lesson.subject}</Badge>
              <Badge variant="outline" className="text-xs">{lesson.difficulty}</Badge>
              {lesson.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InteractiveLessonViewer({ lessonId }: { lessonId: string }) {
  const lesson = interactiveLessons.find((l) => l.id === lessonId);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!lesson) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Box className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Lesson not found</p>
        </div>
      </div>
    );
  }

  const openInNewTab = () => {
    window.open(lesson.htmlPath, '_blank');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div>
          <h2 className="font-semibold">{lesson.title}</h2>
          <p className="text-sm text-muted-foreground">{lesson.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={openInNewTab}>
            <ExternalLink className="h-4 w-4 mr-2" />
            新窗口打开
          </Button>
        </div>
      </div>
      <div className="flex-1 relative">
        <iframe
          src={lesson.htmlPath}
          className="w-full h-full min-h-[600px] border-0"
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  );
}

export function TopicViewer({ topic }: TopicViewerProps) {
  const [activeTab, setActiveTab] = useState("content");
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const theme = detectSubjectTheme(topic.name);

  const themeColors: Record<string, string> = {
    physics: "from-blue-500 to-cyan-500",
    chemistry: "from-orange-500 to-red-500",
    biology: "from-green-500 to-emerald-500",
    math: "from-yellow-500 to-amber-500",
    astronomy: "from-indigo-500 to-blue-500",
    programming: "from-green-500 to-teal-500",
    default: "from-primary to-primary/50",
  };

  const subjectMap: Record<string, 'physics' | 'chemistry' | 'biology' | 'math' | 'astronomy'> = {
    physics: 'physics',
    chemistry: 'chemistry',
    biology: 'biology',
    math: 'math',
    astronomy: 'astronomy',
    Science: 'physics',
    Mathematics: 'math',
  };

  const subjectKey = subjectMap[topic.category] || subjectMap[theme] || 'physics';
  const relatedLessons = getLessonsBySubject(subjectKey);

  return (
    <div className="h-full flex flex-col">
      <div className={`bg-gradient-to-r ${themeColors[theme]} p-6 text-white`}>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{topic.icon}</span>
          <div>
            <h1 className="text-2xl font-bold">{topic.name}</h1>
            <p className="text-sm opacity-90">{topic.description}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Badge variant="secondary">{topic.category}</Badge>
          <Badge variant="outline">{topic.difficulty}</Badge>
          {topic.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList className="bg-transparent">
            <TabsTrigger value="content" className="gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="video" className="gap-2">
              <Play className="h-4 w-4" />
              Video
            </TabsTrigger>
            <TabsTrigger value="interactive" className="gap-2">
              <Layers className="h-4 w-4" />
              Interactive
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Flashcards ({topic.flashcards.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <TabsContent value="content" className="mt-0">
            <div className="space-y-6">
              {topic.contents.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No content available. Add content in Admin panel.
                  </CardContent>
                </Card>
              ) : (
                topic.contents
                  .sort((a, b) => a.order - b.order)
                  .map((content) => (
                    <Card key={content.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{content.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {content.type === "markdown" && <MarkdownContent content={content.content} />}
                        {content.type === "html" && (
                          <div dangerouslySetInnerHTML={{ __html: content.content }} />
                        )}
                        {content.type === "interactive" && <InteractiveContent content={content.content} />}
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="video" className="mt-0">
            <VideoPlayer url={topic.videoUrl} />
          </TabsContent>

          <TabsContent value="interactive" className="mt-0 h-full">
            {selectedLessonId ? (
              <div className="h-[calc(100vh-300px)]">
                <InteractiveLessonViewer lessonId={selectedLessonId} />
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => setSelectedLessonId(null)}
                >
                  ← 返回课程列表
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">3D 交互式课程</h2>
                  <Badge variant="secondary">{relatedLessons.length} 可用</Badge>
                </div>
                {relatedLessons.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      <Box className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>该学科暂无3D交互式课程</p>
                      <p className="text-sm mt-2">
                        请查看其他学科的交互式内容
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedLessons.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        onSelect={() => setSelectedLessonId(lesson.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="flashcards" className="mt-0">
            <Card>
              <CardContent className="p-8">
                <div className="text-center text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>{topic.flashcards.length} flashcards available</p>
                  <p className="text-sm mt-2">Switch to Flashcard mode to study</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
