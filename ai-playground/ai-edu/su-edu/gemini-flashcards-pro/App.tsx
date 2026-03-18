
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Category, Flashcard as FlashcardType, DeckState } from './types';
import { Sidebar } from './components/Sidebar';
import { Flashcard } from './components/Flashcard';
import { AdminDashboard } from './components/AdminDashboard';
import { generateFlashcards, extractVideoInfo } from './services/geminiService';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [deck, setDeck] = useState<DeckState>({
    currentIndex: 0,
    isLoading: true,
    error: null,
  });

  const refreshData = useCallback(() => {
    const data = storageService.loadData();
    setCategories(data);
    if (!selectedCategory || !data.find(c => c.id === selectedCategory.id)) {
      setSelectedCategory(data[0] || null);
    }
  }, [selectedCategory]);

  useEffect(() => {
    refreshData();
  }, []);

  const loadCards = useCallback(async (category: Category) => {
    // If category already has cards (static generation), don't call AI
    if (category.cards && category.cards.length > 0) {
      setDeck({ currentIndex: 0, isLoading: false, error: null });
      return;
    }

    setDeck(prev => ({ ...prev, isLoading: true, error: null, currentIndex: 0 }));
    try {
      const cards = await generateFlashcards(category.name);
      const updatedCat = { ...category, cards };
      storageService.updateCategory(updatedCat);
      setCategories(storageService.loadData());
      setDeck({ currentIndex: 0, isLoading: false, error: null });
    } catch (err) {
      setDeck(prev => ({
        ...prev,
        isLoading: false,
        error: "Gemini couldn't process this topic. Please try another."
      }));
    }
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadCards(selectedCategory);
    }
  }, [selectedCategory?.id, loadCards]);

  const nextCard = () => {
    if (selectedCategory && deck.currentIndex < selectedCategory.cards.length - 1) {
      setDeck(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
    }
  };

  const prevCard = () => {
    if (deck.currentIndex > 0) {
      setDeck(prev => ({ ...prev, currentIndex: prev.currentIndex - 1 }));
    }
  };

  const currentCard = selectedCategory?.cards[deck.currentIndex];
  const progress = (selectedCategory?.cards.length || 0) > 0 
    ? ((deck.currentIndex + 1) / (selectedCategory?.cards.length || 1)) * 100 
    : 0;

  const videoInfo = useMemo(() => {
    return selectedCategory?.videoUrl ? extractVideoInfo(selectedCategory.videoUrl) : { type: null, idOrUrl: null };
  }, [selectedCategory?.videoUrl]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 overflow-hidden">
      {isAdmin && (
        <AdminDashboard 
          categories={categories} 
          onRefresh={refreshData} 
          onClose={() => setIsAdmin(false)} 
        />
      )}

      <Sidebar 
        categories={categories}
        selectedCategoryId={selectedCategory?.id || ''} 
        onSelectCategory={setSelectedCategory} 
      />

      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="px-6 py-4 border-b border-slate-200 bg-white/70 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl bg-slate-100 p-2 rounded-xl">{selectedCategory?.icon || '📚'}</span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">{selectedCategory?.name || 'Loading...'}</h2>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                {deck.isLoading ? 'Processing Entry...' : `Card ${deck.currentIndex + 1} of ${selectedCategory?.cards.length || 0}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsAdmin(true)}
              className="mr-4 px-4 py-1.5 text-[10px] font-black uppercase text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all tracking-widest"
            >
              Admin Maintenance
            </button>
            <div className="hidden md:flex h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-700 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </header>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-8">
            
            {/* Universal Player */}
            <div className="w-full">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-200">
                {videoInfo.type === 'youtube' && videoInfo.idOrUrl && (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoInfo.idOrUrl}?rel=0&modestbranding=1`}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}

                {videoInfo.type === 'bilibili' && videoInfo.idOrUrl && (
                  <iframe
                    src={`//player.bilibili.com/player.html?bvid=${videoInfo.idOrUrl}&page=1&high_quality=1&danmaku=0`}
                    className="absolute inset-0 w-full h-full border-0"
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                )}

                {!videoInfo.type && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-slate-900">
                    <p className="font-bold text-white">Study Mode: Static Context</p>
                    <p className="text-sm opacity-60 text-slate-400 mt-2">No video link detected for this module.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Flashcard Set */}
            <div className="space-y-6 pb-20">
              {deck.isLoading ? (
                <div className="h-[380px] w-full bg-white/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4">
                  <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-sm font-medium text-slate-500">Preparing static site content...</p>
                </div>
              ) : deck.error ? (
                <div className="bg-red-50 p-10 rounded-[2.5rem] text-center border border-red-100">
                   <p className="text-red-700 font-bold mb-4">{deck.error}</p>
                </div>
              ) : currentCard ? (
                <>
                  <Flashcard card={currentCard} />
                  <div className="flex items-center gap-4">
                    <button
                      onClick={prevCard}
                      disabled={deck.currentIndex === 0}
                      className={`h-16 flex-1 flex items-center justify-center gap-3 rounded-2xl font-bold transition-all border-2 ${
                        deck.currentIndex === 0 ? 'bg-slate-50 text-slate-300' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >Back</button>
                    <button
                      onClick={nextCard}
                      disabled={deck.currentIndex === (selectedCategory?.cards.length || 0) - 1}
                      className={`h-16 flex-[2] flex items-center justify-center gap-3 rounded-2xl font-bold transition-all ${
                        deck.currentIndex === (selectedCategory?.cards.length || 0) - 1
                          ? 'bg-slate-50 text-slate-300 border-2 border-slate-100'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/10'
                      }`}
                    >Next Card</button>
                  </div>
                </>
              ) : (
                <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 text-center">
                   <p className="text-slate-500">No cards in this module. Use Admin to add content.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
