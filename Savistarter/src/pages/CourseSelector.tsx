import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import CourseThemeCard from "@/components/CourseThemeCard";
import PageHeader from "@/components/PageHeader";
import FloatingElements from "@/components/FloatingElements";
import { courseData } from "@/contexts/CourseContext";
import { useCourse } from "@/contexts/CourseContext";

type CourseStatus = "active" | "locked";

const hoverSoundUrl = "/audio/effects/hover.webm";
const clickSoundUrl = "/audio/effects/click.webm";

const CourseSelector = () => {
  const navigate = useNavigate();
  const hoverAudioRef = useRef<HTMLAudioElement>(null);
  const clickAudioRef = useRef<HTMLAudioElement>(null);
  const { setCurrentCourse } = useCourse();

  const handleActiveClick = (course: typeof courseData[0]) => {
    if (clickAudioRef.current) clickAudioRef.current.play();
    setCurrentCourse(course);
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
          {courseData.map((course, idx) => (
            <CourseThemeCard
              key={course.key}
              title={course.title}
              description={course.description}
              image={course.image}
              status={course.key === "meet-and-greet" ? "active" : "locked"}
              onClick={() => course.key === "meet-and-greet" ? handleActiveClick(course) : undefined}
              onHover={() => handleCardHover(course.key === "meet-and-greet" ? "active" : "locked")}
              delay={idx * 70}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseSelector;
