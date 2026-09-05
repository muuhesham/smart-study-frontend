import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../assets/logo.png";
import "./forgotpassword.css";
import api from "../../services/axios";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      toast.error("Email is required.");
      setLoading(false);
      return;
    }

    try {
      await api.post(`/api/forgot-password`, {
        email,
      });

      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (error: any) {
      console.error("Send OTP Error:", error);
      const errorMsg =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !otp || !newPassword) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      await api.post(`/api/verify-password`, {
        email,
        otp,
        newPassword,
      });

      toast.success("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error: any) {
      console.error("Verify Password Error:", error);
      const errorMsg =
        error.response?.data?.message || "An error occurred. Please try again.";
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
        <p className="hero-text">
          Reset your password and get back to studying
        </p>
      </div>

      <div className="forgot-box">
        <h1 className="forgot-title">Reset Password</h1>
        <p className="forgot-text">
          Enter your details to update your password
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <p className="input-label">Email</p>
            <input
              type="email"
              placeholder="Enter your email"
              className="forgot-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button type="submit" className="forgot-btn" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyPassword}>
            <p className="input-label">OTP</p>
            <input
              type="text"
              placeholder="Enter OTP sent to your email"
              className="forgot-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
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
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="back-text">
          Remembered your password?
          <span className="back-link" onClick={() => navigate("/")}>
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
