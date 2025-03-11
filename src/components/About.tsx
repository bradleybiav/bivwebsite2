
import { useEffect, useRef } from 'react';

const About = () => {
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

  return (
    <section id="about" className="container-padding" ref={sectionRef}>
      <div className="max-w-5xl mx-auto">
        <h2 className="section-title animate-on-scroll opacity-0">About</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div className="animate-on-scroll opacity-0" style={{ transitionDelay: '100ms' }}>
            <div className="rounded-lg overflow-hidden shadow-md mb-6 transform transition-transform duration-300 hover:scale-[1.01]">
              <div className="aspect-w-4 aspect-h-5 bg-muted">
                {/* Placeholder for image - replace with your actual image */}
                <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
                  <span className="text-primary/40 text-sm">Dancer image</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <p className="body-font text-lg leading-relaxed text-primary/80 animate-on-scroll opacity-0" style={{ transitionDelay: '200ms' }}>
              Brain in a Vat explores the intersection of philosophy, neuroscience, and dance. Through movement, we question perception, reality, and embodied experience.
            </p>
            
            <p className="body-font text-lg leading-relaxed text-primary/80 animate-on-scroll opacity-0" style={{ transitionDelay: '300ms' }}>
              Inspired by the philosophical thought experiment of the same name, our performances challenge audiences to consider the nature of consciousness and reality.
            </p>
            
            <p className="body-font text-lg leading-relaxed text-primary/80 animate-on-scroll opacity-0" style={{ transitionDelay: '400ms' }}>
              Founded by dancers and philosophers, our collective brings together artists from diverse backgrounds to create immersive experiences that blur the boundaries between perceived and actual reality.
            </p>
            
            <div className="pt-4 animate-on-scroll opacity-0" style={{ transitionDelay: '500ms' }}>
              <a href="#performances" className="button-secondary">
                See Our Work
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
