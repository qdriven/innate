"use client";

import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function EmptyState() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");

  const handleAddTopic = () => {
    if (newTopicName.trim()) {
      const { detectSubject, detectRenderMode, generateId } = require("@/lib/utils");
      const newTopic = {
        id: generateId(),
        name: newTopicName,
        icon: "📚",
        description: "自定义主题",
        subject: detectSubject(newTopicName),
        renderMode: detectRenderMode(newTopicName),
        content: {
          learningObjectives: [],
          principles: [],
        },
        flashcards: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      };
      useAppStore.getState().addTopic(newTopic);
      useAppStore.getState().setSelectedTopic(newTopic.id);
      setNewTopicName("");
      setIsAddDialogOpen(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <Card className="bg-slate-800/50 border-slate-700 max-w-lg">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">
            欢迎来到 Susu
          </h2>
          <p className="text-slate-400 mb-6">
            选择左侧的主题开始学习，或者创建一个新主题
          </p>

          <div className="flex gap-4 justify-center">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500">
                  <Plus className="h-4 w-4 mr-2" />
                  创建新主题
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                  <DialogTitle>添加新主题</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="输入主题名称..."
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <Button
                    onClick={handleAddTopic}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400"
                  >
                    创建主题
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700">
            <p className="text-xs text-slate-500">
              让家长和孩子一起学习任何主题
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}