import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import LessonNav from "@/components/LessonNav";
import { LessonSequence } from "@/App";
import { FaPlay, FaPause, FaRedo, FaVolumeUp, FaVolumeDown, FaArrowLeft, FaArrowRight, FaMusic } from "react-icons/fa";
import { GiMusicalNotes, GiMusicalScore } from "react-icons/gi";
import LessonLayout, { LessonCard } from "@/components/LessonLayout";
import { useCourse } from "@/contexts/CourseContext";

const verses = [
  {
    id: 1,
    title: "Morning Greetings",
    lines: [
      "One bright morning, Felix walked in,",
      "He saw Ola with a happy grin.",
      "Hi! said Felix, Hello! said Ola,",
      "Smiles and greetings for everyone!"
    ]
  },
  {
    id: 2,
    title: "Counting Fun",
    lines: [
      '"Hello, hello, good morning, class,',
      "Let's smile and play as the hours pass.",
      "Count with me—zero, one, two, three,",
      'Four, five, six—clap along with glee!"'
    ]
  },
  {
    id: 3,
    title: "Ms. Fine's Welcome",
    lines: [
      '"Ms. Fine walked in with a cheerful smile,',
      "Good morning, class! she said in style.",
      "Let's count together, come and play,",
      'Learning English is fun today!"'
    ]
  },
  {
    id: 4,
    title: "Friends Together",
    lines: [
      '"Wave to your friends, say hi to our teacher,',
      "We're all together, every little creature.",
      "Clap your hands and count with cheer,",
      'Learning is fun when we\'re all here!"'
    ]
  },
  {
    id: 5,
    title: "Morning Song",
    lines: [
      '"Hello, hello, good morning, class,',
      "Let's smile and play as the hours pass.",
      "Count with me—zero, one, two, three,",
      'Four, five, six—clap along with glee!"'
    ]
  },
  {
    id: 6,
    title: "Happy Learning",
    lines: [
      '"We are ready to learn and sing,',
      "Sharing our joy in everything.",
      "Hello, hi, greetings in every way—",
      'A happy, fun, learning day!"'
    ]
  }
];

function SingingPage() {
  const { currentCourse } = useCourse();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeVerse, setActiveVerse] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isPenActive, setIsPenActive] = useState(false);
  const [isAudioDisabled, setIsAudioDisabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current && !audioError && !isAudioDisabled) {
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

  const handleLayoutRestart = () => {
    setActiveVerse(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setVolume(1);
  };

  const handleAudioToggle = () => {
    setIsAudioDisabled(!isAudioDisabled);
    if (audioRef.current) {
      if (!isAudioDisabled) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      {/* Top navigation bar */}
      <div className="flex justify-between items-center mb-8 px-4 py-2">
        <LessonCard className="py-2 px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-cyan-500">
            {currentCourse?.title || "Greetings & Communication"}
          </h2>
        </LessonCard>
        
        <LessonCard className="py-2 px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-cyan-500">
            Sing it
          </h2>
        </LessonCard>
      </div>

      <div className="flex flex-col items-center gap-8 w-full px-4 pb-20">
        {/* Song title and decorative elements */}
        <div className="relative w-full text-center mb-4">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <GiMusicalNotes className="w-12 h-12 text-cyan-500 animate-bounce" />
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <GiMusicalScore className="w-12 h-12 text-cyan-500 animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>
          <h1 className="text-4xl font-bold text-cyan-600 mb-2">
            The Hello Song
          </h1>
          <p className="text-lg text-cyan-500">Sing along and have fun!</p>
        </div>

        {/* Audio controls in a fun design */}
        <LessonCard className="w-full max-w-2xl py-6 px-8">
          <div className="flex flex-col items-center gap-6">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleVolumeChange(-0.1)}
                className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-3 transition-all
                  hover:scale-105 active:scale-95"
              >
                <FaVolumeDown className="w-6 h-6" />
              </button>
              <button
                onClick={togglePlay}
                className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-6 transition-all
                  hover:scale-105 active:scale-95 transform hover:rotate-12"
              >
                {isPlaying ? (
                  <FaPause className="w-10 h-10" />
                ) : (
                  <FaPlay className="w-10 h-10" />
                )}
              </button>
              <button
                onClick={() => handleVolumeChange(0.1)}
                className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-3 transition-all
                  hover:scale-105 active:scale-95"
              >
                <FaVolumeUp className="w-6 h-6" />
              </button>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleRestart}
                className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-3 transition-all
                  hover:scale-105 active:scale-95"
              >
                <FaRedo className="w-6 h-6" />
              </button>
            </div>
          </div>
        </LessonCard>

        {/* Single verse display */}
        <div className="w-full max-w-4xl">
          <LessonCard className="transform transition-all duration-500">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaMusic className="w-6 h-6 text-cyan-500" />
                <h3 className="text-2xl font-bold text-cyan-600">{verses[activeVerse].title}</h3>
              </div>
              <div className="space-y-4">
                {verses[activeVerse].lines.map((line, i) => (
                  <p
                    key={i}
                    className="text-2xl text-center leading-relaxed text-cyan-700"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </LessonCard>
        </div>

        {/* Verse navigation */}
        <div className="flex justify-center items-center gap-6">
          <button
            onClick={handlePrevVerse}
            className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-4 transition-all
              hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={activeVerse === 0}
          >
            <FaArrowLeft className="w-8 h-8" />
          </button>
          <div className="text-lg font-semibold text-cyan-600">
            Verse {activeVerse + 1} of {verses.length}
          </div>
          <button
            onClick={handleNextVerse}
            className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-4 transition-all
              hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={activeVerse === verses.length - 1}
          >
            <FaArrowRight className="w-8 h-8" />
          </button>
        </div>

        <audio
          ref={audioRef}
          src="/audio/music/Music.webm"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleError}
          onEnded={() => setIsPlaying(false)}
        />
      </div>

      <LessonNav
        prevPath={LessonSequence["4.3"]}
        nextPath={LessonSequence["6.0"]}
        onRestart={handleRestart}
        onPenToggle={() => setIsPenActive(!isPenActive)}
        isPenActive={isPenActive}
        onLayoutRestart={handleLayoutRestart}
        onAudioToggle={handleAudioToggle}
        isAudioDisabled={isAudioDisabled}
      />
    </div>
  );
}

export default SingingPage;
