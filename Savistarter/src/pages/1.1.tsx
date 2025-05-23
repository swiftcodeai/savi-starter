import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Volume2 } from "lucide-react";
import AudioControls from "@/components/AudioControls";
import LessonNav from "@/components/LessonNav";
import { cn } from "@/lib/utils";
import { LessonSequence } from "@/App";
import LessonLayout from "@/components/LessonLayout";
import LessonCard from "@/components/dragndrop/LessonCard";
import { FaVolumeUp } from "react-icons/fa";
import LessonInstructionsPopup from '@/components/LessonInstructionsPopup';
import { useCourse } from "@/contexts/CourseContext";

// Custom card component for the lesson
const VocabCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
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

const vocabList = [
  {
    key: "zero",
    word: "Zero",
    image: "/vocab-images/zero.png",
    audio: "/audio/words/zero.webm"
  },
  {
    key: "one",
    word: "One",
    image: "/vocab-images/one.png",
    audio: "/audio/words/one.webm"
  },
  {
    key: "two",
    word: "Two",
    image: "/vocab-images/two.png",
    audio: "/audio/words/two.webm"
  },
  {
    key: "three",
    word: "Three",
    image: "/vocab-images/three.png",
    audio: "/audio/words/three.webm"
  },
  {
    key: "four",
    word: "Four",
    image: "/vocab-images/four.png",
    audio: "/audio/words/four.webm"
  },
  {
    key: "five",
    word: "Five",
    image: "/vocab-images/five.png",
    audio: "/audio/words/five.webm"
  },
  {
    key: "six",
    word: "Six",
    image: "/vocab-images/six.png",
    audio: "/audio/words/six.webm"
  },
  {
    key: "hi",
    word: "Hi",
    image: "/vocab-images/hi.png",
    audio: "/audio/words/hi.webm"
  },
  {
    key: "hello",
    word: "Hello",
    image: "/vocab-images/hello.png",
    audio: "/audio/words/hello.webm"
  },
  {
    key: "felix",
    word: "Felix",
    image: "/vocab-images/felix.png",
    audio: "/audio/words/felix.webm"
  },
  {
    key: "ola",
    word: "Ola",
    image: "/vocab-images/ola.png",
    audio: "/audio/words/ola.webm"
  },
  {
    key: "msfine",
    word: "Ms Fine",
    image: "/vocab-images/ms fine.png",
    audio: "/audio/words/ms fine.webm"
  },
];

const VocabLesson = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPenActive, setIsPenActive] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isAudioDisabled, setIsAudioDisabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { currentCourse } = useCourse();

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : vocabList.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < vocabList.length - 1 ? prev + 1 : 0));
  };

  const handleSound = () => {
    if (isAudioDisabled || !audioRef.current) return;
    
    audioRef.current.src = vocabList[currentIndex].audio;
    audioRef.current.play().catch(error => {
      console.error('Error playing audio:', error);
      setAudioError(true);
    });
  };

  const handleLayoutRestart = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleAudioToggle = () => {
    setIsAudioDisabled(!isAudioDisabled);
    if (!isAudioDisabled) {
      // If we're disabling audio, stop any current playback
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  const currentWord = vocabList[currentIndex];

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
            Vocabulary
          </h2>
        </LessonCard>
      </div>

    <LessonLayout
        title={currentCourse?.title || "Greetings & Communication"}
      className="max-w-6xl mx-auto"
        nextPath={LessonSequence["1.2.1"]}
        prevPath={LessonSequence.SKILLS}
    >
      <LessonInstructionsPopup
        lessonId="1.1"
        title="Welcome to Vocabulary Explorer!"
        instructions={
          <div>
            <p>In this lesson, you'll learn new words through interactive cards. Here's how to use them:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Click on any card to see the word and its image</li>
              <li>Click the speaker icon 🔊 to hear the word pronounced</li>
              <li>Practice saying each word after hearing it</li>
              <li>Take your time to memorize each word and its pronunciation</li>
              <li>You can click the cards as many times as you need</li>
            </ul>
            <p className="mt-4 text-gray-500 italic">Tip: Try to remember both how the word looks and sounds!</p>
          </div>
        }
      />
      
      {/* Main content area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-4 pb-20">
        {/* Left side - Large image display */}
        <div className="flex justify-center">
          <VocabCard className="w-[32rem] h-[32rem] flex items-center justify-center">
            <img 
              src={currentWord.image}
              alt={currentWord.word}
              className="w-full h-full object-contain p-6"
            />
          </VocabCard>
        </div>

        {/* Right side - Word and Navigation */}
        <div className="flex flex-col items-center gap-10">
          {/* Word card */}
          <VocabCard className="w-full max-w-lg py-6 px-8">
            <h2 className="text-6xl sm:text-7xl font-extrabold text-center text-cyan-500">
              {currentWord.word}
            </h2>
          </VocabCard>

          {/* Vocab thumbnails grid */}
          <div className="w-full max-w-lg">
            <div className="grid grid-cols-4 gap-3 p-2">
              {vocabList.map((word, idx) => (
                <div
                  key={word.key}
                  className={cn(
                    "w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer hover:scale-110 mt-[3px]",
                    currentIndex === idx 
                      ? "border-cyan-500 ring-2 ring-cyan-300 scale-110" 
                      : "border-gray-200 opacity-60"
                  )}
                  onClick={() => setCurrentIndex(idx)}
                >
                  <img
                    src={word.image}
                    alt={word.word}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Audio controls */}
          <div className="mt-4 flex justify-center scale-125">
            <AudioControls 
              onPrev={handlePrev} 
              onNext={handleNext} 
              onSound={handleSound} 
            />
          </div>
        </div>
      </div>
    </LessonLayout>
    </div>
  );
};

export default VocabLesson;
