import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare } from 'lucide-react';

const MyMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchMessages = async () => {
      try {
        const { data } = await api.get('/messages/my');
        setMessages(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch messages', error);
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [user, navigate]);

  if (loading) {
    return <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto container px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        <MessageSquare className="text-emerald-600" /> My Support Messages
      </h1>

      {messages.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500 border border-emerald-50">
          You haven't sent any messages yet.
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg._id} className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
              <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-emerald-900">{msg.subject}</h3>
                  <p className="text-xs text-emerald-600">{new Date(msg.createdAt).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  msg.status === 'Open' ? 'bg-yellow-100 text-yellow-800' :
                  msg.status === 'Replied' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {msg.status}
                </span>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Your Message:</p>
                  <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">{msg.message}</p>
                </div>
                {msg.reply && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-emerald-600 mb-1">Admin Reply:</p>
                    <p className="text-gray-800 bg-emerald-50 p-4 rounded-lg border border-emerald-100">{msg.reply}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMessages;
