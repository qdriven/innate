"use client";

import { Topic } from "@/types";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BookOpen, Cards, HelpCircle, Play, Pause, RotateCcw, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import "katex/dist/katex.min.css";
import katex from "katex";

// Dynamic import for 3D visualization to avoid SSR issues
const Visualization3D = dynamic(
  () => import("./Visualization3D").then((mod) => mod.Visualization3D),
  { ssr: false }
);

interface LearningViewProps {
  topic: Topic;
}

export function LearningView({ topic }: LearningViewProps) {
  const { setCurrentView, updateProgress } = useAppStore();
  const [completedObjectives, setCompletedObjectives] = useState<string[]>([]);
  const [controlValues, setControlValues] = useState<Record<string, number | boolean>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize control values
  useEffect(() => {
    if (topic.content.visualization?.controls) {
      const initialValues: Record<string, number | boolean> = {};
      topic.content.visualization.controls.forEach((control) => {
        initialValues[control.id] = control.defaultValue as number | boolean;
      });
      setControlValues(initialValues);
    }
  }, [topic.id]);

  // Render KaTeX formulas
  useEffect(() => {
    if (contentRef.current && topic.content.formulas) {
      const formulaElements = contentRef.current.querySelectorAll(".formula-latex");
      formulaElements.forEach((el, index) => {
        const formula = topic.content.formulas?.[index];
        if (formula) {
          try {
            katex.render(formula.latex, el as HTMLElement, {
              throwOnError: false,
              displayMode: true,
            });
          } catch (e) {
            console.error("KaTeX render error:", e);
          }
        }
      });
    }
  }, [topic.content.formulas]);

  const handleObjectiveToggle = (objective: string) => {
    setCompletedObjectives((prev) =>
      prev.includes(objective)
        ? prev.filter((o) => o !== objective)
        : [...prev, objective]
    );
    updateProgress(topic.id, {
      learningObjectivesCompleted: completedObjectives,
    });
  };

  const handleControlChange = (controlId: string, value: number | boolean) => {
    setControlValues((prev) => ({ ...prev, [controlId]: value }));
  };

  const renderVisualization = () => {
    if (!topic.content.visualization) return null;

    return (
      <div className="relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
        {topic.renderMode === "three" || topic.renderMode === "hybrid" ? (
          <Visualization3D
            type={topic.content.visualization.type}
            parameters={controlValues}
            controls={topic.content.visualization.controls}
            subject={topic.subject}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <p>2D SVG 可视化 (开发中)</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{topic.icon}</span>
            <div>
              <h1 className="text-xl font-bold text-white">{topic.name}</h1>
              {topic.nameEn && (
                <p className="text-sm text-teal-400">{topic.nameEn}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentView("flashcards")}
              className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <Cards className="h-4 w-4 mr-2" />
              闪卡
            </Button>
            <Button
              onClick={() => setCurrentView("quiz")}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              测验
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6" ref={contentRef}>
        {/* Visualization */}
        {topic.content.visualization && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              {renderVisualization()}
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        {topic.content.visualization?.controls && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-teal-400" />
                交互控制
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topic.content.visualization.controls.map((control) => (
                <div key={control.id} className="space-y-2">
                  <Label className="text-slate-300">{control.label}</Label>
                  {control.type === "slider" && (
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[controlValues[control.id] as number]}
                        onValueChange={([value]) =>
                          handleControlChange(control.id, value)
                        }
                        min={control.min}
                        max={control.max}
                        step={control.step}
                        className="flex-1"
                      />
                      <span className="text-sm text-teal-400 w-12 text-right">
                        {typeof controlValues[control.id] === "number"
                          ? controlValues[control.id].toFixed(control.step && control.step < 1 ? 1 : 0)
                          : "0"}
                      </span>
                    </div>
                  )}
                  {control.type === "toggle" && (
                    <Checkbox
                      checked={controlValues[control.id] as boolean}
                      onCheckedChange={(checked) =>
                        handleControlChange(control.id, checked)
                      }
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="border-slate-600 text-slate-300"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? "暂停" : "播放"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (topic.content.visualization?.controls) {
                      const resetValues: Record<string, number | boolean> = {};
                      topic.content.visualization.controls.forEach((c) => {
                        resetValues[c.id] = c.defaultValue as number | boolean;
                      });
                      setControlValues(resetValues);
                    }
                  }}
                  className="border-slate-600 text-slate-300"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  重置
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Learning Objectives */}
        {topic.content.learningObjectives.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-teal-400" />
                学习目标
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topic.content.learningObjectives.map((objective, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Checkbox
                      id={`objective-${index}`}
                      checked={completedObjectives.includes(objective)}
                      onCheckedChange={() => handleObjectiveToggle(objective)}
                      className="mt-1"
                    />
                    <Label
                      htmlFor={`objective-${index}`}
                      className={`text-sm ${
                        completedObjectives.includes(objective)
                          ? "text-slate-500 line-through"
                          : "text-slate-300"
                      }`}
                    >
                      {objective}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulas */}
        {topic.content.formulas && topic.content.formulas.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">核心公式</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topic.content.formulas.map((formula) => (
                  <div key={formula.id} className="space-y-2">
                    <div className="formula-latex text-white text-lg" />
                    <p className="text-sm text-slate-400">{formula.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Principles */}
        {topic.content.principles.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">核心原理</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {topic.content.principles.map((principle, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-300">
                    <span className="text-teal-400 mt-1">•</span>
                    {principle}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Real World Applications */}
        {topic.content.realWorldApplications && topic.content.realWorldApplications.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">实际应用</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {topic.content.realWorldApplications.map((app, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-300">
                    <span className="text-cyan-400 mt-1">→</span>
                    {app}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}