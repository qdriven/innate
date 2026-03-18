
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  videoUrl?: string;
  cards: Flashcard[]; // Cards are now stored within the category for persistence
}

export interface DeckState {
  currentIndex: number;
  isLoading: boolean;
  error: string | null;
}
