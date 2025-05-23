import React, { useEffect, useState, useRef } from "react";
import LessonLayout from "@/components/LessonLayout";
import { LessonSequence } from "@/App";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import LessonInstructionsPopup from '@/components/LessonInstructionsPopup';
import { useNavigate } from "react-router-dom";
import { useCourse } from "@/contexts/CourseContext";
import LessonCard from "@/components/dragndrop/LessonCard";

const GRID_ROWS = 6;
const GRID_COLS = 8;
const FADE_INTERVAL = 700; // ms
const ROUNDS = 4;

const getInitialBlocks = () => {
  const blocks = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      blocks.push({
        id: `${row}-${col}`,
        row,
        col,
        faded: false
      });
    }
  }
  return blocks;
};

const getRightSideBlockIds = () => {
  // Rightmost 4 columns
  const ids = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = GRID_COLS - 4; col < GRID_COLS; col++) {
      ids.push(`${row}-${col}`);
    }
  }
  return ids;
};

const BlockGridOverlay = ({ imageUrl, resetKey }) => {
  const [blocks, setBlocks] = useState(getInitialBlocks());
  const [showCorrectEffect, setShowCorrectEffect] = useState(false);

  useEffect(() => {
    setBlocks(getInitialBlocks());
    setShowCorrectEffect(false);
  }, [resetKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlocks((prevBlocks) => {
        const unfaded = prevBlocks.filter(b => !b.faded);
        if (unfaded.length === 0) {
          clearInterval(interval);
          // Show correct effect when all blocks are faded
          setTimeout(() => setShowCorrectEffect(true), 500);
          return prevBlocks;
        }
        // Get blocks in a spiral pattern from outside to inside
        const centerRow = Math.floor(GRID_ROWS / 2);
        const centerCol = Math.floor(GRID_COLS / 2);
        const unfadedSorted = unfaded.sort((a, b) => {
          const distA = Math.abs(a.row - centerRow) + Math.abs(a.col - centerCol);
          const distB = Math.abs(b.row - centerRow) + Math.abs(b.col - centerCol);
          return distB - distA; // Outside to inside
        });
        const randomBlock = unfadedSorted[0];
        return prevBlocks.map((b) =>
          b.id === randomBlock.id ? { ...b, faded: true } : b
        );
      });
    }, FADE_INTERVAL);
    return () => clearInterval(interval);
  }, [resetKey]);

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-video">
      <img
        src={imageUrl}
        alt="Selected"
        className="w-full h-full object-contain rounded-2xl border-4 border-cyan-200 shadow-xl"
      />
      {/* Overlay grid */}
      <div className="absolute inset-0 grid" style={{ gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`, gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}>
        {blocks.map((block) => (
          <div
            key={block.id}
            className={cn(
              "transition-all duration-700 bg-cyan-500 border-2 border-white",
              block.faded ? 'opacity-0 scale-95' : 'opacity-100 scale-100',
              "transform rotate-3"
            )}
            style={{ 
              pointerEvents: 'none', 
              borderRadius: 8,
              transformOrigin: 'center'
            }}
          />
        ))}
      </div>
      {/* Correct effect overlay */}
      {showCorrectEffect && (
        <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
          <div className="bg-green-500/20 backdrop-blur-sm w-full h-full flex items-center justify-center rounded-2xl">
            <div className="bg-white/80 rounded-full p-8 shadow-lg animate-bounce">
              <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Vocab words and images - Updated paths
const GAME_DATA = [
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

const generateLetters = (word: string) => {
  const letters = word.split('');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const additionalLetters = alphabet
    .filter(letter => !letters.includes(letter))
    .sort(() => Math.random() - 0.5)
    .slice(0, 17 - letters.length);
  return [...letters, ...additionalLetters].sort(() => Math.random() - 0.5);
};

const getRandomIndices = (n: number, max: number) => {
  const indices = Array.from({ length: max }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, n);
};

// Custom card component for the lesson
const VocabCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn(
    "bg-[#fae6b0] rounded-xl border-4 border-[#f9da8d] shadow-lg p-3 relative",
    className
  )}>
    {/* Corner accents - stylized circular accents in the corners */}
    <div className="absolute -top-1 -left-1 w-4 h-4 bg-white rounded-full opacity-80"></div>
    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full opacity-80"></div>
    <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-white rounded-full opacity-80"></div>
    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full opacity-80"></div>
    {children}
  </div>
);

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
            You've completed all the spelling challenges!
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

const WordSpellingGame = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentCourse } = useCourse();
  const [round, setRound] = useState(0);
  const [showVictoryPopup, setShowVictoryPopup] = useState(false);
  const [roundOrder] = useState(() => getRandomIndices(ROUNDS, GAME_DATA.length));
  const gameData = GAME_DATA[roundOrder[round]];
  const [letters, setLetters] = useState(() => generateLetters(gameData.word));
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [isAudioDisabled, setIsAudioDisabled] = useState(false);

  useEffect(() => {
    setLetters(generateLetters(gameData.word));
    setSelectedLetters([]);
    setRevealed(false);
    setIsComplete(false);
    setResetKey(prev => prev + 1);
  }, [round]);

  const playSound = (type: 'correct' | 'wrong'): Promise<void> => {
    if (isAudioDisabled) {
      console.log('Audio is disabled, skipping sound playback');
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      console.log(`Attempting to play ${type} sound`);
      const audio = new Audio(`/audio/effects/${type}.webm`);
      
      audio.onerror = (e) => {
        console.error(`Error loading ${type} sound:`, e);
        resolve();
      };
      
      const handleEnded = () => {
        console.log(`${type} sound finished playing`);
        audio.removeEventListener('ended', handleEnded);
        resolve();
      };
      
      audio.addEventListener('ended', handleEnded);
      audio.play()
        .catch(error => {
          console.error(`Error playing ${type} sound:`, error);
          audio.removeEventListener('ended', handleEnded);
          resolve(); // Resolve even on error to ensure chain continues
        });
    });
  };

  const playVocabAudio = (word: string) => {
    if (isAudioDisabled) {
      console.log('Audio is disabled, skipping vocab playback');
      return;
    }
    console.log(`Attempting to play vocab word: ${word}`);
    const audio = new Audio(`/audio/words/${word.toLowerCase()}.webm`);
    
    audio.onerror = (e) => {
      console.error(`Error loading vocab audio for ${word}:`, e);
    };
    
    audio.play()
      .catch(error => {
        console.error(`Error playing vocab audio for ${word}:`, error);
      });
  };

  useEffect(() => {
    if (selectedLetters.join('') === gameData.word) {
      toast({
        title: "Correct!",
        description: "Well done! You spelled the word correctly!",
      });
      setRevealed(true);
      setIsComplete(true);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });

      // Play correct sound first, then vocab audio
      playSound('correct').then(() => {
        // Wait a short delay before playing the vocab
        setTimeout(() => {
          playVocabAudio(gameData.word);
        }, 50);
      });

      // Add delay before moving to next round or showing victory
      setTimeout(() => {
        if (round < ROUNDS - 1) {
          setRound(round + 1);
        } else {
          setShowVictoryPopup(true);
        }
      }, 1000);
    }
  }, [selectedLetters, gameData.word, round]);

  const handleLetterClick = (letter: string) => {
    if (selectedLetters.length < gameData.word.length && !isComplete) {
      setSelectedLetters([...selectedLetters, letter]);
    }
  };

  const handleDeleteLetter = () => {
    if (!isComplete) setSelectedLetters(selectedLetters.slice(0, -1));
  };

  const imageUrl = gameData.image;

  const title = showVictoryPopup ? "You finished all rounds!" : `Round ${round + 1} of ${ROUNDS}`;
  const subtitle = "";

  const handleRestart = () => {
    setRound(0);
    setLetters(generateLetters(gameData.word));
    setSelectedLetters([]);
    setRevealed(false);
    setIsComplete(false);
    setResetKey(prev => prev + 1);
  };

  const handleNextSet = () => {
    navigate(LessonSequence["3.3"]);
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
        nextPath={LessonSequence["3.3"]}
        prevPath={LessonSequence["3.0"]}
      >
        <LessonInstructionsPopup
          lessonId="3.2"
          title="Spelling Practice Time!"
          instructions={
            <div>
              <p>Welcome to the Word Spelling Game! Here's how to play:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Look at the image and listen to the word</li>
                <li>Type the correct spelling in the box</li>
                <li>Click 'Check' to see if you're right</li>
                <li>Get hints if you need help</li>
                <li>Practice each word until you get it right</li>
                <li>Move on to the next word when ready</li>
              </ul>
              <p className="mt-4 text-gray-500 italic">Tip: Sound out each word carefully before spelling it!</p>
            </div>
          }
        />
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-4 pb-20">
          {/* Left side - Letter selection */}
          <div className="flex justify-center">
            <VocabCard className="w-full max-w-lg p-8">
              {showVictoryPopup ? (
                <div className="text-3xl font-bold text-center text-green-600 py-24">🎉 You did it! 🎉</div>
              ) : (
                <>
                  {/* Word progress display */}
                  <div className="mb-8 flex justify-center gap-3">
                    {gameData.word.split('').map((letter, index) => (
                      <div
                        key={`slot-${index}`}
                        className={cn(
                          "w-16 h-16 border-4 rounded-xl flex items-center justify-center text-3xl font-extrabold",
                          selectedLetters[index] ? "border-cyan-400 bg-cyan-50" : "border-gray-300 bg-gray-50"
                        )}
                      >
                        {selectedLetters[index] || ''}
                      </div>
                    ))}
                  </div>

                  {/* Letter grid */}
                  <div className="grid grid-cols-6 gap-3 mb-6">
                    {letters.map((letter, index) => (
                      <button
                        key={`letter-${index}`}
                        onClick={() => handleLetterClick(letter)}
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold transition-colors shadow-md",
                          isComplete 
                            ? "bg-gray-200 cursor-not-allowed"
                            : "bg-cyan-100 hover:bg-cyan-200 text-cyan-700"
                        )}
                        disabled={isComplete}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>

                  {/* Delete button */}
                  <div className="flex justify-center">
                    <button
                      className={cn(
                        "px-6 py-3 rounded-xl text-lg font-semibold shadow transition-colors",
                        selectedLetters.length === 0 || isComplete
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-cyan-100 hover:bg-cyan-200 text-cyan-700"
                      )}
                      onClick={handleDeleteLetter}
                      disabled={selectedLetters.length === 0 || isComplete}
                    >
                      Delete Letter
                    </button>
                  </div>
                </>
              )}
            </VocabCard>
          </div>

          {/* Right side - Image with blocks */}
          <div className="flex justify-center">
            <VocabCard className="w-[24rem] h-[24rem] flex items-center justify-center p-4">
              {imageUrl && <BlockGridOverlay imageUrl={imageUrl} resetKey={resetKey} />}
            </VocabCard>
          </div>
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

export default WordSpellingGame;
