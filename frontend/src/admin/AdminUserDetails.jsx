import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, User, ShoppingCart, Package, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AdminUserDetails = () => {
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [userDetails, setUserDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const { data } = await api.get(`/users/${id}`);
        setUserDetails(data.user);
        setOrders(data.orders);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch user details');
        setLoading(false);
      }
    };
    
    fetchUserDetails();
  }, [id, currentUser, navigate]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>;
  if (!userDetails) return <div className="text-center py-20 text-gray-500">User not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4 border-b pb-4">
        <Link to="/admin/users" className="text-gray-500 hover:text-teal-600">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <User className="text-teal-600" />
          User Details
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-6 h-max">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Profile Info</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-semibold text-gray-800 text-lg">{userDetails.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-1"><Mail size={14}/> Email</p>
              <a href={`mailto:${userDetails.email}`} className="font-medium text-teal-600 hover:underline">{userDetails.email}</a>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-1"><Phone size={14}/> Mobile Number</p>
              <p className="font-medium text-gray-800">{userDetails.mobileNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-1"><Calendar size={14}/> Join Date</p>
              <p className="font-medium text-gray-800">{new Date(userDetails.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <span className={`px-2 py-1 rounded text-xs font-bold ${userDetails.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {userDetails.role.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Cart & Orders */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Active Cart */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gray-50 p-4 border-b flex items-center gap-2">
              <ShoppingCart className="text-teal-600" />
              <h2 className="text-xl font-bold text-gray-800">Active Cart Items</h2>
            </div>
            <div className="p-0">
              {userDetails.cart && userDetails.cart.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {userDetails.cart.map((item, idx) => (
                    <li key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                      <div className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-gray-100 rounded" />
                        <div>
                          <p className="font-semibold text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.qty} &times; ₹{item.price}</p>
                        </div>
                      </div>
                      <div className="font-bold text-teal-600">
                        ₹{(item.qty * item.price).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-6 text-center text-gray-500">The user's cart is empty.</p>
              )}
            </div>
          </div>

          {/* Past Orders */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gray-50 p-4 border-b flex items-center gap-2">
              <Package className="text-teal-600" />
              <h2 className="text-xl font-bold text-gray-800">Order History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 font-semibold text-gray-600 text-sm">Order ID</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">Date</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">Total</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.length > 0 ? orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <Link to={`/admin/orders`} className="text-teal-600 font-medium hover:underline text-sm">
                          {order._id}
                        </Link>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-bold text-gray-800">
                        ₹{order.totalPrice.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold
                          ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 
                            order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-700' : 
                            order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                            'bg-orange-100 text-orange-700'}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="p-6 text-center text-gray-500">
                        No orders found for this user.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;
