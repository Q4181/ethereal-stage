import React from 'react';
import { Search, User, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-effect border-b border-white/5 px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-bold text-primary font-headline tracking-tight">
            Ethereal Stage
          </Link>
          <div className="hidden md:flex gap-8">
            <Link to="/" className="text-on-surface font-label text-sm border-b-2 border-primary pb-1">Concerts</Link>
            <a href="#" className="text-on-surface-variant hover:text-on-surface font-label text-sm transition-colors">Venues</a>
            <a href="#" className="text-on-surface-variant hover:text-on-surface font-label text-sm transition-colors">Tours</a>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <Search size={20} />
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <User size={20} />
          </button>
          <button className="md:hidden text-primary">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="w-full py-16 px-8 flex flex-col items-center border-t border-white/5 bg-surface-low mt-24">
      <div className="text-xl font-bold text-primary mb-6 font-headline">Ethereal Stage</div>
      <div className="flex flex-wrap justify-center gap-8 mb-10">
        <a href="#" className="text-on-surface-variant hover:text-primary underline underline-offset-4 font-label text-sm transition-all">Privacy Policy</a>
        <a href="#" className="text-on-surface-variant hover:text-primary underline underline-offset-4 font-label text-sm transition-all">Terms of Service</a>
        <a href="#" className="text-on-surface-variant hover:text-primary underline underline-offset-4 font-label text-sm transition-all">Help Center</a>
        <a href="#" className="text-on-surface-variant hover:text-primary underline underline-offset-4 font-label text-sm transition-all">Contact</a>
      </div>
      <p className="text-on-surface-variant font-body text-sm opacity-60">
        © 2024 Ethereal Stage. All Rights Reserved.
      </p>
    </footer>
  );
}
