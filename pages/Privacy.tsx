import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen">
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Privacy"
        />
        <div className="absolute inset-0 bg-stone-900/60" />
        <div className="relative text-center text-white">
          <h1 className="text-5xl md:text-6xl font-serif mb-4">Privacy Policy</h1>
          <p className="text-lg text-white/80">Last updated: January 2026</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="prose prose-stone max-w-none">
          <p className="text-lg text-stone-600 mb-8">
            At Beautistic Glam, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
          </p>

          <h2 className="text-2xl font-serif text-stone-900 mt-12 mb-4">1. Information We Collect</h2>
          <h3 className="text-lg font-bold text-stone-800 mt-6 mb-2">Personal Information</h3>
          <p className="text-stone-600 mb-4">We may collect personal information that you voluntarily provide when you:</p>
          <ul className="list-disc pl-6 text-stone-600 space-y-2 mb-6">
            <li>Create an account or register on our website</li>
            <li>Place an order or make a purchase</li>
            <li>Subscribe to our newsletter</li>
            <li>Contact us for support</li>
            <li>Participate in promotions or surveys</li>
          </ul>
          <p className="text-stone-600 mb-6">This information may include: name, email address, postal address, phone number, payment information, and purchase history.</p>

          <h3 className="text-lg font-bold text-stone-800 mt-6 mb-2">Automatically Collected Information</h3>
          <p className="text-stone-600 mb-6">When you visit our website, we automatically collect certain information, including: IP address, browser type, operating system, device identifiers, pages visited, time spent on pages, and referring website addresses.</p>

          <h2 className="text-2xl font-serif text-stone-900 mt-12 mb-4">2. How We Use Your Information</h2>
          <p className="text-stone-600 mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-stone-600 space-y-2 mb-6">
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Respond to your questions and provide customer support</li>
            <li>Send promotional communications (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Detect and prevent fraud</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-serif text-stone-900 mt-12 mb-4">3. Information Sharing</h2>
          <p className="text-stone-600 mb-4">We do not sell your personal information. We may share your information with:</p>
          <ul className="list-disc pl-6 text-stone-600 space-y-2 mb-6">
            <li><strong>Service providers:</strong> Companies that help us operate our business (payment processors, shipping carriers, email service providers)</li>
            <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Business transfers:</strong> In the event of a merger or acquisition</li>
          </ul>

          <h2 className="text-2xl font-serif text-stone-900 mt-12 mb-4">4. Data Security</h2>
          <p className="text-stone-600 mb-6">
            We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security assessments. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2 className="text-2xl font-serif text-stone-900 mt-12 mb-4">5. Your Rights</h2>
          <p className="text-stone-600 mb-4">Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-6 text-stone-600 space-y-2 mb-6">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Delete your personal information</li>
            <li>Opt out of marketing communications</li>
            <li>Request data portability</li>
            <li>Restrict processing of your information</li>
          </ul>
          <p className="text-stone-600 mb-6">To exercise these rights, contact us at privacy@beautisticglam.com.</p>

          <h2 className="text-2xl font-serif text-stone-900 mt-12 mb-4">6. Cookies</h2>
          <p className="text-stone-600 mb-6">
            We use cookies and similar technologies to enhance your browsing experience. You can control cookies through your browser settings. For more details, see our Cookie Policy.
          </p>

          <h2 className="text-2xl font-serif text-stone-900 mt-12 mb-4">7. Contact Us</h2>
          <p className="text-stone-600 mb-6">
            If you have questions about this Privacy Policy, please contact us at:<br />
            <strong>Email:</strong> privacy@beautisticglam.com<br />
            <strong>Mail:</strong> Beautistic Glam, Attn: Privacy Team, 245 Fifth Avenue, Suite 500, New York, NY 10016
          </p>

          <h2 className="text-2xl font-serif text-stone-900 mt-12 mb-4">8. Changes to This Policy</h2>
          <p className="text-stone-600 mb-6">
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
