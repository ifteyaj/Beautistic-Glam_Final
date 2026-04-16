import React from 'react';
import { Leaf, Heart, Award, Sparkles, Gem, Mail } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <img 
          src="/about us_hero_image.jpg" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="About Beautistic Glam"
        />
        <div className="absolute inset-0 bg-stone-900/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">Our Story</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">Discover the journey behind Beautistic Glam and our passion for clean, luxurious beauty</p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-brand mb-4 font-bold">Our Mission</h2>
            <h3 className="text-4xl font-serif mb-6 text-stone-900">Beauty with Purpose</h3>
            <p className="text-stone-600 leading-relaxed mb-6">
              At Beautistic Glam, we believe that true beauty comes from within. Our journey began with a simple vision: to create luxurious, effective skincare that honors both your skin and the planet.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Every product we create is a testament to our commitment to clean beauty—formulated with potent natural ingredients, free from harmful chemicals, and packaged in sustainable materials that reflect our respect for the environment.
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop" 
              className="rounded-[5px] shadow-2xl"
              alt="Natural ingredients"
            />
            <div className="absolute -bottom-6 -left-6 bg-brand text-white p-6 rounded-[5px]">
              <p className="text-4xl font-serif">10+</p>
              <p className="text-xs uppercase tracking-widest">Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-[#F2EDEA] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs uppercase tracking-[0.2em] text-brand mb-4 font-bold">What We Do</h2>
            <h3 className="text-4xl font-serif text-stone-900">Premium Beauty Products</h3>
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-stone-600 leading-relaxed text-lg">
              We craft premium skincare and cosmetics that deliver real results. From luxurious serums and moisturizers to vibrant lip colors and essential body care, every product is designed to enhance your natural radiance and make you feel confident in your own skin.
            </p>
          </div>
        </div>
      </section>

      {/* Our History */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-xs uppercase tracking-[0.2em] text-brand mb-4 font-bold">Our History</h2>
          <h3 className="text-4xl font-serif text-stone-900">The Journey</h3>
        </div>
        <div className="max-w-3xl mx-auto">
          <p className="text-stone-600 leading-relaxed text-lg">
            Beautistic Glam was founded with a passion for clean, effective beauty. We started as a small boutique brand dedicated to creating products that truly work. Based in Dhaka, Bangladesh, we've grown to serve customers nationwide who share our belief in the power of quality ingredients and ethical beauty.
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs uppercase tracking-[0.2em] text-brand mb-4 font-bold">Our Values</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4">What We Stand For</h3>
            <p className="text-stone-500 max-w-xl mx-auto">Our commitment to excellence guides every product we create</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-8 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl hover:border-brand/30 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-brand/10 rounded-full flex items-center justify-center group-hover:bg-brand/20 transition-colors">
                <Leaf className="w-10 h-10 text-brand" />
              </div>
              <h4 className="text-lg font-serif text-stone-900 mb-3">Clean Ingredients</h4>
              <p className="text-stone-500 leading-relaxed">Only the finest natural and safe ingredients in every formula</p>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl hover:border-brand/30 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-brand/10 rounded-full flex items-center justify-center group-hover:bg-brand/20 transition-colors">
                <Heart className="w-10 h-10 text-brand" />
              </div>
              <h4 className="text-lg font-serif text-stone-900 mb-3">Cruelty-Free</h4>
              <p className="text-stone-500 leading-relaxed">Never tested on animals. Ethical beauty, always.</p>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl hover:border-brand/30 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-brand/10 rounded-full flex items-center justify-center group-hover:bg-brand/20 transition-colors">
                <Award className="w-10 h-10 text-brand" />
              </div>
              <h4 className="text-lg font-serif text-stone-900 mb-3">Premium Quality</h4>
              <p className="text-stone-500 leading-relaxed">Luxury formulations that deliver real, visible results</p>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl hover:border-brand/30 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-brand/10 rounded-full flex items-center justify-center group-hover:bg-brand/20 transition-colors">
                <Sparkles className="w-10 h-10 text-brand" />
              </div>
              <h4 className="text-lg font-serif text-stone-900 mb-3">Sustainable</h4>
              <p className="text-stone-500 leading-relaxed">Eco-conscious packaging and responsible practices</p>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl hover:border-brand/30 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-brand/10 rounded-full flex items-center justify-center group-hover:bg-brand/20 transition-colors">
                <Gem className="w-10 h-10 text-brand" />
              </div>
              <h4 className="text-lg font-serif text-stone-900 mb-3">Inclusive Beauty</h4>
              <p className="text-stone-500 leading-relaxed">Products designed for every skin type and tone</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
