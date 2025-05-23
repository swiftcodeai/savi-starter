import React from "react";
import { cn } from "@/lib/utils";

interface LessonLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  prevPath?: string;
  nextPath?: string;
  onRestart?: () => void;
  isPenActive?: boolean;
  onPenToggle?: () => void;
  onSound?: () => void;
}

// Custom card component for the lesson
export const LessonCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
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

const LessonLayout: React.FC<LessonLayoutProps> = ({
  children,
  title,
  subtitle,
  className,
  onSound,
}) => {
  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      {/* Top navigation bar */}
      {(title || subtitle) && (
        <div className="flex justify-between items-center mb-4 px-4 py-2">
          {title && (
        <LessonCard className="py-2 px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-cyan-500">
            {title}
          </h2>
        </LessonCard>
          )}
          
          {subtitle && (
        <LessonCard className="py-2 px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-cyan-500">
            {subtitle}
          </h2>
        </LessonCard>
          )}
      </div>
      )}

      {/* Main content */}
      <div className={cn("flex-1", className)}>
        {children}
      </div>
    </div>
  );
};

export default LessonLayout;
