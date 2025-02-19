import React from 'react';
import { Mic, Play, Plus, Trash2 } from 'lucide-react';
import type { Word } from '../types';

interface WordListProps {
  words: Word[];
  onDelete: (id: string) => void;
  onPractice: (word: Word) => void;
  onAdd: () => void;
}

export function WordList({ words, onDelete, onPractice, onAdd }: WordListProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-[#58CC02]">My Words</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-6 py-3 bg-[#58CC02] text-white rounded-2xl hover:bg-[#46A302] transition-all shadow-lg hover:shadow-xl font-bold text-lg"
        >
          <Plus size={24} />
          Add Word
        </button>
      </div>
      
      <div className="grid gap-4">
        {words.map((word) => (
          <div
            key={word.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border-2 border-[#E5E5E5] hover:border-[#84D8FF]"
          >
            <div className="p-6">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {word.word}
                  </h3>
                  <p className="text-lg text-gray-600">
                    {word.translation}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => onPractice(word)}
                    className="p-3 text-[#58CC02] hover:bg-[#58CC02]/10 rounded-xl transition-colors"
                    title="Practice pronunciation"
                  >
                    <Mic size={24} />
                  </button>
                  <button
                    onClick={() => {
                      const speech = new SpeechSynthesisUtterance(word.word);
                      speech.lang = 'en-US';
                      window.speechSynthesis.speak(speech);
                    }}
                    className="p-3 text-[#58CC02] hover:bg-[#58CC02]/10 rounded-xl transition-colors"
                    title="Listen to pronunciation"
                  >
                    <Play size={24} />
                  </button>
                  <button
                    onClick={() => onDelete(word.id)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete word"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {words.length === 0 && (
          <div className="text-center py-16 bg-[#F7F7F7] rounded-2xl border-2 border-dashed border-[#E5E5E5]">
            <p className="text-gray-600 text-xl">Start adding words to practice your pronunciation!</p>
          </div>
        )}
      </div>
    </div>
  );
}