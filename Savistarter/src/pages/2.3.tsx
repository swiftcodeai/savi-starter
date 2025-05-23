import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import LessonLayout from "@/components/LessonLayout";
import { LessonSequence } from "@/App";
import LessonInstructionsPopup from '@/components/LessonInstructionsPopup';
import LessonNav from "@/components/LessonNav";
import { useCourse } from "@/contexts/CourseContext";

// Custom card component to match 1.1 style
const LessonCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn(
    "bg-[#fae6b0] rounded-xl border-4 border-[#f9da8d] shadow-lg p-3 relative",
    className
  )}>
    {/* Corner accents - matching 1.1 style */}
    <div className="absolute -top-1 -left-1 w-4 h-4 bg-white rounded-full opacity-80"></div>
    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full opacity-80"></div>
    <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-white rounded-full opacity-80"></div>
    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full opacity-80"></div>
    {children}
  </div>
);

interface Question {
  id: number;
  text: string;
  image: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What is the teacher's name?",
    image: "/vocab-images/ms fine.png",
  },
  {
    id: 2,
    text: "Who said hi in the beginning?",
    image: "/vocab-images/felix.png",
  },
  {
    id: 3,
    text: "What numbers did they count?",
    image: "/vocab-images/numbers.png",
  },
  {
    id: 4,
    text: "How did the students react after counting to six?",
    image: "/vocab-images/happy students.png",
  },
  {
    id: 5,
    text: "After counting what did Ms Fine say next?",
    image: "/vocab-images/ms fine.png",
  },
  {
    id: 6,
    text: "After Ms. Fine laughed, what did she say to the class?",
    image: "/vocab-images/ms fine teaching.png",
  },
];

const QuestionPage = () => {
  const { currentCourse } = useCourse();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPenActive, setIsPenActive] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? QUESTIONS.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === QUESTIONS.length - 1 ? 0 : prev + 1));
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
      nextPath={LessonSequence["2.4"]}
        prevPath={LessonSequence["2.2"]}
    >
      <LessonInstructionsPopup
        lessonId="2.3"
          title="Story Questions"
        instructions={
          <div>
              <p>Time to check your understanding of the story! Here's how it works:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Read each question carefully</li>
                <li>Look at the image for hints</li>
                <li>Think about what happened in the story</li>
                <li>Use the arrows to move between questions</li>
              <li>Try to answer all questions in complete sentences</li>
            </ul>
              <p className="mt-4 text-gray-500 italic">Tip: Remember the sequence of events in the story!</p>
          </div>
        }
      />

        <div className="flex flex-col items-center gap-8 px-4 pb-20">
          <div className="w-full flex justify-between items-center mb-8">
            <div className="text-lg font-medium text-gray-600">
              Question {currentIndex + 1} of {QUESTIONS.length}
            </div>
          </div>

          <LessonCard className="w-full max-w-4xl p-8">
            <div className="flex flex-col items-center gap-8">
              {/* Image */}
              <div className="w-full max-w-md aspect-square relative">
                <img
                  src={QUESTIONS[currentIndex].image}
                  alt={`Question ${currentIndex + 1}`}
                  className="w-full h-full object-contain"
                />
          </div>

              {/* Question */}
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-cyan-700 mb-8">
                {QUESTIONS[currentIndex].text}
              </h2>

                {/* Navigation controls */}
              <div className="flex items-center justify-center gap-8">
                <button
                  onClick={goToPrevious}
                    className="p-4 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white shadow-md transition-all hover:scale-105"
                  aria-label="Previous question"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={goToNext}
                    className="p-4 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white shadow-md transition-all hover:scale-105"
                  aria-label="Next question"
                >
                    <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </LessonCard>
      </div>

        <LessonNav
          prevPath={LessonSequence["2.2"]}
          nextPath={LessonSequence["2.4"]}
          onPenToggle={() => setIsPenActive(!isPenActive)}
          isPenActive={isPenActive}
        />
    </LessonLayout>
    </div>
  );
};

export default QuestionPage;
