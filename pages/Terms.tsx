import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen">
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Terms"
        />
        <div className="absolute inset-0 bg-stone-900/60" />
        <div className="relative text-center text-white">
          <h1 className="text-5xl md:text-6xl font-serif mb-4">Terms of Service</h1>
          <p className="text-lg text-white/80">Last updated: January 2026</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="prose prose-stone max-w-none">
          <p className="text-lg text-stone-600 mb-8">
            Welcome to Beautistic Glam. By accessing or using our website, you agree to be bound by these Terms of Service.
          </p>

          <h2 className="text-2xl font-serif text-stone-900 mt-12 mb-4">1. Acceptance of Terms</h2>
          <p className="text-stone-600 mb-6">
            By accessing or using the Beautistic Glam website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>

          <h2 className="text-2xl font-serif text-stone-900 mt-12 mb-4">2. Products and Pricing</h2>
          <h3 className="text-lg font-bold text-stone-800 mt-6 mb-2">Product Information</h3>
          <p className="text-stone-600 mb-6">
            We strive to display accurate product information, including pricing, descriptions, and images. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free. If a product offered by Beautistic Glam is not as described, your sole remedy is to return it in unused condition.
          </p>
          
          <h3 className="text-lg font-bold text-stone-800 mt-6 mb-2">Pricing</h3>
          <p className="text-stone-600 mb-6">
            All prices are listed in US Dollars and are subject to change without notice. We reserve the right to refuse or cancel any orders placed for products listed at an incorrect price.
          </p>

          <h2 className="text-2xl font-serif text-stone-900 mt-12 mb-4">3. Orders and Payment</h2>
          <p className="text-stone-600 mb-4">By placing an order, you agree to:</p>
          <ul className="list-disc pl-6 text-stone-600 space-y-2 mb-6">
            <li>Provide accurate and complete order information</li>
            <li>Be responsible for all charges incurred under your account</li>
            <li>Be the authorized user of the payment method used</li>
            <li>Accept responsibility for any unauthorized use of your account</li>
          </ul>
          <p className="text-stone-600 mb-6">
            We reserve the right to cancel or limit orders at our discretion. Cash on Delivery is available for select regions and may be subject to additional fees.
          </p>

          <h2 className="text-2xl font-serif text-stone-900 mt-12 mb-4">4. Shipping and Delivery</h2>
          <p className="text-stone-600 mb-6">
            Shipping times are estimates only and are not guaranteed. We are not responsible for delays caused by carriers, customs, or events beyond our control. Risk of loss and title for items purchased pass to you upon delivery to the carrier.
          </p>

          <h2 className="text-2xl font-serif text-stone-900 mt-12 mb-4">5. Returns and Refunds</h2>
          <p className="text-stone-600 mb-6">
            Our return policy allows for returns within 30 days of delivery for a full refund. Products must be returned in their original condition with at least 75% remaining. Return shipping costs are the responsibility of the customer unless the return is due to our error. For complete return instructions, please see our Shipping & Returns page.
          </p>

          <h2 className="text-2xl font-serif text-stone-900 mt-12 mb-4">6. Intellectual Property</h2>
          <p className="text-stone-600 mb-6">
            All content on this website, including but not limited to text, graphics, logos, images, audio clips, digital downloads, data compilations, and software, is the property of Beautistic Glam or its content suppliers and is protected by international copyright laws.
          </p>

          <h2 className="text-2xl font-serif text-stone-900 mt-12 mb-4">7. User Conduct</h2>
          <p className="text-stone-600 mb-4">You agree not to:</p>
          <ul className="list-disc pl-6 text-stone-600 space-y-2 mb-6">
            <li>Use the site for any unlawful purpose</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Interfere with or disrupt the site or servers</li>
            <li>Attempt to gain unauthorized access to any accounts or systems</li>
            <li>Use any robot, spider, or automated device to access the site</li>
            <li>Transmit any viruses, worms, or defects</li>
            <li>Harvest or collect information about other users</li>
          </ul>

          <h2 className="text-2xl font-serif text-stone-900 mt-12 mb-4">8. Disclaimer of Warranties</h2>
          <p className="text-stone-600 mb-6">
            THE SITE AND PRODUCTS ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>

          <h2 className="text-2xl font-serif text-stone-900 mt-12 mb-4">9. Limitation of Liability</h2>
          <p className="text-stone-600 mb-6">
            IN NO EVENT SHALL BEAUTISTIC GLAM BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SITE.
          </p>

          <h2 className="text-2xl font-serif text-stone-900 mt-12 mb-4">10. Indemnification</h2>
          <p className="text-stone-600 mb-6">
            You agree to defend, indemnify, and hold harmless Beautistic Glam and its affiliates, licensors, and service providers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees arising out of or relating to your violation of these Terms or your use of the site.
          </p>

          <h2 className="text-2xl font-serif text-stone-900 mt-12 mb-4">11. Governing Law</h2>
          <p className="text-stone-600 mb-6">
            These Terms shall be governed by and construed in accordance with the laws of Bangladesh, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Dhaka.
          </p>

          <h2 className="text-2xl font-serif text-stone-900 mt-12 mb-4">12. Changes to Terms</h2>
          <p className="text-stone-600 mb-6">
            We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on the site. Your continued use of the site after any changes constitutes acceptance of the modified Terms.
          </p>

          <h2 className="text-2xl font-serif text-stone-900 mt-12 mb-4">13. Contact Information</h2>
          <p className="text-stone-600 mb-6">
            For questions about these Terms, please contact us at:<br />
            <strong>Email:</strong> beautisticglam@gmail.com<br />
            <strong>Mail:</strong> Beautistic Glam, Middle Badda, Dhaka, Bangladesh
          </p>
        </div>
      </section>
    </div>
  );
};

export default Terms;
