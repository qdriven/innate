"use client";

import { Topic } from "@/types";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RotateCcw, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FlashcardsViewProps {
  topic: Topic;
}

export function FlashcardsView({ topic }: FlashcardsViewProps) {
  const { setCurrentView, updateProgress } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyProgress, setStudyProgress] = useState<Record<string, "learning" | "known" | "unknown">>({});

  const cards = topic.flashcards;
  const currentCard = cards[currentIndex];
  const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const markCard = (status: "known" | "unknown") => {
    if (currentCard) {
      setStudyProgress((prev) => ({
        ...prev,
        [currentCard.id]: status,
      }));
    }
    nextCard();
  };

  const resetCards = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudyProgress({});
  };

  const knownCount = Object.values(studyProgress).filter((s) => s === "known").length;
  const unknownCount = Object.values(studyProgress).filter((s) => s === "unknown").length;

  if (cards.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Card className="bg-slate-800/50 border-slate-700 max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-slate-400 mb-4">这个主题还没有闪卡</p>
            <Button
              onClick={() => setCurrentView("learn")}
              className="bg-gradient-to-r from-teal-500 to-cyan-500"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              返回学习
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{topic.icon}</span>
            <div>
              <h1 className="text-xl font-bold text-white">{topic.name} - 闪卡</h1>
              <p className="text-sm text-slate-400">
                卡片 {currentIndex + 1} / {cards.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">
              <span className="text-green-400">{knownCount} 已掌握</span>
              {" | "}
              <span className="text-red-400">{unknownCount} 需复习</span>
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentView("learn")}
              className="border-slate-600 text-slate-300"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              返回学习
            </Button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Flashcard */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div
          className="relative w-full max-w-2xl h-96 cursor-pointer perspective-1000"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            className={cn(
              "relative w-full h-full transition-transform duration-500 transform-style-3d",
              isFlipped && "rotate-y-180"
            )}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-teal-500/30 rounded-3xl shadow-xl">
              <div className="absolute top-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">
                  问题
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white text-center leading-relaxed">
                {currentCard?.question}
              </h3>
              <p className="absolute bottom-6 text-sm text-slate-500 flex items-center gap-2">
                点击翻转
                <ChevronRight className="h-4 w-4" />
              </p>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-teal-900 to-cyan-900 border border-teal-500/30 rounded-3xl shadow-inner">
              <div className="absolute top-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  答案
                </span>
              </div>
              <p className="text-xl md:text-2xl text-white text-center leading-relaxed">
                {currentCard?.answer}
              </p>
              <p className="absolute bottom-6 text-sm text-slate-400">
                点击翻回
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 border-t border-slate-700/50">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Knowledge buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => markCard("unknown")}
              variant="outline"
              className="flex-1 h-14 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
            >
              需要复习
            </Button>
            <Button
              onClick={() => markCard("known")}
              className="flex-1 h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400"
            >
              已掌握
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <Button
              onClick={prevCard}
              disabled={currentIndex === 0}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              上一张
            </Button>
            <Button
              onClick={resetCards}
              variant="outline"
              className="border-slate-600 text-slate-300"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              onClick={nextCard}
              disabled={currentIndex === cards.length - 1}
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 disabled:opacity-50"
            >
              下一张
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}