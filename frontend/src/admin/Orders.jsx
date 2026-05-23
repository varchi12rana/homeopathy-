import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/admin');
      setOrders(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch orders');
      setLoading(false);
    }
  };

  const statusUpdateHandler = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin" className="text-gray-500 hover:text-teal-600">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Manage Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
          No orders found.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700 uppercase text-sm border-b">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">User & Shipping</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">...{order._id.substring(18)}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-bold mb-1">{order.user ? order.user.name : 'Deleted User'}</div>
                      <div className="text-xs text-gray-500 max-w-xs truncate" title={`${order.shippingAddress?.address}, ${order.shippingAddress?.city}, ${order.shippingAddress?.country}`}>
                        {order.shippingAddress?.address}, {order.shippingAddress?.city}
                      </div>
                      <div className="text-xs font-semibold text-emerald-600 mt-1">
                        📞 {order.shippingAddress?.phoneNumber || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-teal-600">₹{order.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 
                          order.orderStatus === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                          order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}
                      `}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <select 
                        className="border rounded px-2 py-1 outline-none text-sm"
                        value={order.orderStatus}
                        onChange={(e) => statusUpdateHandler(order._id, e.target.value)}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      {order.orderStatus !== 'Cancelled' && (
                        <button 
                          onClick={() => {
                            if(window.confirm('Are you sure you want to cancel this order?')) {
                              statusUpdateHandler(order._id, 'Cancelled');
                            }
                          }}
                          className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm font-semibold hover:bg-red-100 transition shadow-sm border border-red-100"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
