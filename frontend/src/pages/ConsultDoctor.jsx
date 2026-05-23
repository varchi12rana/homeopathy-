import React, { useState } from 'react';

const ConsultDoctor = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    symptoms: '',
    preferredTime: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Your consultation request has been submitted. A doctor will contact you soon.');
    setFormData({ name: '', email: '', phone: '', symptoms: '', preferredTime: '' });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold text-emerald-900 mb-6 text-center">Consult a Doctor</h1>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-emerald-100">
        <p className="mb-6 text-gray-700 text-center">
          Get expert homeopathic advice from certified practitioners. Fill out the form below to schedule a consultation.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-emerald-300 rounded focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-emerald-300 rounded focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2 border border-emerald-300 rounded focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Describe Your Symptoms</label>
            <textarea name="symptoms" value={formData.symptoms} onChange={handleChange} required rows="4" className="w-full px-4 py-2 border border-emerald-300 rounded focus:outline-none focus:border-emerald-500"></textarea>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Preferred Consultation Time</label>
            <select name="preferredTime" value={formData.preferredTime} onChange={handleChange} required className="w-full px-4 py-2 border border-emerald-300 rounded focus:outline-none focus:border-emerald-500">
              <option value="">Select a time</option>
              <option value="morning">Morning (9 AM - 12 PM)</option>
              <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
              <option value="evening">Evening (4 PM - 8 PM)</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded hover:bg-emerald-700 transition font-semibold">
            Request Consultation
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConsultDoctor;
