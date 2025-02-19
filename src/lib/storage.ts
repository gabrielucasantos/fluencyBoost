import type { Word, WordAttempt } from '../types';

const STORAGE_KEY = 'pronunciation_words';
const ATTEMPTS_KEY = 'pronunciation_attempts';
const MISPRONUNCIATIONS_KEY = 'pronunciation_mispronunciations';

export function getWords(): Word[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveWords(words: Word[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
}

export function addWord(word: Omit<Word, 'id' | 'created_at'>): Word {
  const words = getWords();
  const newWord: Word = {
    ...word,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  
  words.unshift(newWord);
  saveWords(words);
  return newWord;
}

export function deleteWord(id: string): void {
  const words = getWords();
  const filtered = words.filter(word => word.id !== id);
  saveWords(filtered);
  // Also delete associated attempts
  const attempts = getAttempts();
  const filteredAttempts = attempts.filter(attempt => attempt.word_id !== id);
  saveAttempts(filteredAttempts);
}

export function getAttempts(): WordAttempt[] {
  const stored = localStorage.getItem(ATTEMPTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveAttempts(attempts: WordAttempt[]): void {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
}

export function addAttempt(wordId: string, score: number, spokenWord?: string): WordAttempt {
  const attempts = getAttempts();
  const newAttempt: WordAttempt = {
    id: crypto.randomUUID(),
    word_id: wordId,
    score,
    timestamp: new Date().toISOString(),
    spoken_word: spokenWord,
  };
  
  attempts.push(newAttempt);
  saveAttempts(attempts);
  return newAttempt;
}

export function resetMispronunciations(): void {
  localStorage.removeItem(MISPRONUNCIATIONS_KEY);
}

export function getStatistics() {
  const words = getWords();
  const attempts = getAttempts();
  
  const totalAttempts = attempts.length;
  const averageScore = totalAttempts > 0
    ? attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts
    : 0;
  const successfulAttempts = attempts.filter(attempt => attempt.score >= 80).length;
  const successRate = totalAttempts > 0 ? (successfulAttempts / totalAttempts) * 100 : 0;
  
  const wordPerformance = words.map(word => {
    const wordAttempts = attempts.filter(attempt => attempt.word_id === word.id);
    const avgScore = wordAttempts.length > 0
      ? wordAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / wordAttempts.length
      : 0;
    
    // Track mispronunciations
    const mispronunciations = wordAttempts
      .filter(attempt => attempt.score < 70 && attempt.spoken_word)
      .reduce((acc, attempt) => {
        const key = `${word.word}:${attempt.spoken_word}`;
        if (!acc[key]) {
          acc[key] = {
            expected: word.word,
            spoken: attempt.spoken_word!,
            count: 0
          };
        }
        acc[key].count++;
        return acc;
      }, {} as Record<string, { expected: string; spoken: string; count: number }>);
    
    return {
      word: word.word,
      averageScore: avgScore,
      attempts: wordAttempts.length,
      mispronunciations: Object.values(mispronunciations),
    };
  });
  
  return {
    totalAttempts,
    averageScore,
    successRate,
    wordPerformance: wordPerformance.sort((a, b) => b.averageScore - a.averageScore),
  };
}