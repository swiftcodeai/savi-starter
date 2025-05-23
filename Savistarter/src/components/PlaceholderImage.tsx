
import React from "react";
import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  src: string;
  alt: string;
  className?: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ src, alt, className }) => {
  return (
    <div className={cn("overflow-hidden bg-white rounded-lg relative", className)}>
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <div className="animate-pulse w-12 h-12 bg-gray-200 rounded-full"></div>
      </div>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover relative z-10"
        draggable={false}
        onError={(e) => {
          // If image fails to load, show a fallback
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
};

export default PlaceholderImage;
