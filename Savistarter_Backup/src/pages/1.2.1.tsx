import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import LessonLayout from '@/components/LessonLayout';
import { LessonSequence } from '@/App';
import LessonInstructionsPopup from '@/components/LessonInstructionsPopup';
import confetti from 'canvas-confetti';
import { useCourse } from "@/contexts/CourseContext";

// Custom card component for the lesson (consistent with 1.1.tsx)
const LessonCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
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

// Vocabulary items for all sets
const ALL_VOCAB_ITEMS = [
  { id: 1, word: "Zero", imageUrl: "/vocab-images/zero.png" },
  { id: 2, word: "One", imageUrl: "/vocab-images/one.png" },
  { id: 3, word: "Two", imageUrl: "/vocab-images/two.png" },
  { id: 4, word: "Three", imageUrl: "/vocab-images/three.png" },
  { id: 5, word: "Four", imageUrl: "/vocab-images/four.png" },
  { id: 6, word: "Five", imageUrl: "/vocab-images/five.png" },
  { id: 7, word: "Six", imageUrl: "/vocab-images/six.png" },
  { id: 8, word: "Hi", imageUrl: "/vocab-images/hi.png" },
  { id: 9, word: "Hello", imageUrl: "/vocab-images/hello.png" },
  { id: 10, word: "Felix", imageUrl: "/vocab-images/felix.png" },
  { id: 11, word: "Ola", imageUrl: "/vocab-images/ola.png" },
  { id: 12, word: "Ms Fine", imageUrl: "/vocab-images/ms fine.png" },
];

// Function to shuffle array
const shuffleArray = <T extends unknown>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Create sets of vocabulary items
const createSets = () => {
  const shuffled = shuffleArray(ALL_VOCAB_ITEMS);
  return [
    shuffled.slice(0, 3),
    shuffled.slice(3, 6),
    shuffled.slice(6, 9),
    shuffled.slice(9, 12),
  ];
};

interface DraggableWordProps {
  id: number;
  word: string;
  isMatched: boolean;
  isTransitioning: boolean;
}

interface DragItem {
  id: number;
  word: string;
}

const DraggableWord: React.FC<DraggableWordProps> = ({ id, word, isMatched, isTransitioning }) => {
  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>(() => ({
    type: 'word',
    item: { id, word },
    canDrag: !isMatched && !isTransitioning,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging() && !isMatched && !isTransitioning,
    }),
  }), [isMatched, isTransitioning]);

  return (
    <LessonCard>
      <div
        ref={drag}
        className={cn(
          "w-full px-6 py-4 rounded-2xl shadow-lg border-4 text-center font-bold text-xl relative bg-white",
          "transition-all duration-300 transform",
          isMatched && "border-[#4CAF50] bg-[#E7FFF4] text-[#4CAF50] opacity-50 cursor-not-allowed pointer-events-none",
          !isMatched && !isTransitioning && "border-[#54D2FD] text-[#54D2FD] hover:border-[#54D2FD]/80 cursor-grab hover:scale-105",
          isDragging && "opacity-50 scale-105",
          isTransitioning && "cursor-not-allowed pointer-events-none opacity-50"
        )}
      >
        {word}
        {isMatched && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#4CAF50] rounded-full flex items-center justify-center animate-pop-in">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </LessonCard>
  );
};

interface ImageDropZoneProps {
  id: number;
  imageUrl: string;
  isMatched: boolean;
  showError: boolean;
  onDrop: (wordId: number) => void;
}

const ImageDropZone: React.FC<ImageDropZoneProps> = ({ id, imageUrl, isMatched, showError, onDrop }) => {
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>(() => ({
    accept: 'word',
    drop: (item) => !isMatched && onDrop(item.id),
    canDrop: () => !isMatched,
    collect: (monitor) => ({
      isOver: !!monitor.isOver() && !isMatched,
    }),
  }), [isMatched]);

  return (
    <LessonCard className="w-full max-w-[200px]">
      <div
        ref={drop}
        className={cn(
          "aspect-square rounded-3xl border-4 p-4 flex items-center justify-center bg-white relative",
          "transition-all duration-300 transform",
          showError && "border-red-500 bg-red-50 animate-shake",
          !isMatched && !showError && "border-[#54D2FD]",
          isMatched && "border-[#54D2FD] opacity-50 pointer-events-none",
          isOver && !isMatched && "scale-105 border-[#54D2FD] ring-4 ring-[#54D2FD]/30"
        )}
      >
        <img
          src={imageUrl}
          alt="Vocabulary"
          className="w-full h-full object-contain"
          draggable={false}
        />
        {showError && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pop-in">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}
      </div>
    </LessonCard>
  );
};

interface VictoryPopupProps {
  onNextSet: () => void;
  onHome: () => void;
}

const VictoryPopup: React.FC<VictoryPopupProps> = ({ onNextSet, onHome }) => {
  useEffect(() => {
    // Trigger victory confetti effect
    const duration = 2000;
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
            Great Job! 🎉
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            You've completed this set!
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onNextSet}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-colors shadow-lg"
            >
              Next Layout
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

const VocabMatchingGame: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [matches, setMatches] = useState<Set<number>>(new Set());
  const [errorStates, setErrorStates] = useState<{ [key: number]: boolean }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showVictoryPopup, setShowVictoryPopup] = useState(false);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [allSets] = useState(() => createSets());
  const [currentSet, setCurrentSet] = useState(allSets[0]);
  const [shuffledWordOrder, setShuffledWordOrder] = useState<number[]>([]);
  const [shuffledImageOrder, setShuffledImageOrder] = useState<number[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Initialize first set
  useEffect(() => {
    initializeSet(allSets[0]);
  }, []);

  // Handle set changes
  useEffect(() => {
    if (currentSetIndex < allSets.length) {
      initializeSet(allSets[currentSetIndex]);
    }
  }, [currentSetIndex, allSets]);

  const initializeSet = (newSet: typeof currentSet) => {
    setIsTransitioning(true);
    // Add a fade-out effect before changing the set
    const gameContent = document.querySelector('.game-content');
    if (gameContent) {
      gameContent.classList.add('opacity-0');
    }
    
    // Wait for fade out, then update state
    setTimeout(() => {
    setCurrentSet(newSet);
    setMatches(new Set());
    setErrorStates({});
    
      // Shuffle both word and image orders only at stage initialization
    const itemIds = newSet.map(item => item.id);
    const shuffledWords = shuffleArray([...itemIds]);
    const shuffledImages = shuffleArray([...itemIds]);
    
    setShuffledWordOrder(shuffledWords);
    setShuffledImageOrder(shuffledImages);

      // Fade back in
      if (gameContent) {
        gameContent.classList.remove('opacity-0');
      }
      
      // Re-enable drag and drop after transition
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 300);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const playVocabAudio = (word: string) => {
    const audio = new Audio(`/audio/words/${word.toLowerCase()}.webm`);
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
    });
  };

  const handleNextSet = () => {
    if (currentSetIndex === allSets.length - 1) {
      // If we're on the last set, navigate to the next lesson
      navigate(LessonSequence["1.2.2"]);
    } else {
      // Otherwise, continue to next set within current lesson
      setShowVictoryPopup(false);
      const nextIndex = currentSetIndex + 1;
      setCurrentSetIndex(nextIndex);
      initializeSet(allSets[nextIndex]);
    }
  };

  const handleHome = () => {
    navigate(LessonSequence.SKILLS);
  };

  const handleDrop = (imageId: number, wordId: number) => {
    if (wordId === imageId) {
      setMatches(prev => {
        const newMatches = new Set(prev);
        newMatches.add(wordId);
        
        // Find the word and play its audio
        const matchedItem = ALL_VOCAB_ITEMS.find(item => item.id === wordId);
        if (matchedItem) {
          playVocabAudio(matchedItem.word);
        }
        
        // Check if all items in current set are matched
        if (newMatches.size === currentSet.length) {
            if (currentSetIndex === allSets.length - 1) {
              setIsCompleted(true);
            setShowVictoryPopup(true);
              // Final completion confetti
              setTimeout(() => {
                confetti({
                  particleCount: 200,
                  spread: 90,
                  origin: { y: 0.6 }
                });
              }, 300);
            } else {
            // Move to next set after a delay
            setTimeout(() => {
              setCurrentSetIndex(prev => prev + 1);
            }, 1000);
            }
        }
        
        return newMatches;
      });
      setErrorStates(prev => ({ ...prev, [imageId]: false }));
    } else {
      setErrorStates(prev => ({ ...prev, [imageId]: true }));
      setTimeout(() => {
        setErrorStates(prev => ({ ...prev, [imageId]: false }));
      }, 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-8 min-h-screen bg-sky-100">
      {/* Progress indicator */}
      <div className="w-full max-w-4xl mx-auto flex justify-between items-center px-4">
        <div className="text-lg font-medium text-gray-600">
          Set {currentSetIndex + 1} of {allSets.length}
        </div>
        {!isCompleted && (
          <div className="flex gap-1">
            {allSets.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-3 h-3 rounded-full",
                  idx === currentSetIndex ? "bg-cyan-500" : 
                  idx < currentSetIndex ? "bg-green-500" : "bg-gray-200"
                )}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-full max-w-4xl mx-auto space-y-16 game-content transition-opacity duration-300">
        {/* Words at the top */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {shuffledWordOrder.map((itemId) => {
            const item = currentSet.find(i => i.id === itemId)!;
            return (
              <DraggableWord
                key={`word-${itemId}-${currentSetIndex}`}
                id={item.id}
                word={item.word}
                isMatched={matches.has(item.id)}
                isTransitioning={isTransitioning}
              />
            );
          })}
        </div>

        {/* Images at the bottom */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {shuffledImageOrder.map((itemId) => {
            const item = currentSet.find(i => i.id === itemId)!;
            return (
              <div key={`image-${itemId}-${currentSetIndex}`} className="flex justify-center">
                <ImageDropZone
                  id={item.id}
                  imageUrl={item.imageUrl}
                  isMatched={matches.has(item.id)}
                  showError={errorStates[item.id]}
                  onDrop={(wordId) => handleDrop(item.id, wordId)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {showVictoryPopup && (
        <VictoryPopup
          onNextSet={handleNextSet}
          onHome={handleHome}
        />
      )}
    </div>
  );
};

const Page: React.FC = () => {
  const { currentCourse } = useCourse();
  
  return (
    <DndProvider backend={HTML5Backend}>
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
              Vocabulary
            </h2>
          </LessonCard>
        </div>

        <LessonLayout
          className="max-w-6xl mx-auto"
          nextPath={LessonSequence["1.2.2"]}
          prevPath={LessonSequence["1.1"]}
        >
          <LessonInstructionsPopup
            lessonId="1.2.1"
            title="Word Matching Game"
            instructions={
              <div>
                <p>Welcome to the word matching game! Here's how to play:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Drag the words to their matching images</li>
                  <li>The border will turn green when you make a correct match</li>
                  <li>Complete each set to move to the next one</li>
                  <li>Try to match all words with their correct images</li>
                </ul>
                <p className="mt-4 text-gray-500 italic">Tip: Look carefully at each image before making your match!</p>
              </div>
            }
          />
          <VocabMatchingGame />
        </LessonLayout>
      </div>
    </DndProvider>
  );
};

export default Page;

