import React, { useState, useEffect, useCallback } from "react";
import DOMPurify from 'isomorphic-dompurify';

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  allowHtml?: boolean;
  isPaused?: boolean;
  onSkip?: () => void;
  onType?: (text: string) => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 50,
  className = "",
  onComplete,
  allowHtml = false,
  isPaused = false,
  onSkip,
  onType,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSkipped, setIsSkipped] = useState(false);

  const getCharacterDelay = useCallback((char: string) => {
    // Add natural-feeling delays for punctuation
    if ([",", ";"].includes(char)) return speed * 3;
    if ([".", "!", "?"].includes(char)) return speed * 5;
    if (char === " ") return speed * 0.5;
    return speed;
  }, [speed]);

  const skip = useCallback(() => {
    setDisplayedText(text);
    setCurrentIndex(text.length);
    setIsSkipped(true);
    onSkip?.();
  }, [text, onSkip]);

  useEffect(() => {
    if (isSkipped || isPaused || currentIndex >= text.length) return;

    const delay = getCharacterDelay(text[currentIndex]);
      const timer = setTimeout(() => {
      const newText = displayedText + text[currentIndex];
      setDisplayedText(newText);
        setCurrentIndex((prev) => prev + 1);
      onType?.(newText);
    }, delay);

      return () => clearTimeout(timer);
  }, [currentIndex, text, isPaused, isSkipped, getCharacterDelay, displayedText, onType]);

  useEffect(() => {
    if (currentIndex === text.length && !isSkipped) {
      onComplete?.();
    }
  }, [currentIndex, text.length, isSkipped, onComplete]);

  const renderContent = () => {
    if (allowHtml) {
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(displayedText),
          }}
        />
      );
    }
    return displayedText;
  };

  return (
    <div className={className}>
      {renderContent()}
      {!isSkipped && currentIndex < text.length && (
        <span className="inline-block w-[2px] h-[1em] bg-current animate-[blink_1s_ease-in-out_infinite]" />
      )}
    </div>
  );
};
