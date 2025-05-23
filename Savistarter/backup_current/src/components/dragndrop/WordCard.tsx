import React from "react";
import { useDrag } from "react-dnd";
import { cn } from "@/lib/utils";

interface WordCardProps {
  id: number;
  word: string;
  isMatched: boolean;
  onDragStart: () => void;
}

const ItemTypes = { WORD: "word" };

const WordCard = ({ id, word, isMatched, onDragStart }: WordCardProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.WORD,
    item: { id, word },
    canDrag: !isMatched,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div className="relative group">
      <button
        ref={drag}
        type="button"
        tabIndex={0}
        className={cn(
          "w-full px-8 py-6 bg-white rounded-2xl shadow-lg border-4 text-center font-bold text-2xl",
          "transition-all duration-300 ease-in-out transform",
          isMatched
            ? "bg-[#E7FFF4] border-[#4CAF50] text-gray-600 scale-95"
            : "border-[#54D2FD] hover:border-[#54D2FD]/80 cursor-grab active:cursor-grabbing",
          isMatched ? "animate-bounce-once" : "hover:-translate-y-1 hover:shadow-xl",
          isDragging ? "opacity-30 scale-105 rotate-2" : "opacity-100",
          "relative overflow-visible"
        )}
        style={{
          cursor: isMatched ? "default" : "grab",
        }}
        onMouseDown={!isMatched ? onDragStart : undefined}
        disabled={isMatched}
      >
        <div className={cn(
          "text-[#54D2FD] transition-all",
          isMatched ? "text-[#4CAF50]" : "group-hover:scale-105"
        )}>
          {word}
        </div>
        {isMatched && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#4CAF50] rounded-full flex items-center justify-center animate-pop-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        )}
      </button>
    </div>
  );
};

export default WordCard;
