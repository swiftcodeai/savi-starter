import React, { useState, useRef, useEffect } from "react";
import VocabImageViewer from "@/components/VocabImageViewer";
import { LessonSequence } from "@/App";
import LessonLayout from "@/components/LessonLayout";
import LessonCard from "@/components/dragndrop/LessonCard";
import LessonInstructionsPopup from '@/components/LessonInstructionsPopup';

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
    audio: "/audio/words/msfine.webm"
  }
];

const VocabExplorer = () => {
  const [currentWord, setCurrentWord] = useState(vocabList[0]);
  const [isPenActive, setIsPenActive] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const vocabViewerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Force clear the localStorage entry for this popup when component mounts
  useEffect(() => {
    localStorage.removeItem('lesson-instructions-vocab-explorer');
  }, []);

  const handleTogglePenTool = () => {
    setIsPenActive(!isPenActive);
  };

  const handleRestart = () => {
    if (vocabViewerRef.current) {
      window.location.reload();
    }
  };

  const tryPlayAudio = async (audioPath: string) => {
    setIsAudioLoading(true);
    setAudioError(null);

    if (!audioRef.current) return;

    try {
      // Create a new Audio element to check support
      const audio = new Audio();
      
      // Check if WebM is supported
      const canPlayWebm = audio.canPlayType('audio/webm') !== '';
      
      if (!canPlayWebm) {
        throw new Error('UNSUPPORTED_FORMAT');
      }

      // Set audio properties
      audioRef.current.preload = 'auto';
      audioRef.current.src = audioPath;
      
      // Wait for audio to be loaded
      await new Promise((resolve, reject) => {
        if (!audioRef.current) return reject();
        
        audioRef.current.oncanplaythrough = resolve;
        audioRef.current.onerror = () => reject(new Error('LOAD_ERROR'));
        
        // Timeout if loading takes too long
        setTimeout(() => reject(new Error('TIMEOUT')), 5000);
      });

      await audioRef.current.play();
      setIsAudioLoading(false);
    } catch (error) {
      console.error('Error playing audio:', error);
      
      let errorMessage = 'Could not play audio. Please try again.';
      
      if (error.message === 'UNSUPPORTED_FORMAT') {
        errorMessage = 'Your browser does not support this audio format.';
      } else if (error.message === 'TIMEOUT') {
        errorMessage = 'Audio is taking too long to load. Please try again.';
      } else if (error.message === 'LOAD_ERROR') {
        errorMessage = 'Could not load the audio file. Please try again.';
      }
      
      setAudioError(errorMessage);
      setIsAudioLoading(false);
    }
  };

  // Add cleanup for audio element
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const handleWordSelect = (word) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentWord(word);
    tryPlayAudio(word.audio);
  };

  const handleSound = () => {
    if (currentWord) {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      tryPlayAudio(currentWord.audio);
    }
  };

  return (
    <LessonLayout
      title="Vocabulary"
      subtitle="Learn New Words"
      nextPath={LessonSequence["1.2.1"]}
      onSound={handleSound}
    >
      <LessonInstructionsPopup
        lessonId="vocab-explorer"
        title="Vocabulary Explorer"
        instructions={
          <div>
            <p>Welcome to the Vocabulary Explorer! Here's how to use it:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Browse through the list of words on the right</li>
              <li>Click any word to see its image and hear its pronunciation</li>
              <li>Use the sound button to hear the word again</li>
              <li>Practice saying each word after you hear it</li>
              <li>Take your time to learn each word before moving on</li>
            </ul>
            <p className="mt-4 text-gray-500 italic">Tip: Listen to each word multiple times to help remember its pronunciation!</p>
          </div>
        }
      />
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-gray-700 mb-6 text-base animate-fade-in text-center">
          Click on a word from the list to see its image and hear its pronunciation.
          {audioError && (
            <div className="text-red-500 text-sm mt-2">
              {audioError}
              <button 
                onClick={() => tryPlayAudio(currentWord.audio)}
                className="ml-2 text-blue-500 hover:underline"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left side - Current Image */}
          <div className="md:col-span-2">
            <LessonCard className="w-full aspect-video flex items-center justify-center p-4 relative">
              <img 
                src={currentWord.image} 
                alt={currentWord.word}
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 px-6 py-3 rounded-xl">
                  <h2 className="text-4xl font-bold text-white">{currentWord.word}</h2>
                </div>
              </div>
              {isAudioLoading && (
                <div className="absolute top-2 right-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-savi-blue"></div>
                </div>
              )}
            </LessonCard>
          </div>

          {/* Right side - Word List */}
          <div>
            <LessonCard className="w-full h-full p-4">
              <div className="flex flex-col gap-2 h-full overflow-y-auto">
                {vocabList.map((word) => (
                  <button
                    key={word.key}
                    onClick={() => handleWordSelect(word)}
                    className={`p-3 rounded-lg text-left transition-all ${
                      currentWord.key === word.key
                        ? "bg-savi-blue text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {word.word}
                  </button>
                ))}
              </div>
        </LessonCard>
          </div>
        </div>

        <audio ref={audioRef} preload="auto" />
      </div>
    </LessonLayout>
  );
};

export default VocabExplorer;
