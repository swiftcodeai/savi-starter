import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { cn } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/constants/images";
import LessonLayout from "@/components/LessonLayout";
import LessonCard from "@/components/dragndrop/LessonCard";
import { LessonSequence } from "@/App";
import confetti from 'canvas-confetti';
import '@/styles/animations.css';
import LessonInstructionsPopup from '@/components/LessonInstructionsPopup';
import LessonNav from '@/components/LessonNav';

// Full vocab list, 12 items:
const ALL_VOCAB = [
  { id: 1, word: "zero", image: "/vocab-images/zero.png" },
  { id: 2, word: "one", image: "/vocab-images/one.png" },
  { id: 3, word: "two", image: "/vocab-images/two.png" },
  { id: 4, word: "three", image: "/vocab-images/three.png" },
  { id: 5, word: "four", image: "/vocab-images/four.png" },
  { id: 6, word: "five", image: "/vocab-images/five.png" },
  { id: 7, word: "six", image: "/vocab-images/six.png" },
  { id: 8, word: "hi", image: "/vocab-images/hi.png" },
  { id: 9, word: "hello", image: "/vocab-images/hello.png" },
  { id: 10, word: "Felix", image: "/vocab-images/felix.png" },
  { id: 11, word: "Ola", image: "/vocab-images/ola.png" },
  { id: 12, word: "Ms Fine", image: "/vocab-images/msfine.png" },
];

// 12 sentences, 1 per vocab word:
const SENTENCES = [
  { id: 1, text: "The first number is __________.", answer: "zero" },
  { id: 2, text: "After zero comes __________.", answer: "one" },
  { id: 3, text: "One plus one is __________.", answer: "two" },
  { id: 4, text: "After two comes __________.", answer: "three" },
  { id: 5, text: "Two plus two is __________.", answer: "four" },
  { id: 6, text: "After four comes __________.", answer: "five" },
  { id: 7, text: "Five plus one is __________.", answer: "six" },
  { id: 8, text: "__________ is a friendly greeting.", answer: "hi" },
  { id: 9, text: "Another way to greet is __________.", answer: "hello" },
  { id: 10, text: "__________ is the boy in our story.", answer: "Felix" },
  { id: 11, text: "__________ is Felix's friend.", answer: "Ola" },
  { id: 12, text: "__________ is the teacher.", answer: "Ms Fine" },
];

const ItemTypes = { VOCAB: "vocab" };

const ITEMS_PER_SET = 4; // Show 4 items at a time

const VocabImage = ({ item, isMatched }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.VOCAB,
    item: { id: item.id, word: item.word },
    canDrag: !isMatched,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={cn(
        "w-40 h-48 bg-[#fae6b0] rounded-xl border-4 border-[#f9da8d] shadow-lg p-3 relative transition-all transform",
        isDragging ? "opacity-50 scale-105" : "opacity-100",
        isMatched ? "opacity-50 scale-95" : "",
        !isMatched && "hover:scale-105",
        "cursor-grab active:cursor-grabbing"
      )}
      tabIndex={0}
    >
      {/* Corner accents */}
      <div className="absolute -top-1 -left-1 w-4 h-4 bg-white rounded-full opacity-80"></div>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full opacity-80"></div>
      <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-white rounded-full opacity-80"></div>
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full opacity-80"></div>

      <div className="relative h-full w-full mx-auto">
        <img
          src={item.image}
          alt={item.word}
          className="w-full h-full object-contain rounded-t-lg"
          draggable={false}
        />
      </div>
    </div>
  );
};

const Blank = ({ sentenceId, word, onDrop, isCorrect }) => {
  const [showEffect, setShowEffect] = useState(false);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.VOCAB,
    drop: (item: { id: number; word: string }) => {
      onDrop(sentenceId, item.word);
      setShowEffect(true);
      setTimeout(() => setShowEffect(false), 1000);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <span
      ref={drop}
      className={cn(
        "inline-block min-w-[120px] px-4 py-2 mx-2 border-4 rounded-xl transition-all duration-300",
        isOver ? "bg-[#fae6b0] border-[#f9da8d] scale-105" : "bg-gray-50",
        word ? (
          isCorrect 
            ? "border-green-500 bg-green-50" 
            : "border-red-500 bg-red-50"
        ) : "border-[#f9da8d]",
        showEffect && (isCorrect ? "animate-success" : "animate-error")
      )}
    >
      {word || "___________"}
    </span>
  );
};

const InteractiveVocab = () => {
  const [currentSet, setCurrentSet] = useState(0);
  const [answers, setAnswers] = useState<{ [sentenceId: number]: string | undefined }>({});
  const [correctCount, setCorrectCount] = useState(0);
  const [isPenActive, setIsPenActive] = useState(false);

  // Get current set of vocab and sentences
  const startIdx = currentSet * ITEMS_PER_SET;
  const currentVocab = ALL_VOCAB.slice(startIdx, startIdx + ITEMS_PER_SET);
  const currentSentences = SENTENCES.slice(startIdx, startIdx + ITEMS_PER_SET);
  const matchedWords = Object.values(answers).filter(Boolean);

  // Check if current set is complete
  const isCurrentSetComplete = currentSentences.every(
    sentence => answers[sentence.id] === sentence.answer
  );

  // Auto-advance to next set when current set is complete
  useEffect(() => {
    if (isCurrentSetComplete && currentSet < Math.floor(ALL_VOCAB.length / ITEMS_PER_SET)) {
      const timer = setTimeout(() => {
        setCurrentSet(prev => prev + 1);
      }, 1500); // Wait 1.5 seconds before advancing
      return () => clearTimeout(timer);
    }
  }, [isCurrentSetComplete, currentSet]);

  const handleDrop = (sentenceId, word) => {
    const sentence = SENTENCES.find(s => s.id === sentenceId);
    const isCorrect = sentence?.answer === word;
    
    setAnswers(prev => ({ ...prev, [sentenceId]: word }));
    
    if (isCorrect) {
      const audio = new Audio('/audio/correct.mp3');
      audio.play();
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setCorrectCount(prev => prev + 1);
    } else {
      const audio = new Audio('/audio/wrong.mp3');
      audio.play();
    }
  };

  const handleRestart = () => {
    setCurrentSet(0);
    setAnswers({});
    setCorrectCount(0);
  };

  return (
    <LessonLayout
      title="Interactive Vocabulary"
      subtitle="Learn and practice new words"
      className="max-w-6xl mx-auto"
    >
      <LessonInstructionsPopup
        lessonId="2.4"
        title="Interactive Vocabulary Practice"
        instructions={
          <div>
            <p>Welcome to interactive vocabulary practice! Here's what you can do:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Interact with each vocabulary word</li>
              <li>Listen to the correct pronunciation</li>
              <li>Practice saying the words out loud</li>
              <li>Match words with their meanings</li>
              <li>Complete the exercises to test your knowledge</li>
            </ul>
            <p className="mt-4 text-gray-500 italic">Tip: Use the audio feature to perfect your pronunciation!</p>
          </div>
        }
      />
      <DndProvider backend={HTML5Backend}>
        <div className="w-full max-w-7xl mx-auto px-4 pb-20">
          <LessonCard className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left side - Sentences */}
              <div className="space-y-8">
                <div className="text-2xl font-extrabold text-cyan-500 mb-6">
                  Fill in the blanks with the correct words
                </div>
                {currentSentences.map((sentence) => (
                  <div key={sentence.id} className="text-xl text-cyan-600">
                    {sentence.text.split("__________").map((part, index, array) => (
                      <React.Fragment key={index}>
                        {part}
                        {index < array.length - 1 && (
                          <Blank
                            sentenceId={sentence.id}
                            word={answers[sentence.id]}
                            onDrop={handleDrop}
                            isCorrect={answers[sentence.id] === sentence.answer}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                ))}
              </div>

              {/* Right side - Vocab images */}
              <div className="grid grid-cols-2 gap-6 content-start">
                {currentVocab.map((item) => (
                  <VocabImage
                    key={item.id}
                    item={item}
                    isMatched={matchedWords.includes(item.word)}
                  />
                ))}
              </div>
            </div>
          </LessonCard>
        </div>
      </DndProvider>
      <LessonNav
        prevPath={LessonSequence["2.3"]}
        nextPath={LessonSequence["2.5"]}
        onRestart={handleRestart}
        isPenActive={isPenActive}
        onPenToggle={() => setIsPenActive(!isPenActive)}
      />
    </LessonLayout>
  );
};

export default InteractiveVocab;

