
import React from "react";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";

interface Props {
  onPrev: () => void;
  onNext: () => void;
  onSound: () => void;
}

const AudioControls: React.FC<Props> = ({ onPrev, onNext, onSound }) => {
  return (
    <div className="flex items-center gap-7">
      <button
        aria-label="Previous"
        className="text-savi-blue bg-white shadow rounded-full p-2 hover:bg-savi-blue/10 transition hover:scale-105 active:scale-95"
        onClick={onPrev}
      >
        <ArrowLeft size={28} />
      </button>
      <button
        aria-label="Play Sound"
        className="text-savi-green bg-white shadow-lg rounded-full p-2 border-2 border-savi-green hover:bg-savi-green/10 transition-scale scale-110 hover:scale-125 active:scale-95"
        onClick={onSound}
      >
        <Volume2 size={30} />
      </button>
      <button
        aria-label="Next"
        className="text-savi-blue bg-white shadow rounded-full p-2 hover:bg-savi-blue/10 transition hover:scale-105 active:scale-95"
        onClick={onNext}
      >
        <ArrowRight size={28} />
      </button>
    </div>
  );
};

export default AudioControls;
