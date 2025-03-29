'use client';

import React, { useState, useEffect } from 'react';
import { FileUpload } from './file-upload';
import { Button } from './button';
import { PlusCircle, Trash2, Image as ImageIcon, MoveLeft, MoveRight } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface PosterImage {
  id: string;
  url: string;
  caption?: string;
  order: number;
}

interface PosterGalleryProps {
  value: PosterImage[];
  onChange: (images: PosterImage[]) => void;
}

export const PosterGallery: React.FC<PosterGalleryProps> = ({
  value = [],
  onChange
}) => {
  const [images, setImages] = useState<PosterImage[]>(() => {
    // Sort images by order if available
    return [...value].sort((a, b) => a.order - b.order);
  });
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    // Update the component state if the value prop changes
    setImages([...value].sort((a, b) => a.order - b.order));
  }, [value]);

  const addImage = () => {
    // Find the highest order number and add 1
    const nextOrder = images.length > 0 
      ? Math.max(...images.map(img => img.order)) + 1 
      : 0;
      
    const newImage = {
      id: Math.random().toString(36).substring(2, 9),
      url: '',
      caption: '',
      order: nextOrder
    };
    const updatedImages = [...images, newImage];
    setImages(updatedImages);
    onChange(updatedImages);
  };

  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    // Reorder remaining images
    const reordered = updatedImages.map((img, idx) => ({
      ...img,
      order: idx
    }));
    setImages(reordered);
    onChange(reordered);
  };

  const updateImageUrl = (id: string, url: string) => {
    const updatedImages = images.map(img => 
      img.id === id ? { ...img, url } : img
    );
    setImages(updatedImages);
    onChange(updatedImages);
  };

  const updateImageCaption = (id: string, caption: string) => {
    const updatedImages = images.map(img => 
      img.id === id ? { ...img, caption } : img
    );
    setImages(updatedImages);
    onChange(updatedImages);
  };

  const moveImage = (id: string, direction: 'up' | 'down') => {
    const index = images.findIndex(img => img.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === images.length - 1)
    ) {
      return; // Can't move first item up or last item down
    }

    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap the items
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    
    // Update order values
    const reordered = newImages.map((img, idx) => ({
      ...img,
      order: idx
    }));

    setImages(reordered);
    onChange(reordered);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">Hackathon Posters</h3>
        <Button 
          type="button"
          variant="outline"
          size="sm"
          onClick={addImage}
          className="bg-white hover:bg-gray-50 text-indigo-600 border-indigo-200 hover:border-indigo-300 transition-colors shadow-sm"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Poster
        </Button>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <ImageIcon className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-indigo-800">About Hackathon Posters</h3>
            <div className="mt-1 text-sm text-indigo-700">
              <p>Upload poster images (1080×1350px) for your hackathon. These will be displayed:</p>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                <li>As a gallery on the hackathon page</li>
                <li>Can be used for social media promotion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 shadow-sm animate-pulse">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Upload Error</h3>
              <div className="mt-1 text-sm text-red-700">
                <p>{uploadError}</p>
                <p className="mt-1">Please check your connection and try again.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {images.map((image, index) => (
          <div 
            key={image.id} 
            className="border border-gray-200 rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-gray-700">Poster {index + 1}</h4>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={index === 0}
                  className="h-8 w-8 p-0 flex items-center justify-center bg-gray-50"
                  onClick={() => moveImage(image.id, 'up')}
                >
                  <MoveLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={index === images.length - 1}
                  className="h-8 w-8 p-0 flex items-center justify-center bg-gray-50"
                  onClick={() => moveImage(image.id, 'down')}
                >
                  <MoveRight className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="h-8 w-8 p-0 flex items-center justify-center"
                  onClick={() => removeImage(image.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-2/3">
                <FileUpload
                  bucket="partnership-logo" // Reusing the same bucket
                  folder="posters"  // But in a different folder
                  onUploadComplete={(url) => {
                    if (url) {
                      setUploadError(null);
                      updateImageUrl(image.id, url);
                    }
                  }}
                  existingUrl={image.url}
                  label="Poster Image (1080×1350px)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended size: 1080×1350px (9:16 ratio for social media)
                </p>
              </div>
              
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={image.caption || ''}
                  onChange={(e) => updateImageCaption(image.id, e.target.value)}
                  placeholder="Brief description of this poster"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Displayed when poster is viewed full-size
                </p>
              </div>
            </div>
            
            {image.url && (
              <div className="mt-4 p-2 border border-gray-200 rounded bg-gray-50 flex items-center justify-center">
                <img 
                  src={image.url} 
                  alt={image.caption || `Poster ${index + 1}`}
                  className="max-h-36 object-contain"
                />
              </div>
            )}
          </div>
        ))}

        {images.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-8 px-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
            <div className="rounded-full bg-gray-100 p-3 mb-3">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-1">No poster images added</p>
            <p className="text-gray-500 text-sm mb-4">Add promotional posters for this hackathon</p>
            <Button 
              type="button"
              variant="outline"
              size="sm"
              onClick={addImage}
              className="bg-white hover:bg-indigo-50 text-indigo-600 border-indigo-200 hover:border-indigo-300"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Your First Poster
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};