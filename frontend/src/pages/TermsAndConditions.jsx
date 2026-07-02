import React from 'react';
import { Helmet } from 'react-helmet-async';

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Helmet>
        <title>Terms & Conditions | Homeovia</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold text-emerald-900 mb-8 text-center">Terms & Conditions</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 text-gray-700 space-y-8">
        <p className="text-lg">
          Welcome to Homeovia. By accessing our website or purchasing our products, you agree to the following terms:
        </p>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">Use of Website</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must use this site for lawful purposes only.</li>
            <li>You agree not to copy, reproduce, or misuse any content, images, or product information without permission.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">Product Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We ensure all product details are correct, but variations in results may occur based on individual conditions.</li>
            <li>Products should be used as directed.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">Pricing & Payments</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>All prices listed are subject to change without notice.</li>
            <li>Payments are processed securely through authorized gateways.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">Intellectual Property</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>All content, logos, designs, and product descriptions on this website belong exclusively to Homeovia.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">Limitation of Liability</h2>
          <p className="mb-2">We are not responsible for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Delays in delivery caused by courier partners</li>
            <li>Reactions due to allergies or misuse</li>
            <li>Technical errors causing website downtime</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">Governing Law</h2>
          <p>These terms are governed by Indian law.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
