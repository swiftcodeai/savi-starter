import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import FloatingElements from "@/components/FloatingElements";
import SkillActivityCard from "@/components/SkillActivityCard";
import { LessonSequence } from "@/App";

const skills = [
  {
    key: "vocab",
    title: "Vocabulary",
    desc: "Learning new words",
    path: "/1.1"
  },
  {
    key: "identify",
    title: "Identify",
    desc: "Recognizing words or objects",
    path: "/2.1"
  },
  {
    key: "activities",
    title: "Activities",
    desc: "Interactive exercises",
    path: "/3.0"
  },
  {
    key: "quiz",
    title: "Knowledge Check",
    desc: "A quiz or assessment",
    path: "/4.1"
  },
  {
    key: "sing",
    title: "Sing It",
    desc: "Singing-based learning",
    path: "/5.0"
  },
  {
    key: "say",
    title: "Say It",
    desc: "Speaking-based exercises",
    path: "/6.0"
  },
];

const SkillsMenu = () => {
  const navigate = useNavigate();

  function handleSkillClick(path: string) {
    navigate(path);
  }

  function handleBack() {
    navigate(LessonSequence.UNITS);
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col items-center overflow-x-hidden pb-6">
      <FloatingElements />
      <div className="absolute top-0 left-0 w-full h-20 bg-savi-yellow opacity-10 rounded-b-full z-0"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-savi-pink opacity-10 rounded-t-full z-0"></div>
      <div className="w-full max-w-3xl z-10 mt-8 px-2 flex flex-col items-center">
        <PageHeader title="Skills Menu – U1-L1: Greeting Explorers" />
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-savi-blue font-bold mt-0 mb-4 px-4 py-2 rounded-full bg-white/80 hover:bg-savi-blue/10 transition hover:underline"
        >
          <span className="text-xl">&#8592;</span> Back to Lessons
        </button>
        <div className="mb-5 text-center text-gray-600 font-medium max-w-lg">
          Pick any skill to start exploring!
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 md:gap-9 mt-2 w-full">
          {skills.map((s) => (
            <SkillActivityCard
              key={s.key}
              title={s.title}
              desc={s.desc}
              status="unlocked"
              onClick={() => handleSkillClick(s.path)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsMenu;
