import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import CompanySelect from './CompanySelect';
import CategorySelect from './CategorySelect';

const EditProduct = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [potency, setPotency] = useState('');
  const [company, setCompany] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setPotency(data.potency || '');
        setCompany(data.company);
        setStock(data.stock);
        setImage(data.image);
        setCategory(data.category || '');
        setIsBestSeller(data.isBestSeller || false);
        setLoading(false);
      } catch (error) {
        toast.error('Product not found');
        navigate('/admin');
      }
    };
    fetchProduct();
  }, [id, user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/${id}`, {
        name, description, price: Number(price), potency, company, stock: Number(stock), image, category, isBestSeller
      });
      toast.success('Product updated successfully');
      navigate(`/admin/company/${company}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <div className="flex items-center gap-4 mb-6 border-b pb-4">
        <Link to={`/admin/company/${company}`} className="text-gray-500 hover:text-teal-600">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
      </div>

      <form onSubmit={submitHandler} className="space-y-4">
        {/* Same form layout as AddProduct */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input type="text" className="w-full border rounded px-3 py-2 outline-none focus:border-teal-500" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <CompanySelect selectedCompany={company} onSelectCompany={setCompany} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <CategorySelect selectedCategory={category} onSelectCategory={setCategory} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
            <input type="number" min="0" className="w-full border rounded px-3 py-2 outline-none focus:border-teal-500" value={price} onChange={e => setPrice(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input type="number" min="0" className="w-full border rounded px-3 py-2 outline-none focus:border-teal-500" value={stock} onChange={e => setStock(e.target.value)} required />
          </div>
          {category === 'liquid dilution' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Potency (e.g., 30C)</label>
              <input type="text" className="w-full border rounded px-3 py-2 outline-none focus:border-teal-500" value={potency} onChange={e => setPotency(e.target.value)} required />
            </div>
          )}
          <div className="flex items-center mt-6">
            <input 
              type="checkbox" 
              id="isBestSeller" 
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" 
              checked={isBestSeller} 
              onChange={e => setIsBestSeller(e.target.checked)} 
            />
            <label htmlFor="isBestSeller" className="ml-2 block text-sm font-medium text-gray-700">
              Mark as Best Seller
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input type="text" className="w-full border rounded px-3 py-2 outline-none focus:border-teal-500" value={image} onChange={e => setImage(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea rows="4" className="w-full border rounded px-3 py-2 outline-none focus:border-teal-500" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
        </div>

        <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3 rounded hover:bg-teal-700 transition">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
