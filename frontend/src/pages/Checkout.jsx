import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

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
  const [prepaidMethod, setPrepaidMethod] = useState('Credit / Debit Card');
  const [upiId, setUpiId] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    try {
      const finalPaymentMethod = paymentMethod === 'Prepaid' 
        ? `Prepaid - ${prepaidMethod}${prepaidMethod === 'UPI' ? ` (${upiId})` : ''}` 
        : 'Cash on Delivery';

      await api.post('/orders', {
        orderItems: cartItems,
        shippingAddress: { address, city, postalCode, country, phoneNumber },
        paymentMethod: finalPaymentMethod,
        totalPrice: finalPrice,
      });
      clearCart();
      toast.success('Order done successfully');
      setShowSuccessModal(true);
    } catch (error) {
      toast.error('Failed to place order');
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
                <span className="ml-2 text-gray-700 font-medium">Prepaid (Card / UPI / QR)</span>
              </label>
            </div>

            {paymentMethod === 'Prepaid' && (
              <div className="ml-7 mt-3 p-4 bg-gray-50 border border-gray-200 rounded-md">
                <div className="flex gap-6 mb-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="radio" className="form-radio text-teal-600 h-4 w-4" value="Credit / Debit Card" checked={prepaidMethod === 'Credit / Debit Card'} onChange={(e) => setPrepaidMethod(e.target.value)} />
                    <span className="ml-2 text-sm text-gray-700">Card</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="radio" className="form-radio text-teal-600 h-4 w-4" value="UPI" checked={prepaidMethod === 'UPI'} onChange={(e) => setPrepaidMethod(e.target.value)} />
                    <span className="ml-2 text-sm text-gray-700">UPI</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="radio" className="form-radio text-teal-600 h-4 w-4" value="QR Code" checked={prepaidMethod === 'QR Code'} onChange={(e) => setPrepaidMethod(e.target.value)} />
                    <span className="ml-2 text-sm text-gray-700">QR Code</span>
                  </label>
                </div>
                
                {prepaidMethod === 'Credit / Debit Card' && (
                  <div className="text-sm text-gray-500 italic p-3 bg-white border rounded">You will be securely redirected to the payment gateway after placing the order.</div>
                )}

                {prepaidMethod === 'UPI' && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Enter UPI ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. yourname@okaxis" 
                      value={upiId} 
                      onChange={(e) => setUpiId(e.target.value)} 
                      required={paymentMethod === 'Prepaid' && prepaidMethod === 'UPI'} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" 
                    />
                  </div>
                )}

                {prepaidMethod === 'QR Code' && (
                  <div className="flex flex-col items-center justify-center p-4 bg-white border rounded">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=dummy@upi&pn=Vipul%20Rana&am=${finalPrice}`} alt="QR Code" className="w-32 h-32 mb-3 shadow-sm border p-2" />
                    <p className="text-xs text-gray-600 text-center font-medium">Scan this QR code with PhonePe, GPay, or Paytm to pay <span className="font-bold text-teal-700">₹{finalPrice.toFixed(2)}</span></p>
                  </div>
                )}
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
              className="w-full bg-teal-600 text-white font-bold py-3 rounded-md hover:bg-teal-700 transition"
            >
              Place Order
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
