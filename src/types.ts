export interface Word {
  id: string;
  word: string;
  translation: string;
  created_at: string;
  attempts?: WordAttempt[];
}

export interface WordAttempt {
  id: string;
  word_id: string;
  score: number;
  timestamp: string;
  spoken_word?: string;
}

export interface Statistics {
  totalAttempts: number;
  averageScore: number;
  successRate: number;
  recentScores: number[];
  wordPerformance: {
    word: string;
    averageScore: number;
    attempts: number;
    mispronunciations?: Array<{
      expected: string;
      spoken: string;
      count: number;
    }>;
  }[];
}