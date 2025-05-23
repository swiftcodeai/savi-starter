
import React from "react";
import { Lock, Check, Book, Eye, Activity, Award, Headphones, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

export type SkillStatus = "locked" | "unlocked" | "completed";

interface SkillActivityCardProps {
  icon?: React.ReactNode; // Making icon optional
  title: string;
  desc: string;
  status: SkillStatus;
  onClick?: () => void;
  onHover?: () => void;
}

const SkillActivityCard: React.FC<SkillActivityCardProps> = ({
  icon,
  title,
  desc,
  status,
  onClick,
  onHover
}) => {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isUnlocked = status === "unlocked";
  return (
    <button
      className={cn(
        "group rounded-xl bg-white/80 border-2 flex flex-col items-center justify-between shadow-lg p-4 min-h-[160px] transition-all text-center relative outline-none",
        isUnlocked || isCompleted ? "cursor-pointer hover:scale-105 active:scale-95 ring-1 ring-savi-blue" : "pointer-events-none select-none",
        isLocked ? "opacity-70 grayscale blur-[1.1px]" : "",
        isCompleted ? "ring-2 ring-savi-green" : "",
        "animate-fade-in"
      )}
      disabled={isLocked}
      onClick={isUnlocked || isCompleted ? onClick : undefined}
      onMouseEnter={onHover}
      tabIndex={isUnlocked || isCompleted ? 0 : -1}
      aria-disabled={isLocked}
    >
      <div className="flex flex-col items-center justify-center gap-2 mt-2 mb-1">
        {icon && <span className="text-savi-blue">{icon}</span>}
        <span className="font-bold text-base sm:text-lg text-savi-blue">{title}</span>
        <span className="text-xs text-gray-500">{desc}</span>
      </div>
      {/* Badge or icon for status */}
      <div className="absolute top-3 right-3 flex items-center">
        {isLocked && <Lock className="w-5 h-5 text-gray-400" />}
        {isCompleted && <Check className="w-5 h-5 text-savi-green" />}
      </div>
    </button>
  );
};

export default SkillActivityCard;
