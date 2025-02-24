import type { Word, WordAttempt } from '../types';

const STORAGE_KEY = 'fluencyboost_data';

interface StorageData {
  words: Word[];
  attempts: WordAttempt[];
}

function getStorageData(): StorageData {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return { words: [], attempts: [] };
  }
  return JSON.parse(data);
}

function setStorageData(data: StorageData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function getWords(): Promise<Word[]> {
  const { words, attempts } = getStorageData();
  return words.map(word => ({
    ...word,
    attempts: attempts.filter(attempt => attempt.word_id === word.id)
  }));
}

export async function addWord(word: Pick<Word, 'word' | 'translation'>): Promise<Word> {
  const data = getStorageData();
  const newWord: Word = {
    id: crypto.randomUUID(),
    word: word.word,
    translation: word.translation,
    created_at: new Date().toISOString()
  };
  
  data.words.push(newWord);
  setStorageData(data);
  return newWord;
}

export async function deleteWord(id: string): Promise<void> {
  const data = getStorageData();
  data.words = data.words.filter(word => word.id !== id);
  data.attempts = data.attempts.filter(attempt => attempt.word_id !== id);
  setStorageData(data);
}

export async function addAttempt(wordId: string, score: number, spokenWord?: string): Promise<WordAttempt> {
  const data = getStorageData();
  const newAttempt: WordAttempt = {
    id: crypto.randomUUID(),
    word_id: wordId,
    score,
    timestamp: new Date().toISOString(),
    spoken_word: spokenWord
  };
  
  data.attempts.push(newAttempt);
  setStorageData(data);
  return newAttempt;
}

export async function getStatistics() {
  const { words, attempts } = getStorageData();

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