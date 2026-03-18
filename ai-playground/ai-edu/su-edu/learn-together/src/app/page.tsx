"use client";

import { useState } from "react";
import { useAppStore } from "@/store";
import { Sidebar } from "@/components/Sidebar";
import { TopicList } from "@/components/TopicList";
import { TopicViewer } from "@/components/TopicViewer";
import { FlashcardView } from "@/components/FlashcardView";
import { AdminDashboard } from "@/components/AdminDashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Layers, ArrowLeft } from "lucide-react";

export default function Home() {
  const { selectedTopic, setSelectedTopic, selectedCategory } = useAppStore();
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"learn" | "flashcards">("learn");

  const handleSelectTopic = (topic: typeof selectedTopic) => {
    setSelectedTopic(topic);
    setFlashcardIndex(0);
    setViewMode("learn");
  };

  const handleBack = () => {
    setSelectedTopic(null);
  };

  return (
    <main className="h-screen flex overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden pt-12 md:pt-0">
        {selectedTopic ? (
          <>
            <div className="border-b p-2 flex items-center gap-2 bg-card">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {selectedCategory?.name || "Topics"}
              </Button>
              
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)} className="ml-auto">
                <TabsList>
                  <TabsTrigger value="learn" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Learn
                  </TabsTrigger>
                  <TabsTrigger value="flashcards" className="gap-2">
                    <Layers className="h-4 w-4" />
                    Flashcards
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex-1 overflow-hidden">
              {viewMode === "learn" ? (
                <TopicViewer topic={selectedTopic} />
              ) : (
                <div className="h-full flex items-center justify-center p-8">
                  <FlashcardView
                    cards={selectedTopic.flashcards}
                    currentIndex={flashcardIndex}
                    onPrev={() => setFlashcardIndex((i) => Math.max(0, i - 1))}
                    onNext={() =>
                      setFlashcardIndex((i) =>
                        Math.min(selectedTopic.flashcards.length - 1, i + 1)
                      )
                    }
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <TopicList onSelectTopic={handleSelectTopic} />
        )}
      </div>

      <AdminDashboard />
    </main>
  );
}
