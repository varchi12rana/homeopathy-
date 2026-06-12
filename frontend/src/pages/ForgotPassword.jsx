import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState('');
  const [maskedTarget, setMaskedTarget] = useState('');
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP & Reset
  
  // Step 2 State
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgotpassword', { identifier });
      setMaskedTarget(data.target);
      setStep(2);
      toast.success(data.message || 'OTP sent successfully!');
      if (data.testOtp) {
        toast.info(`[DEMO] Your OTP is: ${data.testOtp}`, { autoClose: false });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending OTP');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error('Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.');
      return;
    }
    
    setLoading(true);
    try {
      await api.post(`/auth/resetpassword`, { identifier, otp, password });
      toast.success('Password reset successful! You can now login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired OTP');
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <Link to="/login" className="text-gray-500 hover:text-teal-600 mb-6 inline-flex items-center gap-1 transition">
          <ArrowLeft size={16} /> Back to Login
        </Link>
        <h2 className="text-3xl font-bold text-center text-teal-700 mb-6">Reset Password</h2>
        
        {step === 1 ? (
          <form onSubmit={handleRequestOTP}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email or Mobile Number</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your registered email or mobile number"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-md hover:bg-teal-700 transition disabled:bg-teal-400"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="bg-emerald-50 text-emerald-700 p-3 rounded-md mb-6 border border-emerald-100 text-sm">
              An OTP has been sent to: <strong>{maskedTarget || '****'}</strong>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Enter 6-Digit OTP</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-center tracking-widest text-lg font-bold"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                required
              />
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-teal-600 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="mb-6 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">Confirm New Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-teal-600 focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-md hover:bg-teal-700 transition disabled:bg-teal-400"
            >
              {loading ? 'Verifying...' : 'Verify OTP & Reset'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
