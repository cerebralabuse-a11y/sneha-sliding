import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GripVertical } from 'lucide-react';

interface BeforeAfterProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterProps> = ({ beforeImage, afterImage, className = '' }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleTouchStart = () => setIsDragging(true);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);
  const handleTouchEnd = useCallback(() => setIsDragging(false), []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleTouchEnd);
    } else {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseUp, handleTouchEnd]);

  return (
    // Outer Frame - Simulates the Aluminium Window Frame
    <div className={`relative p-3 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-lg shadow-2xl border border-gray-400 ${className}`}>
      {/* Inner Track Shadow */}
      <div className="absolute inset-2 bg-gray-800/10 rounded-sm pointer-events-none"></div>
      
      {/* The Glass Area */}
      <div 
        ref={containerRef}
        className="relative w-full h-[300px] md:h-[500px] overflow-hidden rounded bg-gray-100 cursor-col-resize select-none border-2 border-gray-400/50"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Background (After Image) */}
        <img 
          src={afterImage} 
          alt="After" 
          className="absolute inset-0 w-full h-full object-cover" 
          draggable={false}
        />
        
        {/* Foreground (Before Image) - Clipped via CSS */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` 
          }}
        >
          <img 
            src={beforeImage} 
            alt="Before" 
            className="absolute inset-0 w-full h-full object-cover" 
            draggable={false}
          />
           {/* Label Before */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 text-[10px] font-bold rounded uppercase tracking-wider shadow-lg">Before</div>
        </div>

        {/* Label After */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 text-[10px] font-bold rounded uppercase tracking-wider shadow-lg">After</div>

        {/* Slider Handle - Vertical Aluminium Bar */}
        <div 
          className="absolute top-0 bottom-0 w-3 md:w-4 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 cursor-col-resize z-10 flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.3)] border-x border-gray-400"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Handle Grip Details */}
          <div className="absolute h-16 w-6 md:w-8 bg-gradient-to-b from-gray-300 via-gray-100 to-gray-300 rounded shadow-md border border-gray-400 flex items-center justify-center">
             <GripVertical size={16} className="text-gray-500 opacity-50" />
          </div>
        </div>
      </div>
      
      {/* Window Hardware Detail (Bottom Latch Simulation) */}
      <div className="h-6 mt-1 flex justify-center items-center">
         <div className="w-24 h-2 bg-gray-400/50 rounded-full shadow-inner"></div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;