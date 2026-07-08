import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import api from '../services/api';
import { Settings } from 'lucide-react';

const AdminSettings = () => {
  const { user } = useContext(AuthContext);
  const { setSettings } = useContext(CartContext);
  const navigate = useNavigate();
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('');
  const [shippingCharge, setShippingCharge] = useState('');
  const [codCharge, setCodCharge] = useState('');
  const [isPrepaidEnabled, setIsPrepaidEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setFreeShippingThreshold(data.freeShippingThreshold ?? 500);
        setShippingCharge(data.shippingCharge ?? 100);
        setCodCharge(data.codCharge ?? 50);
        setIsPrepaidEnabled(data.isPrepaidEnabled ?? true);
      } catch (error) {
        toast.error('Failed to load settings (Did you restart the server?)');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        freeShippingThreshold: Number(freeShippingThreshold),
        shippingCharge: Number(shippingCharge),
        codCharge: Number(codCharge),
        isPrepaidEnabled: Boolean(isPrepaidEnabled),
      };
      await api.put('/settings', payload);
      
      // Update global context immediately so it reflects instantly across the site
      if (setSettings) {
        setSettings(payload);
      }
      
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading settings...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="text-teal-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-800">Store Settings</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Shipping Configuration</h2>
        
        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Free Shipping Threshold (₹)
            </label>
            <p className="text-xs text-gray-500 mb-2">Orders above this amount will get free shipping.</p>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Standard Shipping Charge (₹)
            </label>
            <p className="text-xs text-gray-500 mb-2">The flat shipping fee applied to orders below the threshold.</p>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={shippingCharge}
              onChange={(e) => setShippingCharge(e.target.value)}
              required
              min="0"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2 mt-8">Payment Methods</h2>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Cash on Delivery (COD) Extra Charge (₹)
            </label>
            <p className="text-xs text-gray-500 mb-2">Extra fee added if user selects COD.</p>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={codCharge}
              onChange={(e) => setCodCharge(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-teal-600"
                checked={isPrepaidEnabled}
                onChange={(e) => setIsPrepaidEnabled(e.target.checked)}
              />
              <span className="text-gray-700 font-bold">Enable Prepaid (Razorpay) Option</span>
            </label>
            <p className="text-xs text-gray-500 ml-8 mt-1">If unchecked, customers can only order via COD.</p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className={`w-full bg-teal-600 text-white font-bold py-3 rounded-md hover:bg-teal-700 transition ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
