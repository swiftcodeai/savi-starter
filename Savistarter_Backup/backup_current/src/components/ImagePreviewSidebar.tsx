
import React from "react";
import { cn } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/constants/images";

interface VocabItem {
  key: string;
  word: string;
  image: string;
  audio?: string; // Make audio optional
}

interface Props {
  vocabList: VocabItem[];
  currentIndex: number;
  previewIndices: number[];
  onSelect: (idx: number) => void;
}

const ImagePreviewSidebar: React.FC<Props> = ({
  vocabList,
  currentIndex,
  previewIndices,
  onSelect,
}) => {
  return (
    <div className="flex flex-col items-center gap-2 px-2 py-3 h-full justify-center w-[80px]">
      {previewIndices.map((idx) => (
        <button
          key={vocabList[idx].key}
          tabIndex={0}
          className={cn(
            "w-14 h-14 rounded-lg overflow-hidden border-2 shadow transition-all hover:scale-105 focus:outline-none flex-shrink-0 bg-white",
            idx === currentIndex
              ? "border-savi-blue ring-2 ring-savi-blue"
              : "border-gray-200 opacity-70"
          )}
          aria-current={idx === currentIndex}
          onClick={() => onSelect(idx)}
        >
          <img
            src={vocabList[idx].image}
            alt={vocabList[idx].word}
            className="w-full h-full object-contain pointer-events-none"
            draggable={false}
          />
        </button>
      ))}
    </div>
  );
};

export default ImagePreviewSidebar;
