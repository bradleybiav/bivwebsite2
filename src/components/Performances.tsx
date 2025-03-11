
import { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface Performance {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
}

const performances: Performance[] = [
  {
    id: 1,
    title: "The Cartesian Dream",
    description: "An exploration of the divide between mind and body through contemporary movement.",
    date: "June 2023",
    location: "Modern Art Gallery, New York",
    image: "",
  },
  {
    id: 2,
    title: "Perception & Reality",
    description: "A duet investigating the boundaries of sensory experience and objective truth.",
    date: "October 2023",
    location: "Dance Underground, Chicago",
    image: "",
  },
  {
    id: 3,
    title: "Neural Pathways",
    description: "An immersive performance exploring consciousness and the physical brain.",
    date: "February 2024",
    location: "Contemporary Art Space, Los Angeles",
    image: "",
  },
];

const Performances = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
    };
  }, []);
  
  // Auto-rotate through performances
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % performances.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="performances" className="bg-secondary/50 container-padding" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title animate-on-scroll opacity-0">Performances</h2>
        <h3 className="section-subtitle animate-on-scroll opacity-0" style={{ transitionDelay: '100ms' }}>
          Recent and upcoming works
        </h3>
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mt-12">
          {/* Performance display */}
          <div className="lg:w-2/3 animate-on-scroll opacity-0" style={{ transitionDelay: '200ms' }}>
            <div className="relative aspect-w-16 aspect-h-9 bg-white rounded-lg shadow-md overflow-hidden">
              {/* This would be replaced with actual performance images */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
                <div className="text-center p-8">
                  <h3 className="title-font text-2xl md:text-3xl text-primary mb-4">
                    {performances[activeIndex].title}
                  </h3>
                  <p className="body-font text-primary/80 mb-6 max-w-lg mx-auto">
                    {performances[activeIndex].description}
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                    <div className="flex items-center text-primary/70">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{performances[activeIndex].date}</span>
                    </div>
                    <div className="flex items-center text-primary/70">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{performances[activeIndex].location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {performances.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    index === activeIndex 
                      ? "bg-primary scale-100" 
                      : "bg-primary/30 scale-75 hover:bg-primary/50 hover:scale-90"
                  )}
                  aria-label={`View performance ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Performance list */}
          <div className="lg:w-1/3 animate-on-scroll opacity-0" style={{ transitionDelay: '300ms' }}>
            <div className="bg-white rounded-lg shadow-sm p-6 h-full">
              <h4 className="title-font text-xl mb-6 text-primary">All Performances</h4>
              <div className="space-y-6">
                {performances.map((performance, index) => (
                  <div 
                    key={performance.id}
                    className={cn(
                      "p-4 rounded-md transition-all duration-300 cursor-pointer",
                      index === activeIndex 
                        ? "bg-primary/5 border-l-4 border-primary" 
                        : "hover:bg-primary/5"
                    )}
                    onClick={() => setActiveIndex(index)}
                  >
                    <h5 className="title-font text-lg text-primary mb-2">{performance.title}</h5>
                    <p className="text-sm text-primary/70 mb-3">{performance.date}</p>
                    <p className="text-sm text-primary/80 line-clamp-2">{performance.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <a href="#contact" className="button-secondary">
                  Booking Inquiries
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Performances;
