import React from "react";
import LessonLayout from "@/components/LessonLayout";
import { LessonSequence } from "@/App";
import LessonInstructionsPopup from '@/components/LessonInstructionsPopup';

const VocabPractice = () => {
  return (
    <LessonLayout
      title="Vocabulary Practice"
      subtitle="Test your knowledge"
      className="max-w-6xl mx-auto"
    >
      <LessonInstructionsPopup
        lessonId="2.6"
        title="Vocabulary Practice Time!"
        instructions={
          <div>
            <p>Let's practice what you've learned! Here's how:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Read each question carefully</li>
              <li>Choose the best answer from the options provided</li>
              <li>Click to select your answer</li>
              <li>Get instant feedback on your choices</li>
              <li>Review any mistakes to learn from them</li>
            </ul>
            <p className="mt-4 text-gray-500 italic">Tip: Don't rush - take your time to think about each answer!</p>
          </div>
        }
      />
      
      {/* Rest of the existing content... */}
    </LessonLayout>
  );
};

export default VocabPractice; 