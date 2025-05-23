import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LessonLayout, { LessonCard } from "@/components/LessonLayout";
import { LessonSequence } from "@/App";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import LessonInstructionsPopup from '@/components/LessonInstructionsPopup';
import { motion, AnimatePresence } from "framer-motion";
import { useCourse } from "@/contexts/CourseContext";

interface VictoryPopupProps {
  onNextSet: () => void;
  onHome: () => void;
}

const VictoryPopup: React.FC<VictoryPopupProps> = ({ onNextSet, onHome }) => {
  useEffect(() => {
    // Trigger victory confetti effect
    const duration = 500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#FFD700', '#FFA500', '#FF69B4', '#87CEEB']
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#FFD700', '#FFA500', '#FF69B4', '#87CEEB']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 transform animate-bounce-in">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-green-600 mb-4">
            Amazing Job! 🎉
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            You've matched all the vocabulary images!
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onNextSet}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-colors shadow-lg"
            >
              Next Lesson
            </button>
            <button
              onClick={onHome}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors shadow-lg"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  { word: "MS FINE", image: "/vocab-images/ms fine.png", audio: "/audio/words/msfine.webm" },
];

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const ROUNDS = VOCAB_ITEMS.length;

const VocabMatchGame = () => {
  const navigate = useNavigate();
  const { currentCourse } = useCourse();
  const [round, setRound] = useState(0);
  const [shuffledImages, setShuffledImages] = useState(() => shuffleArray(VOCAB_ITEMS));
  const [feedback, setFeedback] = useState<{ idx: number; correct: boolean } | null>(null);
  const [completed, setCompleted] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showVictoryPopup, setShowVictoryPopup] = useState(false);

  const shuffleImages = () => {
    setIsShuffling(true);
    setTimeout(() => {
      setShuffledImages(shuffleArray(VOCAB_ITEMS));
      setIsShuffling(false);
    }, 500);
  };

  useEffect(() => {
    shuffleImages();
    setFeedback(null);
  }, [round]);

  const currentWord = VOCAB_ITEMS[round].word;

  const handleImageClick = (item, idx) => {
    if (feedback) return; // Prevent double clicks
    if (item.word === currentWord) {
      setFeedback({ idx, correct: true });
      const audio = new Audio(item.audio);
      audio.play();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
      setTimeout(() => {
        if (round < ROUNDS - 1) {
          setRound(r => r + 1);
        } else {
          setCompleted(true);
          setShowVictoryPopup(true);
        }
      }, 1200);
    } else {
      setFeedback({ idx, correct: false });
      setTimeout(() => setFeedback(null), 700);
    }
  };

  const handleRestart = () => {
    setRound(0);
    setCompleted(false);
    setFeedback(null);
    setShowVictoryPopup(false);
    setShuffledImages(shuffleArray(VOCAB_ITEMS));
  };

  const handleNextSet = () => {
    navigate(LessonSequence["4.1"]);
  };

  const handleHome = () => {
    navigate(LessonSequence.SKILLS);
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
            Activities
          </h2>
        </LessonCard>
      </div>

      <LessonLayout
        className="max-w-6xl mx-auto"
        nextPath={LessonSequence["4.1"]}
        prevPath={LessonSequence["3.2"]}
      >
        <LessonInstructionsPopup
          lessonId="3.3"
          title="Word and Image Matching Game"
          instructions={
            <div>
              <p>Welcome to the Word and Image Matching Game! Here's how to play:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Look at the words and images on the screen</li>
                <li>Click on a word, then click on its matching image</li>
                <li>If you match correctly, the pair will stay revealed</li>
                <li>If you make a mistake, try again</li>
                <li>Match all pairs to complete the game</li>
                <li>Try to remember the locations to improve your score</li>
              </ul>
              <p className="mt-4 text-gray-500 italic">Tip: Focus on matching a few pairs at a time rather than trying to remember everything at once!</p>
            </div>
          }
        />
        <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto px-4 pb-20">
          {/* Word at the top in its own card */}
          <LessonCard className="w-full max-w-xl py-10 px-6 flex items-center justify-center">
            <span className="text-6xl sm:text-7xl font-extrabold text-cyan-500 text-center drop-shadow-lg tracking-wide animate-pop">
              {currentWord}
            </span>
          </LessonCard>

          {/* Images grid in its own card */}
          <LessonCard className="w-full max-w-5xl py-10 px-6 flex flex-col items-center">
            <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 sm:gap-8 md:gap-10">
              <AnimatePresence mode="sync">
                {shuffledImages.map((item, idx) => (
                  <motion.button
                    key={item.word}
                    layout
                    initial={{ scale: 0.8, opacity: 0, rotate: -30 }}
                    animate={{ 
                      scale: isShuffling ? 0.8 : 1,
                      opacity: isShuffling ? 0 : 1,
                      rotate: isShuffling ? 30 : 0
                    }}
                    exit={{ scale: 0.8, opacity: 0, rotate: 30 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 200,
                      damping: 25,
                      duration: 0.5
                    }}
                    onClick={() => handleImageClick(item, idx)}
                    className={cn(
                      "rounded-3xl p-4 flex flex-col items-center justify-center transition-all",
                      "hover:scale-110 active:scale-95",
                      feedback && feedback.correct && item.word !== currentWord ? "opacity-60" : ""
                    )}
                    disabled={!!feedback}
                  >
                    <motion.div 
                      className={cn(
                        "bg-[#fae6b0] rounded-2xl w-full aspect-square flex items-center justify-center border-4 border-[#f9da8d] transition-all",
                        feedback && feedback.idx === idx && feedback.correct && "border-green-400 ring-4 ring-green-300 scale-110 animate-bounce-smooth",
                        feedback && feedback.idx === idx && !feedback.correct && "border-red-400 ring-4 ring-red-300 animate-shake"
                      )}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5
                      }}
                      whileTap={{ 
                        scale: 0.95,
                        rotate: -5
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.word}
                        className="w-4/5 h-4/5 object-contain select-none"
                        draggable={false}
                      />
                    </motion.div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </LessonCard>
        </div>
        
        {showVictoryPopup && (
          <VictoryPopup
            onNextSet={handleNextSet}
            onHome={handleHome}
          />
        )}
      </LessonLayout>
    </div>
  );
};

export default VocabMatchGame;
