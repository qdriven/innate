"use client";

import { Topic, QuizQuestion } from "@/types";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle, XCircle, RotateCcw, Trophy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface QuizViewProps {
  topic: Topic;
}

export function QuizView({ topic }: QuizViewProps) {
  const { setCurrentView } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizComplete, setQuizComplete] = useState(false);

  const questions = topic.content.quizQuestions || [];
  const currentQuestion = questions[currentIndex];

  const handleSelectAnswer = (index: number) => {
    if (!showResult) {
      setSelectedAnswer(index);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer !== null && currentQuestion) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: selectedAnswer,
      }));
      setShowResult(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers({});
    setQuizComplete(false);
  };

  const correctCount = questions.filter(
    (q) => answers[q.id] === q.correctIndex
  ).length;

  const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  if (questions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Card className="bg-slate-800/50 border-slate-700 max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-slate-400 mb-4">这个主题还没有测验题目</p>
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

  if (quizComplete) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <Card className="bg-slate-800/50 border-slate-700 max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">测验完成!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div>
              <p className="text-5xl font-bold text-white mb-2">{score}%</p>
              <p className="text-slate-400">
                答对 {correctCount} / {questions.length} 题
              </p>
            </div>

            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-500",
                  score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500"
                )}
                style={{ width: `${score}%` }}
              />
            </div>

            <p className="text-slate-300">
              {score >= 80
                ? "太棒了！你已经很好地掌握了这个主题！"
                : score >= 60
                ? "不错！继续努力，你可以做得更好！"
                : "再学习一下这个主题，然后重新测验吧！"}
            </p>

            <div className="flex gap-4">
              <Button
                onClick={resetQuiz}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                重新测验
              </Button>
              <Button
                onClick={() => setCurrentView("learn")}
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                继续学习
              </Button>
            </div>
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
              <h1 className="text-xl font-bold text-white">{topic.name} - 测验</h1>
              <p className="text-sm text-slate-400">
                问题 {currentIndex + 1} / {questions.length}
              </p>
            </div>
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
        <div className="mt-4">
          <Progress value={(currentIndex / questions.length) * 100} className="h-1" />
        </div>
      </header>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="bg-slate-800/50 border-slate-700 max-w-2xl w-full">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold text-white mb-6">
              {currentQuestion?.question}
            </h2>

            <div className="space-y-3">
              {currentQuestion?.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQuestion.correctIndex;
                const showCorrectness = showResult;

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={showResult}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all border",
                      !showResult && isSelected && "border-teal-500 bg-teal-500/10",
                      !showResult && !isSelected && "border-slate-600 hover:border-slate-500 hover:bg-slate-700/50",
                      showResult && isCorrect && "border-green-500 bg-green-500/10",
                      showResult && isSelected && !isCorrect && "border-red-500 bg-red-500/10",
                      showResult && !isSelected && !isCorrect && "border-slate-700 opacity-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                          !showResult && isSelected && "bg-teal-500 text-white",
                          !showResult && !isSelected && "bg-slate-700 text-slate-300",
                          showResult && isCorrect && "bg-green-500 text-white",
                          showResult && isSelected && !isCorrect && "bg-red-500 text-white"
                        )}
                      >
                        {showResult && isCorrect ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : showResult && isSelected && !isCorrect ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          String.fromCharCode(65 + index)
                        )}
                      </span>
                      <span
                        className={cn(
                          "text-base",
                          showResult && isCorrect && "text-green-400",
                          showResult && isSelected && !isCorrect && "text-red-400",
                          !showResult && "text-slate-300"
                        )}
                      >
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showResult && currentQuestion.explanation && (
              <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                <p className="text-sm text-slate-400">
                  <span className="font-bold text-teal-400">解析：</span>
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-slate-700/50">
        <div className="max-w-2xl mx-auto flex gap-4">
          {!showResult ? (
            <Button
              onClick={handleCheckAnswer}
              disabled={selectedAnswer === null}
              className="flex-1 h-14 bg-gradient-to-r from-teal-500 to-cyan-500 disabled:opacity-50"
            >
              确认答案
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="flex-1 h-14 bg-gradient-to-r from-teal-500 to-cyan-500"
            >
              {currentIndex < questions.length - 1 ? "下一题" : "查看结果"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}