import React from 'react';
import { Volume as VolumeUp, Mic, Trophy } from 'lucide-react';

export function HowItWorks() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How FluencyBoost Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-duo-dark-50 p-6 rounded-2xl text-center">
            <div className="w-12 h-12 bg-duo-green rounded-full flex items-center justify-center mx-auto mb-4">
              <VolumeUp className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Listen</h3>
            <p className="text-gray-300">Listen to native pronunciation of English words</p>
            <p className="text-gray-300 mt-4">Ouça a pronúncia nativa das palavras em inglês</p>
          </div>
          
          <div className="bg-duo-dark-50 p-6 rounded-2xl text-center">
            <div className="w-12 h-12 bg-duo-green rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Practice</h3>
            <p className="text-gray-300">Record yourself and get instant feedback</p>
            <p className="text-gray-300 mt-4">Grave sua pronúncia e receba feedback instantâneo</p>
          </div>
          
          <div className="bg-duo-dark-50 p-6 rounded-2xl text-center">
            <div className="w-12 h-12 bg-duo-green rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Improve</h3>
            <p className="text-gray-300">Track your progress and master pronunciation</p>
            <p className="text-gray-300 mt-4">Acompanhe seu progresso e domine a pronúncia</p>
          </div>
        </div>
      </div>
    </div>
  );
}