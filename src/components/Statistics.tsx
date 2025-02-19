import React from 'react';
import type { Statistics as StatsType } from '../types';

interface StatisticsProps {
  stats: StatsType;
}

export function Statistics({ stats }: StatisticsProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-duo-dark-50 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-2">Total Attempts</h3>
          <p className="text-3xl font-bold text-duo-green">{stats.totalAttempts}</p>
        </div>
        <div className="bg-duo-dark-50 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-2">Average Score</h3>
          <p className="text-3xl font-bold text-duo-green">
            {Math.round(stats.averageScore)}%
          </p>
        </div>
        <div className="bg-duo-dark-50 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-2">Success Rate</h3>
          <p className="text-3xl font-bold text-duo-green">
            {Math.round(stats.successRate)}%
          </p>
        </div>
      </div>

      <div className="bg-duo-dark-50 p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-4">Common Mispronunciations</h3>
        <div className="grid gap-4">
          {stats.wordPerformance
            .filter(wp => wp.mispronunciations && wp.mispronunciations.length > 0)
            .map(wp => (
              <div key={wp.word} className="bg-duo-dark-100 p-4 rounded-xl">
                <h4 className="text-lg font-bold text-white mb-2">{wp.word}</h4>
                <div className="space-y-2">
                  {wp.mispronunciations?.map((mp, index) => (
                    <div key={index} className="flex items-center justify-between text-gray-300">
                      <span>Spoken as: <span className="text-red-400">{mp.spoken}</span></span>
                      <span className="text-sm">{mp.count} times</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          {!stats.wordPerformance.some(wp => wp.mispronunciations?.length > 0) && (
            <p className="text-gray-400 text-center py-4">No mispronunciations recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}