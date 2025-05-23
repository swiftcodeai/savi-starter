import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import LessonNav from "@/components/LessonNav";
import { LessonSequence } from "@/App";
import { FaPlay, FaPause, FaRedo, FaVolumeUp, FaVolumeDown, FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface LessonCardProps {
  children: React.ReactNode;
  className?: string;
}

// Custom card component for the lesson
const LessonCard: React.FC<LessonCardProps> = ({ children, className }) => (
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

const verses = [
  {
    id: 1,
    lines: [
      "One bright morning, Felix walked in,",
      "He saw Ola with a happy grin.",
      "Hi! said Felix, Hello! said Ola,",
      "Smiles and greetings for everyone!"
    ]
  },
  {
    id: 2,
    lines: [
      '"Hello, hello, good morning, class,',
      "Let's smile and play as the hours pass.",
      "Count with me—zero, one, two, three,",
      'Four, five, six—clap along with glee!"'
    ]
  },
  {
    id: 3,
    lines: [
      '"Ms. Fine walked in with a cheerful smile,',
      "Good morning, class! she said in style.",
      "Let's count together, come and play,",
      'Learning English is fun today!"'
    ]
  },
  {
    id: 4,
    lines: [
      '"Wave to your friends, say hi to our teacher,',
      "We're all together, every little creature.",
      "Clap your hands and count with cheer,",
      'Learning is fun when we\'re all here!"'
    ]
  },
  {
    id: 5,
    lines: [
      '"Hello, hello, good morning, class,',
      "Let's smile and play as the hours pass.",
      "Count with me—zero, one, two, three,",
      'Four, five, six—clap along with glee!"'
    ]
  },
  {
    id: 6,
    lines: [
      '"We are ready to learn and sing,',
      "Sharing our joy in everything.",
      "Hello, hi, greetings in every way—",
      'A happy, fun, learning day!"'
    ]
  }
];

function SingingPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeVerse, setActiveVerse] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current && !audioError) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          setAudioError(true);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setAudioError(false);
    }
  };

  const handleRestart = () => {
    if (audioRef.current && !audioError) {
      audioRef.current.currentTime = 0;
      setActiveVerse(0);
      if (!isPlaying) {
        audioRef.current.play().catch(() => {
          setAudioError(true);
        });
        setIsPlaying(true);
      }
    }
  };

  const handleError = () => {
    setAudioError(true);
    setIsPlaying(false);
  };

  const handleVolumeChange = (delta: number) => {
    if (audioRef.current) {
      const newVolume = Math.max(0, Math.min(1, volume + delta));
      setVolume(newVolume);
      audioRef.current.volume = newVolume;
    }
  };

  const handlePrevVerse = () => {
    setActiveVerse(prev => Math.max(0, prev - 1));
  };

  const handleNextVerse = () => {
    setActiveVerse(prev => Math.min(verses.length - 1, prev + 1));
  };

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      {/* Top navigation bar */}
      <div className="flex justify-between items-center mb-4 px-4 py-2">
        <LessonCard className="py-2 px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-cyan-500">
            Let's Sing Together!
          </h2>
        </LessonCard>
        
        <LessonCard className="py-2 px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-cyan-500">
            🎵 Verse {activeVerse + 1} of {verses.length} 🎵
          </h2>
        </LessonCard>
      </div>

      {/* Audio controls */}
      <div className="flex justify-center mb-6">
        <LessonCard className="py-4 px-6 flex gap-4 items-center">
          {audioError ? (
            <div className="text-amber-600 font-medium">
              Audio file not available. Please read along with the verses!
            </div>
          ) : (
            <>
              <button
                onClick={togglePlay}
                className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-4 transition-all
                  hover:scale-105 active:scale-95"
              >
                {isPlaying ? (
                  <FaPause className="w-8 h-8" />
                ) : (
                  <FaPlay className="w-8 h-8" />
                )}
              </button>
              <button
                onClick={handleRestart}
                className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-4 transition-all
                  hover:scale-105 active:scale-95"
              >
                <FaRedo className="w-8 h-8" />
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVolumeChange(-0.1)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-3 transition-all
                    hover:scale-105 active:scale-95"
                >
                  <FaVolumeDown className="w-6 h-6" />
                </button>
                <button
                  onClick={() => handleVolumeChange(0.1)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-3 transition-all
                    hover:scale-105 active:scale-95"
                >
                  <FaVolumeUp className="w-6 h-6" />
                </button>
              </div>
              <div className="text-lg font-semibold text-cyan-700">
                Volume: {Math.round(volume * 100)}%
              </div>
            </>
          )}
        </LessonCard>
      </div>

      {/* Verse navigation */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={handlePrevVerse}
          disabled={activeVerse === 0}
          className={cn(
            "bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-4 transition-all",
            "hover:scale-105 active:scale-95",
            activeVerse === 0 && "opacity-50 cursor-not-allowed"
          )}
        >
          <FaArrowLeft className="w-8 h-8" />
        </button>
        <button
          onClick={handleNextVerse}
          disabled={activeVerse === verses.length - 1}
          className={cn(
            "bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-4 transition-all",
            "hover:scale-105 active:scale-95",
            activeVerse === verses.length - 1 && "opacity-50 cursor-not-allowed"
          )}
        >
          <FaArrowRight className="w-8 h-8" />
        </button>
      </div>

      {/* Current verse */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <LessonCard 
            className={cn(
              "transition-all duration-300",
              "ring-4 ring-cyan-400 scale-105 bg-opacity-100"
            )}
          >
            <div className="p-6 space-y-4">
              {verses[activeVerse].lines.map((line, lineIndex) => (
                <p 
                  key={lineIndex}
                  className="text-2xl font-medium text-cyan-800 text-center"
                >
                  {line}
                </p>
              ))}
            </div>
          </LessonCard>
        </div>
      </div>

      <audio
        ref={audioRef}
        src="/audio/Music.webm"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onError={handleError}
      />

      {/* Navigation bar */}
      <LessonNav
        prevPath={LessonSequence["4.3"]}
        nextPath={LessonSequence["6.0"]}
        onRestart={handleRestart}
        isPenActive={false}
      />
    </div>
  );
}

export default SingingPage;
