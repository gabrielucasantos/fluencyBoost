import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddWordFormProps {
  onSubmit: (data: { word: string; translation: string }) => void;
  onClose: () => void;
}

export function AddWordForm({ onSubmit, onClose }: AddWordFormProps) {
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ word, translation });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-[#58CC02]">Add New Word</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="word" className="block text-lg font-bold text-gray-700 mb-2">
              English Word
            </label>
            <input
              type="text"
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#E5E5E5] rounded-2xl focus:ring-2 focus:ring-[#84D8FF] focus:border-[#84D8FF] transition-all text-lg"
              required
              placeholder="Enter word in English..."
            />
          </div>
          
          <div>
            <label htmlFor="translation" className="block text-lg font-bold text-gray-700 mb-2">
              Translation
            </label>
            <input
              type="text"
              id="translation"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#E5E5E5] rounded-2xl focus:ring-2 focus:ring-[#84D8FF] focus:border-[#84D8FF] transition-all text-lg"
              required
              placeholder="Enter translation..."
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-[#58CC02] bg-white border-2 border-[#58CC02] rounded-2xl hover:bg-[#58CC02]/5 transition-colors font-bold text-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#58CC02] text-white rounded-2xl hover:bg-[#46A302] transition-all shadow-lg hover:shadow-xl font-bold text-lg"
            >
              Add Word
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}