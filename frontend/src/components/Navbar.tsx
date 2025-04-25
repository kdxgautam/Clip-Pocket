import React, { useState, useEffect } from 'react';
import { Menu, X, Youtube, Github } from 'lucide-react';

interface NavLink {
  href: string;
  text: string;
}

interface NavigationHeaderProps {
  className?: string;
  brandText?: string;
}

const Navbar: React.FC<NavigationHeaderProps> = ({
  className = '',
  brandText = 'Clip Pocket'
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks: NavLink[] = [
    
    { href: '#features', text: 'Features' },
    { href: '#howItWorks', text: 'How It Works' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-neutral-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
    } ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center space-x-2">
            <Youtube className="h-7 w-7 text-red-500" />
            <a href="#" className="text-2xl font-bold text-white">
              {brandText}
            </a>
          </div>
          
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-200 hover:bg-neutral-700/50 hover:text-white px-4 py-2 rounded-md text-base font-medium transition-all duration-200"
              >
                {link.text}
              </a>
            ))}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 bg-white text-black px-4 py-2 rounded-3xl hover:bg-black hover:text-white hover:border"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline-block">Star me on GitHub</span>
            </a>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-200 hover:bg-neutral-700/50 p-2 rounded-md transition-all duration-200"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-2 bg-neutral-800/90 backdrop-blur-sm rounded-lg mt-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-100 hover:bg-neutral-700 block px-4 py-3 rounded-md text-lg font-medium transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.text}
              </a>
            ))}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-100 hover:bg-neutral-700 px-4 py-3 rounded-md text-lg font-medium transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Github className="h-5 w-5" />
              Star me on GitHub
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;