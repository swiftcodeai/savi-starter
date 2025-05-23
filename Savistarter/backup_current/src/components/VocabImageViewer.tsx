
import React, { useState } from "react";
import ImagePreviewSidebar from "./ImagePreviewSidebar";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/constants/images";

export interface VocabItem {
  key: string;
  word: string;
  image: string;
  audio?: string; // Make audio optional to match external usages
}

interface Props {
  vocabList: VocabItem[];
}

const VocabImageViewer: React.FC<Props> = ({ vocabList }) => {
  const [index, setIndex] = useState(0);
  const [anim, setAnim] = useState<"none" | "next" | "prev">("none");

  // Animate main image on change (zoom-pop)
  React.useEffect(() => {
    if (anim !== "none") {
      const timeout = setTimeout(() => setAnim("none"), 380);
      return () => clearTimeout(timeout);
    }
  }, [anim]);

  function prev() {
    setAnim("prev");
    setIndex(i => (i === 0 ? vocabList.length - 1 : i - 1));
  }

  function next() {
    setAnim("next");
    setIndex(i => (i === vocabList.length - 1 ? 0 : i + 1));
  }

  function goTo(idx: number) {
    setAnim(idx > index ? "next" : "prev");
    setIndex(idx);
  }

  // Thumbnail indices: current, +1, -1 (with wrap)
  function previewIndices() {
    const total = vocabList.length;
    if (total < 3) return [0, 1, 2].map(i => i % total);
    const prev = (index - 1 + total) % total;
    const curr = index;
    const nextIdx = (index + 1) % total;
    return [prev, curr, nextIdx];
  }

  return (
    <div className="flex w-full h-full relative select-none">
      <div className="w-0 sm:w-[30%] h-full flex items-center">
        <div className="hidden sm:flex w-full h-full items-center">
          <ImagePreviewSidebar
            vocabList={vocabList}
            currentIndex={index}
            previewIndices={previewIndices()}
            onSelect={goTo}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
        <div
          className={[
            "flex flex-col items-center justify-center h-full w-full transition-transform duration-300",
            anim === "next"
              ? "animate-[scale-in_0.38s_cubic-bezier(0.5,1.65,0.4,1)_both]"
              : anim === "prev"
              ? "animate-[scale-in_0.38s_cubic-bezier(0.5,1.65,0.4,1)_reverse_both]"
              : "",
          ].join(" ")}
        >
          <img
            src={vocabList[index].image}
            alt={vocabList[index].word}
            className="w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] object-contain bg-white rounded-xl shadow-xl border-2 transition-all duration-300"
            draggable={false}
            style={{ userSelect: "none" }}
          />
          <div className="mt-4 text-2xl sm:text-3xl font-semibold text-savi-blue animate-fade-in shadow-sm">
            {vocabList[index].word}
          </div>
        </div>

        <div className="mt-5 w-full flex flex-col items-center">
          <div className="flex items-center gap-7">
            <button
              aria-label="Previous"
              className="text-savi-blue bg-white shadow rounded-full p-2 hover:bg-savi-blue/10 transition hover:scale-105 active:scale-95"
              onClick={prev}
            >
              <ArrowLeft size={28} />
            </button>
            <button
              aria-label="Next"
              className="text-savi-blue bg-white shadow rounded-full p-2 hover:bg-savi-blue/10 transition hover:scale-105 active:scale-95"
              onClick={next}
            >
              <ArrowRight size={28} />
            </button>
          </div>
        </div>
      </div>

      <div className="sm:hidden w-[90px] flex items-center">
        <ImagePreviewSidebar
          vocabList={vocabList}
          currentIndex={index}
          previewIndices={previewIndices()}
          onSelect={goTo}
        />
      </div>
    </div>
  );
};

export default VocabImageViewer;
