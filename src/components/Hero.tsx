
import { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleParallax = () => {
      if (!heroRef.current) return;
      const scrollPosition = window.scrollY;
      heroRef.current.style.transform = `translateY(${scrollPosition * 0.4}px)`;
      heroRef.current.style.opacity = `${1 - scrollPosition / 700}`;
    };

    window.addEventListener('scroll', handleParallax);
    return () => window.removeEventListener('scroll', handleParallax);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white/90">
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i}
              className={cn(
                "absolute w-64 h-64 rounded-full bg-primary/10",
                "animate-float opacity-30",
                i % 2 === 0 ? "animate-delay-300" : "animate-delay-100"
              )}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${6 + i}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div 
        ref={heroRef}
        className="container mx-auto px-4 relative z-10 text-center"
      >
        <h1 className="title-font text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary font-light tracking-wide mb-6 animate-slide-down opacity-0" style={{ animationDelay: '300ms' }}>
          Brain in a Vat
        </h1>
        <h2 className="body-font text-xl sm:text-2xl md:text-3xl text-primary/80 font-light max-w-3xl mx-auto mb-10 animate-slide-down opacity-0" style={{ animationDelay: '500ms' }}>
          Contemporary movement exploration through artistic expression
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up opacity-0" style={{ animationDelay: '700ms' }}>
          <a href="#performances" className="button-primary">
            Explore Performances
          </a>
          <a href="#contact" className="button-secondary">
            Get in Touch
          </a>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-pulse">
        <span className="text-primary/60 text-sm mb-2">Scroll to explore</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 text-primary/60"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
