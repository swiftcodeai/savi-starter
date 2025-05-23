import React, { useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import LessonLayout, { LessonCard } from "@/components/LessonLayout";
import { LessonSequence } from "@/App";
import LessonInstructionsPopup from '@/components/LessonInstructionsPopup';

const VOCAB_ITEMS = [
  { word: "ZERO", image: "/vocab-images/zero.png" },
  { word: "ONE", image: "/vocab-images/one.png" },
  { word: "TWO", image: "/vocab-images/two.png" },
  { word: "THREE", image: "/vocab-images/three.png" },
  { word: "FOUR", image: "/vocab-images/four.png" },
  { word: "FIVE", image: "/vocab-images/five.png" },
  { word: "SIX", image: "/vocab-images/six.png" },
  { word: "HI", image: "/vocab-images/hi.png" },
  { word: "HELLO", image: "/vocab-images/hello.png" },
  { word: "FELIX", image: "/vocab-images/felix.png" },
  { word: "OLA", image: "/vocab-images/ola.png" },
  { word: "MS FINE", image: "/vocab-images/ms fine.png" },
];

// Split vocab into 4 sets of 6 items each
const VOCAB_SETS = [
  VOCAB_ITEMS.slice(0, 6),   // Set 1: numbers 0-5
  VOCAB_ITEMS.slice(6, 12),  // Set 2: 6, hi, hello, felix, ola, ms fine
  VOCAB_ITEMS.slice(0, 6),   // Set 3: repeat numbers
  VOCAB_ITEMS.slice(6, 12),  // Set 4: repeat others
];

const ListeningGame = () => {
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState<{ idx: number; correct: boolean } | null>(null);
  const [completed, setCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPenActive, setIsPenActive] = useState(false);

  const currentAudio = `/audio/4.1_sentence_${round + 1}.webm`;
  const currentVocabSet = VOCAB_SETS[round];

  const playAudio = () => {
    setIsPlaying(true);
    const audio = new Audio(currentAudio);
    audio.play();
    audio.onended = () => setIsPlaying(false);
  };

  const handleImageClick = (item, idx) => {
    if (feedback) return; // Prevent double clicks

    // Note: This will need to be adjusted based on which word matches which audio
    const isCorrect = idx === 0; 

    setFeedback({ idx, correct: isCorrect });
    
    if (isCorrect) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
      setTimeout(() => {
        if (round < 3) {
          setRound(r => r + 1);
          setFeedback(null);
        } else {
          setCompleted(true);
        }
      }, 1200);
    } else {
      setTimeout(() => setFeedback(null), 700);
    }
  };

  const handleRestart = () => {
    setRound(0);
    setFeedback(null);
    setCompleted(false);
    setIsPlaying(false);
  };

  return (
    <LessonLayout
      title="Listening Practice"
      subtitle="Listen and Choose"
      className="max-w-6xl mx-auto"
    >
      <LessonInstructionsPopup
        lessonId="4.1"
        title="Listening Practice Game"
        instructions={
          <div>
            <p>Welcome to the Listening Practice Game! Here's how to play:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Click the speaker icon 🔊 to hear a word</li>
              <li>Listen carefully to the pronunciation</li>
              <li>Choose the correct image that matches the word</li>
              <li>Get instant feedback on your choice</li>
              <li>Listen as many times as you need</li>
              <li>Try to improve your listening skills with each round</li>
            </ul>
            <p className="mt-4 text-gray-500 italic">Tip: Pay attention to the small differences in pronunciation between similar words!</p>
          </div>
        }
      />
      <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto px-4 pb-20">
        {/* Audio player */}
        <LessonCard className="w-full max-w-lg py-4 px-6 flex justify-center">
          <button
            onClick={playAudio}
            disabled={isPlaying}
            className={cn(
              "bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-6 transition-all",
              isPlaying ? "scale-110 opacity-70" : "hover:scale-105"
            )}
          >
            <FaVolumeUp className="w-12 h-12" />
          </button>
        </LessonCard>

        {/* Images grid */}
        {!completed && (
          <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 gap-4">
            {currentVocabSet.map((item, idx) => (
              <button
                key={item.word}
                onClick={() => handleImageClick(item, idx)}
                disabled={!!feedback}
                className="transition-all hover:scale-105 active:scale-95"
              >
                <LessonCard className={cn(
                  "w-full aspect-square flex items-center justify-center transition-all p-2",
                  feedback && feedback.idx === idx && feedback.correct && "ring-4 ring-green-400 scale-105",
                  feedback && feedback.idx === idx && !feedback.correct && "ring-4 ring-red-400 animate-shake",
                  feedback && feedback.correct && idx !== feedback.idx && "opacity-50"
                )}>
                  <img
                    src={item.image}
                    alt={item.word}
                    className="w-full h-full object-contain select-none"
                    draggable={false}
                  />
                </LessonCard>
              </button>
            ))}
          </div>
        )}

        {/* Completion message */}
        {completed && (
          <LessonCard className="py-6 px-8">
            <div className="text-5xl font-extrabold text-cyan-500 text-center animate-pop">
              🎉 Great listening! 🎉
            </div>
          </LessonCard>
        )}
      </div>
    </LessonLayout>
  );
};

export default ListeningGame; 