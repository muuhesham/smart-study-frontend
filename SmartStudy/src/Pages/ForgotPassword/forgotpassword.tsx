import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../../assets/logo.png';
import './forgotpassword.css';
import { backendUrl } from '../../constants/backendUrl';
import axios from 'axios';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !newPassword) {
      toast.error('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/forgot-password`, { 
        name, 
        email, 
        newPassword 
      });

      if (response.data) {
        toast.success('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        toast.error(response.data.message || 'Failed to reset password.');
      }
    } catch (error: any) {
      console.error('Reset Password Error:', error);
      const errorMsg = error.response?.data?.message || 'An error occurred. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="hero">
        <div className="hero-logo">
          <img className="logo" src={logo} alt="Logo" />
          <h1 className="hero-title">SmartStudy</h1>
        </div>
        <p className="hero-text">Reset your password and get back to studying</p>
      </div>

      <div className="forgot-box">
        <h1 className="forgot-title">Reset Password</h1>
        <p className="forgot-text">Enter your details to update your password</p>

        <form onSubmit={handleSubmit}>
          <p className="input-label">Name</p>
          <input
            type="text"
            placeholder="Enter your name"
            className="forgot-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <p className="input-label">Email</p>
          <input
            type="email"
            placeholder="Enter your email"
            className="forgot-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <p className="input-label">New Password</p>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 chars, 1 uppercase & 1 lowercase letter"
              className="forgot-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button type="submit" className="forgot-btn" disabled={loading}>
            {loading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>

        <p className="back-text">
          Remembered your password?
          <span className="back-link" onClick={() => navigate('/')}>
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
