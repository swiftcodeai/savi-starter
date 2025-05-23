import React, { useState, useRef } from "react";
import { FaVolumeUp } from "react-icons/fa";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import LessonLayout, { LessonCard } from "@/components/LessonLayout";
import { LessonSequence } from "@/App";
import LessonInstructionsPopup from '@/components/LessonInstructionsPopup';
import LessonNav from "@/components/LessonNav";
import VictoryPopup from "@/components/VictoryPopup";
import { useCourse } from "@/contexts/CourseContext";

const VOCAB_ITEMS = [
  { word: "ZERO", image: "/vocab-images/zero.png", audio: "/audio/words/zero.webm" },
  { word: "ONE", image: "/vocab-images/one.png", audio: "/audio/words/one.webm" },
  { word: "TWO", image: "/vocab-images/two.png", audio: "/audio/words/two.webm" },
  { word: "THREE", image: "/vocab-images/three.png", audio: "/audio/words/three.webm" },
  { word: "FOUR", image: "/vocab-images/four.png", audio: "/audio/words/four.webm" },
  { word: "FIVE", image: "/vocab-images/five.png", audio: "/audio/words/five.webm" },
  { word: "SIX", image: "/vocab-images/six.png", audio: "/audio/words/six.webm" },
  { word: "HI", image: "/vocab-images/hi.png", audio: "/audio/words/hi.webm" },
  { word: "HELLO", image: "/vocab-images/hello.png", audio: "/audio/words/hello.webm" },
  { word: "FELIX", image: "/vocab-images/felix.png", audio: "/audio/words/felix.webm" },
  { word: "OLA", image: "/vocab-images/ola.png", audio: "/audio/words/ola.webm" },
  { word: "MS FINE", image: "/vocab-images/ms fine.png", audio: "/audio/words/ms fine.webm" },
];

// Split vocab into 4 sets, ensuring required items are in the correct sets
const VOCAB_SETS = [
  VOCAB_ITEMS.slice(0, 6),   // Set 1: numbers 0-5
  [   // Set 2: set with FIVE
    VOCAB_ITEMS[5],  // FIVE
    VOCAB_ITEMS[6],  // SIX
    VOCAB_ITEMS[7],  // HI
    VOCAB_ITEMS[8],  // HELLO
    VOCAB_ITEMS[9],  // FELIX
    VOCAB_ITEMS[11], // MS FINE
  ],
  [   // Set 3: set with MS FINE
    VOCAB_ITEMS[7],  // HI
    VOCAB_ITEMS[8],  // HELLO
    VOCAB_ITEMS[11], // MS FINE
    VOCAB_ITEMS[10], // OLA
    VOCAB_ITEMS[9],  // FELIX
    VOCAB_ITEMS[6],  // SIX
  ],
  [   // Set 4: set with FELIX
    VOCAB_ITEMS[7],  // HI
    VOCAB_ITEMS[8],  // HELLO
    VOCAB_ITEMS[9],  // FELIX
    VOCAB_ITEMS[10], // OLA
    VOCAB_ITEMS[11], // MS FINE
    VOCAB_ITEMS[6],  // SIX
  ],
];

const ListeningGame = () => {
  const { currentCourse } = useCourse();
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState<{ idx: number; correct: boolean } | null>(null);
  const [completed, setCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPenActive, setIsPenActive] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isAudioDisabled, setIsAudioDisabled] = useState(false);
  const [showVictoryPopup, setShowVictoryPopup] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentAudio = `/audio/words/4.1 sentence ${round + 1}`;
  const currentVocabSet = VOCAB_SETS[round];
  const progress = (round / VOCAB_SETS.length) * 100;

  const playAudio = async () => {
    if (isAudioDisabled) return;
    
    setIsPlaying(true);
    setAudioError(false);

    const audio = new Audio(`${currentAudio}.webm`);
    
    audio.onerror = async () => {
      audio.src = `${currentAudio}.mp3`;
      
      audio.onerror = () => {
        setIsPlaying(false);
        setAudioError(true);
        console.error('Failed to play audio in both webm and mp3 formats');
      };

      try {
        await audio.play();
      } catch (err) {
        setIsPlaying(false);
        setAudioError(true);
        console.error('Error playing audio:', err);
      }
    };

    audio.onended = () => {
      setIsPlaying(false);
      setAudioError(false);
    };

    try {
      await audio.play();
    } catch (err) {
      audio.onerror(new ErrorEvent('error'));
    }
  };

  const playSound = (type: 'correct' | 'wrong') => {
    const audio = new Audio(`/audio/${type}.mp3`);
    audio.play();
  };

  const playVocabAudio = async (word: string) => {
    if (isAudioDisabled) return;
    
    const vocabItem = VOCAB_ITEMS.find(item => item.word === word);
    if (!vocabItem) return;

    try {
      const audio = new Audio(vocabItem.audio);
      await audio.play();
    } catch (err) {
      console.error('Error playing vocab audio:', err);
    }
  };

  const handleImageClick = (item, idx) => {
    if (feedback) return; // Prevent double clicks

    let isCorrect = false;
    
    // Check correct answer based on current round
    switch(round) {
      case 0: // First stage
        isCorrect = idx === 0;
        break;
      case 1: // Second stage - FIVE
        isCorrect = item.word === "FIVE";
        break;
      case 2: // Third stage - Ms Fine
        isCorrect = item.word === "MS FINE";
        break;
      case 3: // Fourth stage - Felix
        isCorrect = item.word === "FELIX";
        break;
    }

    setFeedback({ idx, correct: isCorrect });
    
    if (isCorrect) {
      playSound('correct');
      setTimeout(() => playVocabAudio(item.word), 150);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
      setTimeout(() => {
        if (round < 3) {
          setRound(r => r + 1);
          setFeedback(null);
        } else {
          setCompleted(true);
          setShowVictoryPopup(true);
        }
      }, 1200);
    } else {
      playSound('wrong');
      setTimeout(() => setFeedback(null), 700);
    }
  };

  const handleRestart = () => {
    setRound(0);
    setFeedback(null);
    setCompleted(false);
    setIsPlaying(false);
  };

  const handleLayoutRestart = () => {
    setRound(0);
    setFeedback(null);
    setCompleted(false);
    setIsPlaying(false);
  };

  const handleAudioToggle = () => {
    setIsAudioDisabled(!isAudioDisabled);
    if (!isAudioDisabled) {
      // If we're disabling audio, stop any current playback
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      {/* Top navigation bar */}
      <div className="flex justify-between items-center mb-8 px-4 py-2">
        <LessonCard className="py-2 px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-cyan-500">
            {currentCourse?.title || "Greetings & Communication"}
          </h2>
        </LessonCard>
        
        <LessonCard className="py-2 px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-cyan-500">
            Knowledge Check
          </h2>
        </LessonCard>
      </div>

    <LessonLayout
      className="max-w-6xl mx-auto"
        nextPath={LessonSequence["4.2"]}
        prevPath={LessonSequence["4.0"]}
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
      <div className="flex flex-col items-center gap-8 w-full px-4 pb-20">
          {/* Progress indicator */}
          <div className="w-full max-w-4xl mx-auto flex justify-between items-center px-4">
            <div className="text-lg font-medium text-gray-600">
              Set {round + 1} of {VOCAB_SETS.length}
            </div>
            <div className="flex gap-1">
              {VOCAB_SETS.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-3 h-3 rounded-full",
                    idx === round ? "bg-cyan-500" : 
                    idx < round ? "bg-green-500" : "bg-gray-200"
                  )}
                />
              ))}
            </div>
          </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left side - Audio player */}
          <div className="flex flex-col items-center gap-6">
            <LessonCard className="w-full py-8 px-6 flex flex-col items-center gap-4">
              <h2 className="text-2xl font-bold text-cyan-700">Listen to the Word</h2>
              <button
                onClick={playAudio}
                disabled={isPlaying}
                className={cn(
                  "bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-4 transition-all",
                  isPlaying ? "scale-110 opacity-70" : "hover:scale-105",
                  audioError && "bg-red-500"
                )}
              >
                <FaVolumeUp className="w-8 h-8" />
              </button>
              <p className="text-gray-600 text-center mt-2">
                {audioError 
                  ? "Sorry, there was an error playing the audio"
                  : "Click the speaker to hear the word"}
              </p>
            </LessonCard>
          </div>

          {/* Right side - Images grid */}
          <div className="flex flex-col items-center gap-6">
            {!completed ? (
              <LessonCard className="w-full p-6">
                <h2 className="text-2xl font-bold text-cyan-700 mb-6 text-center">Choose the Matching Image</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {currentVocabSet.map((item, idx) => (
                    <button
                      key={item.word}
                      onClick={() => handleImageClick(item, idx)}
                      disabled={!!feedback}
                      className="transition-all hover:scale-105 active:scale-95"
                    >
                      <div className={cn(
                        "bg-[#fae6b0] rounded-xl border-4 border-[#f9da8d] shadow-md p-2 aspect-square flex items-center justify-center transition-all relative",
                        feedback && feedback.idx === idx && feedback.correct && "ring-4 ring-green-400 scale-105",
                        feedback && feedback.idx === idx && !feedback.correct && "ring-4 ring-red-400 animate-shake",
                        feedback && feedback.correct && idx !== feedback.idx && "opacity-50"
                      )}>
                        {/* Corner accents */}
                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-white rounded-full opacity-80"></div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-80"></div>
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white rounded-full opacity-80"></div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full opacity-80"></div>
                        <img
                          src={item.image}
                          alt={item.word}
                          className="w-full h-full object-contain select-none p-2"
                          draggable={false}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </LessonCard>
            ) : (
              <LessonCard className="w-full py-6 px-8">
                <div className="text-4xl font-extrabold text-cyan-500 text-center animate-pop">
                  🎉 Great listening! 🎉
                </div>
              </LessonCard>
            )}
          </div>
        </div>
      </div>
      <LessonNav
        prevPath={LessonSequence["4.0"]}
        nextPath={LessonSequence["4.2"]}
        onRestart={handleRestart}
        onPenToggle={() => setIsPenActive(!isPenActive)}
        isPenActive={isPenActive}
        onLayoutRestart={handleLayoutRestart}
        onAudioToggle={handleAudioToggle}
        isAudioDisabled={isAudioDisabled}
      />
        {showVictoryPopup && (
          <VictoryPopup
            onClose={() => setShowVictoryPopup(false)}
            message="Congratulations! You've completed all the listening exercises! 🎉"
            nextPath={LessonSequence["4.2"]}
          />
        )}
    </LessonLayout>
    </div>
  );
};

export default ListeningGame; 