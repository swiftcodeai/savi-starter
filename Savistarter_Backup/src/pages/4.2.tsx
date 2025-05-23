import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import LessonNav from "@/components/LessonNav";
import { LessonSequence } from "@/App";
import LessonLayout from "@/components/LessonLayout";
import LessonInstructionsPopup from '@/components/LessonInstructionsPopup';
import { useCourse } from "@/contexts/CourseContext";

interface LessonCardProps {
  children: React.ReactNode;
  className?: string;
}

interface StoryInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
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

// Input field component
const StoryInput: React.FC<StoryInputProps> = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-24 px-3 py-1 text-lg font-bold text-cyan-600 bg-white rounded-lg border-2 border-cyan-200 
      focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 outline-none transition-all inline-block mx-1"
  />
);

const STORY_TEXT = `One morning, Felix walked into the classroom. He saw his friend Ola and smiled.

"hi" said Felix.

"hello" said Ola.

Their teacher, Ms Fine, walked into the room.

"Good morning, class!" she said. "Let's count together. zero, one, two, three, four, five, six!"

The students clapped. Ms. Fine smiled and said, "Great job! Now let's say hello to each other!"

Felix waved and said, "hi"

Ola waved back and said, "hello"

Ms. Fine laughed and said, "We are all ready to learn today!"`;

interface StoryAnswers {
  blank1: string; // First Felix
  blank2: string; // First Ola
  blank3: string; // Ms Fine
  blank4: string; // zero
  blank5: string; // one
  blank6: string; // two
  blank7: string; // three
  blank8: string; // four
  blank9: string; // five
  blank10: string; // hi
  blank11: string; // hello
}

const StoryPage = () => {
  const [isPenActive, setIsPenActive] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [showBlanks, setShowBlanks] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasRestarted, setHasRestarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { currentCourse } = useCourse();
  
  const [answers, setAnswers] = useState<StoryAnswers>({
    blank1: "",
    blank2: "",
    blank3: "",
    blank4: "",
    blank5: "",
    blank6: "",
    blank7: "",
    blank8: "",
    blank9: "",
    blank10: "",
    blank11: "",
  });

  const handleRestart = () => {
    if (!hasRestarted) {
      setHasStarted(false);
      setDisplayedText("");
      setShowBlanks(false);
      setAnswers({
        blank1: "",
        blank2: "",
        blank3: "",
        blank4: "",
        blank5: "",
        blank6: "",
        blank7: "",
        blank8: "",
        blank9: "",
        blank10: "",
        blank11: "",
      });
      setHasRestarted(true);
    }
  };

  const startStory = () => {
    if (!hasStarted || hasRestarted) {
      setHasStarted(true);
      setIsTyping(true);
      setShowBlanks(false);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error);
        });
      }
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isTyping && hasStarted) {
      const typeNextChar = (index: number) => {
        if (index < STORY_TEXT.length) {
          setDisplayedText(STORY_TEXT.slice(0, index + 1));
          timeoutId = setTimeout(() => typeNextChar(index + 1), 50);
        } else {
          setIsTyping(false);
          setShowBlanks(true);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        }
      };
      typeNextChar(0);
    }
    return () => clearTimeout(timeoutId);
  }, [isTyping, hasStarted]);

  const updateAnswer = (field: keyof StoryAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
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
            Knowledge Check
          </h2>
        </LessonCard>
      </div>

      <LessonLayout
        className="max-w-6xl mx-auto"
        nextPath={LessonSequence["4.3"]}
        prevPath={LessonSequence["4.1"]}
      >
        <LessonInstructionsPopup
          lessonId="4.2"
          title="Story Time!"
          instructions={
            <div>
              <p>Welcome to interactive story time! Here's what you can do:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Click the Start button to begin the story</li>
                <li>Watch and listen as the story unfolds</li>
                <li>After the story finishes, fill in the blanks</li>
                <li>Use the Restart button if you want to start over (only works once)</li>
              </ul>
              <p className="mt-4 text-gray-500 italic">Tip: Pay attention to the story as it plays!</p>
            </div>
          }
        />
        
        <audio ref={audioRef} src="/audio/Audio story.mp3" />
        
        {/* Control buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={startStory}
            disabled={hasStarted && !hasRestarted}
            className={cn(
              "px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all",
              hasStarted && !hasRestarted
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 hover:scale-105"
            )}
          >
            Start
          </button>
          <button
            onClick={handleRestart}
            disabled={!hasStarted || hasRestarted}
            className={cn(
              "px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all",
              !hasStarted || hasRestarted
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 hover:scale-105"
            )}
          >
            Restart
          </button>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col items-center px-4 pb-20">
          <LessonCard className="w-full max-w-4xl">
            <div className="p-6 text-lg leading-relaxed space-y-6">
              {!showBlanks ? (
                <div className="min-h-[400px] whitespace-pre-line">
                  {displayedText}
                </div>
              ) : (
                <div className="space-y-6">
                  <p>
                    One morning, <input 
                      type="text"
                      value={answers.blank1}
                      onChange={(e) => updateAnswer('blank1', e.target.value)}
                      className="w-24 px-2 py-1 border-2 border-cyan-500 rounded"
                      placeholder="who?"
                    /> walked into the classroom. He saw his friend <input 
                      type="text"
                      value={answers.blank2}
                      onChange={(e) => updateAnswer('blank2', e.target.value)}
                      className="w-24 px-2 py-1 border-2 border-cyan-500 rounded"
                      placeholder="who?"
                    /> and smiled.
                  </p>

                  <p>"hi" said Felix.</p>

                  <p>"hello" said Ola.</p>

                  <p>
                    Their teacher, <input 
                      type="text"
                      value={answers.blank3}
                      onChange={(e) => updateAnswer('blank3', e.target.value)}
                      className="w-24 px-2 py-1 border-2 border-cyan-500 rounded"
                      placeholder="who?"
                    />, walked into the room.
                  </p>

                  <p>
                    "Good morning, class!" she said. "Let's count together. <input 
                      type="text"
                      value={answers.blank4}
                      onChange={(e) => updateAnswer('blank4', e.target.value)}
                      className="w-24 px-2 py-1 border-2 border-cyan-500 rounded"
                      placeholder="?"
                    />, <input 
                      type="text"
                      value={answers.blank5}
                      onChange={(e) => updateAnswer('blank5', e.target.value)}
                      className="w-24 px-2 py-1 border-2 border-cyan-500 rounded"
                      placeholder="?"
                    />, <input 
                      type="text"
                      value={answers.blank6}
                      onChange={(e) => updateAnswer('blank6', e.target.value)}
                      className="w-24 px-2 py-1 border-2 border-cyan-500 rounded"
                      placeholder="?"
                    />, <input 
                      type="text"
                      value={answers.blank7}
                      onChange={(e) => updateAnswer('blank7', e.target.value)}
                      className="w-24 px-2 py-1 border-2 border-cyan-500 rounded"
                      placeholder="?"
                    />, <input 
                      type="text"
                      value={answers.blank8}
                      onChange={(e) => updateAnswer('blank8', e.target.value)}
                      className="w-24 px-2 py-1 border-2 border-cyan-500 rounded"
                      placeholder="?"
                    />, <input 
                      type="text"
                      value={answers.blank9}
                      onChange={(e) => updateAnswer('blank9', e.target.value)}
                      className="w-24 px-2 py-1 border-2 border-cyan-500 rounded"
                      placeholder="?"
                    />, six!"
                  </p>

                  <p>The students clapped. Ms. Fine smiled and said, "Great job! Now let's say hello to each other!"</p>

                  <p>
                    Felix waved and said, "<input 
                      type="text"
                      value={answers.blank10}
                      onChange={(e) => updateAnswer('blank10', e.target.value)}
                      className="w-24 px-2 py-1 border-2 border-cyan-500 rounded"
                      placeholder="?"
                    />"
                  </p>

                  <p>
                    Ola waved back and said, "<input 
                      type="text"
                      value={answers.blank11}
                      onChange={(e) => updateAnswer('blank11', e.target.value)}
                      className="w-24 px-2 py-1 border-2 border-cyan-500 rounded"
                      placeholder="?"
                    />"
                  </p>

                  <p>Ms. Fine laughed and said, "We are all ready to learn today!"</p>
                </div>
              )}
            </div>
          </LessonCard>
        </div>

        {/* Navigation bar */}
        <LessonNav
          prevPath={LessonSequence["4.1"]}
          nextPath={LessonSequence["4.3"]}
          onRestart={handleRestart}
          onPenToggle={() => setIsPenActive(!isPenActive)}
          isPenActive={isPenActive}
        />
      </LessonLayout>
    </div>
  );
};

export default StoryPage;
