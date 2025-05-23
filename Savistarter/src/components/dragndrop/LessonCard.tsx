
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface LessonCardProps {
  children: React.ReactNode;
  className?: string;
}

const LessonCard = forwardRef<HTMLDivElement, LessonCardProps>(
  ({ children, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-[#fae6b0] rounded-xl border-4 border-[#f9da8d] shadow-lg p-3 relative",
        className
      )}
    >
      <div className="absolute -top-1 -left-1 w-4 h-4 bg-white rounded-full opacity-80"></div>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full opacity-80"></div>
      <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-white rounded-full opacity-80"></div>
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full opacity-80"></div>
      {children}
    </div>
  )
);

LessonCard.displayName = "LessonCard";

export default LessonCard;
