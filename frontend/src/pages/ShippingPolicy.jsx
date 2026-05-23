import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-emerald-900 mb-6">Shipping Policy</h1>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-emerald-100 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">1. Order Processing Time</h2>
          <p className="text-gray-700 leading-relaxed">
            All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">2. Shipping Rates & Delivery Estimates</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Shipping charges for your order will be calculated and displayed at checkout.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Standard Shipping:</strong> 3-5 business days - $5.00 (Free for orders over $50)</li>
            <li><strong>Express Shipping:</strong> 1-2 business days - $15.00</li>
            <li><strong>Overnight Shipping:</strong> 1 business day - $25.00</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">3. Shipment Confirmation & Order Tracking</h2>
          <p className="text-gray-700 leading-relaxed">
            You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">4. Damages</h2>
          <p className="text-gray-700 leading-relaxed">
            HOMEOVIA is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;
