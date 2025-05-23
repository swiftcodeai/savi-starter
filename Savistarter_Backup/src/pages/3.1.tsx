import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import FloatingElements from "@/components/FloatingElements";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Save, 
  RotateCcw, 
  Brush, 
  Eraser, 
  ImageIcon,
  Palette,
  PaintBucket,
  ArrowRight
} from "lucide-react";
import { LessonSequence } from "@/App";
import { PLACEHOLDER_IMAGE } from "@/constants/images";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import LessonLayout from "@/components/LessonLayout";
import LessonInstructionsPopup from '@/components/LessonInstructionsPopup';
import { useCourse } from "@/contexts/CourseContext";
import LessonCard from "@/components/dragndrop/LessonCard";

// Custom card component to match 1.1 style
const StyledCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn(
    "bg-[#fae6b0] rounded-xl border-4 border-[#f9da8d] shadow-lg p-3 relative",
    className
  )}>
    {/* Corner accents - matching 1.1 style */}
    <div className="absolute -top-1 -left-1 w-4 h-4 bg-white rounded-full opacity-80"></div>
    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full opacity-80"></div>
    <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-white rounded-full opacity-80"></div>
    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full opacity-80"></div>
    {children}
  </div>
);

const COLOR_PALETTE = [
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#ff0000" },
  { name: "Orange", value: "#ff9900" },
  { name: "Yellow", value: "#ffff00" },
  { name: "Green", value: "#00ff00" },
  { name: "Blue", value: "#0000ff" },
  { name: "Purple", value: "#9900ff" },
  { name: "Pink", value: "#ff00ff" },
  { name: "Brown", value: "#996633" },
  { name: "White", value: "#ffffff" },
];

const DrawingTool = ({ currentTool, setCurrentTool, currentColor, setCurrentColor, brushSize, setBrushSize, handleReset, fillTolerance, setFillTolerance }) => {
  return (
    <StyledCard className="p-4 flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={currentTool === "brush" ? "default" : "outline"}
          size="icon"
          onClick={() => setCurrentTool("brush")}
          title="Brush Tool"
          className={cn(
            currentTool === "brush" ? "bg-cyan-500 hover:bg-cyan-600" : "",
            "border-2 border-cyan-300"
          )}
        >
          <Brush />
        </Button>
        <Button
          variant={currentTool === "fill" ? "default" : "outline"}
          size="icon"
          onClick={() => setCurrentTool("fill")}
          title="Fill Tool"
          className={cn(
            currentTool === "fill" ? "bg-cyan-500 hover:bg-cyan-600" : "",
            "border-2 border-cyan-300"
          )}
        >
          <PaintBucket size={20} />
        </Button>
        <Button
          variant={currentTool === "eraser" ? "default" : "outline"}
          size="icon"
          onClick={() => setCurrentTool("eraser")}
          title="Eraser Tool"
          className={cn(
            currentTool === "eraser" ? "bg-cyan-500 hover:bg-cyan-600" : "",
            "border-2 border-cyan-300"
          )}
        >
          <Eraser />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              title="Color Picker"
              className="border-2 border-cyan-300"
            >
              <div 
                className="w-5 h-5 rounded-full" 
                style={{ backgroundColor: currentColor }}
              ></div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 bg-[#fae6b0] border-4 border-[#f9da8d]">
            <div className="grid grid-cols-5 gap-2">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color.value}
                  className={cn(
                    "w-8 h-8 rounded-full border-2",
                    currentColor === color.value ? "border-cyan-500" : "border-transparent"
                  )}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setCurrentColor(color.value)}
                  title={color.name}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          title="Reset Canvas"
          className="border-2 border-cyan-300"
        >
          <RotateCcw />
        </Button>
      </div>

      {currentTool === "fill" && (
        <div className="flex flex-col gap-2 mt-2">
          <label className="text-sm text-cyan-700">Fill Tolerance: {fillTolerance}</label>
          <Slider
            value={[fillTolerance]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setFillTolerance(value[0])}
            className="[&>span]:bg-cyan-500"
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm text-cyan-700">Brush Size: {brushSize}px</label>
        <Slider
          value={[brushSize]}
          min={1}
          max={50}
          step={1}
          onValueChange={(value) => setBrushSize(value[0])}
          className="[&>span]:bg-cyan-500"
        />
      </div>
    </StyledCard>
  );
};

const DrawingCanvas = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const backgroundImageRef = useRef(null);
  const [currentTool, setCurrentTool] = useState("brush");
  const [currentColor, setCurrentColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [fillTolerance, setFillTolerance] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [canvasContext, setCanvasContext] = useState(null);
  const { currentCourse } = useCourse();
  
  useEffect(() => {
    const storedImage = sessionStorage.getItem('selectedDrawingImage');
    if (storedImage) {
      const parsedImage = JSON.parse(storedImage);
      setSelectedImage({
        title: parsedImage.title,
        image: parsedImage.image
      });
    } else {
      setSelectedImage({
        title: "Default Canvas",
        image: PLACEHOLDER_IMAGE
      });
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    setCanvasContext(ctx);
    
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);
  
  useEffect(() => {
    if (selectedImage?.image && canvasRef.current && canvasContext) {
      const img = new Image();
      img.src = selectedImage.image;
      img.onload = () => {
        const canvas = canvasRef.current;
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        ) * 0.95;
        
        const imgWidth = img.width * scale;
        const imgHeight = img.height * scale;
        
        const x = (canvas.width - imgWidth) / 2;
        const y = (canvas.height - imgHeight) / 2;
        
        canvasContext.globalAlpha = 0.3;
        canvasContext.drawImage(img, x, y, imgWidth, imgHeight);
        canvasContext.globalAlpha = 1.0;
      };
    }
  }, [selectedImage, canvasContext]);
  
  const startDrawing = (e) => {
    if (!canvasContext) return;
    setIsDrawing(true);
    
    const { offsetX, offsetY } = getCoordinates(e);
    canvasContext.beginPath();
    canvasContext.moveTo(offsetX, offsetY);
  };
  
  const draw = (e) => {
    if (!isDrawing || !canvasContext) return;
    
    const { offsetX, offsetY } = getCoordinates(e);
    canvasContext.lineTo(offsetX, offsetY);
    canvasContext.stroke();
  };
  
  const stopDrawing = () => {
    if (!canvasContext) return;
    setIsDrawing(false);
    canvasContext.closePath();
  };
  
  const getCoordinates = (e) => {
    if (!canvasRef.current) {
      return { offsetX: 0, offsetY: 0 };
    }
    
    const canvas = canvasRef.current;
    let offsetX, offsetY;
    
    if (e.touches) {
      const rect = canvas.getBoundingClientRect();
      offsetX = e.touches[0].clientX - rect.left;
      offsetY = e.touches[0].clientY - rect.top;
    } else {
      offsetX = e.nativeEvent.offsetX;
      offsetY = e.nativeEvent.offsetY;
    }
    
    return { offsetX, offsetY };
  };
  
  const handleReset = () => {
    if (!canvasRef.current || !canvasContext) return;
    const canvas = canvasRef.current;
    
    // Clear the entire canvas with transparency
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fill with white background
    canvasContext.globalCompositeOperation = 'source-over';
    canvasContext.fillStyle = '#ffffff';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    
    // Redraw the background image
    if (selectedImage?.image) {
      const img = new window.Image();
      img.src = selectedImage.image;
      img.onload = () => {
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        ) * 0.95;
        const imgWidth = img.width * scale;
        const imgHeight = img.height * scale;
        const x = (canvas.width - imgWidth) / 2;
        const y = (canvas.height - imgHeight) / 2;
        canvasContext.globalAlpha = 0.3;
        canvasContext.drawImage(img, x, y, imgWidth, imgHeight);
        canvasContext.globalAlpha = 1.0;
      };
    }
  };
  
  const handleSave = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    
    link.href = canvas.toDataURL('image/png');
    link.download = `${selectedImage?.title || 'drawing'}.png`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  useEffect(() => {
    if (!canvasContext) return;
    
    canvasContext.lineWidth = brushSize;
    canvasContext.lineCap = 'round';
    canvasContext.lineJoin = 'round';
    
    if (currentTool === 'eraser') {
      canvasContext.globalCompositeOperation = 'destination-out';
      canvasContext.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      canvasContext.globalCompositeOperation = 'source-over';
      canvasContext.strokeStyle = currentColor;
    }
  }, [currentTool, currentColor, brushSize, canvasContext]);

  const handleResize = () => {
    if (!canvasRef.current || !canvasContext) return;
    
    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    const oldData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
    
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    canvasContext.putImageData(oldData, 0, 0);
    
    canvasContext.lineWidth = brushSize;
    canvasContext.lineCap = 'round';
    canvasContext.lineJoin = 'round';
    if (currentTool === 'eraser') {
      canvasContext.globalCompositeOperation = 'destination-out';
      canvasContext.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      canvasContext.globalCompositeOperation = 'source-over';
      canvasContext.strokeStyle = currentColor;
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasContext, currentTool, currentColor, brushSize]);

  const colorMatch = (r1, g1, b1, r2, g2, b2, tolerance) => {
    return (
      Math.abs(r1 - r2) <= tolerance &&
      Math.abs(g1 - g2) <= tolerance &&
      Math.abs(b1 - b2) <= tolerance
    );
  };

  const floodFill = (startX, startY, fillColor, tolerance) => {
    if (!canvasContext) return;
    
    const canvas = canvasRef.current;
    const ctx = canvasContext;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    const startPos = (startY * canvas.width + startX) * 4;
    const startR = pixels[startPos];
    const startG = pixels[startPos + 1];
    const startB = pixels[startPos + 2];
    const startA = pixels[startPos + 3];
    
    const fillR = parseInt(fillColor.slice(1, 3), 16);
    const fillG = parseInt(fillColor.slice(3, 5), 16);
    const fillB = parseInt(fillColor.slice(5, 7), 16);
    
    if (colorMatch(startR, startG, startB, fillR, fillG, fillB, tolerance)) return;
    
    const stack = [[startX, startY]];
    
    while (stack.length) {
      const [x, y] = stack.pop();
      const pos = (y * canvas.width + x) * 4;
      
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
      if (!colorMatch(pixels[pos], pixels[pos + 1], pixels[pos + 2], startR, startG, startB, tolerance) || pixels[pos + 3] !== startA) continue;
      
      pixels[pos] = fillR;
      pixels[pos + 1] = fillG;
      pixels[pos + 2] = fillB;
      pixels[pos + 3] = 255;
      
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const handleCanvasClick = (e) => {
    if (currentTool === "fill") {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
      const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
      floodFill(x, y, currentColor, fillTolerance);
    }
  };

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      {/* Top navigation bar */}
      <div className="flex justify-between items-center mb-8 px-4 py-2">
        <LessonCard className="py-2 px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-cyan-500">
            {currentCourse?.title || "Greetings & Communication"}
          </h2>
        </LessonCard>
        
        <LessonCard className="py-2 px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-cyan-500">
            Activities
          </h2>
        </LessonCard>
      </div>

      <LessonLayout
        className="max-w-6xl mx-auto"
        nextPath={LessonSequence["3.2"]}
        prevPath={LessonSequence["3.0"]}
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left side - Drawing tools */}
          <div className="flex flex-col gap-6">
            <DrawingTool
              currentTool={currentTool}
              setCurrentTool={setCurrentTool}
              currentColor={currentColor}
              setCurrentColor={setCurrentColor}
              brushSize={brushSize}
              setBrushSize={setBrushSize}
              handleReset={handleReset}
              fillTolerance={fillTolerance}
              setFillTolerance={setFillTolerance}
            />
            
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={handleSave}
                className="bg-cyan-500 hover:bg-cyan-600 text-white border-none"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Drawing
              </Button>
            </div>
          </div>

          {/* Right side - Canvas */}
          <StyledCard className="w-full aspect-square">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              onClick={handleCanvasClick}
              className="w-full h-full rounded-lg cursor-crosshair"
            />
          </StyledCard>
        </div>
      </LessonLayout>
    </div>
  );
};

export default DrawingCanvas;
