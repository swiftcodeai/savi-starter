import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/constants/images";
import { LessonSequence } from "@/App";
import { useNavigate } from "react-router-dom";
import LessonLayout from "@/components/LessonLayout";
import LessonInstructionsPopup from '@/components/LessonInstructionsPopup';

const BIG_IMAGE = "/vocab-images/2.1 main image.png";

const VOCAB_ITEMS = [
  { id: 1, word: "Zero", image: "/vocab-images/zero.png", position: { top: "70%", left: "30%" } },
  { id: 2, word: "One", image: "/vocab-images/one.png", position: { top: "35%", left: "55%" } },
  { id: 3, word: "Two", image: "/vocab-images/two.png", position: { top: "60%", left: "25%" } },
  { id: 4, word: "Three", image: "/vocab-images/three.png", position: { top: "65%", left: "45%" } },
  { id: 5, word: "Four", image: "/vocab-images/four.png", position: { top: "80%", left: "30%" } },
  { id: 6, word: "Five", image: "/vocab-images/five.png", position: { top: "75%", left: "70%" } },
  { id: 7, word: "Six", image: "/vocab-images/six.png", position: { top: "55%", left: "75%" } },
  { id: 8, word: "Hi", image: "/vocab-images/hi.png", position: { top: "25%", left: "70%" } },
  { id: 9, word: "Hello", image: "/vocab-images/hello.png", position: { top: "15%", left: "45%" } },
  { id: 10, word: "Felix", image: "/vocab-images/felix.png", position: { top: "40%", left: "80%" } },
  { id: 11, word: "Ola", image: "/vocab-images/ola.png", position: { top: "30%", left: "65%" } },
  { id: 12, word: "Ms Fine", image: "/vocab-images/ms fine full body.png", position: { top: "26%", left: "27%" }, size: "w-44" }
];

const transitionDuration = 0.6;

const ChildrenTickingHotspots = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [tickeds, setTickeds] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const rightRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [animationPositions, setAnimationPositions] = useState<{ left: number; top: number } | null>(null);
  const [movingImage, setMovingImage] = useState<{ id: number; src: string } | null>(null);

  useEffect(() => {
    if (activeId !== null) {
      const target = rightRefs.current[activeId];
      const container = containerRef.current;
      if (target && container) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        setAnimationPositions({
          left: targetRect.left - containerRect.left,
          top: targetRect.top - containerRect.top,
        });
        const vocab = VOCAB_ITEMS.find((v) => v.id === activeId);
        if (vocab) {
          setMovingImage({ id: activeId, src: vocab.image });
        }
      }
      const timer = setTimeout(() => {
        setTickeds((prev) => new Set(prev).add(activeId));
        setActiveId(null);
        setMovingImage(null);
        setAnimationPositions(null);
      }, transitionDuration * 1000);
      return () => clearTimeout(timer);
    }
  }, [activeId]);

  const handleSmallImageClick = (id: number) => {
    if (tickeds.has(id)) return;
    setActiveId(id);
  };

  return (
    <LessonLayout
      title="Find and Click"
      subtitle="Click on the highlighted areas to learn"
      className="max-w-6xl mx-auto"
    >
      <LessonInstructionsPopup
        lessonId="2.1"
        title="Interactive Image Explorer"
        instructions={
          <div>
            <p>Welcome to the interactive image lesson! Here's how to explore:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Look for glowing spots on the image</li>
              <li>Click on each highlighted area to discover new words</li>
              <li>Listen to the pronunciation when available</li>
              <li>Try to remember where each word appears in the image</li>
              <li>Make sure to find all the interactive spots!</li>
            </ul>
            <p className="mt-4 text-gray-500 italic">Tip: Take your time to explore each area carefully - there might be surprises!</p>
          </div>
        }
      />
      <div ref={containerRef} className="flex flex-1 gap-4 max-w-6xl mx-auto w-full">
        <div className="relative flex-1 rounded-xl overflow-hidden border-2 border-gray-300 shadow-lg bg-white h-[480px] select-none">
          <img
            src={BIG_IMAGE}
            alt="Big background"
            className="w-full h-full object-cover"
            draggable={false}
          />
          {VOCAB_ITEMS.map(({ id, image, position, size }) => {
            const isTicked = tickeds.has(id);
            const isActive = id === activeId;
            return (
              <button
                key={id}
                onClick={() => handleSmallImageClick(id)}
                aria-pressed={isTicked}
                disabled={isTicked}
                className={`absolute hover:scale-110 active:scale-90 transition-transform duration-300 p-0.5 aspect-square ${size || 'w-16'} flex items-center justify-center cursor-pointer select-none ${
                  isTicked ? "opacity-40 cursor-default grayscale" : ""
                }`}
                style={{ top: position.top, left: position.left, transformOrigin: "center" }}
                type="button"
                title={VOCAB_ITEMS.find(v => v.id === id)?.word || ""}
              >
                <img
                  src={image}
                  alt={`Hotspot ${id}`}
                  className={`w-full h-full object-contain ${isActive ? "animate-pulse" : ""}`}
                  draggable={false}
                />
              </button>
            );
          })}
          <AnimatePresence>
            {movingImage && animationPositions && (
              <motion.img
                key={movingImage.id}
                src={movingImage.src}
                alt="Moving vocab"
                className={`absolute ${VOCAB_ITEMS.find(v => v.id === movingImage.id)?.size || 'w-16'} h-auto pointer-events-none`}
                initial={{
                  top: VOCAB_ITEMS.find(v => v.id === movingImage.id)?.position.top,
                  left: VOCAB_ITEMS.find(v => v.id === movingImage.id)?.position.left,
                  opacity: 1,
                  scale: 1,
                  position: "absolute",
                }}
                animate={{
                  top: animationPositions.top,
                  left: animationPositions.left,
                  opacity: 0,
                  scale: 0.3,
                  transition: { duration: transitionDuration },
                }}
                exit={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col w-64 overflow-y-auto max-h-[480px] bg-white rounded-xl border-2 border-gray-300 shadow-lg p-4 space-y-3 select-none">
          {VOCAB_ITEMS.map(({ id, word, image }) => (
            <div
              key={id}
              ref={(el) => (rightRefs.current[id] = el)}
              className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-savi-blue/20 transition cursor-default"
            >
              <img
                src={image}
                alt={word}
                draggable={false}
                className="w-12 h-12 rounded-full"
              />
              <span className="font-semibold text-gray-700">{word}</span>
              {tickeds.has(id) && <Check className="ml-auto text-savi-green" size={18} />}
            </div>
          ))}
        </div>
      </div>
    </LessonLayout>
  );
};

export default ChildrenTickingHotspots;
