"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { interactiveLessons, getLessonsBySubject, searchLessons } from "@/lib/lessons";
import { useAppStore } from "@/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, Search, Box, ArrowLeft, Trophy, BarChart3, CheckCircle, Menu, X, Filter } from "lucide-react";
import { ProgressDashboard } from "@/components/ProgressDashboard";

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

const subjectNames: Record<string, string> = {
  physics: "物理",
  chemistry: "化学",
  biology: "生物",
  math: "数学",
  astronomy: "天文",
};

export default function LessonsPage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const { lessonProgress, updateLessonProgress, markLessonCompleted, getOverallProgress } = useAppStore();

  const subjects = ['physics', 'chemistry', 'biology', 'math', 'astronomy'];
  const overall = getOverallProgress();

  useEffect(() => {
    if (selectedLessonId) {
      updateLessonProgress(selectedLessonId, { lastAccessedAt: new Date().toISOString() });
    }
  }, [selectedLessonId, updateLessonProgress]);

  const filteredLessons = searchQuery
    ? searchLessons(searchQuery)
    : selectedSubject
    ? getLessonsBySubject(selectedSubject)
    : interactiveLessons;

  const selectedLesson = selectedLessonId
    ? interactiveLessons.find((l) => l.id === selectedLessonId)
    : null;

  if (selectedLesson) {
    const progress = lessonProgress[selectedLesson.id];
    const isCompleted = progress?.completed;

    return (
      <div className="h-screen flex flex-col">
        <div className="flex items-center justify-between p-2 md:p-4 border-b bg-background flex-wrap gap-2">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            <Button variant="ghost" size="sm" onClick={() => setSelectedLessonId(null)}>
              <ArrowLeft className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">返回</span>
            </Button>
            <div className="min-w-0">
              <h1 className="font-semibold truncate">{selectedLesson.title}</h1>
              <p className="text-sm text-muted-foreground truncate hidden sm:block">{selectedLesson.titleEn}</p>
            </div>
          </div>
          <div className="flex gap-1 md:gap-2 flex-wrap">
            <Badge variant="secondary" className="hidden sm:inline-flex">{subjectNames[selectedLesson.subject]}</Badge>
            <Badge variant="outline" className="hidden sm:inline-flex">{selectedLesson.difficulty}</Badge>
            {isCompleted && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                已完成
              </Badge>
            )}
            <Button
              variant={isCompleted ? "outline" : "default"}
              size="sm"
              onClick={() => markLessonCompleted(selectedLesson.id)}
              disabled={isCompleted}
            >
              <Trophy className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{isCompleted ? "已完成" : "标记完成"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(selectedLesson.htmlPath, '_blank')}
            >
              <ExternalLink className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">新窗口</span>
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <iframe
            src={selectedLesson.htmlPath}
            className="w-full h-full border-0"
            title={selectedLesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b p-4 md:p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">🎮 3D 交互式课程</h1>
            <p className="text-sm md:text-base opacity-90 hidden sm:block">探索物理、化学、生物的沉浸式3D学习体验</p>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="text-right hidden sm:block">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                <span className="font-bold">{overall.completedLessons}/{overall.totalLessons}</span>
              </div>
              <Progress 
                value={(overall.completedLessons / overall.totalLessons) * 100} 
                className="w-32 h-2 mt-1"
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDashboard(!showDashboard)}
              className="hidden md:flex"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {showDashboard ? "隐藏进度" : "查看进度"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="md:hidden"
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            >
              <Filter className="h-4 w-4 mr-2" />
              筛选
            </Button>
          </div>
        </div>
      </header>

      {showDashboard && (
        <div className="border-b bg-background">
          <ProgressDashboard />
        </div>
      )}

      <div className="flex-1 flex overflow-hidden relative">
        <aside className={`w-64 border-r bg-muted/30 p-4 flex flex-col gap-4 absolute md:relative inset-y-0 left-0 z-40 transform transition-transform duration-200 ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} bg-background`}>
          <div className="flex items-center justify-between md:hidden">
            <span className="font-semibold">筛选课程</span>
            <Button variant="ghost" size="sm" onClick={() => setShowMobileSidebar(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索课程..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedSubject(null);
              }}
              className="pl-9"
            />
          </div>

          <div className="space-y-2">
            <Button
              variant={!selectedSubject ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setSelectedSubject(null);
                setShowMobileSidebar(false);
              }}
            >
              <Box className="h-4 w-4 mr-2" />
              全部课程
              <Badge variant="secondary" className="ml-auto">
                {interactiveLessons.length}
              </Badge>
            </Button>

            {subjects.map((subject) => {
              const count = getLessonsBySubject(subject).length;
              return (
                <Button
                  key={subject}
                  variant={selectedSubject === subject ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedSubject(subject);
                    setSearchQuery("");
                    setShowMobileSidebar(false);
                  }}
                >
                  <span className="mr-2">{subjectIcons[subject]}</span>
                  {subjectNames[subject]}
                  <Badge variant="secondary" className="ml-auto">
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </aside>

        {showMobileSidebar && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden" 
            onClick={() => setShowMobileSidebar(false)}
          />
        )}

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {searchQuery && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  搜索 "{searchQuery}" 找到 {filteredLessons.length} 个结果
                </p>
              </div>
            )}

            {filteredLessons.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Box className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">没有找到匹配的课程</p>
                <p className="text-sm mt-2">尝试其他搜索词或选择其他学科</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLessons.map((lesson) => {
                  const progress = lessonProgress[lesson.id];
                  const isCompleted = progress?.completed;
                  
                  return (
                    <Card
                      key={lesson.id}
                      className={`cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] overflow-hidden ${isCompleted ? 'ring-2 ring-green-500/50' : ''}`}
                      onClick={() => setSelectedLessonId(lesson.id)}
                    >
                      <div className={`h-2 bg-gradient-to-r ${subjectColors[lesson.subject]}`} />
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <div
                              className={`w-12 h-12 rounded-lg bg-gradient-to-br ${subjectColors[lesson.subject]} flex items-center justify-center text-2xl shrink-0`}
                            >
                              {subjectIcons[lesson.subject]}
                            </div>
                            {isCompleted && (
                              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                                <CheckCircle className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold truncate">{lesson.title}</h3>
                            </div>
                            <p className="text-xs text-muted-foreground">{lesson.titleEn}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {lesson.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge variant="secondary" className="text-xs">
                                {subjectNames[lesson.subject]}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {lesson.difficulty}
                              </Badge>
                              {isCompleted && (
                                <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600">
                                  已完成
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
