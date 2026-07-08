import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CreditCard, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminPayments = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchStats();
    fetchPayments();
  }, [user, navigate, page, search]);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/payment/stats');
      setStats(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load payment statistics');
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/payment/all?page=${page}&limit=15&search=${search}`);
      setPayments(data.payments);
      setTotalPages(data.pages);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load payments');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPayments();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Payment Management</h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-teal-500">
            <h2 className="text-sm font-bold text-gray-500 uppercase">Total Revenue</h2>
            <p className="text-3xl font-bold text-gray-800 mt-2">₹{stats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
            <h2 className="text-sm font-bold text-gray-500 uppercase">Today's Revenue</h2>
            <p className="text-3xl font-bold text-gray-800 mt-2">₹{stats.todaysRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500 flex items-center gap-1"><CheckCircle size={16} className="text-green-500" /> Success</span>
              <span className="font-bold">{stats.successfulPayments}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500 flex items-center gap-1"><Clock size={16} className="text-yellow-500" /> Pending</span>
              <span className="font-bold">{stats.pendingPayments}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500 flex items-center gap-1"><XCircle size={16} className="text-red-500" /> Failed</span>
              <span className="font-bold">{stats.failedPayments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500 flex items-center gap-1"><RotateCcw size={16} className="text-blue-500" /> Refunds</span>
              <span className="font-bold">{stats.refunds}</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
          <form onSubmit={handleSearch} className="flex">
            <input 
              type="text"
              placeholder="Search ID, Invoice..."
              className="border rounded-l px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-r hover:bg-teal-700 transition">
              Search
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                <th className="p-4 font-bold border-b">Date</th>
                <th className="p-4 font-bold border-b">Customer</th>
                <th className="p-4 font-bold border-b">Razorpay Order ID</th>
                <th className="p-4 font-bold border-b">Invoice No.</th>
                <th className="p-4 font-bold border-b">Amount</th>
                <th className="p-4 font-bold border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-500">Loading payments...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-500">No payments found.</td>
                </tr>
              ) : (
                payments.map(payment => (
                  <tr key={payment._id} className="hover:bg-gray-50 transition border-b border-gray-100">
                    <td className="p-4 text-sm text-gray-700 whitespace-nowrap">
                      {new Date(payment.createdAt).toLocaleDateString()} {new Date(payment.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      {payment.user?.name || 'Unknown'}<br/>
                      <span className="text-xs text-gray-400">{payment.user?.email}</span>
                    </td>
                    <td className="p-4 text-sm text-gray-700 font-mono text-xs">
                      {payment.razorpayOrderId}
                      {payment.razorpayPaymentId && <><br/><span className="text-teal-600">{payment.razorpayPaymentId}</span></>}
                    </td>
                    <td className="p-4 text-sm text-gray-700 font-mono text-xs">
                      {payment.invoiceNumber || '-'}
                    </td>
                    <td className="p-4 text-sm font-bold text-gray-800">
                      ₹{payment.amount.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        payment.status === 'Paid' ? 'bg-green-100 text-green-700' :
                        payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        payment.status === 'Refunded' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-4 border-t bg-gray-50">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-white border rounded text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm font-medium text-gray-600">Page {page} of {totalPages}</span>
            <button 
              disabled={page === totalPages} 
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-white border rounded text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
