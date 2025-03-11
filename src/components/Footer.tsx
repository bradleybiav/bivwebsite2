
import { cn } from "@/lib/utils";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <a 
              href="#" 
              className="title-font text-2xl font-medium tracking-wider"
            >
              BrainInaVat.Dance
            </a>
            <p className="mt-2 text-sm text-primary-foreground/80 max-w-xs">
              Contemporary movement exploration through artistic expression
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-12">
            <div>
              <h5 className="font-medium mb-4">Navigation</h5>
              <ul className="space-y-2">
                <li>
                  <a href="#hero" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#performances" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Performances
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium mb-4">Connect</h5>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="mailto:info@braininavat.dance" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-primary-foreground/70">
            &copy; {currentYear} Brain in a Vat Dance. All rights reserved.
          </p>
          
          <div className="mt-4 sm:mt-0 flex space-x-6">
            <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
