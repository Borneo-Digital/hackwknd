'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PosterImage } from '@/types/hackathon';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

interface PosterCarouselProps {
  images: PosterImage[];
}

export const PosterCarousel: React.FC<PosterCarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  // Initialize client-side mounting for createPortal
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % sortedImages.length);
  }, [sortedImages.length]);

  const goToPrevious = useCallback(() => {
    setActiveIndex((current) => (current - 1 + sortedImages.length) % sortedImages.length);
  }, [sortedImages.length]);

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
    
    // When opening fullscreen, add a class to prevent body scrolling
    if (!fullscreen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  };

  // Handle arrow key navigation and cleanup body class
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreen) {
        if (e.key === 'ArrowRight') goToNext();
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'Escape') {
          setFullscreen(false);
          document.body.classList.remove('overflow-hidden');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Make sure to clean up the body class when component unmounts
      document.body.classList.remove('overflow-hidden');
    };
  }, [fullscreen, goToNext, goToPrevious]);

  if (sortedImages.length === 0) return null;

  // Fullscreen modal component
  const FullscreenModal = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
      {/* Keyboard navigation hint */}
      <div className="absolute top-4 left-4 bg-black/40 text-gray-300 text-xs py-1 px-2 rounded flex items-center space-x-2">
        <span className="inline-block border border-gray-500 rounded px-1.5 py-0.5">←</span>
        <span className="inline-block border border-gray-500 rounded px-1.5 py-0.5">→</span>
        <span className="ml-1">to navigate</span>
        <span className="ml-2 inline-block border border-gray-500 rounded px-1.5 py-0.5">ESC</span>
        <span className="ml-1">to close</span>
      </div>
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 rounded-full bg-black/60 p-3 text-white hover:bg-black/80 z-[10000]"
      >
        <X className="h-6 w-6" />
      </button>
      
      <div className="relative w-full h-full flex items-center justify-center p-8">
        <div className="relative max-w-5xl max-h-[80vh] w-full flex items-center justify-center">
          <Image
            src={sortedImages[activeIndex].url}
            alt={sortedImages[activeIndex].caption || `Poster ${activeIndex + 1}`}
            fill
            className="object-contain"
            sizes="90vw"
          />
          
          {sortedImages[activeIndex].caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white text-center">
              <p className="text-lg">{sortedImages[activeIndex].caption}</p>
            </div>
          )}
        </div>
        
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white hover:bg-black/80 z-[10000]"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
        
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white hover:bg-black/80 z-[10000]"
          onClick={goToNext}
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>
      
      {/* Thumbnail navigation in fullscreen */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 overflow-x-auto p-2 max-w-[90vw]">
        {sortedImages.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setActiveIndex(index)}
            className={`relative h-20 w-16 overflow-hidden rounded-md transition-all ${
              index === activeIndex ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-90'
            }`}
          >
            <Image
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="4rem"
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="poster-gallery">
        {/* Poster grid that preserves aspect ratio */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {sortedImages.map((image, index) => (
            <div key={image.id} className="flex flex-col space-y-2">
              {/* Poster with preserved aspect ratio */}
              <button
                onClick={() => {
                  setActiveIndex(index);
                  toggleFullscreen();
                }}
                className="group relative bg-gray-800/30 dark:bg-gray-900/40 rounded-md overflow-hidden hover:shadow-lg transition-all h-[180px] w-full"
              >
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <Image
                    src={image.url}
                    alt={image.caption || `Poster ${index + 1}`}
                    fill
                    className="object-contain rounded"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="bg-black/60 rounded-full p-3">
                    <Maximize2 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </button>
              
              {/* Caption below the image, always visible */}
              {image.caption && (
                <div className="px-1">
                  <p className="text-xs text-muted-foreground truncate text-center">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Render the fullscreen modal using portal to ensure it's not constrained by parent containers */}
      {isMounted && fullscreen && createPortal(
        <FullscreenModal />,
        document.body
      )}
    </div>
  );
};