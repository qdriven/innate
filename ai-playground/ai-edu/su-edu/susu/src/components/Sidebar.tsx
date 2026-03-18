"use client";

import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";
import { Topic } from "@/types";
import { BookOpen, Settings, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function Sidebar() {
  const { topics, categories, selectedTopicId, setSelectedTopic, sidebarOpen, setSidebarOpen, currentView, setCurrentView } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");

  const selectedTopic = topics.find((t) => t.id === selectedTopicId);

  const filteredTopics = topics.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nameEn?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTopic = () => {
    if (newTopicName.trim()) {
      const { detectSubject, detectRenderMode, generateId } = require("@/lib/utils");
      const newTopic: Topic = {
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
      setSelectedTopic(newTopic.id);
      setNewTopicName("");
      setIsAddDialogOpen(false);
    }
  };

  if (!sidebarOpen) {
    return (
      <div className="w-16 bg-slate-900/80 border-r border-teal-500/20 flex flex-col items-center py-4 gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/10"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
          苏
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentView("learn")}
          className={cn(
            "text-slate-400 hover:text-teal-400 hover:bg-teal-500/10",
            currentView === "learn" && "text-teal-400 bg-teal-500/10"
          )}
        >
          <BookOpen className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentView("settings")}
          className={cn(
            "text-slate-400 hover:text-teal-400 hover:bg-teal-500/10",
            currentView === "settings" && "text-teal-400 bg-teal-500/10"
          )}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-slate-900/80 border-r border-teal-500/20 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-teal-500/20">
              苏
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Susu</h1>
              <p className="text-xs text-slate-400">互动学习平台</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 hover:text-teal-400 hover:bg-teal-500/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-slate-700/50">
        <Input
          placeholder="搜索主题..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-teal-500"
        />
      </div>

      {/* Topics List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              主题库
            </span>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-teal-400 hover:text-teal-300 hover:bg-teal-500/10"
                >
                  <Plus className="h-4 w-4" />
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

          {filteredTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => {
                setSelectedTopic(topic.id);
                setCurrentView("learn");
              }}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group",
                selectedTopicId === topic.id
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/20"
                  : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
              )}
            >
              <span className="text-2xl">{topic.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{topic.name}</div>
                <div className={cn(
                  "text-xs truncate",
                  selectedTopicId === topic.id ? "text-teal-100" : "text-slate-500"
                )}>
                  {topic.flashcards.length} 张卡片 · {topic.description}
                </div>
              </div>
            </button>
          ))}

          {filteredTopics.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <p>没有找到匹配的主题</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-700/50 space-y-2">
        <Button
          variant="ghost"
          onClick={() => setCurrentView("settings")}
          className={cn(
            "w-full justify-start text-slate-400 hover:text-teal-400 hover:bg-teal-500/10",
            currentView === "settings" && "text-teal-400 bg-teal-500/10"
          )}
        >
          <Settings className="h-4 w-4 mr-2" />
          设置
        </Button>
      </div>
    </div>
  );
}