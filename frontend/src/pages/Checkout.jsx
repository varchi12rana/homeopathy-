import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
    }
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [user, navigate, cartItems]);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shippingPrice = itemsPrice < 500 ? 100 : 0;
  const codCharge = paymentMethod === 'Cash on Delivery' ? 50 : 0;
  const finalPrice = itemsPrice + shippingPrice + codCharge;

  const handleRazorpayPayment = async (orderData) => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      setIsProcessing(false);
      return;
    }

    try {
      const { data: { paymentId, razorpayOrderId, amount, currency, keyId } } = await api.post('/payment/create-order', orderData);

      const options = {
        key: keyId,
        amount: amount.toString(),
        currency: currency,
        name: 'Homeovia',
        description: 'Order Payment',
        image: '/logo 2.png',
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            setIsProcessing(true);
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            };
            const verifyRes = await api.post('/payment/verify', verifyData);
            
            // The order is created upon verification
            const createdOrderId = verifyRes.data.order._id;
            
            clearCart();
            setIsProcessing(false);
            navigate(`/payment-success?orderId=${createdOrderId}`);
          } catch (err) {
            console.error(err);
            setIsProcessing(false);
            navigate('/payment-failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: phoneNumber
        },
        theme: {
          color: '#047857' // emerald-700
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        console.error('Razorpay payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });

      paymentObject.open();
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Failed to initiate payment';
      toast.error(errorMessage);
      setIsProcessing(false);
    }
  };

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const finalPaymentMethod = paymentMethod === 'Prepaid' 
        ? 'Prepaid (Razorpay)' 
        : 'Cash on Delivery';

      const orderData = {
        orderItems: cartItems,
        shippingAddress: { address, city, postalCode, country, phoneNumber },
        paymentMethod: finalPaymentMethod,
        totalPrice: finalPrice,
      };

      if (paymentMethod === 'Prepaid') {
        await handleRazorpayPayment(orderData);
      } else {
        await api.post('/orders', orderData);
        clearCart();
        toast.success('Order placed successfully');
        setShowSuccessModal(true);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to place order');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Shipping Address</h2>
            <form id="checkout-form" onSubmit={placeOrderHandler}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">City</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Postal Code</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Country</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 10) setPhoneNumber(val);
                    }}
                    required
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Payment Method</h2>
            <div className="mb-4">
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  className="form-radio text-teal-600 h-5 w-5" 
                  name="paymentMethod" 
                  value="Cash on Delivery"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ml-2 text-gray-700 font-medium">Cash on Delivery</span>
              </label>
            </div>
            <div className="mb-2">
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  className="form-radio text-teal-600 h-5 w-5" 
                  name="paymentMethod" 
                  value="Prepaid"
                  checked={paymentMethod === 'Prepaid'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ml-2 text-gray-700 font-medium">Pay Online (Cards / UPI / Netbanking)</span>
              </label>
            </div>

            {paymentMethod === 'Prepaid' && (
              <div className="ml-7 mt-3 p-4 bg-gray-50 border border-gray-200 rounded-md">
                <div className="text-sm text-gray-500 italic flex items-center">
                  <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  You will be securely redirected to the Razorpay payment gateway to complete your payment.
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="md:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Order Summary</h2>
            
            <ul className="mb-4 space-y-2">
              {cartItems.map((item) => (
                <li key={item.product} className="flex justify-between text-sm">
                  <span className="text-gray-600 flex-grow truncate mr-2">{item.qty} x {item.name}</span>
                  <span className="font-medium">₹{(item.qty * item.price).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            
            <div className="border-t pt-4 space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">{shippingPrice === 0 ? 'Free' : `₹${shippingPrice.toFixed(2)}`}</span>
              </div>
              {codCharge > 0 && (
                <div className="flex justify-between text-amber-600">
                  <span>COD Charge</span>
                  <span className="font-medium">₹{codCharge.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between font-bold text-lg border-t pt-4 mb-6">
              <span>Total</span>
              <span className="text-teal-600">₹{finalPrice.toFixed(2)}</span>
            </div>
            
            <button 
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              className={`w-full text-white font-bold py-3 rounded-md transition ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center overflow-hidden m-0 p-0">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-pop-in m-auto relative z-[10000]">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-green-200 opacity-50 animate-ping rounded-full"></div>
              <svg className="w-12 h-12 text-green-500 animate-checkmark relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-extrabold text-gray-800 mb-2">Order Received Successfully!</h3>
            <p className="text-gray-600 mb-8">Thank you for your purchase. We are processing your order and will ship it shortly.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => navigate('/orders')}
                className="w-full bg-teal-600 text-white font-bold py-3 rounded-full hover:bg-teal-700 transition"
              >
                View My Orders
              </button>
              <button 
                onClick={() => navigate('/track-order')}
                className="w-full bg-emerald-50 text-teal-700 font-bold py-3 rounded-full hover:bg-emerald-100 transition"
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
