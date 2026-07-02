import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Bell } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

const AdminNotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // We assume notification.mp3 exists in the public directory
    audioRef.current = new Audio('/notification.mp3');

    // Fetch initial unread count and recent notifications
    const fetchInitialData = async () => {
      try {
        const [countRes, notifRes] = await Promise.all([
          api.get('/notifications/unread-count'),
          api.get('/notifications')
        ]);
        setUnreadCount(countRes.data.count);
        setNotifications(notifRes.data);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };
    fetchInitialData();

    // Setup Socket.IO
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const socket = io(backendUrl);

    socket.on('new_order_notification', (data) => {
      // Play sound
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log('Audio play prevented by browser policy:', e));
      }

      // Update states
      setUnreadCount(prev => prev + 1);
      setNotifications(prev => [data, ...prev]);

      // Show toast
      toast.success(
        <div>
          <strong className="block text-sm">New Order!</strong>
          <span className="text-xs">{data.customerName} just placed an order for ₹{data.amount?.toFixed(2)}.</span>
        </div>,
        { autoClose: 8000, position: "top-right" }
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={toggleDropdown}
        className="relative p-2 text-gray-600 hover:text-teal-600 focus:outline-none transition-colors"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full animate-bounce">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-100">
          <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b">
            <h3 className="font-bold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-teal-600 hover:underline font-semibold"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-teal-50/30' : ''}`}
                  onClick={() => !notif.isRead && markAsRead(notif._id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {notif.title}
                    </h4>
                    {!notif.isRead && <span className="w-2 h-2 rounded-full bg-teal-500 mt-1"></span>}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{notif.message}</p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
          
          <div className="px-4 py-2 bg-gray-50 border-t text-center">
            <a href="/admin/orders" className="text-xs text-teal-600 hover:underline font-semibold">
              View all orders
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationBell;
