'use client'

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-foreground border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-foreground">
              DOMINATE MUSCLE
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline">ログイン</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-700 hover:bg-blue-800 transition-colors">サインアップ</Button>
            </Link>
          </div>
          {/* ハンバーガーメニュー */}
          <div className="md:hidden" ref={menuRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className="text-primary-foreground"
            >
              <span className="sr-only">メニューを開く</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            {/* モバイルメニュー */}
            <div
              id="mobile-menu"
              className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-background border border-border
                ${isMenuOpen ? 'animate-in fade-in-0 slide-in-from-top-5' : 'animate-out fade-out-0 slide-out-to-top-5 hidden'}
                transition-all duration-300 ease-in-out`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <Link href="/login" className="block px-4 py-2 text-sm text-primary hover:bg-accent hover:text-accent-foreground transition-colors duration-150 ease-in-out">
                ログイン
              </Link>
              <Link href="/register" className="block px-4 py-2 text-sm text-primary hover:bg-accent hover:text-accent-foreground transition-colors duration-150 ease-in-out">
                サインアップ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};