"use client";

import { useAppStore } from "@/store";
import { Sidebar } from "@/components/Sidebar";
import { MainContent } from "@/components/MainContent";
import { useEffect } from "react";
import { defaultTopics, defaultCategories } from "@/data/defaultData";

export default function Home() {
  const { topics, categories, importTopics } = useAppStore();

  useEffect(() => {
    // Initialize with default data if empty
    if (topics.length === 0) {
      defaultTopics.forEach(topic => {
        useAppStore.getState().addTopic(topic);
      });
    }
    if (categories.length === 0) {
      defaultCategories.forEach(category => {
        useAppStore.getState().addCategory(category);
      });
    }
  }, []);

  return (
    <main className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar />
      <MainContent />
    </main>
  );
}