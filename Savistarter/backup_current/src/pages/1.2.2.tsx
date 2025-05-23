import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { cn } from "@/lib/utils";
import AudioControls from "@/components/AudioControls";
import LessonNav from "@/components/LessonNav";
import { LessonSequence } from "@/App";
import LessonLayout from "@/components/LessonLayout";
import { useToast } from "@/hooks/use-toast";
import correctSound from '@/assets/sounds/correct.mp3';
import incorrectSound from '@/assets/sounds/incorrect.mp3';
import dragSound from '@/assets/sounds/drag.mp3';
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

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&q=80";

const PLACEHOLDER_IMAGES = Array(6).fill(PLACEHOLDER_IMAGE);

// All vocabulary items
const ALL_VOCAB_ITEMS = [
  { id: 1, word: "Zero", imageUrl: "/vocab-images/zero.png", imageIndex: 0 },
  { id: 2, word: "One", imageUrl: "/vocab-images/one.png", imageIndex: 1 },
  { id: 3, word: "Two", imageUrl: "/vocab-images/two.png", imageIndex: 2 },
  { id: 4, word: "Three", imageUrl: "/vocab-images/three.png", imageIndex: 3 },
  { id: 5, word: "Four", imageUrl: "/vocab-images/four.png", imageIndex: 4 },
  { id: 6, word: "Five", imageUrl: "/vocab-images/five.png", imageIndex: 5 },
  { id: 7, word: "Six", imageUrl: "/vocab-images/six.png", imageIndex: 6 },
  { id: 8, word: "Hi", imageUrl: "/vocab-images/hi.png", imageIndex: 7 },
  { id: 9, word: "Hello", imageUrl: "/vocab-images/hello.png", imageIndex: 8 },
  { id: 10, word: "Felix", imageUrl: "/vocab-images/felix.png", imageIndex: 9 },
  { id: 11, word: "Ola", imageUrl: "/vocab-images/ola.png", imageIndex: 10 },
  { id: 12, word: "Ms Fine", imageUrl: "/vocab-images/ms fine.png", imageIndex: 11 },
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

// Create 4 sets of 3 items each
const createShuffledSets = () => {
  const shuffledItems = shuffleArray(ALL_VOCAB_ITEMS);
  return [
    shuffledItems.slice(0, 3),
    shuffledItems.slice(3, 6),
    shuffledItems.slice(6, 9),
    shuffledItems.slice(9, 12),
  ];
};

const SOUND_EFFECTS = {
  correct: "/audio/effects/correct.mp3",
  incorrect: "/audio/effects/incorrect.mp3",
  drag: "/audio/effects/drag.mp3",
};

const ItemTypes = {
  IMAGE: "image",
};

interface ImageCardProps {
  id: number;
  imageUrl: string;
  isMatched: boolean;
  onDragStart: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ id, imageUrl, isMatched, onDragStart }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.IMAGE,
    item: { id },
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
          "w-64 h-64 sm:w-72 sm:h-72 rounded-3xl border-4 p-4 flex items-center justify-center bg-white",
          "transition-all duration-300 transform",
          isMatched && "border-[#4CAF50] bg-[#E7FFF4]",
          !isMatched && "border-[#54D2FD] hover:border-[#54D2FD]/80 cursor-grab hover:scale-105",
          isDragging && "opacity-50 scale-105"
        )}
        onMouseDown={!isMatched ? onDragStart : undefined}
      >
        <img
          src={imageUrl}
          alt="Draggable vocabulary"
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
      </div>
    </LessonCard>
  );
};

interface WordDropZoneProps {
  id: number;
  word: string;
  matchedImageId: number | null;
  correctImageId: number;
  onDrop: (imageId: number, wordId: number) => void;
}

const WordDropZone: React.FC<WordDropZoneProps> = ({
  id,
  word,
  matchedImageId,
  correctImageId,
  onDrop,
}) => {
  const isCorrectMatch = matchedImageId === correctImageId;
  const hasMatch = matchedImageId !== null;
  const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);

  useEffect(() => {
    if (hasMatch && !isCorrectMatch) {
      setShowIncorrectFeedback(true);
      const timer = setTimeout(() => {
        setShowIncorrectFeedback(false);
      }, 820);
      return () => clearTimeout(timer);
    } else {
      setShowIncorrectFeedback(false);
    }
  }, [hasMatch, isCorrectMatch, matchedImageId]);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.IMAGE,
    drop: (item: { id: number }) => {
      onDrop(item.id, id);
      return undefined;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  return (
    <LessonCard>
      <div
        ref={drop}
        className={cn(
          "w-full px-8 py-6 rounded-2xl shadow-lg border-4 text-center font-bold text-2xl relative bg-white",
          "transition-all duration-300 transform",
          isCorrectMatch && "border-[#4CAF50] bg-[#E7FFF4] text-[#4CAF50]",
          showIncorrectFeedback && "border-red-500 bg-red-50 animate-shake",
          !isCorrectMatch && !showIncorrectFeedback && "border-[#54D2FD] text-[#54D2FD] hover:border-[#54D2FD]/80",
          isOver && canDrop && "scale-105 border-[#54D2FD] ring-4 ring-[#54D2FD]/30"
        )}
      >
        {word}
        {isCorrectMatch && (
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

const VocabMatchingGame: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Audio refs
  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const incorrectAudioRef = useRef<HTMLAudioElement | null>(null);
  const dragAudioRef = useRef<HTMLAudioElement | null>(null);

  // Game state
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [vocabSets] = useState(createShuffledSets());
  const [matches, setMatches] = useState<Record<number, number>>({});
  const [hasInteracted, setHasInteracted] = useState(false);
  const currentSet = vocabSets[currentSetIndex];
  
  // Calculate correct matches for progress
  const correctMatches = currentSet.reduce((count, item) => {
    return matches[item.id] === item.imageIndex ? count + 1 : count;
  }, 0);
  const progress = (currentSetIndex / vocabSets.length) * 100;

  // Check if all items in current set are matched correctly
  const allMatchedInSet = currentSet.every(item => 
    matches[item.id] === item.imageIndex
  );

  // Effect to handle set completion
  useEffect(() => {
    if (allMatchedInSet && hasInteracted) {
      // Wait for animations to complete
      setTimeout(() => {
        if (currentSetIndex < vocabSets.length - 1) {
          setCurrentSetIndex(prev => prev + 1);
          setMatches({});
          setHasInteracted(false);
        } else {
          // Game completed
          toast({
            title: "Congratulations! 🎉",
            description: "You've completed all the vocabulary sets!",
            duration: 3000,
          });
          setTimeout(() => navigate(LessonSequence[1].next), 3000);
        }
      }, 1500);
    }
  }, [allMatchedInSet, currentSetIndex, hasInteracted]);

  // Initialize audio elements
  useEffect(() => {
    correctAudioRef.current = new Audio(SOUND_EFFECTS.correct);
    incorrectAudioRef.current = new Audio(SOUND_EFFECTS.drag);
    dragAudioRef.current = new Audio(SOUND_EFFECTS.drag);

    return () => {
      if (correctAudioRef.current) correctAudioRef.current = null;
      if (incorrectAudioRef.current) incorrectAudioRef.current = null;
      if (dragAudioRef.current) dragAudioRef.current = null;
    };
  }, []);

  const handleImageDragStart = () => {
    setHasInteracted(true);
    dragAudioRef.current?.play();
  };

  const handleDrop = (imageId: number, wordId: number) => {
    setHasInteracted(true);
    const matchedWord = currentSet.find(item => item.id === wordId);
    const isCorrectMatch = matchedWord?.imageIndex === imageId;

    // Update matches
    setMatches(prev => ({ ...prev, [wordId]: imageId }));
    
    if (isCorrectMatch) {
      correctAudioRef.current?.play();
    } else {
      incorrectAudioRef.current?.play();
      // Clear the incorrect match after shake animation completes
      setTimeout(() => {
        setMatches(prev => ({ ...prev, [wordId]: null }));
      }, 820); // Duration matches shake animation
    }
  };

  return (
    <LessonLayout
      title="Match the Words"
      subtitle="Drag the images to match their words"
      className="max-w-6xl mx-auto"
    >
      <LessonInstructionsPopup
        lessonId="1.2.2"
        title="How to Play"
        instructions={
          <div>
            <p>Welcome to the next level of Vocabulary Matching! Here's how to play:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>This time, you'll drag the images at the top</li>
              <li>Match each image with its correct word below</li>
              <li>A green checkmark ✓ appears for correct matches</li>
              <li>Incorrect matches will show briefly in red</li>
              <li>Complete all matches to move to the next set</li>
              <li>Listen for sound effects that indicate correct and incorrect matches</li>
            </ul>
            <p className="mt-4 text-gray-500 italic">Tip: The game gets progressively more challenging - stay focused!</p>
          </div>
        }
      />
      
      <div className="flex flex-col items-center gap-12">
        {/* Progress bar */}
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-600 font-bold">
              Progress
            </div>
            <div className="text-savi-blue font-bold">
              {Math.round(progress)}%
            </div>
          </div>
          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <div
              className="h-full bg-gradient-to-r from-savi-blue to-cyan-400 transition-all duration-500 rounded-full shadow-inner flex items-center justify-center"
              style={{
                width: `${progress}%`,
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div className="w-2 h-2 rounded-full bg-white shadow-sm animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>Set {currentSetIndex + 1} of 4</span>
            <span>{correctMatches} of {currentSet.length} matched</span>
          </div>
        </div>

        {/* Game area */}
        <div className="w-full space-y-16">
          {/* Image cards at the top */}
          <div className="grid grid-cols-3 gap-6 w-full">
            {currentSet.map((item) => (
              <ImageCard
                key={item.id}
                id={item.imageIndex}
                imageUrl={item.imageUrl}
                isMatched={matches[item.id] === item.imageIndex}
                onDragStart={handleImageDragStart}
              />
            ))}
          </div>

          {/* Word drop zones at the bottom */}
          <div className="grid grid-cols-3 gap-6 w-full">
            {currentSet.map((item) => (
              <WordDropZone
                key={item.id}
                id={item.id}
                word={item.word}
                matchedImageId={matches[item.id]}
                correctImageId={item.imageIndex}
                onDrop={handleDrop}
              />
            ))}
          </div>
        </div>
      </div>
    </LessonLayout>
  );
};

const Page: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <VocabMatchingGame />
    </DndProvider>
  );
};

export default Page;
