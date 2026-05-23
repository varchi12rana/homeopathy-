import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { MessageSquare, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/messages');
      setMessages(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch messages');
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      await api.put(`/messages/${selectedMessage._id}/reply`, { reply: replyText });
      toast.success('Reply sent successfully');
      setReplyText('');
      setSelectedMessage(null);
      fetchMessages(); // Refresh list
    } catch (error) {
      toast.error('Failed to send reply');
    }
  };

  if (loading) return <div className="flex justify-center mt-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MessageSquare className="text-emerald-600" /> User Messages
        </h2>
        <Link to="/admin" className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">Back to Dashboard</Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Messages List */}
        <div className="md:w-1/3 border-r border-gray-200 pr-4">
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages found.</p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {messages.map(msg => (
                <div 
                  key={msg._id} 
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 rounded-lg cursor-pointer transition border ${selectedMessage?._id === msg._id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-gray-800 truncate">{msg.name}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${msg.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {msg.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 truncate mb-1">{msg.subject}</p>
                  <p className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Details & Reply */}
        <div className="md:w-2/3">
          {selectedMessage ? (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="mb-6 border-b border-gray-200 pb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedMessage.subject}</h3>
                <div className="flex gap-4 text-sm text-gray-600">
                  <p><strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})</p>
                  <p><strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">Message:</p>
                <div className="bg-white p-4 rounded border border-gray-200 whitespace-pre-wrap text-gray-800">
                  {selectedMessage.message}
                </div>
              </div>

              {selectedMessage.status === 'Replied' ? (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-emerald-700 mb-2">Admin Reply:</p>
                  <div className="bg-emerald-50 p-4 rounded border border-emerald-200 whitespace-pre-wrap text-emerald-900">
                    {selectedMessage.reply}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReplySubmit}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Send Reply:</label>
                  <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-emerald-300 rounded focus:outline-none focus:border-emerald-500 mb-4"
                    placeholder="Type your reply here..."
                  ></textarea>
                  <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition flex items-center gap-2">
                    <Send size={16} /> Send Reply
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Select a message to view details and reply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
