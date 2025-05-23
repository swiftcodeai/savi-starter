import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/constants/images";
import LessonLayout from "@/components/LessonLayout";
import { LessonSequence } from "@/App";
import LessonCard from "@/components/dragndrop/LessonCard";
import LessonInstructionsPopup from '@/components/LessonInstructionsPopup';

interface Question {
  id: number;
  text: string;
  image: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What do we say when we meet someone for the first time?",
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: 2,
    text: "How do we ask someone their name?",
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: 3,
    text: "What do we say when we want to play together?",
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: 4,
    text: "How do we ask someone to be our friend?",
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: 5,
    text: "What do we say when we want to share our toys?",
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: 6,
    text: "How do we say goodbye to our friends?",
    image: PLACEHOLDER_IMAGE,
  },
];

const QuestionPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? QUESTIONS.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === QUESTIONS.length - 1 ? 0 : prev + 1));
  };

  return (
    <LessonLayout 
      title="Meet and Greet Adventures" 
      subtitle="Question Time!"
      nextPath={LessonSequence["2.4"]}
    >
      <LessonInstructionsPopup
        lessonId="2.3"
        title="Sentence Practice"
        instructions={
          <div>
            <p>Time to practice making sentences! Here's how it works:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Read each question carefully</li>
              <li>Think about the appropriate greeting or response</li>
              <li>Use the navigation arrows to move between questions</li>
              <li>Look at the images for context clues</li>
              <li>Try to answer all questions in complete sentences</li>
            </ul>
            <p className="mt-4 text-gray-500 italic">Tip: Think about real-life situations where you might use these phrases!</p>
          </div>
        }
      />
      <div className="max-w-4xl mx-auto">
        <LessonCard className="p-6 relative aspect-video bg-white">
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-4 p-6">
            {QUESTIONS.map((_, idx) => (
              <div 
                key={idx} 
                className={`relative transition-opacity duration-300 ${
                  idx === currentIndex ? 'opacity-100' : 'opacity-30'
                }`}
              >
                <img
                  src={PLACEHOLDER_IMAGE}
                  alt={`Question ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
            <div className="bg-white/90 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl sm:text-3xl text-center font-semibold text-gray-800 mb-8">
                {QUESTIONS[currentIndex].text}
              </h2>

              <div className="flex items-center justify-center gap-8">
                <button
                  onClick={goToPrevious}
                  className="p-3 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                  aria-label="Previous question"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>

                <span className="text-xl font-medium text-gray-500">
                  {currentIndex + 1} / {QUESTIONS.length}
                </span>

                <button
                  onClick={goToNext}
                  className="p-3 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                  aria-label="Next question"
                >
                  <ArrowRight className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </LessonCard>
      </div>
    </LessonLayout>
  );
};

export default QuestionPage;
