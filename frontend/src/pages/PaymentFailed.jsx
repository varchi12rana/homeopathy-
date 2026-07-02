import { useLocation, Link, useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden text-center p-10 border-t-4 border-red-500">
        <div className="flex justify-center mb-6">
          <div className="bg-red-50 p-4 rounded-full">
            <XCircle size={64} className="text-red-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We couldn't process your payment. This might be due to a network issue, an incorrect OTP, or a declined transaction from your bank.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <button 
            onClick={() => navigate('/checkout')}
            className="bg-teal-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-teal-700 transition"
          >
            Retry Payment
          </button>
          <Link 
            to="/cart" 
            className="bg-white text-gray-700 border border-gray-300 font-semibold py-3 px-8 rounded-full hover:bg-gray-50 transition"
          >
            Return to Cart
          </Link>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 text-sm text-gray-500">
          If you continue to experience issues or if amount was deducted, please contact our support at <a href="mailto:homeovia.care@gmail.com" className="text-teal-600 font-medium hover:underline">homeovia.care@gmail.com</a>.
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
