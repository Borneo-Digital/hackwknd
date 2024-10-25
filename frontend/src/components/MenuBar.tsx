'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface MenuItemProps {
  href: string;
  label: string;
  isScrolled: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ href, label, isScrolled }) => (
  <li>
    <Link
      href={href}
      className={`
        relative group font-medium
        ${isScrolled ? 'text-gray-800 hover:text-hack-primary' : 'text-gray-100 hover:text-white'}
        transition-colors duration-300
      `}
    >
      {label}
      <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-hack-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
    </Link>
  </li>
)

interface MenuBarProps {
  logo: string;
  logoSrc?: string;
  menuItems: { href: string; label: string }[];
}

export const MenuBar: React.FC<MenuBarProps> = ({ logo, logoSrc, menuItems }) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${isScrolled 
        ? 'bg-white/80 backdrop-blur-md border-b border-gray-200/20 py-4'
        : 'bg-transparent py-6'
      }
    `}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="group flex items-center">
          {logoSrc && (
            <Image
              src={logoSrc}
              alt="HackWknd Logo"
              width={32}
              height={32}
              className="mr-2"
            />
          )}
          <h1 className={`
            text-2xl font-bold transition-colors duration-300
            ${isScrolled ? 'text-gray-800' : 'text-white'}
          `}>
            <span className="hack-gradient-text">{logo}</span>
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="relative">
          <ul className="flex items-center space-x-8">
            {menuItems.map((item) => (
              <MenuItem 
                key={item.label} 
                href={item.href} 
                label={item.label}
                isScrolled={isScrolled}
              />
            ))}
            {/* CTA Button */}
            <li>
              <Link 
                href="#register" 
                className={`
                  hack-button text-sm
                  ${isScrolled 
                    ? 'bg-hack-primary hover:bg-hack-primary/90' 
                    : 'bg-white text-hack-primary hover:bg-white/90'
                  }
                `}
              >
                Register Now
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}