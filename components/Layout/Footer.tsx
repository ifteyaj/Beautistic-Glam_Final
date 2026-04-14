
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-serif text-white tracking-[0.2em] mb-8">Beautistic Glam</h2>
            <p className="text-sm leading-relaxed mb-8">Crafting premium beauty experiences through nature's most potent ingredients and modern science. Luxury skincare for every body.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-brand transition-colors">Instagram</a>
              <a href="#" className="hover:text-brand transition-colors">Pinterest</a>
              <a href="#" className="hover:text-brand transition-colors">YouTube</a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-brand mb-8 font-bold">Collections</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/shop?category=Face" className="hover:text-white transition-colors">Face Care</Link></li>
              <li><Link to="/shop?category=Serum" className="hover:text-white transition-colors">Serums & Elixirs</Link></li>
              <li><Link to="/shop?category=Body" className="hover:text-white transition-colors">Body Rituals</Link></li>
              <li><Link to="/shop?category=Lips" className="hover:text-white transition-colors">Color Collection</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-brand mb-8 font-bold">The Brand</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/ethics" className="hover:text-white transition-colors">Sustainability</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Store Locator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-brand mb-8 font-bold">Support</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-24 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest">
          <p>© 2024 Beautistic Glam BEAUTY CO. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
             <span className="text-brand font-bold">Handcrafted with Care</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
