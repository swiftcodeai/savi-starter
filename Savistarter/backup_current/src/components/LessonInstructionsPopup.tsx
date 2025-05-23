import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface LessonInstructionsPopupProps {
  lessonId: string;
  title: string;
  instructions: React.ReactNode;
  className?: string;
}

const LessonInstructionsPopup: React.FC<LessonInstructionsPopupProps> = ({
  lessonId,
  title,
  instructions,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if this lesson's instructions have been shown before
    const hasShownInstructions = localStorage.getItem(`lesson-instructions-${lessonId}`);
    if (!hasShownInstructions) {
      setIsOpen(true);
    }
  }, [lessonId]);

  const handleClose = () => {
    setIsOpen(false);
    // Mark this lesson's instructions as shown
    localStorage.setItem(`lesson-instructions-${lessonId}`, 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={cn(
        "bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full mx-4 transform transition-all",
        "animate-in fade-in slide-in-from-bottom-4 duration-300",
        className
      )}>
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="text-gray-600 space-y-4">
            {instructions}
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-savi-blue text-white rounded-lg hover:bg-savi-blue/90 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonInstructionsPopup; 