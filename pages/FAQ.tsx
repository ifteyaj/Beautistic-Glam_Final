import React, { useState } from 'react';
import { ChevronDown, Package, RotateCcw, Truck, CreditCard, Shield } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Shipping',
      icon: Truck,
      questions: [
        {
          q: 'How long will my order take to arrive?',
          a: 'Standard shipping takes 5-7 business days. Express shipping (2-3 business days) is available at checkout. Orders placed before 2pm EST ship same day.'
        },
        {
          q: 'Do you offer free shipping?',
          a: 'Yes! We offer free standard shipping on all orders over $75. Orders under $75 have a flat rate of $8.95.'
        },
        {
          q: 'Can I track my order?',
          a: 'Absolutely. Once your order ships, you\'ll receive a confirmation email with a tracking number. You can also track your order in your account dashboard.'
        }
      ]
    },
    {
      category: 'Returns & Refunds',
      icon: RotateCcw,
      questions: [
        {
          q: 'What is your return policy?',
          a: 'We offer a 30-day satisfaction guarantee. If you\'re not completely happy with your purchase, return it for a full refund. Products must be at least 75% full.'
        },
        {
          q: 'How do I initiate a return?',
          a: 'Log into your account, go to Order History, and click "Return Item" next to the product you wish to return. We\'ll email you a prepaid return label.'
        },
        {
          q: 'How long do refunds take?',
          a: 'Once we receive your return, refunds are processed within 3-5 business days. The refund will appear on your original payment method within 5-10 additional days.'
        }
      ]
    },
    {
      category: 'Products',
      icon: Package,
      questions: [
        {
          q: 'Are your products vegan and cruelty-free?',
          a: 'Yes! All Beautistic Glam products are 100% vegan and never tested on animals. We\'re certified by Leaping Bunny and PETA.'
        },
        {
          q: 'Are your products safe for sensitive skin?',
          a: 'Our products are dermatologist-tested and formulated without common irritants. We recommend doing a patch test first. Each product page lists all ingredients.'
        },
        {
          q: 'Do you offer samples?',
          a: 'Yes! Every order includes complimentary samples of our newest products. You can also request specific samples at checkout.'
        }
      ]
    },
    {
      category: 'Payment',
      icon: CreditCard,
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. Cash on Delivery is available for select regions.'
        },
        {
          q: 'Is my payment information secure?',
          a: 'Absolutely. All transactions are encrypted and processed through PCI-compliant payment processors. We never store your full credit card information.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1600&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Shipping"
        />
        <div className="absolute inset-0 bg-stone-900/60" />
        <div className="relative text-center text-white">
          <h1 className="text-5xl md:text-6xl font-serif mb-4">Shipping & Returns</h1>
          <p className="text-lg text-white/80">Everything you need to know</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="space-y-8">
          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white border border-stone-100 rounded-[5px] overflow-hidden shadow-sm">
              <div className="p-6 bg-stone-50 flex items-center gap-4">
                <section.icon className="w-6 h-6 text-brand" />
                <h3 className="text-xl font-serif text-stone-900">{section.category}</h3>
              </div>
              <div className="divide-y divide-stone-100">
                {section.questions.map((item, qIndex) => (
                  <div key={qIndex}>
                    <button
                      onClick={() => setOpenIndex(openIndex === qIndex ? null : qIndex)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-stone-50 transition-colors"
                    >
                      <span className="font-medium text-stone-900 pr-4">{item.q}</span>
                      <ChevronDown className={`w-5 h-5 text-brand transition-transform ${openIndex === qIndex ? 'rotate-180' : ''}`} />
                    </button>
                    {openIndex === qIndex && (
                      <div className="px-6 pb-6">
                        <p className="text-stone-600 leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-brand/5 p-8 rounded-[5px] text-center">
          <Shield className="w-12 h-12 text-brand mx-auto mb-4" />
          <h3 className="text-xl font-serif text-stone-900 mb-2">Still have questions?</h3>
          <p className="text-stone-600 mb-4">Our customer care team is here to help.</p>
          <a href="mailto:hello@beautisticglam.com" className="text-brand font-bold hover:underline">
beautisticglam@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
