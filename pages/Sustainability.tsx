import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Recycle, Heart, Globe } from 'lucide-react';

const Sustainability: React.FC = () => {
  const initiatives = [
    {
      icon: Leaf,
      title: 'Natural Ingredients',
      description: 'We source 95% of our ingredients from natural and organic origins, avoiding harsh chemicals and synthetic preservatives.'
    },
    {
      icon: Recycle,
      title: 'Sustainable Packaging',
      description: 'All our packaging is recyclable, reusable, or biodegradable. We\'ve eliminated single-use plastics from our supply chain.'
    },
    {
      icon: Globe,
      title: 'Carbon Neutral',
      description: 'We offset 100% of our carbon emissions through verified environmental programs and sustainable manufacturing practices.'
    },
    {
      icon: Heart,
      title: 'Cruelty-Free',
      description: 'We never test on animals. All our products are certified cruelty-free by Leaping Bunny and PETA.'
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1600&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Nature"
        />
        <div className="absolute inset-0 bg-stone-900/60" />
        <div className="relative text-center text-white max-w-3xl px-4">
          <h1 className="text-5xl md:text-6xl font-serif mb-6">Our Commitment to the Earth</h1>
          <p className="text-lg text-white/80">Every product we create honors the planet that inspires our ingredients.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-sm uppercase tracking-widest text-brand font-bold mb-4">Our Promise</h2>
          <h3 className="text-4xl font-serif text-stone-900 mb-6">Beauty That Gives Back</h3>
          <p className="text-stone-600 max-w-2xl mx-auto">
            We believe luxury and sustainability go hand in hand. Every decision we make considers its impact on the environment, from sourcing to packaging to shipping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {initiatives.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-[5px] border border-stone-200 hover:border-brand transition-colors">
              <div className="w-14 h-14 bg-brand/10 rounded-full flex items-center justify-center mb-6">
                <item.icon className="w-7 h-7 text-brand" />
              </div>
              <h4 className="text-xl font-serif text-stone-900 mb-3">{item.title}</h4>
              <p className="text-stone-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-stone-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm uppercase tracking-widest text-brand font-bold mb-4">Looking Forward</h2>
              <h3 className="text-4xl font-serif text-stone-900 mb-6">Our 2026 Goals</h3>
              <ul className="space-y-4 text-stone-600">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-brand rounded-full mt-2" />
                  <span>Achieve 100% renewable energy in manufacturing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-brand rounded-full mt-2" />
                  <span>Launch refillable product line to reduce waste</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-brand rounded-full mt-2" />
                  <span>Partner with ocean cleanup initiatives</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-brand rounded-full mt-2" />
                  <span>Achieve B-Corp certification</span>
                </li>
              </ul>
            </div>
            <div className="relative h-96 rounded-[5px] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full object-cover"
                alt="Sustainability"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h3 className="text-3xl font-serif text-stone-900 mb-6">Join Our Journey</h3>
        <p className="text-stone-600 max-w-xl mx-auto mb-8">
          Every purchase you make supports our environmental initiatives. Together, we can make a difference.
        </p>
        <Link to="/shop" className="inline-block bg-brand text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-[5px] hover:bg-brand-hover transition-colors">
          Shop Sustainably
        </Link>
      </section>
    </div>
  );
};

export default Sustainability;
