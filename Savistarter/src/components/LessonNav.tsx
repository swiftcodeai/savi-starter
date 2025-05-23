import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, ArrowRight, PenTool, RotateCcw, Layout, Volume2, VolumeX } from "lucide-react";
import { LessonSequence } from "@/App";
import { cn } from "@/lib/utils";

export interface LessonNavProps {
  prevPath?: string;
  nextPath?: string;
  onRestart?: () => void;
  isPenActive?: boolean;
  onPenToggle?: () => void;
  onLayoutRestart?: () => void;
  isAudioDisabled?: boolean;
  onAudioToggle?: () => void;
}

// Custom button component for nav buttons
const NavButton = ({ children, onClick, className = "", label = "" }: { 
  children: React.ReactNode; 
  onClick: () => void;
  className?: string;
  label?: string;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300",
      "hover:scale-105 active:scale-95",
      "bg-gradient-to-b text-white shadow-lg hover:shadow-xl border-2",
      className || "from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 border-cyan-300"
    )}
  >
    {children}
    {label && <span className="text-xs font-medium">{label}</span>}
  </button>
);

const LessonNav: React.FC<LessonNavProps> = ({
  prevPath,
  nextPath,
  onRestart,
  isPenActive = false,
  onPenToggle,
  onLayoutRestart = () => {},
  isAudioDisabled = false,
  onAudioToggle = () => {},
}) => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
      <div className="container mx-auto px-4 py-3 flex justify-center items-center gap-6">
        <NavButton 
          onClick={() => navigate(LessonSequence.SKILLS)} 
          label="Home"
        >
          <Home className="w-6 h-6" />
        </NavButton>

        {prevPath && (
          <NavButton 
            onClick={() => navigate(prevPath)}
            label="Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </NavButton>
        )}

        <NavButton 
          onClick={onLayoutRestart}
          label="Reset Layout"
        >
          <Layout className="w-6 h-6" />
        </NavButton>

        <NavButton 
          onClick={onAudioToggle}
          className={isAudioDisabled ? 
            "from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 border-red-300" : 
            "from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 border-cyan-300"}
          label={isAudioDisabled ? "Enable Audio" : "Disable Audio"}
        >
          {isAudioDisabled ? (
            <VolumeX className="w-6 h-6" />
          ) : (
            <Volume2 className="w-6 h-6" />
          )}
        </NavButton>

        {onPenToggle && (
          <NavButton 
            onClick={onPenToggle}
            className={isPenActive ? 
              "from-cyan-600 to-cyan-700 border-cyan-500" : 
              undefined}
            label="Pen"
          >
            <PenTool className="w-6 h-6" />
          </NavButton>
        )}

        {onRestart && (
          <NavButton 
            onClick={onRestart}
            label="Restart"
          >
            <RotateCcw className="w-6 h-6" />
          </NavButton>
        )}

        {nextPath && (
          <NavButton 
            onClick={() => navigate(nextPath)}
            label="Next"
          >
            <ArrowRight className="w-6 h-6" />
          </NavButton>
        )}
      </div>
    </div>
  );
};

export default LessonNav;
