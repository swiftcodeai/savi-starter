import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CourseTheme {
  key: string;
  title: string;
  description: string;
  image: string;
  skills: string[];
}

interface CourseContextType {
  currentCourse: CourseTheme | null;
  setCurrentCourse: (course: CourseTheme | null) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const courseData: CourseTheme[] = [
  {
    key: "meet-and-greet",
    title: "Greetings & Communication",
    description: "Say hello, make friends, and explore how to introduce yourself!",
    image: "/menu-images/Greetings & Communication.png",
    skills: ["Greetings", "Basic Communication", "Introductions", "Friendly Expressions"]
  },
  {
    key: "classroom-adventures",
    title: "Classroom Adventures",
    description: "Learn all about school, classroom objects and educational activities.",
    image: "/menu-images/Classroom Adventures.png",
    skills: ["School Vocabulary", "Classroom Objects", "Numbers", "Basic Commands"]
  },
  // Add other courses with their specific skills...
];

export function CourseProvider({ children }: { children: ReactNode }) {
  const [currentCourse, setCurrentCourse] = useState<CourseTheme | null>(null);

  return (
    <CourseContext.Provider value={{ currentCourse, setCurrentCourse }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
} 