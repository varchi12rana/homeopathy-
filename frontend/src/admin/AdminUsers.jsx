import { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Users, Mail, Calendar, Shield } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users');
        setUsers(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch users');
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [user, navigate]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8 border-b pb-4">
        <Link to="/admin" className="text-gray-500 hover:text-teal-600">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="text-teal-600" />
          User Management
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-semibold text-gray-600">Full Name</th>
                <th className="p-4 font-semibold text-gray-600">Email Address</th>
                <th className="p-4 font-semibold text-gray-600">Role</th>
                <th className="p-4 font-semibold text-gray-600">Join Date</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800">{u.name}</td>
                  <td className="p-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <a href={`mailto:${u.email}`} className="hover:text-teal-600">{u.email}</a>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role === 'admin' && <Shield size={12} />}
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      {new Date(u.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <Link to={`/admin/user/${u._id}`} className="bg-teal-100 text-teal-700 px-3 py-1.5 rounded-md hover:bg-teal-200 transition font-medium text-sm">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
