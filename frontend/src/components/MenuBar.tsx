import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

interface MenuBarProps {
  logo: string;
  logoSrc?: string;
  showRegisterButton?: boolean;
  onRegisterClick?: () => void;
  registerButtonText?: string;
}

export const MenuBar: React.FC<MenuBarProps> = ({ 
  logo, 
  logoSrc, 
  showRegisterButton = false,
  onRegisterClick,
  registerButtonText = "Register Now"
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20); // Change background after 20px scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 py-4
        transition-all duration-300 ease-in-out
        ${isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-sm shadow-md' // Changed to dark background
          : 'bg-transparent'
        }
      `}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          href="/" 
          className={`
            flex items-center hover:opacity-80 transition-opacity
            ${isScrolled ? 'scale-90' : 'scale-100'}
            transition-transform duration-300
          `}
        >
          {logoSrc && (
            <Image
              src={logoSrc}
              alt="HackWknd Logo"
              width={32}
              height={32}
              className="mr-2 transition-all duration-300"
            />
          )}
          <h1 className="text-2xl font-bold text-white"> {/* Always white text */}
            <span className="hack-gradient-text">{logo}</span>
          </h1>
        </Link>

        {/* Optional Register Now button */}
        {showRegisterButton && onRegisterClick && (
          <Button 
            onClick={onRegisterClick}
            className={`
              hack-button
              transition-transform duration-300
              ${isScrolled ? 'scale-90' : 'scale-100'}
            `}
          >
            {registerButtonText}
          </Button>
        )}
      </div>
    </header>
  )
}