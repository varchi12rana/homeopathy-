import React from 'react';

const RefundAndCancellation = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-emerald-900 mb-6">Refund & Cancellation Policy</h1>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-emerald-100 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">Order Cancellation</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Orders can be cancelled only before dispatch.</li>
            <li>Once shipped, cancellation is not possible.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">Refund Eligibility</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Refunds are offered only in the following cases:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Damaged or leaked product received</li>
            <li>Wrong product delivered</li>
            <li>Expired product delivered</li>
          </ul>
          <p className="text-red-600 font-medium mt-4">
            Important: Refund requests must be raised within 48 hours of receiving the order. Photo/video proof is mandatory.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">Non-Returnable Items</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Opened or used products</li>
            <li>Items damaged due to customer mishandling</li>
            <li>Products without original packaging</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">Refund Timeline</h2>
          <p className="text-gray-700 leading-relaxed">
            Once approved, refunds take 5–7 business days to reflect in your original payment method.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">Return Shipping</h2>
          <p className="text-gray-700 leading-relaxed">
            If the return is approved, we will arrange reverse pickup or provide instructions for return shipment.
          </p>
        </section>
      </div>
    </div>
  );
};

export default RefundAndCancellation;
