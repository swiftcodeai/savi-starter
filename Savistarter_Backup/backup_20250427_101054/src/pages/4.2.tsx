import React, { useState } from "react";
import { cn } from "@/lib/utils";
import LessonNav from "@/components/LessonNav";
import { LessonSequence } from "@/App";
import LessonLayout from "@/components/LessonLayout";
import LessonInstructionsPopup from '@/components/LessonInstructionsPopup';

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
  };

  const updateAnswer = (field: keyof StoryAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  return (
    <LessonLayout 
      title="Story Time!"
      subtitle="The Hungry Caterpillar"
    >
      <LessonInstructionsPopup
        title="Story Time!"
        instructions={[
          "Read at your own pace through this interactive story",
          "Click on highlighted words to see their meaning",
          "Use the audio button to hear the story read aloud",
          "Look at the pictures that go with the story",
          "Try to understand the main ideas",
          "Have fun with the story!"
        ]}
        tip="Try reading along with the audio to improve your pronunciation!"
      />
      <div className="min-h-screen bg-sky-100 flex flex-col">
        {/* Top navigation bar */}
        <div className="flex justify-between items-center mb-8 px-4 py-2">
          <LessonCard className="py-2 px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-cyan-500">
              Story Time
            </h2>
          </LessonCard>
          
          <LessonCard className="py-2 px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-cyan-500">
              Fill in the Blanks
            </h2>
          </LessonCard>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col items-center px-4 pb-20">
          <LessonCard className="w-full max-w-4xl">
            <div className="p-6 text-lg leading-relaxed space-y-6">
              <p>
                One morning, <StoryInput 
                  value={answers.blank1} 
                  onChange={(v) => updateAnswer('blank1', v)}
                  placeholder="who?"
                /> walked into the classroom. He saw his friend <StoryInput 
                  value={answers.blank2}
                  onChange={(v) => updateAnswer('blank2', v)}
                  placeholder="who?"
                /> and smiled.
              </p>

              <p>"hi" said Felix.</p>

              <p>"hello" said Ola.</p>

              <p>
                Their teacher, <StoryInput 
                  value={answers.blank3}
                  onChange={(v) => updateAnswer('blank3', v)}
                  placeholder="who?"
                />, walked into the room.
              </p>

              <p>
                "Good morning, class!" she said. "Let's count together. <StoryInput 
                  value={answers.blank4}
                  onChange={(v) => updateAnswer('blank4', v)}
                  placeholder="?"
                />, <StoryInput 
                  value={answers.blank5}
                  onChange={(v) => updateAnswer('blank5', v)}
                  placeholder="?"
                />, <StoryInput 
                  value={answers.blank6}
                  onChange={(v) => updateAnswer('blank6', v)}
                  placeholder="?"
                />, <StoryInput 
                  value={answers.blank7}
                  onChange={(v) => updateAnswer('blank7', v)}
                  placeholder="?"
                />, <StoryInput 
                  value={answers.blank8}
                  onChange={(v) => updateAnswer('blank8', v)}
                  placeholder="?"
                />, <StoryInput 
                  value={answers.blank9}
                  onChange={(v) => updateAnswer('blank9', v)}
                  placeholder="?"
                />, six!"
              </p>

              <p>The students clapped. Ms. Fine smiled and said, "Great job! Now let's say hello to each other!"</p>

              <p>
                Felix waved and said, "<StoryInput 
                  value={answers.blank10}
                  onChange={(v) => updateAnswer('blank10', v)}
                  placeholder="?"
                />"
              </p>

              <p>
                Ola waved back and said, "<StoryInput 
                  value={answers.blank11}
                  onChange={(v) => updateAnswer('blank11', v)}
                  placeholder="?"
                />"
              </p>

              <p>Ms. Fine laughed and said, "We are all ready to learn today!"</p>
            </div>
          </LessonCard>
        </div>

        {/* Navigation bar */}
        <LessonNav
          prevPath={LessonSequence["4.1"]}
          nextPath={LessonSequence["4.3"]}
          onRestart={handleRestart}
          onTogglePenTool={() => setIsPenActive(!isPenActive)}
          isPenActive={isPenActive}
        />
      </div>
    </LessonLayout>
  );
};

export default StoryPage;
