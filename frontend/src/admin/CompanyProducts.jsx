import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Edit, Trash2, ArrowLeft, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

const CompanyProducts = () => {
  const { companyName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchProducts();
  }, [user, navigate, companyName]);

  const fetchProducts = async () => {
    try {
      const url = companyName === 'All Products' ? '/products' : `/products/company/${companyName}`;
      const { data } = await api.get(url);
      setProducts(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch products');
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
      try {
        await api.post('/products/bulk-delete', { ids: selectedIds });
        toast.success(`${selectedIds.length} products deleted`);
        setSelectedIds([]);
        fetchProducts();
      } catch (error) {
        console.error('Bulk delete error:', error.response?.data || error);
        toast.error('Failed to delete products: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(products.map(p => p._id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  if (loading) {
    return <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-gray-500 hover:text-teal-600">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">{companyName} Products</h1>
        </div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-red-700 transition"
            >
              <Trash2 size={18} /> Delete Selected ({selectedIds.length})
            </button>
          )}
          <Link 
            to="/admin/add-product" 
            className="bg-teal-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-teal-700 transition"
          >
            <Plus size={18} /> Add Product
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
          No products found for this company.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700 uppercase text-sm border-b">
                  <th className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      onChange={toggleSelectAll} 
                      checked={products.length > 0 && selectedIds.length === products.length}
                      className="w-4 h-4 text-teal-600 rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Potency/Dilution</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className={`transition ${selectedIds.includes(product._id) ? 'bg-teal-50' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(product._id)} 
                        onChange={() => toggleSelect(product._id)}
                        className="w-4 h-4 text-teal-600 rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <img src={product.image} alt={product.name} className="h-10 w-10 object-contain bg-white" />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.potency} {product.dilution} {product.motherTincture && '(MT)'}</td>
                    <td className="px-6 py-4 text-sm font-bold text-teal-600">₹{product.price}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-3">
                      <Link to={`/admin/edit-product/${product._id}`} className="text-blue-500 hover:text-blue-700">
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => deleteHandler(product._id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
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

export default CompanyProducts;
