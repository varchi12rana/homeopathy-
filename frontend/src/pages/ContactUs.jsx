import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/messages', formData);
      toast.success('Thank you for contacting us. We will get back to you shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold text-emerald-900 mb-8 text-center">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-emerald-900 text-emerald-50 p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>
          <p className="mb-8 text-emerald-200">
            Have questions about our products, orders, or need general assistance? We're here to help!
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="text-emerald-400 mt-1 shrink-0" size={24} />
              <div>
                <h3 className="font-medium text-lg">Our Address</h3>
                <p className="text-emerald-200">102,Sahyog shopping centre,<br />udhna main road, udhana,<br />surat, gujarat-394210</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Phone className="text-emerald-400 mt-1 shrink-0" size={24} />
              <div>
                <h3 className="font-medium text-lg">Phone Number</h3>
                <p className="text-emerald-200"><a href="tel:+919638930188" className="hover:text-white transition">+91 9638930188</a><br />Mon-Fri: 9am - 6pm</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Mail className="text-emerald-400 mt-1 shrink-0" size={24} />
              <div>
                <h3 className="font-medium text-lg">Email Address</h3>
                <p className="text-emerald-200"><a href="mailto:dr.ranascare@gmail.com" className="hover:text-white transition">dr.ranascare@gmail.com</a></p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-emerald-100">
          <h2 className="text-2xl font-semibold text-emerald-800 mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Your Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-emerald-300 rounded focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-emerald-300 rounded focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Subject</label>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-2 border border-emerald-300 rounded focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Message</label>
              <textarea name="message" value={formData.message} onChange={handleChange} required rows="4" className="w-full px-4 py-2 border border-emerald-300 rounded focus:outline-none focus:border-emerald-500"></textarea>
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded hover:bg-emerald-700 transition font-semibold">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
