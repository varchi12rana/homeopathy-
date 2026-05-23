import { useState, useEffect, useRef } from 'react';
import { Check, X, Plus, ChevronDown } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const CompanySelect = ({ selectedCompany, onSelectCompany }) => {
  const [companies, setCompanies] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchCompanies();
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsAdding(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data } = await api.get('/companies');
      setCompanies(data);
      if (data.length > 0 && !selectedCompany) {
        onSelectCompany(data[0].name);
      }
    } catch (error) {
      console.error('Error fetching companies', error);
    }
  };

  const handleAddCompany = async () => {
    if (!newCompanyName.trim()) return;
    try {
      const { data } = await api.post('/companies', { name: newCompanyName });
      setCompanies([...companies, data].sort((a, b) => a.name.localeCompare(b.name)));
      onSelectCompany(data.name);
      setNewCompanyName('');
      setIsAdding(false);
      setIsOpen(false);
      toast.success('Company added!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding company');
    }
  };

  const handleDeleteCompany = async (id, name, e) => {
    e.stopPropagation(); // prevent selecting it when clicking delete
    try {
      await api.delete(`/companies/${id}`);
      const updated = companies.filter(c => c._id !== id);
      setCompanies(updated);
      if (selectedCompany === name && updated.length > 0) {
        onSelectCompany(updated[0].name);
      } else if (updated.length === 0) {
        onSelectCompany('');
      }
      toast.info('Company removed');
    } catch (error) {
      toast.error('Error deleting company');
    }
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <div 
        className="w-full border rounded px-3 py-2 flex justify-between items-center cursor-pointer bg-white outline-none focus:border-teal-500 hover:border-teal-400 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedCompany ? 'text-gray-800' : 'text-gray-400'}>
          {selectedCompany || 'Select a company...'}
        </span>
        <ChevronDown size={18} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 border rounded shadow-lg bg-white overflow-hidden">
          <div className="max-h-48 overflow-y-auto">
            {companies.map(c => (
              <div 
                key={c._id} 
                className={`flex justify-between items-center px-3 py-2 cursor-pointer hover:bg-emerald-50 ${selectedCompany === c.name ? 'bg-emerald-100 font-medium text-emerald-800' : 'text-gray-700'}`}
                onClick={() => {
                  onSelectCompany(c.name);
                  setIsOpen(false);
                }}
              >
                <span>{c.name}</span>
                <button 
                  type="button" 
                  onClick={(e) => handleDeleteCompany(c._id, c.name, e)}
                  className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition"
                  title="Delete Company"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {companies.length === 0 && !isAdding && (
              <div className="px-3 py-3 text-sm text-gray-500 italic">No companies found</div>
            )}
          </div>

          {!isAdding ? (
            <div 
              className="flex items-center gap-2 px-3 py-2 cursor-pointer text-teal-600 hover:bg-teal-50 border-t transition"
              onClick={(e) => {
                e.stopPropagation();
                setIsAdding(true);
              }}
            >
              <Plus size={16} /> <span className="text-sm font-medium">Add New Company...</span>
            </div>
          ) : (
            <div 
              className="flex items-center gap-2 px-3 py-2 border-t bg-gray-50"
              onClick={e => e.stopPropagation()}
            >
              <input 
                type="text" 
                className="flex-grow border rounded px-2 py-1.5 text-sm outline-none focus:border-teal-500" 
                placeholder="Type company name..."
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCompany();
                  }
                }}
              />
              <button 
                type="button" 
                onClick={handleAddCompany}
                className="text-emerald-600 bg-emerald-100 hover:bg-emerald-200 p-1.5 rounded transition shadow-sm"
                title="Save Company"
              >
                <Check size={16} />
              </button>
              <button 
                type="button" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAdding(false);
                }}
                className="text-gray-500 bg-gray-200 hover:bg-gray-300 p-1.5 rounded transition shadow-sm"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanySelect;
