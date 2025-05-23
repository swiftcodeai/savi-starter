import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Check, RotateCcw, ArrowRight } from "lucide-react";
import FloatingElements from "@/components/FloatingElements";
import PlaceholderImage from "@/components/PlaceholderImage";
import LessonNav from "@/components/LessonNav";
import { LessonSequence } from "@/App";

const PLACEHOLDER_IMAGES = ["/placeholder.svg"];

const VOCAB_ITEMS = [
  { id: 1, word: "Hello", imageIndex: 0 },
  { id: 2, word: "Bye", imageIndex: 1 },
  { id: 3, word: "Friend", imageIndex: 2 },
  { id: 4, word: "Teacher", imageIndex: 3 },
  { id: 5, word: "Explorer", imageIndex: 4 },
  { id: 6, word: "Thank you", imageIndex: 5 },
];

const ItemTypes = {
  WORD: "word",
};

interface WordCardProps {
  id: number;
  word: string;
  isMatched: boolean;
  onDragStart: () => void;
}

const WordCard: React.FC<WordCardProps> = ({ id, word, isMatched, onDragStart }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.WORD,
    item: { id, word },
    canDrag: !isMatched,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (_item, monitor) => {
      if (!monitor.didDrop()) {
      }
    },
  }));

  return (
    <div
      ref={drag}
      className={cn(
        "px-4 py-2 bg-white rounded-lg shadow-md border-2 text-center font-bold text-lg cursor-grab active:cursor-grabbing transition-all",
        isDragging ? "opacity-30" : "opacity-100",
        isMatched ? "bg-green-100 border-savi-green text-gray-400 cursor-default" : "border-savi-blue hover:shadow-lg",
        isMatched ? "animate-bounce-once" : ""
      )}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isMatched ? "default" : "grab",
      }}
      onMouseDown={!isMatched ? onDragStart : undefined}
    >
      {word}
      {isMatched && <Check className="inline-block ml-2 text-savi-green" size={18} />}
    </div>
  );
};

interface ImageDropZoneProps {
  id: number;
  imageUrl: string;
  matchedWordId: number | null;
  correctWordId: number;
  onDrop: (wordId: number, imageId: number) => void;
}

const ImageDropZone: React.FC<ImageDropZoneProps> = ({ 
  id, 
  imageUrl, 
  matchedWordId, 
  correctWordId,
  onDrop 
}) => {
  const isCorrectMatch = matchedWordId === correctWordId;
  const hasMatch = matchedWordId !== null;
  
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.WORD,
    drop: (item: { id: number }) => {
      onDrop(item.id, id);
    },
    canDrop: () => !hasMatch,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const matchedWord = VOCAB_ITEMS.find(item => item.id === matchedWordId)?.word || "";
  
  return (
    <div 
      ref={drop} 
      className={cn(
        "relative rounded-xl overflow-hidden bg-white shadow-md border-2 flex flex-col items-center transition-all duration-300",
        isOver && canDrop ? "scale-105 ring-2 ring-blue-400 border-blue-300" : "",
        hasMatch ? (isCorrectMatch ? "border-savi-green" : "border-red-300") : "border-gray-200",
        hasMatch && isCorrectMatch ? "animate-pop" : "",
        hasMatch && !isCorrectMatch ? "animate-shake" : ""
      )}
      style={{ height: "180px", width: "180px" }}
    >
      <PlaceholderImage 
        src={imageUrl} 
        alt="Match target" 
        className="w-full h-full" 
      />
      
      {hasMatch && (
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 p-2 text-center font-medium truncate",
            isCorrectMatch ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          )}
        >
          {matchedWord}
        </div>
      )}
    </div>
  );
};

const U1L1WordToImage = () => {
  const navigate = useNavigate();
  const [wordMatches, setWordMatches] = useState<Record<number, number | null>>({});
  const [imageMatches, setImageMatches] = useState<Record<number, number | null>>({});
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [correctMatches, setCorrectMatches] = useState(0);
  
  useEffect(() => {
    const initialWordMatches = VOCAB_ITEMS.reduce((acc, item) => {
      acc[item.id] = null;
      return acc;
    }, {} as Record<number, number | null>);

    const initialImageMatches = VOCAB_ITEMS.reduce((acc, item, index) => {
      acc[index] = null;
      return acc;
    }, {} as Record<number, number | null>);

    setWordMatches(initialWordMatches);
    setImageMatches(initialImageMatches);
  }, []);

  useEffect(() => {
    const correctCount = Object.entries(wordMatches).reduce((count, [wordId, imageId]) => {
      const word = VOCAB_ITEMS.find(v => v.id === parseInt(wordId));
      return imageId === word?.imageIndex ? count + 1 : count;
    }, 0);
    
    setCorrectMatches(correctCount);
    
    if (correctCount === VOCAB_ITEMS.length) {
      setIsGameComplete(true);
    }
  }, [wordMatches]);

  const handleWordDragStart = () => {
  };

  const handleDrop = (wordId: number, imageId: number) => {
    const word = VOCAB_ITEMS.find(v => v.id === wordId);
    const isCorrectMatch = word?.imageIndex === imageId;
    
    setWordMatches(prev => ({ ...prev, [wordId]: imageId }));
    setImageMatches(prev => ({ ...prev, [imageId]: wordId }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative min-h-screen w-full bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col items-center overflow-x-hidden pb-6">
        <FloatingElements />
        
        <div className="absolute top-0 left-0 w-full h-20 bg-savi-yellow opacity-10 rounded-b-full z-0"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-savi-pink opacity-10 rounded-t-full z-0"></div>
        
        <LessonNav 
          nextPath={LessonSequence.SKILLS} 
          prevPath={LessonSequence["1.1"]}
        />
        
        <div className="w-full max-w-4xl z-10 mt-8 px-3 flex flex-col items-center">
          <PageHeader title="Match Words to Images" subtitle="U1-L1: Greeting Explorers - Identify" />
          
          <div className="w-full max-w-md mb-6">
            <div className="w-full bg-white rounded-full h-4 shadow-inner mb-1">
              <div 
                className="h-full bg-savi-blue rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(correctMatches / VOCAB_ITEMS.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 text-right">
              Progress: {correctMatches} of {VOCAB_ITEMS.length} matches
            </div>
          </div>
          
          <p className="text-gray-600 mb-8 text-center max-w-xl">
            Drag each word and drop it onto the matching image. Listen for sounds to know if you got it right!
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
            {VOCAB_ITEMS.map((item, index) => (
              <ImageDropZone
                key={index}
                id={index}
                imageUrl={PLACEHOLDER_IMAGES[index]}
                matchedWordId={imageMatches[index]}
                correctWordId={item.id}
                onDrop={handleDrop}
              />
            ))}
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8 px-4">
            {VOCAB_ITEMS.map((item) => (
              <WordCard
                key={item.id}
                id={item.id}
                word={item.word}
                isMatched={wordMatches[item.id] !== null && wordMatches[item.id] === item.imageIndex}
                onDragStart={handleWordDragStart}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default U1L1WordToImage;
