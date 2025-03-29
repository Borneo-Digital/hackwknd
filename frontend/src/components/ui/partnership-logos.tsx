'use client';

import React, { useState, useEffect } from 'react';
import { FileUpload } from './file-upload';
import { Button } from './button';
import { PlusCircle, Trash2 } from 'lucide-react';

interface PartnershipLogo {
  id: string;
  url: string;
  name: string;
}

interface PartnershipLogosProps {
  value: PartnershipLogo[];
  onChange: (logos: PartnershipLogo[]) => void;
}

export const PartnershipLogos: React.FC<PartnershipLogosProps> = ({
  value = [],
  onChange
}) => {
  const [logos, setLogos] = useState<PartnershipLogo[]>(value);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    // Update the component state if the value prop changes
    setLogos(value);
  }, [value]);

  const addLogo = () => {
    const newLogo = {
      id: Math.random().toString(36).substring(2, 9),
      url: '',
      name: ''
    };
    const updatedLogos = [...logos, newLogo];
    setLogos(updatedLogos);
    onChange(updatedLogos);
  };

  const removeLogo = (id: string) => {
    const updatedLogos = logos.filter(logo => logo.id !== id);
    setLogos(updatedLogos);
    onChange(updatedLogos);
  };

  const updateLogoUrl = (id: string, url: string) => {
    const updatedLogos = logos.map(logo => 
      logo.id === id ? { ...logo, url } : logo
    );
    setLogos(updatedLogos);
    onChange(updatedLogos);
  };

  const updateLogoName = (id: string, name: string) => {
    const updatedLogos = logos.map(logo => 
      logo.id === id ? { ...logo, name } : logo
    );
    setLogos(updatedLogos);
    onChange(updatedLogos);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">Partnership Logos</h3>
        <Button 
          type="button"
          variant="outline"
          size="sm"
          onClick={addLogo}
          className="bg-white hover:bg-gray-50 text-indigo-600 border-indigo-200 hover:border-indigo-300 transition-colors shadow-sm"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Logo
        </Button>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">About Partnership Logos</h3>
            <div className="mt-1 text-sm text-blue-700">
              <p>Upload logos of organizations collaborating on this hackathon. These will be displayed:</p>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                <li>On the hackathon page under "In partnership with"</li>
                <li>In registration confirmation emails</li>
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

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {logos.map((logo) => (
          <div 
            key={logo.id} 
            className="border border-gray-200 rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-gray-700">Partnership Logo</h4>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="h-8 w-8 rounded-full p-0 flex items-center justify-center"
                onClick={() => removeLogo(logo.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-2/3 order-2 md:order-1">
                <FileUpload
                  bucket="partnership-logo"
                  onUploadComplete={(url) => {
                    if (url) {
                      setUploadError(null);
                      updateLogoUrl(logo.id, url);
                    }
                  }}
                  existingUrl={logo.url}
                  label="Logo Image"
                />
              </div>
              
              <div className="w-full md:w-1/3 order-1 md:order-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Partner Name
                </label>
                <input
                  type="text"
                  value={logo.name}
                  onChange={(e) => updateLogoName(logo.id, e.target.value)}
                  placeholder="E.g., Acme Corp"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {logo.url && (
                  <div className="mt-2 text-xs text-gray-500">
                    Logo uploaded successfully
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {logos.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-8 px-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
            <div className="rounded-full bg-gray-100 p-3 mb-3">
              <PlusCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-1">No partnership logos added</p>
            <p className="text-gray-500 text-sm mb-4">Add logos of organizations collaborating on this hackathon</p>
            <Button 
              type="button"
              variant="outline"
              size="sm"
              onClick={addLogo}
              className="bg-white hover:bg-indigo-50 text-indigo-600 border-indigo-200 hover:border-indigo-300"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Your First Partner
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};