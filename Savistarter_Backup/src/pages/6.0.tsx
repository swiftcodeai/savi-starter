import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import LessonNav from "@/components/LessonNav";
import { LessonSequence } from "@/App";
import { FaPlay, FaPause, FaRedo, FaRandom, FaClock, FaArrowRight } from "react-icons/fa";
import LessonLayout, { LessonCard } from "@/components/LessonLayout";
import { useCourse } from "@/contexts/CourseContext";

const VOCAB_ITEMS = [
  { word: "ZERO", image: "/vocab-images/zero.png" },
  { word: "ONE", image: "/vocab-images/one.png" },
  { word: "TWO", image: "/vocab-images/two.png" },
  { word: "THREE", image: "/vocab-images/three.png" },
  { word: "FOUR", image: "/vocab-images/four.png" },
  { word: "FIVE", image: "/vocab-images/five.png" },
  { word: "SIX", image: "/vocab-images/six.png" },
  { word: "HI", image: "/vocab-images/hi.png" },
  { word: "HELLO", image: "/vocab-images/hello.png" },
  { word: "FELIX", image: "/vocab-images/felix.png" },
  { word: "OLA", image: "/vocab-images/ola.png" },
  { word: "MS FINE", image: "/vocab-images/ms fine.png" },
];

// Shuffle array function
const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

function VocabFlashPage() {
  const { currentCourse } = useCourse();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [flashSpeed, setFlashSpeed] = useState(2000); // 2 seconds default
  const [vocabList, setVocabList] = useState(VOCAB_ITEMS);
  const [isVisible, setIsVisible] = useState(true);
  const [isPenActive, setIsPenActive] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isAudioDisabled, setIsAudioDisabled] = useState(false);

  // Handle auto-play
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    if (isPlaying) {
      intervalId = setInterval(() => {
        // First make the card invisible
        setIsVisible(false);
        
        // After a brief pause, show next card
        timeoutId = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % vocabList.length);
          setIsVisible(true);
        }, 200); // Quick transition
      }, flashSpeed);
    }

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      setIsVisible(true);
    };
  }, [isPlaying, flashSpeed, vocabList.length]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleShuffle = () => {
    setIsPlaying(false);
    const shuffledList = shuffleArray([...VOCAB_ITEMS]); // Create new array to force re-render
    setVocabList(shuffledList);
    setCurrentIndex(0);
    setIsVisible(true);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    setIsVisible(true);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setIsVisible(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % vocabList.length);
      setIsVisible(true);
    }, 200);
  };

  const handleSpeedChange = () => {
    const speeds = [1000, 2000, 3000, 4000]; // 1, 2, 3, 4 seconds
    setFlashSpeed((prev) => speeds[(speeds.indexOf(prev) + 1) % speeds.length]);
  };

  const handleLayoutRestart = () => {
    setIsPlaying(false);
  };

  const handleAudioToggle = () => {
    setIsAudioDisabled(!isAudioDisabled);
    if (!isAudioDisabled) {
      setIsPlaying(false);
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
            Say it
          </h2>
        </LessonCard>
      </div>

      <div className="flex flex-col items-center gap-6 w-full px-4 pb-20">
        {/* Controls */}
        <div className="flex justify-center mb-6">
          <LessonCard className="py-4 px-6 flex gap-4 items-center">
            <button
              onClick={handlePlayPause}
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
              onClick={handleNext}
              className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-4 transition-all
                hover:scale-105 active:scale-95"
            >
              <FaArrowRight className="w-8 h-8" />
            </button>
            <button
              onClick={handleRestart}
              className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-4 transition-all
                hover:scale-105 active:scale-95"
            >
              <FaRedo className="w-8 h-8" />
            </button>
            <button
              onClick={handleShuffle}
              className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-4 transition-all
                hover:scale-105 active:scale-95"
            >
              <FaRandom className="w-8 h-8" />
            </button>
            <button
              onClick={handleSpeedChange}
              className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-4 transition-all
                hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <FaClock className="w-8 h-8" />
              <span className="text-lg font-bold">{flashSpeed / 1000}s</span>
            </button>
          </LessonCard>
        </div>
        
        {/* Status indicator */}
        <div className="w-full max-w-md text-center">
          <LessonCard className="py-2 px-4">
            <h3 className="text-xl font-bold text-cyan-600">
              {currentIndex + 1} of {vocabList.length}
            </h3>
          </LessonCard>
        </div>

        {/* Flashcard */}
        <div className="flex-1 flex justify-center items-center">
          <div 
            className={cn(
              "transition-all duration-200 transform",
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
          >
            <LessonCard className="w-[500px] aspect-square flex items-center justify-center p-8">
              <img
                src={vocabList[currentIndex].image}
                alt={vocabList[currentIndex].word}
                className="w-full h-full object-contain select-none"
                draggable={false}
              />
            </LessonCard>
            <div className="text-center mt-4">
              <h3 className="text-4xl font-bold text-cyan-600">
                {vocabList[currentIndex].word}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <LessonNav
        prevPath={LessonSequence["5.0"]}
        nextPath={LessonSequence.SKILLS}
        onPenToggle={() => setIsPenActive(!isPenActive)}
        isPenActive={isPenActive}
        onLayoutRestart={handleLayoutRestart}
        onAudioToggle={handleAudioToggle}
        isAudioDisabled={isAudioDisabled}
      />
    </div>
  );
}

export default VocabFlashPage;
