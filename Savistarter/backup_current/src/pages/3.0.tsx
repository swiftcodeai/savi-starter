import React, { useState } from "react";
import { LessonSequence } from "@/App";
import { useNavigate } from "react-router-dom";
import LessonLayout from "@/components/LessonLayout";
import LessonCard from "@/components/dragndrop/LessonCard";
import { FaChevronLeft, FaChevronRight, FaPencilAlt } from "react-icons/fa";
import LessonInstructionsPopup from '@/components/LessonInstructionsPopup';

const IMAGES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  src: `/vocab-images/${i.toString().padStart(3, '0')}.png`
}));

const ImageCarousel = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? IMAGES.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === IMAGES.length - 1 ? 0 : prevIndex + 1));
  };

  const selectForDrawing = () => {
    const selectedImage = {
      title: `Image ${currentIndex + 1}`,
      image: IMAGES[currentIndex].src
    };
    sessionStorage.setItem('selectedDrawingImage', JSON.stringify(selectedImage));
    navigate(LessonSequence["3.1"]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto h-[calc(100vh-200px)] flex items-center">
      <LessonCard className="w-full p-8 flex flex-col items-center justify-center">
        {/* Main Image Display */}
        <div className="relative w-full h-[70vh] max-h-[600px] mb-8">
          <img
            src={IMAGES[currentIndex].src}
            alt={`Image ${currentIndex}`}
            className="w-full h-full object-contain"
          />
          <button
            onClick={selectForDrawing}
            className="absolute top-4 right-4 p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-lg"
            aria-label="Select for coloring"
          >
            <FaPencilAlt size={24} />
          </button>
          
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-4 bg-white/90 hover:bg-white text-blue-600 rounded-full shadow-xl transition-all"
            aria-label="Previous image"
          >
            <FaChevronLeft size={32} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-4 bg-white/90 hover:bg-white text-blue-600 rounded-full shadow-xl transition-all"
            aria-label="Next image"
          >
            <FaChevronRight size={32} />
          </button>
        </div>

        {/* Image Counter */}
        <div className="text-center">
          <span className="text-xl text-gray-600 font-medium">
            Image {currentIndex + 1} of {IMAGES.length}
          </span>
        </div>
      </LessonCard>
    </div>
  );
};

const ImageSelectionMenu = () => {
  return (
    <LessonLayout
      title="Image Selection"
      subtitle="Choose and Learn"
      className="max-w-6xl mx-auto"
    >
      <LessonInstructionsPopup
        lessonId="3.0"
        title="Welcome to Image Selection!"
        instructions={
          <div>
            <p>Welcome to the Image Selection activity! Here's what you can do:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Browse through different images and activities</li>
              <li>Click on images to select them</li>
              <li>Follow the instructions for each activity</li>
              <li>Practice identifying and matching images</li>
              <li>Have fun while learning!</li>
            </ul>
            <p className="mt-4 text-gray-500 italic">Tip: Take your time to look at each image carefully!</p>
          </div>
        }
      />
      <ImageCarousel />
    </LessonLayout>
  );
};

export default ImageSelectionMenu;
