
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Brand Column */}
          <div className="flex flex-col items-start">
            <img src="/logo.svg" alt="Beautistic Glam" className="h-10 mb-8 brightness-0 invert" />
            <p className="text-sm leading-relaxed mb-4">Crafting premium beauty experiences through nature's most potent ingredients and modern science.</p>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/beautisticglam?igsh=ZDV0dmtkcmp1dHls" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors text-sm">Instagram</a>
              <a href="https://www.facebook.com/profile.php?id=61576665968495" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors text-sm">Facebook</a>
            </div>
          </div>

          {/* Collections Column */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-brand mb-6 font-bold">Collections</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/shop?category=Face" className="hover:text-white transition-colors">Face Care</Link></li>
              <li><Link to="/shop?category=Serum" className="hover:text-white transition-colors">Serums & Elixirs</Link></li>
              <li><Link to="/shop?category=Body" className="hover:text-white transition-colors">Body Rituals</Link></li>
              <li><Link to="/shop?category=Lips" className="hover:text-white transition-colors">Color Collection</Link></li>
            </ul>
          </div>

          {/* The Brand Column */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-brand mb-6 font-bold">The Brand</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Store Locator</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-brand mb-6 font-bold">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Middle Badda, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:01330800078" className="hover:text-white transition-colors">01330800078</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:beautisticglam@gmail.com" className="hover:text-white transition-colors">beautisticglam@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center text-xs uppercase tracking-widest">
          <p>© 2026 Beautistic Glam. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
