
import React, { useState, useEffect } from 'react';
import { Flashcard as FlashcardType } from '../types';

interface FlashcardProps {
  card: FlashcardType;
}

export const Flashcard: React.FC<FlashcardProps> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [card.id]);

  return (
    <div 
      className="relative w-full h-[320px] lg:h-[380px] perspective-1000 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-10 bg-white border-2 border-slate-200 rounded-[2.5rem] shadow-sm group-hover:shadow-md transition-all">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[10px] font-black tracking-[0.2em] text-blue-500 uppercase">Question</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 text-center leading-tight">
            {card.question}
          </h3>
          <div className="absolute bottom-8 text-[11px] font-medium text-slate-400 flex items-center gap-2">
            Click to Flip
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18 6-6-6-6"/><path d="M3 12h18"/></svg>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-10 bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] shadow-inner text-white">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-black tracking-[0.2em] text-emerald-500 uppercase">Answer</span>
          </div>
          <p className="text-lg md:text-xl font-medium text-slate-200 text-center leading-relaxed">
            {card.answer}
          </p>
          <div className="absolute bottom-8 text-[11px] font-medium text-slate-500">
            Click to flip back
          </div>
        </div>
      </div>
    </div>
  );
};
