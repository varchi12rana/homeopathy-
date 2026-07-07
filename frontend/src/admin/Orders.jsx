import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const orderIdMatch = order._id?.toLowerCase().includes(searchLower);
    const txnMatch = order.razorpayPaymentId?.toLowerCase().includes(searchLower);
    const nameMatch = order.user?.name?.toLowerCase().includes(searchLower);
    return orderIdMatch || txnMatch || nameMatch;
  });

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

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by Order ID, Payment ID, or Customer Name..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
          No orders found.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700 uppercase text-sm border-b">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">User & Shipping</th>
                  <th className="px-6 py-4">Payment Info</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div>...{order._id.substring(18)}</div>
                      <div className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-teal-600 text-xs font-semibold hover:underline mt-1 inline-block"
                      >
                        View Details
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-bold mb-1">{order.user ? order.user.name : 'Deleted User'}</div>
                      <div className="text-xs text-gray-500 max-w-xs truncate" title={`${order.shippingAddress?.address}, ${order.shippingAddress?.city}, ${order.shippingAddress?.country}`}>
                        {order.shippingAddress?.address}, {order.shippingAddress?.city}
                      </div>
                      <div className="text-xs font-semibold text-emerald-600 mt-1">
                        📞 {order.shippingAddress?.phoneNumber || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold mb-1">
                        <span className={`px-2 py-1 rounded text-white ${
                          order.paymentStatus === 'Paid' ? 'bg-green-500' :
                          order.paymentStatus === 'Failed' ? 'bg-red-500' :
                          order.paymentStatus === 'Refunded' ? 'bg-gray-500' :
                          'bg-yellow-500'
                        }`}>
                          {order.paymentStatus || 'Pending'}
                        </span>
                      </div>
                      {order.razorpayPaymentId && (
                        <div className="text-xs text-gray-500 mt-1">Txn: {order.razorpayPaymentId}</div>
                      )}
                      {order.invoiceNumber && (
                        <div className="text-xs text-gray-500">Inv: {order.invoiceNumber}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-teal-600">₹{order.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 
                          order.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                          order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}
                      `}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex flex-col gap-2">
                      <select 
                        className="border rounded px-2 py-1 outline-none text-sm"
                        value={order.orderStatus}
                        onChange={(e) => statusUpdateHandler(order._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
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

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times; Close
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 font-semibold mb-1">Order ID</p>
                  <p className="text-gray-800">{selectedOrder._id}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-semibold mb-1">Date</p>
                  <p className="text-gray-800">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-semibold mb-1">Payment Method</p>
                  <p className="text-gray-800">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-semibold mb-1">Payment Status</p>
                  <p className="text-gray-800">{selectedOrder.paymentStatus || 'Pending'}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 border-b pb-2 mb-3">Items Ordered</h3>
                <ul className="space-y-3">
                  {selectedOrder.products.map(item => (
                    <li key={item._id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                        )}
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                        </div>
                      </div>
                      <div className="font-bold text-teal-600">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end mt-4 text-lg font-bold">
                  Total: <span className="text-teal-600 ml-2">₹{selectedOrder.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
