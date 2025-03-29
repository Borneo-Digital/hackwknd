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
      
      <div className={`border-2 ${!preview ? 'border-dashed' : 'border-solid'} ${isUploading ? 'bg-gray-50' : ''} border-gray-300 rounded-lg p-4 transition-all duration-200 hover:border-indigo-300`}>
        {!preview ? (
          <div className="flex flex-col items-center justify-center py-4">
            <label className="cursor-pointer text-center w-full">
              <div className="mt-2 transition-transform duration-200 hover:scale-105">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm font-medium text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {isUploading && (
                <div className="mt-4 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 mr-2"></div>
                  <span className="text-sm text-indigo-600 font-medium">Uploading...</span>
                </div>
              )}
            </label>
          </div>
        ) : (
          <div className="relative group">
            <div className="bg-white/80 absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 rounded-lg">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="z-10"
                onClick={handleRemove}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
            <div className="flex items-center justify-center bg-gray-50 py-2 rounded-lg overflow-hidden">
              <img 
                src={preview} 
                alt="Preview" 
                className="max-h-32 max-w-full object-contain rounded"
              />
            </div>
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