import React, { useState, useRef, useEffect } from 'react';
import { Mic, Volume, X, Loader2, ArrowRight, RotateCcw } from 'lucide-react';
import type { Word } from '../types';
import { addAttempt } from '../lib/storage';

interface PracticeModalProps {
  word: Word;
  onClose: () => void;
  onNext: () => void;
  isLastWord: boolean;
}

export function PracticeModal({ word, onClose, onNext, isLastWord }: PracticeModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; score: number; spokenWord?: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(true);
  const recognition = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Initialize recognition when word changes
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      // Create a new instance for each word to ensure fresh state
      recognition.current = new webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';
      recognition.current.maxAlternatives = 1;

      setupRecognitionHandlers();
    } else {
      setIsRecognitionSupported(false);
    }

    return () => {
      if (recognition.current) {
        recognition.current.abort();
      }
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [word]); // Reinitialize when word changes

  const normalizeWord = (text: string): string => {
    return text
      .toLowerCase() // Convert to lowercase
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim(); // Remove leading/trailing spaces
  };

  const setupRecognitionHandlers = () => {
    if (!recognition.current) return;

    recognition.current.onstart = () => {
      setIsRecording(true);
      setIsProcessing(true);
      timeoutRef.current = window.setTimeout(() => {
        if (recognition.current && isRecording) {
          recognition.current.stop();
          setFeedback({
            message: "Recording took too long. Please try again.",
            score: 0
          });
          setIsProcessing(false);
          setIsRecording(false);
        }
      }, 10000);
    };

    recognition.current.onresult = (event) => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      const spokenWord = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      
      const normalizedSpoken = normalizeWord(spokenWord);
      const normalizedTarget = normalizeWord(word.word);
      
      // Log for debugging
      console.log('Spoken:', normalizedSpoken);
      console.log('Target:', normalizedTarget);
      
      let similarityScore: number;
      
      if (normalizedSpoken === normalizedTarget) {
        // Perfect match after normalization
        similarityScore = 100;
      } else {
        // Calculate similarity for non-exact matches
        similarityScore = calculateSimilarity(normalizedSpoken, normalizedTarget) * 100;
      }

      // Weight the final score
      const finalScore = (similarityScore * 0.7 + confidence * 100 * 0.3);

      // Log scores for debugging
      console.log('Similarity Score:', similarityScore);
      console.log('Confidence:', confidence * 100);
      console.log('Final Score:', finalScore);

      addAttempt(word.id, finalScore, spokenWord);

      if (finalScore >= 80) {
        setFeedback({
          message: "Perfect! You're doing great! 🎉",
          score: finalScore,
          spokenWord
        });
      } else if (finalScore >= 70) {
        setFeedback({
          message: "Almost there! Try again focusing on the pronunciation.",
          score: finalScore,
          spokenWord
        });
      } else {
        setFeedback({
          message: "Let's practice more. Listen to the word again and try to match it.",
          score: finalScore,
          spokenWord
        });
      }
    };

    recognition.current.onerror = (event) => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      console.error('Speech recognition error:', event.error);
      setIsProcessing(false);
      setIsRecording(false);
      setFeedback({
        message: event.error === 'not-allowed' 
          ? "Please allow microphone access to use this feature."
          : "Sorry, there was an error. Please try again.",
        score: 0
      });
    };

    recognition.current.onend = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      setIsProcessing(false);
      setIsRecording(false);
    };
  };

  const startRecording = async () => {
    try {
      if (!recognition.current) {
        throw new Error('Speech recognition not available');
      }

      setIsProcessing(true);
      setFeedback(null);

      // Request microphone permission first
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());

      recognition.current.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setFeedback({
        message: 'Error accessing microphone. Please check your permissions.',
        score: 0
      });
      setIsProcessing(false);
      setIsRecording(false);
    }
  };

  const playReference = () => {
    const speech = new SpeechSynthesisUtterance(word.word);
    speech.lang = 'en-US';
    speech.rate = 0.8;
    
    const voices = window.speechSynthesis.getVoices().filter(voice => 
      voice.lang.startsWith('en-')
    );
    
    if (voices.length > 0) {
      const usVoice = voices.find(voice => voice.lang === 'en-US');
      speech.voice = usVoice || voices[0];
    }
    
    window.speechSynthesis.speak(speech);
  };

  const handleNext = () => {
    setFeedback(null);
    onNext();
  };

  const handleRetry = () => {
    setFeedback(null);
    startRecording();
  };

  if (!isRecognitionSupported) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Speech Recognition Not Supported</h2>
          <p className="text-gray-600 mb-6">
            Sorry, your browser doesn't support speech recognition. Please try using a modern browser like Chrome, Edge, or Safari.
          </p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-duo-green text-white rounded-2xl hover:bg-duo-green-hover transition-colors font-bold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-[#58CC02]">Practice Pronunciation</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-4xl font-bold text-gray-800 mb-3">{word.word}</h3>
            <p className="text-xl text-gray-600 bg-[#F7F7F7] px-4 py-2 rounded-lg inline-block">
              {word.translation}
            </p>
          </div>
          
          {!feedback ? (
            <div className="flex justify-center gap-6">
              <button
                onClick={playReference}
                className="flex items-center gap-2 px-6 py-3 bg-[#58CC02] text-white rounded-2xl hover:bg-[#46A302] transition-colors shadow-lg font-bold text-lg"
              >
                <Volume size={24} />
                Listen
              </button>
              <button
                onClick={startRecording}
                disabled={isRecording || isProcessing}
                className={`flex items-center gap-2 px-6 py-3 font-bold text-lg ${
                  isRecording 
                    ? 'bg-red-500 animate-pulse' 
                    : isProcessing
                      ? 'bg-gray-400'
                      : 'bg-[#58CC02] hover:bg-[#46A302]'
                } text-white rounded-2xl transition-colors shadow-lg`}
              >
                {isProcessing ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <Mic size={24} />
                )}
                {isRecording ? 'Recording...' : isProcessing ? 'Processing...' : 'Record'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl ${
                feedback.score >= 80 
                  ? 'bg-[#E5F6E3] text-[#58CC02] border-2 border-[#58CC02]' 
                  : feedback.score >= 70
                    ? 'bg-[#FFF4DC] text-[#FF9600] border-2 border-[#FF9600]'
                    : 'bg-[#FDE7E9] text-red-500 border-2 border-red-500'
              }`}>
                <div className="flex flex-col items-center gap-3">
                  <div className="text-3xl font-bold">{Math.round(feedback.score)}%</div>
                  <p className="text-center text-lg font-medium">{feedback.message}</p>
                  {feedback.spokenWord && (
                    <p className="text-sm mt-2">
                      You said: <span className="font-medium">{feedback.spokenWord}</span>
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-4">
                {feedback.score < 70 && (
                  <button
                    onClick={handleRetry}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#FF9600] text-white rounded-2xl hover:bg-[#E68A00] transition-colors shadow-lg font-bold text-lg"
                  >
                    <RotateCcw size={24} />
                    Try Again
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className={`${feedback.score < 70 ? 'flex-1' : 'w-full'} flex items-center justify-center gap-2 px-6 py-4 bg-[#58CC02] text-white rounded-2xl hover:bg-[#46A302] transition-colors shadow-lg font-bold text-lg`}
                >
                  {isLastWord ? 'Complete Practice' : 'Next Word'}
                  <ArrowRight size={24} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function calculateSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1.0;
  
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const costs = new Array();
  for (let i = 0; i <= longer.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= shorter.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (longer.charAt(i - 1) !== shorter.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[shorter.length] = lastValue;
  }
  
  return (longer.length - costs[shorter.length]) / longer.length;
}