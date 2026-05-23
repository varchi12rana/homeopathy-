import React, { useState } from 'react';
import api from '../services/api';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (orderId.trim() === '') return;
    
    setLoading(true);
    setError('');
    setStatus(null);
    
    try {
      const { data } = await api.get(`/orders/${orderId.trim()}`);
      setStatus({
        id: data._id,
        status: data.orderStatus,
        expectedDelivery: 'Standard Delivery',
        carrier: 'Internal Logistics'
      });
    } catch (err) {
      setError('Order not found. Please check your Order ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <h1 className="text-3xl font-bold text-emerald-900 mb-6 text-center">Track Your Order</h1>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-emerald-100">
        <p className="mb-6 text-gray-700 text-center">
          Enter your Order ID below to check the current status of your shipment.
        </p>
        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <input 
              type="text" 
              placeholder="e.g., ORD-12345678" 
              value={orderId} 
              onChange={(e) => setOrderId(e.target.value)} 
              className="w-full px-4 py-3 border border-emerald-300 rounded focus:outline-none focus:border-emerald-500" 
              required
            />
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded hover:bg-emerald-700 transition font-semibold" disabled={loading}>
            {loading ? 'Tracking...' : 'Track Order'}
          </button>
        </form>

        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">{error}</div>}

        {status && (
          <div className="mt-8 p-4 bg-emerald-50 rounded border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 text-lg mb-4 border-b border-emerald-200 pb-2">Tracking Results</h3>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-medium">Order ID:</span> {status.id}</p>
              <p><span className="font-medium">Current Status:</span> <span className="text-emerald-600 font-bold">{status.status}</span></p>
              <p><span className="font-medium">Expected Delivery:</span> {status.expectedDelivery}</p>
              <p><span className="font-medium">Carrier:</span> {status.carrier}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
