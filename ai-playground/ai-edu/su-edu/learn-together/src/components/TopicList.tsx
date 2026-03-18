"use client";

import { useAppStore } from "@/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Topic } from "@/types";
import { Plus, BookOpen } from "lucide-react";

interface TopicListProps {
  onSelectTopic: (topic: Topic) => void;
}

export function TopicList({ onSelectTopic }: TopicListProps) {
  const { selectedCategory, addTopic } = useAppStore();

  if (!selectedCategory) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Select a category to view topics</p>
          <p className="text-sm mt-2">Choose from the sidebar on the left</p>
        </div>
      </div>
    );
  }

  const handleAddTopic = () => {
    const name = prompt("Enter topic name:");
    if (name && name.trim()) {
      addTopic(selectedCategory.id, {
        name: name.trim(),
        icon: "📖",
        description: "New learning topic",
        category: selectedCategory.name,
        tags: [],
        difficulty: "beginner",
        videoUrl: "",
        contents: [],
        flashcards: [],
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{selectedCategory.icon}</span>
          <div>
            <h2 className="text-xl font-bold">{selectedCategory.name}</h2>
            <p className="text-sm text-muted-foreground">{selectedCategory.description}</p>
          </div>
        </div>
        <Button onClick={handleAddTopic}>
          <Plus className="h-4 w-4 mr-2" />
          Add Topic
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {selectedCategory.topics.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No topics in this category</p>
              <Button onClick={handleAddTopic} variant="outline" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add your first topic
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedCategory.topics.map((topic) => (
              <Card
                key={topic.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onSelectTopic(topic)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{topic.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{topic.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {topic.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-secondary px-2 py-0.5 rounded">
                          {topic.flashcards.length} cards
                        </span>
                        <span className="text-xs bg-secondary px-2 py-0.5 rounded capitalize">
                          {topic.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
