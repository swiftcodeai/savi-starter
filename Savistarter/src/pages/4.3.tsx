import React, { useState } from "react";
import { cn } from "@/lib/utils";
import LessonNav from "@/components/LessonNav";
import { LessonSequence } from "@/App";
import LessonLayout from "@/components/LessonLayout";
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

interface StoryAnswers {
  blank1: string; // Felix
  blank2: string; // Hello
  blank3: string; // two
  blank4: string; // five
  blank5: string; // hi
}

function StoryPage() {
  const [isPenActive, setIsPenActive] = useState(false);
  const { currentCourse } = useCourse();
  const [answers, setAnswers] = useState<StoryAnswers>({
    blank1: "",
    blank2: "",
    blank3: "",
    blank4: "",
    blank5: "",
  });

  const handleRestart = () => {
    setAnswers({
      blank1: "",
      blank2: "",
      blank3: "",
      blank4: "",
      blank5: "",
    });
  };

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

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center px-4 pb-20">
        <LessonLayout 
          className="max-w-6xl mx-auto"
        >
          <LessonCard className="w-full max-w-4xl">
            <div className="p-6 text-lg leading-relaxed space-y-6">
              <p>
                <StoryInput 
                  value={answers.blank1} 
                  onChange={(v) => updateAnswer('blank1', v)}
                  placeholder="who?"
                /> and Ola were happy. It was their first day at a new school!
              </p>

              <p>
                Ms. Fine greeted them with a smile. She said, "<StoryInput 
                  value={answers.blank2}
                  onChange={(v) => updateAnswer('blank2', v)}
                  placeholder="greeting?"
                />! Welcome to your first day!"
              </p>

              <p>
                Ms. Fine looked at Felix and Ola. She said, "I see <StoryInput 
                  value={answers.blank3}
                  onChange={(v) => updateAnswer('blank3', v)}
                  placeholder="number?"
                /> new friends today."
              </p>

              <p>
                On the board, she wrote 0, 1, 2, 3, 4, <StoryInput 
                  value={answers.blank4}
                  onChange={(v) => updateAnswer('blank4', v)}
                  placeholder="number?"
                />.
              </p>

              <p>
                Felix walked into the classroom. Felix said, "<StoryInput 
                  value={answers.blank5}
                  onChange={(v) => updateAnswer('blank5', v)}
                  placeholder="greeting?"
                />" to Ola.
              </p>
            </div>
          </LessonCard>
        </LessonLayout>
      </div>

      {/* Navigation bar */}
      <LessonNav
        prevPath={LessonSequence["4.2"]}
        nextPath={LessonSequence["5.0"]}
        onRestart={handleRestart}
        onPenToggle={() => setIsPenActive(!isPenActive)}
        isPenActive={isPenActive}
      />
    </div>
  );
}

export default StoryPage; 