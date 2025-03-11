
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 md:py-6",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <a 
          href="#" 
          className="title-font text-2xl md:text-3xl font-medium tracking-wider text-primary"
        >
          BrainInaVat.Dance
        </a>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center p-2 text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="sr-only">Open menu</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#about" className="nav-link">About</a>
          <a href="#performances" className="nav-link">Performances</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>
      </div>
      
      {/* Mobile navigation */}
      <div 
        className={cn(
          "md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-md transition-all duration-300 ease-in-out overflow-hidden",
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col space-y-4 p-6">
          <a 
            href="#about" 
            className="text-primary hover:text-primary/80 transition-colors py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </a>
          <a 
            href="#performances" 
            className="text-primary hover:text-primary/80 transition-colors py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Performances
          </a>
          <a 
            href="#contact" 
            className="text-primary hover:text-primary/80 transition-colors py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
