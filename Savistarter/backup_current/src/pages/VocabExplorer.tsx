import React, { useState, useRef } from "react";
import VocabImageViewer from "@/components/VocabImageViewer";
import { LessonSequence } from "@/App";
import LessonLayout from "@/components/LessonLayout";
import LessonCard from "@/components/dragndrop/LessonCard";

const vocabList = [
  {
    key: "zero",
    word: "Zero",
    image: "/vocab-images/zero.png",
    audio: "/audio/vocab/zero.mp3"
  },
  {
    key: "one",
    word: "One",
    image: "/vocab-images/one.png",
    audio: "/audio/vocab/one.mp3"
  },
  {
    key: "two",
    word: "Two",
    image: "/vocab-images/two.png",
    audio: "/audio/vocab/two.mp3"
  },
  {
    key: "three",
    word: "Three",
    image: "/vocab-images/three.png",
    audio: "/audio/vocab/three.mp3"
  },
  {
    key: "four",
    word: "Four",
    image: "/vocab-images/four.png",
    audio: "/audio/vocab/four.mp3"
  },
  {
    key: "five",
    word: "Five",
    image: "/vocab-images/five.png",
    audio: "/audio/vocab/five.mp3"
  },
  {
    key: "six",
    word: "Six",
    image: "/vocab-images/six.png",
    audio: "/audio/vocab/six.mp3"
  },
  {
    key: "hi",
    word: "Hi",
    image: "/vocab-images/hi.png",
    audio: "/audio/vocab/hi.mp3"
  },
  {
    key: "hello",
    word: "Hello",
    image: "/vocab-images/hello.png",
    audio: "/audio/vocab/hello.mp3"
  },
  {
    key: "felix",
    word: "Felix",
    image: "/vocab-images/felix.png",
    audio: "/audio/vocab/felix.mp3"
  },
  {
    key: "ola",
    word: "Ola",
    image: "/vocab-images/ola.png",
    audio: "/audio/vocab/ola.mp3"
  },
  {
    key: "msfine",
    word: "Ms Fine",
    image: "/vocab-images/ms fine.png",
    audio: "/audio/vocab/msfine.mp3"
  },
];

const VocabExplorer = () => {
  const [currentWord, setCurrentWord] = useState(vocabList[0]);
  const [isPenActive, setIsPenActive] = useState(false);
  const vocabViewerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleTogglePenTool = () => {
    setIsPenActive(!isPenActive);
  };

  const handleRestart = () => {
    if (vocabViewerRef.current) {
      window.location.reload();
    }
  };

  const handleWordSelect = (word) => {
    setCurrentWord(word);
    if (audioRef.current) {
      audioRef.current.src = word.audio;
      audioRef.current.play();
    }
  };

  const handleSound = () => {
    if (audioRef.current && currentWord) {
      audioRef.current.play();
    }
  };

  return (
    <LessonLayout
      title="Meet and Greet Adventures"
      subtitle="Learn New Words"
      nextPath={LessonSequence["1.2.1"]}
      onSound={handleSound}
    >
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-gray-700 mb-6 text-base animate-fade-in text-center">
          Click on a word from the list to see its image and hear its pronunciation.
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left side - Current Image */}
          <div className="md:col-span-2">
            <LessonCard className="w-full aspect-video flex items-center justify-center p-4">
              <img 
                src={currentWord.image} 
                alt={currentWord.word}
                className="max-w-full max-h-full object-contain"
              />
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

        <audio ref={audioRef} />
      </div>
    </LessonLayout>
  );
};

export default VocabExplorer;
