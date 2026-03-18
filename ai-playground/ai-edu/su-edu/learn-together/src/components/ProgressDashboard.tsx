"use client";

import { useAppStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { interactiveLessons } from "@/lib/lessons";
import { Trophy, Clock, Target, TrendingUp } from "lucide-react";

const subjectColors: Record<string, string> = {
  physics: "bg-blue-500",
  chemistry: "bg-orange-500",
  biology: "bg-green-500",
  math: "bg-yellow-500",
  astronomy: "bg-purple-500",
};

const subjectNames: Record<string, string> = {
  physics: "物理",
  chemistry: "化学",
  biology: "生物",
  math: "数学",
  astronomy: "天文",
};

export function ProgressDashboard() {
  const { lessonProgress, getOverallProgress } = useAppStore();
  const overall = getOverallProgress();

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}秒`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

  const recentLessons = Object.entries(lessonProgress)
    .filter(([, p]) => p.lastAccessedAt)
    .sort((a, b) => new Date(b[1].lastAccessedAt).getTime() - new Date(a[1].lastAccessedAt).getTime())
    .slice(0, 5)
    .map(([id]) => interactiveLessons.find(l => l.id === id))
    .filter(Boolean);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-yellow-500" />
        <div>
          <h2 className="text-2xl font-bold">学习进度</h2>
          <p className="text-muted-foreground">追踪你的3D课程学习进度</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总进度</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overall.completedLessons}/{overall.totalLessons}</div>
            <Progress 
              value={(overall.completedLessons / overall.totalLessons) * 100} 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((overall.completedLessons / overall.totalLessons) * 100)}% 完成
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">学习时长</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(overall.totalTimeSpent)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              累计学习时间
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完成</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overall.completedLessons}</div>
            <p className="text-xs text-muted-foreground mt-1">
              3D交互课程
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">进行中</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(lessonProgress).length - overall.completedLessons}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              正在学习
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>各学科进度</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(overall.subjectProgress).map(([subject, progress]) => (
              <div key={subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${subjectColors[subject]}`} />
                    <span className="font-medium">{subjectNames[subject]}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {progress.completed}/{progress.total}
                  </span>
                </div>
                <Progress 
                  value={progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近学习</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLessons.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>还没有学习记录</p>
                <p className="text-sm">开始你的第一个3D课程吧！</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLessons.map((lesson) => lesson && (
                  <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-8 rounded ${subjectColors[lesson.subject]}`} />
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground">{subjectNames[lesson.subject]}</p>
                      </div>
                    </div>
                    {lessonProgress[lesson.id]?.completed && (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                        已完成
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
