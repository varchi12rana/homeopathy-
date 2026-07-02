import React from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Helmet>
        <title>Privacy Policy | Homeovia</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold text-emerald-900 mb-8 text-center">Privacy Policy</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 text-gray-700 space-y-8">
        <p className="text-lg">
          At Homeovia, your privacy is extremely important to us. This policy explains how we collect, use, and protect your information.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name, phone number, email</li>
            <li>Billing and delivery address</li>
            <li>Payment information (secured by payment partners)</li>
            <li>Browsing data, cookies, and device information</li>
            <li>Order history and preferences</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">How Your Data Is Used</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To process and deliver orders</li>
            <li>To improve our website and user experience</li>
            <li>To communicate updates about orders</li>
            <li>To send promotional messages (only with your consent)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">Data Protection</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>SSL-enabled secure website</li>
            <li>Encrypted payment processing</li>
            <li>No unauthorized access to your data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">Sharing of Information</h2>
          <p className="mb-2">We only share your details with:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Courier partners</li>
            <li>Payment gateways</li>
            <li>Internal customer support</li>
          </ul>
          <p>We do not sell your personal information.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">Your Rights</h2>
          <p className="mb-2">You may request to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal data</li>
            <li>Modify or delete your data</li>
            <li>Opt-out of marketing communication</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">Contact</h2>
          <p>
            For any privacy-related concerns, please contact us at:{' '}
            <a href="mailto:homeovia.care@gmail.com" className="text-emerald-600 hover:text-emerald-800 hover:underline">
              homeovia.care@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
