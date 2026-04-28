import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Package, ListOrdered, PlusCircle, MessageSquare } from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [productCounts, setProductCounts] = useState({});
  const [companies, setCompanies] = useState(['All Products']);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const { data: prods } = await api.get('/products');
        const { data: comps } = await api.get('/companies');
        
        const compNames = comps.map(c => c.name);
        setCompanies(['All Products', ...compNames]);
        
        const counts = {
          'All Products': prods.length,
        };
        
        compNames.forEach(c => {
          counts[c] = prods.filter(p => p.company === c).length;
        });
        
        setProductCounts(counts);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };
    
    fetchData();
  }, [user, navigate]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {companies.map((company) => (
          <Link 
            to={`/admin/company/${company}`} 
            key={company}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border-t-4 border-teal-500 flex flex-col items-center justify-center text-center h-32"
          >
            <h2 className="text-xl font-bold text-gray-800">{company}</h2>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              {productCounts[company] !== undefined ? `${productCounts[company]} Products` : 'Loading...'}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <Package className="text-teal-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Product Management</h2>
          </div>
          <Link 
            to="/admin/add-product" 
            className="w-full flex items-center justify-center gap-2 bg-teal-50 text-teal-700 font-medium py-3 px-4 rounded-md hover:bg-teal-100 transition mb-3"
          >
            <PlusCircle size={20} /> Add New Product
          </Link>
          <Link 
            to="/admin/bulk-upload" 
            className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-700 font-medium py-3 px-4 rounded-md hover:bg-blue-100 transition"
          >
            <PlusCircle size={20} /> Bulk Upload Products
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <ListOrdered className="text-teal-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Order Management</h2>
          </div>
          <Link 
            to="/admin/orders" 
            className="w-full flex items-center justify-center gap-2 bg-teal-50 text-teal-700 font-medium py-3 px-4 rounded-md hover:bg-teal-100 transition"
          >
            View All Orders
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <MessageSquare className="text-teal-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">User Messages</h2>
          </div>
          <Link 
            to="/admin/messages" 
            className="w-full flex items-center justify-center gap-2 bg-teal-50 text-teal-700 font-medium py-3 px-4 rounded-md hover:bg-teal-100 transition"
          >
            Manage Messages
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
