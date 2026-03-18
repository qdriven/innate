
import React from 'react';
import { Category } from '../types';
import { extractVideoInfo } from '../services/geminiService';
import { storageService } from '../services/storageService';

interface SidebarProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (category: Category) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ categories, selectedCategoryId, onSelectCategory }) => {
  return (
    <div className="w-full lg:w-80 h-full bg-white border-r border-slate-200 flex flex-col p-6 space-y-6 overflow-y-auto shrink-0">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10"/><path d="m16 8-4 4-4-4"/><path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2"/></svg>
        </div>
        <div>
          <h1 className="text-lg font-black text-slate-900 tracking-tight">StudyTube</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Static Site Generator</p>
        </div>
      </div>

      <nav className="space-y-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-3">
          Site Library
        </p>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category)}
            className={`w-full flex items-start gap-3 p-4 rounded-[1.25rem] transition-all duration-300 text-left group ${
              selectedCategoryId === category.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="text-2xl shrink-0">{category.icon}</span>
            <div>
              <div className="font-bold text-sm leading-tight mb-0.5">{category.name}</div>
              <p className={`text-[10px] line-clamp-1 ${selectedCategoryId === category.id ? 'text-blue-100' : 'text-slate-400'}`}>
                {category.cards.length} Cards • {category.description}
              </p>
            </div>
          </button>
        ))}
      </nav>

      <div className="pt-6 mt-auto">
        <div className="bg-slate-900 rounded-3xl p-5 text-white">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Auto-Discover</p>
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Instant Topic Generator..."
              className="w-full text-xs px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value;
                  if (val.trim()) {
                    const videoInfo = extractVideoInfo(val);
                    const newCat = {
                      id: `temp-${Date.now()}`,
                      name: val,
                      icon: videoInfo.type ? '📺' : '📚',
                      description: 'AI Generated Module',
                      videoUrl: videoInfo.type ? val : undefined,
                      cards: []
                    };
                    storageService.updateCategory(newCat);
                    onSelectCategory(newCat);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
