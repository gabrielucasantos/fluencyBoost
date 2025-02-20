import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { WordList } from './components/WordList';
import { AddWordForm } from './components/AddWordForm';
import { PracticeModal } from './components/PracticeModal';
import { Statistics } from './components/Statistics';
import { HowItWorks } from './components/HowItWorks';
import { getWords, addWord, deleteWord, getStatistics, resetMispronunciations } from './lib/storage';
import type { Word } from './types';
import { GraduationCap, BookOpen, BarChart2, Menu, X } from 'lucide-react';

function App() {
  const [words, setWords] = useState<Word[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'practice' | 'words' | 'stats'>('practice');
  const [stats, setStats] = useState(getStatistics());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setWords(getWords());
    setLoading(false);
  }, []);

  const handleAddWord = (data: { word: string; translation: string }) => {
    try {
      const newWord = addWord(data);
      setWords(prev => [newWord, ...prev]);
      toast.success('Word added successfully');
      setShowAddForm(false);
    } catch (error) {
      toast.error('Error adding word');
    }
  };

  const handleDeleteWord = (id: string) => {
    try {
      deleteWord(id);
      setWords(prev => prev.filter(word => word.id !== id));
      toast.success('Word deleted successfully');
    } catch (error) {
      toast.error('Error deleting word');
    }
  };

  const startPractice = () => {
    setCurrentWordIndex(0);
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    setWords(shuffledWords);
    setSelectedWord(shuffledWords[0]);
    resetMispronunciations();
  };

  const handleNextWord = () => {
    if (currentWordIndex + 1 < words.length) {
      setCurrentWordIndex(prev => prev + 1);
      setSelectedWord(words[currentWordIndex + 1]);
    } else {
      setSelectedWord(null);
      setCurrentWordIndex(0);
      setStats(getStatistics());
      toast.success('Practice completed! 🎉');
    }
  };

  const handleTabChange = (tab: 'practice' | 'words' | 'stats') => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-duo-dark-200 flex flex-col">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#2C3440',
            color: '#ffffff',
          },
        }}
      />
      
      <header className="bg-duo-dark-100 shadow-lg border-b border-duo-dark-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap size={36} className="text-duo-green" />
              <h1 className="text-3xl font-bold text-white">
                FluencyBoost
              </h1>
            </div>
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className="text-white hover:text-duo-green transition-colors p-2 rounded-lg"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-duo-green border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading...</p>
              </div>
            ) : (
              <>
                {activeTab === 'practice' && (
                  <div className="text-center space-y-8">
                    <div className="max-w-2xl mx-auto">
                      <h2 className="text-4xl font-bold text-white mb-6">
                        Improve Your English Pronunciation
                      </h2>
                      <p className="text-gray-300 text-lg mb-8">
                        Practice with real-time feedback and track your progress
                      </p>
                      {words.length > 0 ? (
                        <button
                          onClick={startPractice}
                          className="px-8 py-4 bg-duo-green text-white text-xl font-bold rounded-2xl hover:bg-duo-green-hover transition-all shadow-lg hover:shadow-xl"
                        >
                          Start Practice
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="px-8 py-4 bg-duo-green text-white text-xl font-bold rounded-2xl hover:bg-duo-green-hover transition-all shadow-lg hover:shadow-xl"
                        >
                          Add Your First Word
                        </button>
                      )}
                    </div>
                    <HowItWorks />
                  </div>
                )}
                
                {activeTab === 'words' && (
                  <WordList
                    words={words}
                    onDelete={handleDeleteWord}
                    onPractice={setSelectedWord}
                    onAdd={() => setShowAddForm(true)}
                  />
                )}
                
                {activeTab === 'stats' && (
                  <Statistics stats={stats} />
                )}
              </>
            )}
          </div>
        </main>

        {/* Side Menu - Now using a fixed position with transform */}
        <nav 
          className={`fixed top-0 right-0 h-full w-64 md:w-72 bg-duo-dark-100 border-l border-duo-dark-50 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } z-30 shadow-xl`}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-end p-4 border-b border-duo-dark-50">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-white hover:text-duo-green transition-colors p-2 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 p-4 space-y-2">
              <button
                onClick={() => handleTabChange('practice')}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${
                  activeTab === 'practice'
                    ? 'bg-duo-green text-white'
                    : 'text-gray-400 hover:text-white hover:bg-duo-dark-50'
                }`}
              >
                <GraduationCap size={20} />
                Practice
              </button>
              <button
                onClick={() => handleTabChange('words')}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${
                  activeTab === 'words'
                    ? 'bg-duo-green text-white'
                    : 'text-gray-400 hover:text-white hover:bg-duo-dark-50'
                }`}
              >
                <BookOpen size={20} />
                My Words
              </button>
              <button
                onClick={() => {
                  handleTabChange('stats');
                  setStats(getStatistics());
                }}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${
                  activeTab === 'stats'
                    ? 'bg-duo-green text-white'
                    : 'text-gray-400 hover:text-white hover:bg-duo-dark-50'
                }`}
              >
                <BarChart2 size={20} />
                Statistics
              </button>
            </div>
          </div>
        </nav>
      </div>

      <footer className="bg-duo-dark-100 border-t border-duo-dark-50 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          Copyright 2025. Todos os direitos reservados por Gabriel Andrade.
        </div>
      </footer>

      {showAddForm && (
        <AddWordForm
          onSubmit={handleAddWord}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {selectedWord && (
        <PracticeModal
          word={selectedWord}
          onClose={() => {
            setSelectedWord(null);
            setCurrentWordIndex(0);
          }}
          onNext={handleNextWord}
          isLastWord={currentWordIndex === words.length - 1}
        />
      )}
    </div>
  );
}

export default App;