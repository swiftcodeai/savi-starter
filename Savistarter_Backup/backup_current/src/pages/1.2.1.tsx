import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import LessonLayout from '@/components/LessonLayout';
import { LessonSequence } from '@/App';
import LessonInstructionsPopup from '@/components/LessonInstructionsPopup';

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
}

const DraggableWord: React.FC<DraggableWordProps> = ({ id, word, isMatched }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'word',
    item: { id, word },
    canDrag: !isMatched,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <LessonCard>
      <div
        ref={drag}
        className={cn(
          "w-full px-8 py-6 rounded-2xl shadow-lg border-4 text-center font-bold text-2xl relative bg-white",
          "transition-all duration-300 transform",
          isMatched && "border-[#4CAF50] bg-[#E7FFF4] text-[#4CAF50]",
          !isMatched && "border-[#54D2FD] text-[#54D2FD] hover:border-[#54D2FD]/80 cursor-grab hover:scale-105",
          isDragging && "opacity-50 scale-105"
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
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'word',
    drop: (item: { id: number }) => onDrop(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <LessonCard>
      <div
        ref={drop}
        className={cn(
          "w-64 h-64 sm:w-72 sm:h-72 rounded-3xl border-4 p-4 flex items-center justify-center bg-white",
          "transition-all duration-300 transform",
          isMatched && "border-[#4CAF50] bg-[#E7FFF4]",
          showError && "border-red-500 bg-red-50 animate-shake",
          !isMatched && !showError && "border-[#54D2FD]",
          isOver && "scale-105 border-[#54D2FD] ring-4 ring-[#54D2FD]/30"
        )}
      >
        <img
          src={imageUrl}
          alt="Vocabulary"
          className="w-full h-full object-contain"
          draggable={false}
        />
        {isMatched && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#4CAF50] rounded-full flex items-center justify-center animate-pop-in">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
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

const VocabMatchingGame: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [sets] = useState(createSets);
  const [matches, setMatches] = useState<Record<number, number>>({});
  const [errorStates, setErrorStates] = useState<Record<number, boolean>>({});
  const [shuffledImageOrder, setShuffledImageOrder] = useState<number[]>([]);
  const [shuffledWordOrder, setShuffledWordOrder] = useState<number[]>([]);
  
  const currentSet = sets[currentSetIndex];
  const correctMatches = Object.entries(matches).filter(([wordId, imageId]) => 
    Number(wordId) === imageId
  ).length;

  // Shuffle the order of images and words when set changes
  useEffect(() => {
    setShuffledImageOrder(shuffleArray(currentSet.map(item => item.id)));
    setShuffledWordOrder(shuffleArray(currentSet.map(item => item.id)));
  }, [currentSetIndex, currentSet]);

  useEffect(() => {
    if (correctMatches === currentSet.length) {
      const timer = setTimeout(() => {
        if (currentSetIndex < sets.length - 1) {
          setCurrentSetIndex(prev => prev + 1);
          setMatches({});
          setErrorStates({});
        } else {
          toast({
            title: "Congratulations! 🎉",
            description: "You've completed all the vocabulary sets!",
          });
          setTimeout(() => navigate(LessonSequence["1.2.2"]), 2000);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [correctMatches, currentSetIndex]);

  const handleDrop = (imageId: number, wordId: number) => {
    const isCorrect = wordId === imageId;
    
    if (isCorrect) {
      setMatches(prev => ({ ...prev, [wordId]: imageId }));
      setErrorStates(prev => ({ ...prev, [imageId]: false }));
    } else {
      setErrorStates(prev => ({ ...prev, [imageId]: true }));
      setTimeout(() => {
        setErrorStates(prev => ({ ...prev, [imageId]: false }));
      }, 1000);
    }
  };

  const progress = (currentSetIndex / sets.length) * 100;

  return (
    <LessonLayout
      title="Match Words to Images"
      subtitle="Drag the words to match their images"
      className="max-w-6xl mx-auto"
    >
      <LessonInstructionsPopup
        lessonId="1.2.1"
        title="How to Play"
        instructions={
          <div>
            <p>Welcome to the Vocabulary Matching Game! Here's how to play:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Look at the words at the top of the screen</li>
              <li>Drag each word to its matching image below</li>
              <li>If you match correctly, you'll see a green checkmark ✓</li>
              <li>If you match incorrectly, the image will show a red X briefly</li>
              <li>Complete all matches to move to the next set</li>
              <li>There are 4 sets in total to complete</li>
            </ul>
            <p className="mt-4 text-gray-500 italic">Tip: Take your time and look carefully at each image before matching!</p>
          </div>
        }
      />
      
      <div className="flex flex-col items-center gap-12">
        {/* Progress bar */}
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-600 font-bold">Progress</div>
            <div className="text-savi-blue font-bold">{Math.round(progress)}%</div>
          </div>
          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <div
              className="h-full bg-gradient-to-r from-savi-blue to-cyan-400 transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>Set {currentSetIndex + 1} of {sets.length}</span>
            <span>{correctMatches} of {currentSet.length} matched</span>
          </div>
        </div>

        {/* Game area */}
        <div className="w-full space-y-16">
          {/* Words at the top */}
          <div className="grid grid-cols-3 gap-6">
            {shuffledWordOrder.map((itemId) => {
              const item = currentSet.find(i => i.id === itemId)!;
              return (
                <DraggableWord
                  key={item.id}
                  id={item.id}
                  word={item.word}
                  isMatched={!!matches[item.id]}
                />
              );
            })}
          </div>

          {/* Images at the bottom */}
          <div className="grid grid-cols-3 gap-6">
            {shuffledImageOrder.map((itemId) => {
              const item = currentSet.find(i => i.id === itemId)!;
              return (
                <ImageDropZone
                  key={item.id}
                  id={item.id}
                  imageUrl={item.imageUrl}
                  isMatched={Object.values(matches).includes(item.id)}
                  showError={errorStates[item.id]}
                  onDrop={(wordId) => handleDrop(item.id, wordId)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </LessonLayout>
  );
};

const Page: React.FC = () => (
  <DndProvider backend={HTML5Backend}>
    <VocabMatchingGame />
  </DndProvider>
);

export default Page;

