import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';

const Cart = () => {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const checkoutHandler = () => {
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=/checkout');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link to="/" className="text-teal-600 font-medium hover:underline">Go Shopping</Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.product} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-gray-50 rounded" />
                      <div>
                        <Link to={`/product/${item.product}`} className="font-semibold text-gray-800 hover:text-teal-600">
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500">{item.company} | {item.potency}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <span className="font-bold text-teal-600">₹{item.price}</span>
                      <div className="flex items-center border border-gray-300 rounded-md h-9">
                        <button 
                          onClick={() => addToCart(item, Math.max(1, item.qty - 1))}
                          disabled={item.qty <= 1}
                          className="px-3 h-full text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition"
                        >
                          -
                        </button>
                        <span className="px-3 h-full flex items-center justify-center border-x border-gray-300 font-medium w-10 text-center text-sm bg-gray-50">{item.qty}</span>
                        <button 
                          onClick={() => addToCart(item, Math.min(item.stock, item.qty + 1))}
                          disabled={item.qty >= Math.min(item.stock, 10)}
                          className="px-3 h-full text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-4">Order Summary</h2>
              
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                <span className="font-medium text-gray-800">
                  ₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between mb-4 border-b pb-4">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-800">
                  {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0) < 500 ? '₹100.00' : <span className="text-green-600">Free</span>}
                </span>
              </div>
              
              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-lg font-bold text-teal-600">
                  ₹{(cartItems.reduce((acc, item) => acc + item.qty * item.price, 0) + (cartItems.reduce((acc, item) => acc + item.qty * item.price, 0) < 500 ? 100 : 0)).toFixed(2)}
                </span>
              </div>
              
              <button 
                onClick={checkoutHandler}
                className="w-full bg-teal-600 text-white font-bold py-3 rounded-md hover:bg-teal-700 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
