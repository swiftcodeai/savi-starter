import React from "react";
import LessonLayout from "@/components/LessonLayout";
import { LessonSequence } from "@/App";
import LessonCard from "@/components/dragndrop/LessonCard";
import { FaVolumeUp } from "react-icons/fa";
import LessonInstructionsPopup from '@/components/LessonInstructionsPopup';
import { cn } from "@/lib/utils";
import { useCourse } from "@/contexts/CourseContext";

// Custom card component to match 1.1 style
const StyledCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
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

const VOCAB_ITEMS = [
  {
    id: 1,
    word: "zero",
    image: "/vocab-images/zero.png",
    audio: "/audio/words/zero.webm",
    description: "The number that comes before one. It means nothing or none."
  },
  {
    id: 2,
    word: "one",
    image: "/vocab-images/one.png",
    audio: "/audio/words/one.webm",
    description: "The first number when counting. It represents a single thing."
  },
  {
    id: 3,
    word: "two",
    image: "/vocab-images/two.png",
    audio: "/audio/words/two.webm",
    description: "The number after one. It means a pair or double."
  },
  {
    id: 4,
    word: "three",
    image: "/vocab-images/three.png",
    audio: "/audio/words/three.webm",
    description: "The number after two. It's like a triangle's corners."
  },
  {
    id: 5,
    word: "four",
    image: "/vocab-images/four.png",
    audio: "/audio/words/four.webm",
    description: "The number after three. Like the sides of a square."
  },
  {
    id: 6,
    word: "five",
    image: "/vocab-images/five.png",
    audio: "/audio/words/five.webm",
    description: "The number after four. Like fingers on one hand."
  },
  {
    id: 7,
    word: "six",
    image: "/vocab-images/six.png",
    audio: "/audio/words/six.webm",
    description: "The number after five. Two times three equals six."
  },
  {
    id: 8,
    word: "hi",
    image: "/vocab-images/hi.png",
    audio: "/audio/words/hi.webm",
    description: "A friendly way to greet someone. It's short and casual."
  },
  {
    id: 9,
    word: "hello",
    image: "/vocab-images/hello.png",
    audio: "/audio/words/hello.webm",
    description: "Another way to greet people. It's friendly and polite."
  },
  {
    id: 10,
    word: "Felix",
    image: "/vocab-images/felix.png",
    audio: "/audio/words/felix.webm",
    description: "The boy in our story. He's friendly and likes to learn."
  },
  {
    id: 11,
    word: "Ola",
    image: "/vocab-images/ola.png",
    audio: "/audio/words/ola.webm",
    description: "Felix's friend in class. She likes to say hello."
  },
  {
    id: 12,
    word: "Ms Fine",
    image: "/vocab-images/ms fine.png",
    audio: "/audio/words/ms fine.webm",
    description: "The teacher in the story. She helps students learn numbers."
  }
];

const VocabCard = ({ item }) => {
  const playAudio = () => {
    const audio = new Audio(item.audio);
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
    });
  };
  
  return (
    <StyledCard className="transform transition-all hover:scale-105">
      <div className="relative">
          <img
            src={item.image}
            alt={item.word}
          className="w-full h-48 object-contain p-4"
        />
        <button
          onClick={playAudio}
          className="absolute top-2 right-2 p-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-colors shadow-md"
          aria-label={`Play ${item.word} pronunciation`}
          >
          <FaVolumeUp size={20} />
        </button>
          </div>
      <div className="p-4">
        <h3 className="text-2xl font-bold text-cyan-500 mb-2">{item.word}</h3>
        <p className="text-gray-600">{item.description}</p>
      </div>
    </StyledCard>
  );
};

const VocabGallery = () => {
  const { currentCourse } = useCourse();
  
  const handleRestart = () => {
    window.location.reload();
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
        nextPath={LessonSequence["3.1"]}
        prevPath={LessonSequence["2.4"]}
    >
      <LessonInstructionsPopup
        lessonId="2.5"
          title="Vocabulary Gallery"
        instructions={
          <div>
            <p>Welcome to the Vocabulary Gallery! Here's how to explore:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Browse through the collection of vocabulary cards</li>
              <li>Each card shows an image and its corresponding word</li>
              <li>Click the audio icon to hear the pronunciation</li>
              <li>Read the description to understand the word better</li>
              <li>Take time to study each word and its usage</li>
            </ul>
            <p className="mt-4 text-gray-500 italic">Tip: Try to make your own sentences using these words!</p>
          </div>
        }
      />
      <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {VOCAB_ITEMS.map((item) => (
            <VocabCard key={item.id} item={item} />
            ))}
          </div>
      </div>
    </LessonLayout>
    </div>
  );
};

export default VocabGallery;
