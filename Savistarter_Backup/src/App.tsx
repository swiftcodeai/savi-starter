import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CourseProvider } from "@/contexts/CourseContext";
import LessonNav from "@/components/LessonNav";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import CourseSelector from "./pages/CourseSelector";
import UnitSelector from "./pages/UnitSelector";
import SkillsMenu from "./pages/SkillsMenu";
import U1L2ImageToWord from "./pages/1.2.1";
import Lesson1_2_2 from "./pages/1.2.2";
import VocabLesson from "./pages/1.1";
import ChildrenTickingHotspots from "./pages/2.1";
import StoryReader from "./pages/2.2";
import SentenceCompletion from "./pages/2.3";
import InteractiveVocab from "./pages/2.4";
import VocabImageGallery from "./pages/2.5";
import ImageSelectionMenu from "./pages/3.0";
import DrawingCanvas from "./pages/3.1";
import WordSpellingGame from "./pages/3.2";
import WordImageMatch from "./pages/3.3";
import ListeningGame from "./pages/4.1";
import StoryPage from "./pages/4.2";
import StoryPageTwo from "./pages/4.3";
import SingingPage from "./pages/5.0";
import Page60 from "./pages/6.0";

export const LessonSequence: { [key: string]: string } = {
  "INDEX": "/",
  "LOGIN": "/login",
  "COURSES": "/courses",
  "UNITS": "/units",
  "SKILLS": "/skills",
  "1.1": "/1.1",
  "1.2.1": "/1.2.1",
  "1.2.2": "/1.2.2",
  "2.1": "/2.1",
  "2.2": "/2.2",
  "2.3": "/2.3",
  "2.4": "/2.4",
  "2.5": "/2.5",
  "3.0": "/3.0",
  "3.1": "/3.1",
  "3.2": "/3.2",
  "3.3": "/3.3",
  "4.1": "/4.1",
  "4.2": "/4.2",
  "4.3": "/4.3",
  "5.0": "/5.0",
  "6.0": "/6.0",
};

// Get next and previous paths based on current path
const getNavPaths = (currentPath: string) => {
  const paths = Object.values(LessonSequence);
  const currentIndex = paths.indexOf(currentPath);
  
  // Only return navigation for lesson pages (not menu pages)
  if (currentPath === "/" || currentPath === "/login" || currentPath === "/courses" || 
      currentPath === "/units" || currentPath === "/skills") {
    return { prevPath: undefined, nextPath: undefined };
  }
  
  // Special case for 3.0 - skip to 3.2
  if (currentPath === LessonSequence["3.0"]) {
    return {
      prevPath: LessonSequence["2.5"],
      nextPath: LessonSequence["3.2"]
    };
  }

  // Special case for 3.2 - go back to 3.0 (skip 3.1)
  if (currentPath === LessonSequence["3.2"]) {
    return {
      prevPath: LessonSequence["3.0"],
      nextPath: LessonSequence["3.3"]
    };
  }
  
  return {
    prevPath: currentIndex > 0 ? paths[currentIndex - 1] : undefined,
    nextPath: currentIndex < paths.length - 1 ? paths[currentIndex + 1] : undefined,
  };
};

// Layout component that includes the navigation
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { prevPath, nextPath } = getNavPaths(location.pathname);
  
  // Hide nav bar for home, login, courses, units, and skills pages
  const hideNavPaths = ['/', '/login', '/courses', '/units', '/skills'];
  const shouldShowNav = !hideNavPaths.includes(location.pathname);
  
  return (
    <>
      {children}
      {shouldShowNav && (
        <LessonNav
          prevPath={prevPath}
          nextPath={nextPath}
        />
      )}
    </>
  );
};

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CourseProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path={LessonSequence.INDEX} element={<Index />} />
                <Route path={LessonSequence.LOGIN} element={<Login />} />
                <Route path={LessonSequence.COURSES} element={<CourseSelector />} />
                <Route path={LessonSequence.UNITS} element={<UnitSelector />} />
                <Route path={LessonSequence.SKILLS} element={<SkillsMenu />} />
                
                <Route path={LessonSequence["1.1"]} element={<VocabLesson />} />
                <Route path={LessonSequence["1.2.1"]} element={<U1L2ImageToWord />} />
                <Route path={LessonSequence["1.2.2"]} element={<Lesson1_2_2 />} />
                
                <Route path={LessonSequence["2.1"]} element={<ChildrenTickingHotspots />} />
                <Route path={LessonSequence["2.2"]} element={<StoryReader />} />
                <Route path={LessonSequence["2.3"]} element={<SentenceCompletion />} />
                <Route path={LessonSequence["2.4"]} element={<InteractiveVocab />} />
                <Route path={LessonSequence["2.5"]} element={<VocabImageGallery />} />
                
                <Route path={LessonSequence["3.0"]} element={<ImageSelectionMenu />} />
                <Route path={LessonSequence["3.1"]} element={<DrawingCanvas />} />
                <Route path={LessonSequence["3.2"]} element={<WordSpellingGame />} />
                <Route path={LessonSequence["3.3"]} element={<WordImageMatch />} />
                
                <Route path={LessonSequence["4.1"]} element={<ListeningGame />} />
                <Route path={LessonSequence["4.2"]} element={<StoryPage />} />
                <Route path={LessonSequence["4.3"]} element={<StoryPageTwo />} />
                <Route path={LessonSequence["5.0"]} element={<SingingPage />} />
                <Route path={LessonSequence["6.0"]} element={<Page60 />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </CourseProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
