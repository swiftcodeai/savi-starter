import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import PageHeader from "@/components/PageHeader";
import FloatingElements from "@/components/FloatingElements";
import { Lock, Check } from "lucide-react";

type LessonStatus = "locked" | "unlocked" | "completed";

interface Lesson {
  key: string;
  name: string;
  status: LessonStatus;
}

const lessons: Lesson[] = [
  {
    key: "u1l1",
    name: "U1-L1 – Greeting Explorers",
    status: "unlocked",
  },
  {
    key: "u1l2",
    name: "U1-L2 – Counting Explorers",
    status: "locked",
  },
  {
    key: "u1l3",
    name: "U1-L3 – Memory and Language Lab",
    status: "locked",
  },
];

// Demo lesson images
const lessonImgs = ["/menu-images/Greetings & Communication.png"];

const UnitSelector = () => {
  const navigate = useNavigate();

  const handleCardHover = (status: LessonStatus) => {
    // No audio handling needed
  };

  const handleStartLesson = () => {
    navigate("/skills");
  };

  const handleBack = () => {
    navigate("/courses");
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col items-center overflow-x-hidden pb-6">
      <FloatingElements />
      {/* BG Clouds for border */}
      <div className="absolute top-0 left-0 w-full h-20 bg-savi-yellow opacity-10 rounded-b-full z-0"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-savi-pink opacity-10 rounded-t-full z-0"></div>
      <div className="w-full max-w-3xl z-10 mt-8 px-2 flex flex-col items-center">
        <PageHeader title="Choose a Lesson" subtitle="Meet and Greet Adventures" />
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-savi-blue font-bold mt-0 mb-4 px-4 py-2 rounded-full bg-white/80 hover:bg-savi-blue/10 transition hover:underline"
        >
          <span className="text-xl">&#8592;</span> Back to Themes
        </button>
        <div className="mb-5 text-center text-gray-600 font-medium max-w-lg">
          Swipe or scroll to choose a lesson from this unit!
        </div>
        {/* Carousel */}
        <div className="w-full mt-0">
          <Carousel className="relative w-full max-w-2xl mx-auto" opts={{
            align: "center",
            loop: true,
          }}>
            <CarouselContent className="p-4">
              {lessons.map((lesson, idx) => {
                // Card status helpers
                const isLocked = lesson.status === "locked";
                const isCompleted = lesson.status === "completed";
                const isUnlocked = lesson.status === "unlocked";
                return (
                  <CarouselItem key={lesson.key} className="basis-full md:basis-[85%] cursor-grab active:cursor-grabbing">
                    <div
                      onMouseEnter={() => handleCardHover(lesson.status)}
                      className={`
                        group relative bg-white/80 border-4 rounded-2xl overflow-hidden shadow-xl flex flex-col items-center transition-all duration-500 
                        ${isUnlocked || isCompleted ? "cursor-pointer hover:scale-102 active:scale-98 ring-2 ring-savi-blue" : "pointer-events-none select-none"}
                        ${isLocked ? "opacity-70 grayscale blur-[1.2px]" : ""}
                        ${isCompleted ? "ring-2 ring-savi-green" : ""}
                        animate-fade-in
                      `}
                      style={{animationDelay:`${idx * 50}ms`}}
                      tabIndex={isUnlocked ? 0 : -1}
                      aria-disabled={isLocked}
                    >
                      <div className="w-full h-52 sm:h-64 p-4 flex items-center justify-center">
                      <img
                          src={lessonImgs[0]}
                        alt={lesson.name}
                          className="w-full h-full object-contain transition-all group-hover:scale-105 duration-500"
                        draggable={false}
                      />
                      </div>
                      {/* Title */}
                      <div className="px-5 py-3 w-full flex flex-col items-center gap-1">
                        <div className={`font-extrabold text-lg sm:text-xl text-savi-blue ${isLocked ? 'opacity-80' : ''}`}>
                          {lesson.name}
                        </div>
                        {/* Status / Badge */}
                        <div className="flex items-center gap-2 justify-center mt-2">
                          {isLocked && (
                            <span className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-full">
                              <Lock className="w-4 h-4 text-gray-400" /> Locked
                            </span>
                          )}
                          {isCompleted && (
                            <span className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full text-savi-green">
                              <Check className="w-4 h-4" /> Completed
                            </span>
                          )}
                          {isUnlocked && (
                            <span className="flex items-center gap-1 bg-savi-blue/10 text-savi-blue px-2 py-1 rounded-full">
                              Unlocked
                            </span>
                          )}
                        </div>
                        {/* Start Button */}
                        {isUnlocked && (
                          <button
                            onClick={handleStartLesson}
                            className="mt-4 px-5 py-2 bg-savi-blue text-white font-semibold rounded-full shadow hover:bg-blue-600 transition-all text-base"
                          >
                            Start Lesson
                          </button>
                        )}
                      </div>
                      {/* Overlay lock (visual, not interactive) */}
                      {isLocked && (
                        <div className="absolute top-4 right-4 bg-white/70 rounded-full p-2 z-20 flex items-center justify-center shadow-lg">
                          <Lock className="h-7 w-7 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 bg-white/80 hover:bg-white" />
            <CarouselNext className="hidden md:flex -right-4 bg-white/80 hover:bg-white" />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default UnitSelector;
