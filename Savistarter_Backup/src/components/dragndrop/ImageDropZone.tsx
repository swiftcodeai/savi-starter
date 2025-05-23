import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { cn } from "@/lib/utils";

const ItemTypes = { WORD: "word" };

interface ImageDropZoneProps {
  id: number;
  imageUrl: string;
  matchedWordId: number | null;
  correctWordId: number;
  onDrop: (wordId: number, imageId: number) => void;
  matchedWord?: string;
}

const ImageDropZone = ({
  id,
  imageUrl,
  matchedWordId,
  correctWordId,
  onDrop,
  matchedWord = "",
}: ImageDropZoneProps) => {
  const isCorrectMatch = matchedWordId === correctWordId;
  const hasMatch = matchedWordId !== null;
  const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);

  useEffect(() => {
    if (hasMatch && !isCorrectMatch) {
      setShowIncorrectFeedback(true);
      // Remove red effect after shake animation
      const timer = setTimeout(() => {
        setShowIncorrectFeedback(false);
      }, 820); // Duration matches shake animation
      return () => clearTimeout(timer);
    } else {
      setShowIncorrectFeedback(false);
    }
  }, [hasMatch, isCorrectMatch, matchedWordId]);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.WORD,
    drop: (item: { id: number }) => {
      onDrop(item.id, id);
      return undefined;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={cn(
        "relative rounded-3xl overflow-hidden bg-white shadow-xl border-4 flex flex-col items-center",
        "transition-all duration-300 transform mt-5 ml-11",
        isOver && canDrop
          ? "scale-105 ring-4 ring-[#54D2FD] border-[#54D2FD] rotate-1"
          : canDrop
          ? "hover:border-[#54D2FD]/50 hover:ring-2 hover:ring-[#54D2FD]/30"
          : "",
        hasMatch
          ? isCorrectMatch
            ? "border-[#4CAF50] ring-2 ring-[#4CAF50]/30"
            : showIncorrectFeedback
              ? "border-red-500 ring-4 ring-red-400/50"
              : "border-transparent"
          : "border-transparent hover:border-[#54D2FD]/50",
        hasMatch && isCorrectMatch
          ? "animate-pop"
          : showIncorrectFeedback
          ? "animate-shake"
          : "",
        "w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center"
      )}
    >
      <div 
        className={cn(
          "w-full h-full p-4 flex items-center justify-center",
          isOver && canDrop ? "bg-[#F0FBFF]" : "bg-white",
          "transition-colors duration-300"
        )}
      >
        <img
          src={imageUrl}
          alt="Match target"
          className={cn(
            "w-full h-full object-contain rounded-2xl transition-transform duration-300",
            isOver && canDrop ? "scale-90" : "scale-100"
          )}
          draggable={false}
        />
      </div>
      {hasMatch && isCorrectMatch && (
        <div className="absolute -top-3 right-2 w-6 h-6 bg-[#4CAF50] rounded-full flex items-center justify-center animate-pop-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      )}
      {!hasMatch && (
        <div className={cn(
          "absolute inset-0 border-4 border-dashed rounded-3xl border-transparent",
          isOver && canDrop ? "border-[#54D2FD]/30 animate-pulse" : "",
          "pointer-events-none"
        )} />
      )}
    </div>
  );
};

export default ImageDropZone;
