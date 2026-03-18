"use client";

import { useAppStore } from "@/store";
import { LearningView } from "./LearningView";
import { FlashcardsView } from "./FlashcardsView";
import { QuizView } from "./QuizView";
import { SettingsView } from "./SettingsView";
import { EmptyState } from "./EmptyState";

export function MainContent() {
  const { currentView, selectedTopicId, topics } = useAppStore();
  const selectedTopic = topics.find((t) => t.id === selectedTopicId);

  if (!selectedTopic) {
    return <EmptyState />;
  }

  switch (currentView) {
    case "flashcards":
      return <FlashcardsView topic={selectedTopic} />;
    case "quiz":
      return <QuizView topic={selectedTopic} />;
    case "settings":
      return <SettingsView />;
    case "learn":
    default:
      return <LearningView topic={selectedTopic} />;
  }
}