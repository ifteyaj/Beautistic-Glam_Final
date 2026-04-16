import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const locations = [
    {
      city: 'New York',
      address: '245 Fifth Avenue, Suite 500',
      zip: 'New York, NY 10016',
      phone: '+1 (212) 555-0123',
      hours: 'Mon-Sat: 10am-8pm, Sun: 11am-6pm'
    },
    {
      city: 'Los Angeles',
      address: '8500 Beverly Boulevard',
      zip: 'Los Angeles, CA 90048',
      phone: '+1 (310) 555-0456',
      hours: 'Mon-Sat: 10am-9pm, Sun: 11am-7pm'
    },
    {
      city: 'Miami',
      address: '1000 Brickell Avenue',
      zip: 'Miami, FL 33131',
      phone: '+1 (305) 555-0789',
      hours: 'Mon-Sat: 10am-8pm, Sun: 12pm-6pm'
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1600&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Contact"
        />
        <div className="absolute inset-0 bg-stone-900/60" />
        <div className="relative text-center text-white">
          <h1 className="text-5xl md:text-6xl font-serif mb-4">Get in Touch</h1>
          <p className="text-lg text-white/80">We'd love to hear from you</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-sm uppercase tracking-widest text-brand font-bold mb-4">Send a Message</h2>
            <h3 className="text-3xl font-serif text-stone-900 mb-8">Contact Form</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2 font-bold">Name</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-stone-200 rounded-[5px] focus:border-brand focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2 font-bold">Email</label>
                  <input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-stone-200 rounded-[5px] focus:border-brand focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2 font-bold">Subject</label>
                <input 
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 border border-stone-200 rounded-[5px] focus:border-brand focus:outline-none transition-colors"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2 font-bold">Message</label>
                <textarea 
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-stone-200 rounded-[5px] focus:border-brand focus:outline-none transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button 
                type="submit"
                className="bg-brand text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-[5px] hover:bg-brand-hover transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-sm uppercase tracking-widest text-brand font-bold mb-4">Store Locations</h2>
            <h3 className="text-3xl font-serif text-stone-900 mb-8">Visit Us</h3>
            
            <div className="space-y-8">
              {locations.map((loc, index) => (
                <div key={index} className="bg-stone-50 p-6 rounded-[5px]">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-brand" />
                    <h4 className="text-lg font-serif text-stone-900">{loc.city}</h4>
                  </div>
                  <div className="space-y-2 text-sm text-stone-600">
                    <p>{loc.address}</p>
                    <p>{loc.zip}</p>
                    <p className="flex items-center gap-2 mt-3">
                      <Phone className="w-4 h-4" />
                      {loc.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {loc.hours}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-brand/10 rounded-[5px]">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-5 h-5 text-brand" />
                <h4 className="font-bold text-stone-900">Email Us</h4>
              </div>
              <p className="text-stone-600">hello@beautisticglam.com</p>
              <p className="text-xs text-stone-500 mt-2">We respond within 24 hours</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
