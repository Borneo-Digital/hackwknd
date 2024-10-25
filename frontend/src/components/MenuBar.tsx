import React from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

interface MenuBarProps {
  logo: string;
  logoSrc?: string;
  onRegisterClick: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({ logo, logoSrc, onRegisterClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          {logoSrc && (
            <Image
              src={logoSrc}
              alt="HackWknd Logo"
              width={32}
              height={32}
              className="mr-2"
            />
          )}
          <h1 className="text-2xl font-bold text-white">
            <span className="hack-gradient-text">{logo}</span>
          </h1>
        </div>

        {/* Register Now button */}
        <Button 
          onClick={onRegisterClick}
          className="hack-button"
        >
          Register Now
        </Button>
      </div>
    </header>
  )
}