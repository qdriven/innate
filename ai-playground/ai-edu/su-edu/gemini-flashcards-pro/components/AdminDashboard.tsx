
import React, { useState } from 'react';
import { Category } from '../types';
import { storageService } from '../services/storageService';
import { parseMarkdown, generateMarkdown } from '../services/mdService';

interface AdminDashboardProps {
  categories: Category[];
  onRefresh: () => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ categories, onRefresh, onClose }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'editor'>('list');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [mdInput, setMdInput] = useState('');

  const handleSave = () => {
    if (!mdInput.trim()) return;
    const parsed = parseMarkdown(mdInput);
    const newCategory: Category = {
      id: editingCategory?.id || `cat-${Date.now()}`,
      name: parsed.name || 'Untitled',
      icon: parsed.icon || '📁',
      description: parsed.description || '',
      videoUrl: parsed.videoUrl || '',
      cards: parsed.cards || []
    };
    storageService.updateCategory(newCategory);
    setMdInput('');
    setEditingCategory(null);
    setActiveTab('list');
    onRefresh();
  };

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setMdInput(generateMarkdown(cat));
    setActiveTab('editor');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this category?')) {
      storageService.deleteCategory(id);
      onRefresh();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col animate-in fade-in duration-300">
      <header className="px-8 py-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
            A
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Maintenance Console</h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Backend Systems v1.0</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all text-sm"
        >
          Exit Admin
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-slate-800 p-6 space-y-2">
          <button 
            onClick={() => setActiveTab('list')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'list' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/10' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            Manage Library
          </button>
          <button 
            onClick={() => {
              setActiveTab('editor');
              setEditingCategory(null);
              setMdInput('# New Topic\nIcon: 📂\nVideo: \nDescription: \n---\nQ: \nA: ');
            }}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'editor' && !editingCategory ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/10' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            Import Markdown
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-950/50">
          {activeTab === 'list' ? (
            <div className="max-w-4xl space-y-4">
              <h2 className="text-white font-bold mb-6">Database Entries ({categories.length})</h2>
              {categories.map(cat => (
                <div key={cat.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{cat.icon}</span>
                    <div>
                      <h3 className="text-white font-bold">{cat.name}</h3>
                      <p className="text-xs text-slate-500">{cat.cards.length} Cards • {cat.videoUrl ? 'Video Linked' : 'No Video'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(cat)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-bold transition-all">Edit</button>
                    <button onClick={() => handleDelete(cat.id)} className="px-4 py-2 bg-slate-800 hover:bg-red-900/40 text-red-400 rounded-lg text-xs font-bold transition-all">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-5xl h-full flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold">Markdown Engine</h2>
                <button 
                  onClick={handleSave}
                  className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-xl shadow-emerald-500/20 transition-all"
                >
                  {editingCategory ? 'Update Entry' : 'Build & Deploy'}
                </button>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-6 min-h-[400px]">
                <textarea 
                  value={mdInput}
                  onChange={(e) => setMdInput(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                  placeholder="# Enter Markdown Format..."
                />
                <div className="bg-slate-900/30 border border-slate-800 border-dashed rounded-2xl p-6 overflow-y-auto">
                   <p className="text-[10px] font-black text-slate-600 uppercase mb-4 tracking-widest">Format Help</p>
                   <div className="text-xs text-slate-500 space-y-4">
                      <p><code className="text-emerald-400 font-bold"># Title</code> defines the subject</p>
                      <p><code className="text-emerald-400 font-bold">Icon: ✨</code> set the sidebar icon</p>
                      <p><code className="text-emerald-400 font-bold">Video: [URL]</code> link YouTube/Bilibili</p>
                      <p><code className="text-emerald-400 font-bold">---</code> starts a new flashcard block</p>
                      <p><code className="text-emerald-400 font-bold">Q: Question</code> / <code className="text-emerald-400 font-bold">A: Answer</code> card content</p>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
