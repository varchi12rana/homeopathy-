import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';
import { Tags, Trash2 } from 'lucide-react';

const AdminCategories = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchCategories();
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/products/categories/unique');
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const removeCategory = async (categoryName) => {
    if (!window.confirm(`Are you sure you want to remove the category "${categoryName}"? This will remove the category from all products that have it.`)) {
      return;
    }
    try {
      await api.delete(`/products/categories/${encodeURIComponent(categoryName)}`);
      toast.success('Category removed successfully!');
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove category');
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading categories...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Tags className="text-teal-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-800">Category Management</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Existing Categories</h2>
        
        {categories.length === 0 ? (
          <p className="text-gray-500">No categories found. Categories are created automatically when you add them to products.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category} className="border rounded-md p-4 flex justify-between items-center bg-gray-50">
                <span className="font-medium text-gray-700">{category}</span>
                <button 
                  onClick={() => removeCategory(category)}
                  className="text-red-500 hover:text-red-700 transition"
                  title="Remove Category"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
