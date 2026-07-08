import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { ArrowLeft, Trash2, Check, X, Building2, Plus } from 'lucide-react';

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyCountry, setNewCompanyCountry] = useState('India');
  const [newCompanyTagline, setNewCompanyTagline] = useState('Excellence in Homeopathy');
  const [newCompanySlider, setNewCompanySlider] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchCompanies();
  }, [user, navigate]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/companies');
      setCompanies(data);
    } catch (error) {
      toast.error('Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    try {
      const { data } = await api.post('/companies', { 
        name: newCompanyName,
        country: newCompanyCountry,
        tagline: newCompanyTagline,
        showOnSlider: newCompanySlider
      });
      setCompanies([...companies, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCompanyName('');
      setNewCompanyCountry('India');
      setNewCompanyTagline('Excellence in Homeopathy');
      setNewCompanySlider(true);
      setIsAdding(false);
      toast.success('Company added!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding company');
    }
  };

  const handleUpdate = async (id, field, value) => {
    try {
      await api.put(`/companies/${id}`, { [field]: value });
      setCompanies(companies.map(c => c._id === id ? { ...c, [field]: value } : c));
      toast.success('Updated successfully');
    } catch (error) {
      toast.error('Failed to update company');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await api.delete(`/companies/${id}`);
        setCompanies(companies.filter(c => c._id !== id));
        toast.success('Company deleted');
      } catch (error) {
        toast.error('Failed to delete company');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-8 pb-4 border-b">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-gray-500 hover:text-teal-600 transition">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
              <Building2 size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Manage Companies & Partners</h1>
          </div>
        </div>
        
        {!isAdding ? (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition font-medium shadow-sm"
          >
            <Plus size={18} /> Add Company
          </button>
        ) : (
          <form onSubmit={handleAddCompany} className="flex flex-col sm:flex-row items-center gap-3 bg-gray-50 p-4 rounded-lg border w-full lg:w-auto">
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1 font-medium">Company Name</label>
              <input 
                type="text" 
                placeholder="e.g. Boiron" 
                className="border rounded px-3 py-1.5 outline-none focus:border-teal-500 min-w-[150px]"
                value={newCompanyName}
                onChange={e => setNewCompanyName(e.target.value)}
                autoFocus
                required
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1 font-medium">Country</label>
              <input 
                type="text" 
                placeholder="e.g. France" 
                className="border rounded px-3 py-1.5 outline-none focus:border-teal-500 min-w-[120px]"
                value={newCompanyCountry}
                onChange={e => setNewCompanyCountry(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1 font-medium">Tagline</label>
              <input 
                type="text" 
                placeholder="e.g. World Leader" 
                className="border rounded px-3 py-1.5 outline-none focus:border-teal-500 min-w-[180px]"
                value={newCompanyTagline}
                onChange={e => setNewCompanyTagline(e.target.value)}
              />
            </div>

            <div className="flex flex-col items-center justify-center pt-2">
              <label className="flex items-center cursor-pointer gap-2 text-sm text-gray-700 font-medium">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={newCompanySlider}
                    onChange={(e) => setNewCompanySlider(e.target.checked)}
                  />
                  <div className={`block w-10 h-6 rounded-full transition ${newCompanySlider ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${newCompanySlider ? 'translate-x-4' : ''}`}></div>
                </div>
                Slider
              </label>
            </div>

            <div className="flex items-center gap-2 mt-2 sm:mt-0 pt-3 sm:pt-4">
              <button type="submit" className="bg-emerald-600 text-white p-1.5 rounded hover:bg-emerald-700 transition" title="Save">
                <Check size={20} />
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-200 text-gray-600 p-1.5 rounded hover:bg-gray-300 transition" title="Cancel">
                <X size={20} />
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-700 uppercase text-sm border-b">
              <th className="px-4 py-3 w-1/4">Company Name</th>
              <th className="px-4 py-3 w-1/6">Show on Slider</th>
              <th className="px-4 py-3 w-1/4">Country</th>
              <th className="px-4 py-3 w-1/3">Tagline</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {companies.map((company) => (
              <tr key={company._id} className="hover:bg-gray-50 transition group">
                <td className="px-4 py-4 font-medium text-gray-900">{company.name}</td>
                <td className="px-4 py-4">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={company.showOnSlider || false}
                        onChange={(e) => handleUpdate(company._id, 'showOnSlider', e.target.checked)}
                      />
                      <div className={`block w-10 h-6 rounded-full transition ${company.showOnSlider ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${company.showOnSlider ? 'translate-x-4' : ''}`}></div>
                    </div>
                  </label>
                </td>
                <td className="px-4 py-4">
                  <input 
                    type="text" 
                    defaultValue={company.country || 'India'}
                    onBlur={(e) => {
                      if (e.target.value !== company.country) {
                        handleUpdate(company._id, 'country', e.target.value);
                      }
                    }}
                    className="w-full border-b border-transparent hover:border-gray-300 focus:border-teal-500 bg-transparent px-1 py-1 outline-none transition"
                  />
                </td>
                <td className="px-4 py-4">
                  <input 
                    type="text" 
                    defaultValue={company.tagline || 'Excellence in Homeopathy'}
                    onBlur={(e) => {
                      if (e.target.value !== company.tagline) {
                        handleUpdate(company._id, 'tagline', e.target.value);
                      }
                    }}
                    className="w-full border-b border-transparent hover:border-gray-300 focus:border-teal-500 bg-transparent px-1 py-1 outline-none transition"
                  />
                </td>
                <td className="px-4 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(company._id)} 
                    className="text-red-400 hover:text-red-600 p-2 rounded hover:bg-red-50 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete Company"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {companies.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                  No companies found. Add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCompanies;
