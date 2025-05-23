import React from "react";
import { cn } from "@/lib/utils";

// Custom card component for the lesson
const HeaderCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
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

interface LessonHeaderProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

const LessonHeader: React.FC<LessonHeaderProps> = ({ left, right }) => {
  return (
    <div className="flex justify-between items-center mb-4 px-4 py-2">
      <HeaderCard className="py-1.5 px-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-cyan-500">
          {left}
        </h2>
      </HeaderCard>
      
      <HeaderCard className="py-1.5 px-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-cyan-500">
          {right}
        </h2>
      </HeaderCard>
    </div>
  );
};

export default LessonHeader; 