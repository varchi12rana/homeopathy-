import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-emerald-900 mb-6">Shipping Policy</h1>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-emerald-100 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">Order Processing</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Orders are processed within 24–48 hours after confirmation.</li>
            <li>Orders placed on Sundays or holidays are dispatched the next business day.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">Delivery Time</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>India:</strong> 4-6 business days</li>
            <li><strong>International:</strong> 15-21 business days.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">Shipping Charges</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Free shipping on orders above ₹499 (India only)</li>
            <li>Standard charges apply for international deliveries.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">Order Tracking</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Once shipped, tracking details will be shared via SMS/email.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">Delays</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Shipments may be delayed due to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Weather conditions</li>
            <li>High-demand periods</li>
            <li>Courier partner issues</li>
            <li>Unforeseen logistics challenges</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;
