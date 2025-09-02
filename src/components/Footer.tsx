import { Link } from "react-router-dom";
import { X, Instagram, Mail } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return (
    <footer className="bg-card border-t border-primary/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-6 h-6 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/1b627097-cca7-4da0-9dfb-92968194dc92.png" 
                  alt="COSTRAS Logo" 
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="text-xl font-bold text-foreground">COSTRAS</span>
            </Link>
            <p className="text-muted-foreground">
              Leading AI Twitter/X automation platform. Streamline your Twitter engagement and expand your reach.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://x.com/CostrasAI" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <X className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/costras.ai/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" onClick={scrollToTop} className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" onClick={scrollToTop} className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#how-it-works" onClick={scrollToTop} className="text-muted-foreground hover:text-foreground transition-colors">
                  How it Works
                </a>
              </li>
              <li>
                <Link to="/dashboard" onClick={scrollToTop} className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" onClick={scrollToTop} className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/affiliates" onClick={scrollToTop} className="text-muted-foreground hover:text-foreground transition-colors">
                  Affiliates
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={scrollToTop} className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" onClick={scrollToTop} className="text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <a href="/#faq" onClick={scrollToTop} className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <Link to="/privacy" onClick={scrollToTop} className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/20 mt-12 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2025 COSTRAS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;