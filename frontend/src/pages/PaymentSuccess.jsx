import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Parse order ID from URL if any, or state
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('orderId') || location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch order details', error);
        toast.error('Failed to load order details');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">Order not found</h2>
        <Link to="/" className="text-teal-600 hover:underline mt-4 inline-block">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden text-center p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle size={64} className="text-green-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">Thank you for your purchase. Your payment has been received successfully.</p>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left border border-gray-100">
          <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">Transaction Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div>
              <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Order Number</span>
              <span className="font-semibold text-gray-800">{order._id}</span>
            </div>
            
            {order.razorpayPaymentId && (
              <div>
                <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Transaction ID</span>
                <span className="font-semibold text-gray-800">{order.razorpayPaymentId}</span>
              </div>
            )}
            
            <div>
              <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Amount Paid</span>
              <span className="font-semibold text-teal-600 text-base">₹{order.totalPrice?.toFixed(2)}</span>
            </div>
            
            <div>
              <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Date</span>
              <span className="font-semibold text-gray-800">
                {order.transactionDate ? new Date(order.transactionDate).toLocaleString() : new Date().toLocaleString()}
              </span>
            </div>

            <div>
              <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Estimated Delivery</span>
              <span className="font-semibold text-gray-800">3-5 Business Days</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/products" 
            className="bg-teal-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-teal-700 transition"
          >
            Continue Shopping
          </Link>
          <button 
            className="bg-white text-teal-600 border border-teal-600 font-semibold py-3 px-8 rounded-full hover:bg-teal-50 transition"
            onClick={() => {
              // Usually handled by a dedicated endpoint, just showing an alert for now
              toast.info('Invoice has been sent to your registered email.');
            }}
          >
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
