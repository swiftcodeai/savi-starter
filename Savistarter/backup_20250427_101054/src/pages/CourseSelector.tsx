import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import CourseThemeCard from "@/components/CourseThemeCard";
import PageHeader from "@/components/PageHeader";
import FloatingElements from "@/components/FloatingElements";

type CourseStatus = "active" | "locked";
interface CourseTheme {
  key: string;
  title: string;
  description: string;
  image: string;
  status: CourseStatus;
}

const courseThemes: CourseTheme[] = [
  {
    key: "meet-and-greet",
    title: "Greetings & Communication",
    description: "Say hello, make friends, and explore how to introduce yourself!",
    image: "/menu-images/Greetings & Communication.png",
    status: "active",
  },
  {
    key: "classroom-adventures",
    title: "Classroom Adventures",
    description: "Learn all about school, classroom objects and educational activities.",
    image: "/menu-images/Classroom Adventures.png",
    status: "locked",
  },
  {
    key: "color-splash",
    title: "Color Splash World",
    description: "Explore colors, shapes, and creative art vocabulary!",
    image: "/menu-images/Color Splash World.png",
    status: "locked",
  },
  {
    key: "toyland",
    title: "Toyland Treasures",
    description: "Discover your favorite toys by name and learn playful words.",
    image: "/menu-images/Toyland Treasures.png",
    status: "locked",
  },
  {
    key: "home-sweet-home",
    title: "Home Sweet Home",
    description: "Explore vocabulary for everyday life and things around the house.",
    image: "/menu-images/Home Sweet Home Adventures.png",
    status: "locked",
  },
  {
    key: "body-explorers",
    title: "Body Explorers",
    description: "Learn about body parts, health, and how our bodies work.",
    image: "/menu-images/Body Explorers.png",
    status: "locked",
  },
  {
    key: "city-life",
    title: "City Life",
    description: "Explore buildings, city vocabulary, and community places!",
    image: "/menu-images/City Life.png",
    status: "locked",
  },
  {
    key: "water-world",
    title: "Water World",
    description: "Dive into water activities, swimming, and ocean vocabulary.",
    image: "/menu-images/Color Splash World.png",
    status: "locked",
  },
];

const hoverSoundUrl = "https://assets.mixkit.co/active_storage/sfx/2996/2996-preview.mp3";
const clickSoundUrl = "https://assets.mixkit.co/active_storage/sfx/3512/3512-preview.mp3";

const CourseSelector = () => {
  const navigate = useNavigate();
  const hoverAudioRef = useRef<HTMLAudioElement>(null);
  const clickAudioRef = useRef<HTMLAudioElement>(null);

  const handleActiveClick = () => {
    if (clickAudioRef.current) clickAudioRef.current.play();
    navigate("/units");
  };

  const handleCardHover = (status: CourseStatus) => {
    if (status === "active" && hoverAudioRef.current) {
      hoverAudioRef.current.currentTime = 0;
      hoverAudioRef.current.play();
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col items-center overflow-x-hidden">
      <FloatingElements />
      <div className="absolute top-0 left-0 w-full h-20 bg-savi-yellow opacity-10 rounded-b-full z-0"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-savi-pink opacity-10 rounded-t-full z-0"></div>
      
      <audio ref={hoverAudioRef} src={hoverSoundUrl} preload="auto" />
      <audio ref={clickAudioRef} src={clickSoundUrl} preload="auto" />

      <div className="w-full max-w-6xl z-10 mt-8 px-2 flex flex-col items-center">
        <PageHeader title="Choose Your Adventure" />
        <div className="mt-2 mb-8 text-center text-gray-600 font-medium max-w-xl">
          Pick a theme to start your English journey! More adventures coming soon.
        </div>
        {/* Responsive Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7 md:gap-9 py-4">
          {courseThemes.map((theme, idx) => (
            <CourseThemeCard
              key={theme.key}
              title={theme.title}
              description={theme.description}
              image={theme.image}
              status={theme.status}
              onClick={theme.status === "active" ? handleActiveClick : undefined}
              onHover={() => handleCardHover(theme.status)}
              delay={idx * 70}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseSelector;
