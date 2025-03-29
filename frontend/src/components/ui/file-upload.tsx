'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from './button';
import { Trash2, Upload } from 'lucide-react';

interface FileUploadProps {
  bucket: string;
  folder?: string;
  onUploadComplete: (url: string) => void;
  existingUrl?: string;
  label?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  bucket,
  folder = '',
  onUploadComplete,
  existingUrl,
  label = 'Upload File'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(existingUrl || null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    setError(null);

    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('File upload can only be performed in browser environment');
      }
      
      // We'll remove this explicit check since it seems to be causing issues
      // The Supabase client will handle auth via its built-in mechanisms

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Upload file to Supabase Storage with simplified error handling
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true 
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Upload failed. Please check your connection and try again.');
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;

      // Update preview and notify parent
      setPreview(publicUrl);
      onUploadComplete(publicUrl);
    } catch (err: any) {
      console.error('File upload error:', err);
      setError(err.message || 'An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadComplete('');
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        {!preview ? (
          <div className="flex flex-col items-center justify-center">
            <label className="cursor-pointer text-center">
              <div className="mt-2">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-1 text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {isUploading && (
                <div className="mt-2 text-sm text-indigo-600">
                  Uploading...
                </div>
              )}
            </label>
          </div>
        ) : (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="mx-auto h-32 object-contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-0 right-0 p-1 rounded-full"
              onClick={handleRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};