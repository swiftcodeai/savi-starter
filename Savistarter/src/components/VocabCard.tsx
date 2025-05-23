
import React from "react";
import { Volume2, Check, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/constants/images";

interface VocabCardProps {
  idx: number;
  word: string;
  image: string;
  revealed: boolean;
  onReveal: () => void;
}

const VocabCard: React.FC<VocabCardProps> = ({
  word,
  image,
  revealed,
  onReveal,
}) => {
  function handleClick() {
    if (!revealed) {
      onReveal();
    }
  }

  return (
    <div
      className={cn(
        "relative bg-white rounded-xl p-3 flex flex-col items-center justify-center min-h-[160px] shadow-md select-none cursor-pointer transition-all",
        revealed
          ? "scale-105 ring-2 ring-savi-blue animate-bounce border border-savi-blue"
          : "opacity-80 hover:scale-105 hover:bg-savi-blue/10 border border-gray-200",
        "group"
      )}
      tabIndex={0}
      aria-pressed={revealed}
      onClick={handleClick}
      onKeyDown={e => (e.key === "Enter" ? handleClick() : undefined)}
      style={{ outline: "none" }}
    >
      {/* Hidden image or placeholder */}
      {!revealed ? (
        <div
          className="flex flex-col items-center justify-center h-24 w-24 rounded-lg bg-savi-yellow/30 text-savi-blue"
        >
          <ImageIcon className="w-12 h-12 mb-1" />
          <span className="text-xs text-gray-400">Tap to reveal</span>
        </div>
      ) : (
        <img
          src={image}
          alt={word}
          className="h-24 w-24 object-contain rounded-lg drop-shadow-lg animate-pop"
          draggable={false}
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
          }}
        />
      )}
      {/* The word */}
      <div
        className={cn(
          "mt-2 font-semibold text-base text-gray-700 text-center min-h-[1.5em] transition-all",
          revealed ? "opacity-100 animate-fade-in" : "opacity-50"
        )}
      >
        {revealed ? word : " "}
      </div>
      {/* Completion check */}
      {revealed && (
        <div className="absolute bottom-3 left-2 text-savi-green">
          <Check className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export default VocabCard;
