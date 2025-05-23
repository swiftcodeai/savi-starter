import React from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeCardProps {
  title: string;
  description: string;
  image: string;
  status: "active" | "locked";
  onClick?: () => void;
  onHover?: () => void;
  delay?: number;
}

const CourseThemeCard = ({
  title,
  description,
  image,
  status,
  onClick,
  onHover,
  delay = 0,
}: ThemeCardProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl shadow-xl bg-white/80 relative overflow-hidden flex flex-col justify-end border-4 border-savi-blue/40 transition-all duration-300 md:hover:scale-105 md:active:scale-95 cursor-pointer group",
        {
          "opacity-100 brightness-100 hover:shadow-2xl ring-2 ring-savi-blue": status === "active",
          "opacity-60 blur-[1.5px] grayscale pointer-events-none select-none": status === "locked"
        }
      )}
      onClick={status === "active" ? onClick : undefined}
      onMouseEnter={status === "active" && onHover ? onHover : undefined}
      style={{
        animation: `fade-in 0.55s cubic-bezier(.46,.03,.52,.96) backwards`,
        animationDelay: `${delay}ms`
      }}
      tabIndex={status === "active" ? 0 : -1}
      aria-disabled={status === "locked"}
    >
      <img
        src={image}
        alt={title}
        className={cn(
          "w-full h-48 sm:h-56 object-contain transition-all duration-300 group-hover:scale-105 p-2",
          { "opacity-80": status === "active", "opacity-60": status === "locked" }
        )}
        draggable={false}
      />
      <div className="p-4 pt-2 flex flex-col gap-2 backdrop-blur-sm">
        <h3 className={cn(
          "font-extrabold text-lg sm:text-xl text-savi-blue transition-colors duration-200",
          { "group-hover:text-blue-600": status === "active" }
        )}>{title}</h3>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
      {/* Padlock icon for locked */}
      {status === "locked" && (
        <div className="absolute top-4 right-4 bg-white/70 rounded-full p-2 z-10 flex items-center justify-center shadow-lg">
          <Lock className="h-7 w-7 text-gray-400" />
        </div>
      )}
      {/* Animated border glow for active */}
      {status === "active" && (
        <div className="absolute inset-0 pointer-events-none animate-pulse opacity-20 rounded-2xl border-4 border-savi-blue"></div>
      )}
    </div>
  );
};

export default CourseThemeCard;
