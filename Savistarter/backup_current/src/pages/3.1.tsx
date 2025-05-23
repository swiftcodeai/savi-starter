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
    <div className="bg-white rounded-xl p-4 shadow-md flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={currentTool === "brush" ? "default" : "outline"}
          size="icon"
          onClick={() => setCurrentTool("brush")}
          title="Brush Tool"
        >
          <Brush />
        </Button>
        <Button
          variant={currentTool === "fill" ? "default" : "outline"}
          size="icon"
          onClick={() => setCurrentTool("fill")}
          title="Fill Tool"
        >
          <PaintBucket size={20} />
        </Button>
        <Button
          variant={currentTool === "eraser" ? "default" : "outline"}
          size="icon"
          onClick={() => setCurrentTool("eraser")}
          title="Eraser Tool"
        >
          <Eraser />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" title="Color Picker">
              <div 
                className="w-5 h-5 rounded-full" 
                style={{ backgroundColor: currentColor }}
              ></div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="grid grid-cols-5 gap-2">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color.value}
                  className={cn(
                    "w-8 h-8 rounded-full border-2",
                    currentColor === color.value ? "border-black" : "border-transparent"
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
        >
          <RotateCcw />
        </Button>
      </div>

      {currentTool === "fill" && (
        <div className="flex flex-col gap-2 mt-2">
          <label className="text-sm text-gray-500">Fill Tolerance: {fillTolerance}</label>
          <Slider
            value={[fillTolerance]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setFillTolerance(value[0])}
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-500">Brush Size: {brushSize}px</label>
        <Slider
          value={[brushSize]}
          min={1}
          max={50}
          step={1}
          onValueChange={(value) => setBrushSize(value[0])}
        />
      </div>
    </div>
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
    } else {
      canvasContext.globalCompositeOperation = 'source-over';
      canvasContext.strokeStyle = currentColor;
    }
  }, [currentTool, currentColor, brushSize, canvasContext]);

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
    <LessonLayout
      title="Drawing Time"
      subtitle="Express yourself through art"
      className="max-w-6xl mx-auto"
      nextPath={LessonSequence["3.2"]}
      prevPath={LessonSequence["3.0"]}
      onRestart={handleReset}
    >
      <LessonInstructionsPopup
        lessonId="3.1"
        title="Let's Draw Together!"
        instructions={
          <div>
            <p>Welcome to the Drawing Canvas! Here's how to use it:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Use your mouse or touch to draw on the canvas</li>
              <li>Select different colors from the palette</li>
              <li>Change brush sizes for different effects</li>
              <li>Use the eraser to correct mistakes</li>
              <li>Clear the canvas to start over</li>
              <li>Save your artwork when you're done</li>
            </ul>
            <p className="mt-4 text-gray-500 italic">Tip: Try different colors and brush sizes to make your drawing more interesting!</p>
          </div>
        }
      />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-8 items-start px-4 pb-32">
        {/* Left side - Drawing tools */}
        <div className="flex flex-col gap-4">
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
          
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(LessonSequence["3.0"])}
              className="flex items-center gap-2"
            >
              <ImageIcon size={16} /> Change Image
            </Button>
            
            <Button
              variant="default"
              onClick={handleSave}
              className="flex items-center gap-2"
            >
              <Save size={16} /> Save Drawing
            </Button>
          </div>
        </div>

        {/* Right side - Canvas */}
        <div className="bg-white rounded-xl h-[700px] shadow-lg overflow-hidden border-4 border-savi-blue">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            onMouseDown={currentTool === "fill" ? handleCanvasClick : startDrawing}
            onMouseMove={currentTool === "fill" ? null : draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={currentTool === "fill" ? handleCanvasClick : startDrawing}
            onTouchMove={currentTool === "fill" ? null : draw}
            onTouchEnd={stopDrawing}
          />
        </div>
      </div>
    </LessonLayout>
  );
};

export default DrawingCanvas;
