import React from 'react';

const RefundAndCancellation = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-emerald-900 mb-6">Refund & Cancellation Policy</h1>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-emerald-100 space-y-6">
        <section>
          <p className="text-gray-700 leading-relaxed mb-6">
            At HOMEOVIA, customer satisfaction is our priority. If you are not completely satisfied with your purchase, please review our return and refund policy below.
          </p>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">1. Return Eligibility</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            You may request a return within 24-48 hours of receiving your order if:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>The product was delivered damaged.</li>
            <li>You received the wrong product.</li>
            <li>The product is expired at the time of delivery.</li>
            <li>The product is missing items or has a manufacturing defect.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4">To be eligible for a return:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>The product must be unused and in its original condition.</li>
            <li>The original packaging, labels, invoice, and accessories must be included.</li>
            <li>A clear unboxing video and photographs may be requested to verify the issue.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">2. Non-Returnable Items</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            For hygiene and safety reasons, we do not accept returns for:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Opened or used medicines.</li>
            <li>Homeopathic medicines with broken seals.</li>
            <li>Personal care products that have been opened or used.</li>
            <li>Products damaged due to customer misuse.</li>
            <li>Products purchased during clearance or special promotional sales (unless damaged or incorrect).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">3. Return Process</h2>
          <p className="text-gray-700 leading-relaxed mb-4">To initiate a return:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Email us at @homeovia.care@gmail.com</li>
            <li>Mention your Order ID, reason for return, and attach clear photos or videos of the product.</li>
            <li>Our support team will review your request within 1–2 business days.</li>
            <li>If approved, we will arrange pickup where available. If pickup is unavailable, customers may be requested to ship the product to our return address.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">4. Refund Policy</h2>
          <p className="text-gray-700 leading-relaxed mb-4">Once the returned product is received and inspected:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Approved refunds will be processed within 5–7 business days.</li>
            <li>Refunds will be credited to the original payment method.</li>
            <li>For Cash on Delivery (COD) orders, refunds will be made via bank transfer or UPI after receiving the required account details.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">5. Return Shipping Charges</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>If the return is due to our mistake (wrong, damaged, defective, or expired product), HOMEOVIA will bear the return shipping cost.</li>
            <li>If the return is due to any other eligible reason, the customer may be responsible for the return shipping charges.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">6. Order Cancellation</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Orders can be cancelled before dispatch for a full refund.</li>
            <li>Once an order has been dispatched, it cannot be cancelled and will be subject to this Return & Refund Policy.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">7. Replacement</h2>
          <p className="text-gray-700 leading-relaxed">
            If a replacement product is available, we may offer a replacement instead of a refund. If the product is unavailable, a full refund will be issued.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">8. Refund Timeline</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Return Request Approval:</strong> 1–2 Business Days</li>
            <li><strong>Product Inspection:</strong> 1–2 Business Days</li>
            <li><strong>Refund Processing:</strong> 5–7 Business Days</li>
            <li><strong>Bank/Credit Card Processing:</strong> 2–7 Business Days (depending on the payment provider)</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default RefundAndCancellation;
