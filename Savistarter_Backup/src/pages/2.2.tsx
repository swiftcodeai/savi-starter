import React, { useState, useRef, useEffect } from "react";
import { Typewriter } from "@/components/Typewriter";
import LessonLayout from "@/components/LessonLayout";
import { LessonSequence } from "@/App";
import LessonCard from "@/components/dragndrop/LessonCard";
import LessonInstructionsPopup from '@/components/LessonInstructionsPopup';
import LessonNav from "@/components/LessonNav";
import { useCourse } from "@/contexts/CourseContext";

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);

const RestartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
  </svg>
);

const storyText = `One morning, Felix walked into the classroom. He saw his friend Ola and smiled.

"Hi," said Felix.

"Hello," said Ola.

Their teacher, Ms Fine, walked into the room.

"Good morning, class!" she said. "Let's count together. Zero, one, two, three, four, five, six!"

The students clapped. Ms. Fine smiled and said, "Great job! Now let's say hello to each other!"

Felix waved and said, "Hello!"

Ola waved back and said, "Hi!"

Ms. Fine laughed and said, "We are all ready to learn today!"`;

const StoryReader: React.FC = () => {
  const { currentCourse } = useCourse();
  const [isReading, setIsReading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/audio/words/Story Audio.webm");
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleStart = () => {
    setHasStarted(true);
    setIsReading(true);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleRestart = () => {
    setIsReading(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setTimeout(() => {
      setIsReading(true);
      setIsPlaying(true);
      audioRef.current?.play();
    }, 100);
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsReading(false);
      } else {
        audioRef.current.play();
        setIsReading(true);
      }
      setIsPlaying(!isPlaying);
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
            Identity
          </h2>
        </LessonCard>
      </div>

      <LessonLayout
        className="max-w-6xl mx-auto"
        nextPath={LessonSequence["2.3"]}
        prevPath={LessonSequence["2.1"]}
      >
        <LessonInstructionsPopup
          lessonId="2.2"
          title="Interactive Story Reader"
          instructions={
            <div>
              <p>Welcome to the Story Reader! Here's how to enjoy the story:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Use the play button ▶️ to start the story</li>
                <li>Watch as the text appears automatically</li>
                <li>Use the pause button ⏸️ if you need more time to read</li>
                <li>Click restart 🔄 to read the story again</li>
                <li>Follow along with the highlighted words</li>
              </ul>
              <p className="mt-4 text-gray-500 italic">Tip: Try reading aloud with the story to practice pronunciation!</p>
            </div>
          }
        />
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          <LessonCard className="w-full p-8 mb-8 relative">
            {!hasStarted ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
                <h2 className="text-3xl font-bold text-blue-600 animate-pulse">Ready to start the story?</h2>
                <button
                  onClick={handleStart}
                  className="px-8 py-4 text-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all shadow-lg"
                >
                  Start Reading!
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-4 gap-2">
                  <button
                    onClick={toggleAudio}
                    className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all shadow-md"
                    aria-label={isPlaying ? "Pause story audio" : "Play story audio"}
                  >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                  </button>
                  <button
                    onClick={handleRestart}
                    className="p-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transition-all shadow-md"
                    aria-label="Restart story"
                  >
                    <RestartIcon />
                  </button>
                </div>
                <div className="story-content">
                  {isReading && (
                    <Typewriter
                      text={storyText}
                      speed={40}
                      className="mb-0 prose prose-lg story-text"
                      onComplete={() => console.log("Typing complete")}
                      isPaused={!isPlaying}
                    />
                  )}
                </div>
              </>
            )}
          </LessonCard>
        </div>
        <style>{`
          .story-content {
            font-family: 'Comic Sans MS', cursive, sans-serif;
          }
          .story-text {
            line-height: 2;
          }
          .story-text > div {
            background: linear-gradient(45deg, #2563eb, #7c3aed);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-size: 1.75rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
          }
          .story-text strong {
            color: #2563eb;
          }
          @keyframes colorChange {
            0% { color: #2563eb; }
            50% { color: #7c3aed; }
            100% { color: #2563eb; }
          }
          .story-text span {
            animation: colorChange 3s infinite;
          }
        `}</style>
      </LessonLayout>
    </div>
  );
};

export default StoryReader;
