"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/LanguageContext';
import { Languages } from 'lucide-react';

export const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 lg:px-20 py-5 font-body relative z-50">
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold tracking-tight text-foreground">
          ✦ Nexora
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.navbar.home}</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.navbar.pricing}</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.navbar.about}</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.navbar.contact}</a>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent"
          aria-label="Toggle language"
        >
          <Languages className="h-4 w-4" />
          <span>{language === 'en' ? 'English' : 'हिंदी'}</span>
        </button>

        <Button variant="default" className="rounded-full px-5 text-sm font-medium">
          {t.navbar.getStarted}
        </Button>
      </div>
    </nav>
  );
};
