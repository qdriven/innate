"use client";

import { useState } from "react";
import { Flashcard as FlashcardType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

interface FlashcardProps {
  cards: FlashcardType[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

export function FlashcardView({ cards, currentIndex, onPrev, onNext }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const currentCard = cards[currentIndex];

  if (!currentCard) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center text-muted-foreground">
          No flashcards available. Generate some using AI or add them manually in Admin.
        </CardContent>
      </Card>
    );
  }

  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 px-4">
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Card {currentIndex + 1} of {cards.length}
      </div>

      <div
        className="relative h-64 md:h-80 cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <Card
          className={`absolute inset-0 transition-all duration-500 transform-style-preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          <CardContent
            className={`p-4 md:p-8 h-full flex items-center justify-center text-center backface-hidden ${
              isFlipped ? "rotate-y-180" : ""
            }`}
          >
            <div className={!isFlipped ? "" : "hidden"}>
              <p className="text-base md:text-lg font-medium">{currentCard.question}</p>
              <p className="text-xs text-muted-foreground mt-4">Click to flip</p>
            </div>
            <div className={isFlipped ? "" : "hidden"}>
              <p className="text-base md:text-lg">{currentCard.answer}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setIsFlipped(false);
            onPrev();
          }}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setIsFlipped(false);
          }}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          variant="default"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setIsFlipped(false);
            onNext();
          }}
          disabled={currentIndex === cards.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
