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
        <h3 className="text-lg font-medium">Partnership Logos</h3>
        <Button 
          type="button"
          variant="outline"
          size="sm"
          onClick={addLogo}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Logo
        </Button>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Upload partnership logos here. These will be displayed on the hackathon page under "In partnership with".
            </p>
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {uploadError}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {logos.map((logo) => (
          <div key={logo.id} className="border border-gray-200 rounded-md p-4">
            <div className="flex justify-between mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={logo.name}
                  onChange={(e) => updateLogoName(logo.id, e.target.value)}
                  placeholder="Partner Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="ml-2"
                onClick={() => removeLogo(logo.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
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
        ))}

        {logos.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No partnership logos added. Click "Add Logo" to add partners.
          </div>
        )}
      </div>
    </div>
  );
};