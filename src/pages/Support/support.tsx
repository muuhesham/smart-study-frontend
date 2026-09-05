import React, { useState } from "react";
import { useNavigate } from "react-router";
import logo from "../../assets/logo.png";
import "./support.css";
import toast from "react-hot-toast";
import api from "../../services/axios";

const Support = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    messageType: "bug",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(`/api/support/report`, {
        name: formData.name,
        email: formData.email,
        messageType: formData.messageType,
        message: formData.message,
      });

      toast.success(
        "Thank you for your feedback! We will get back to you soon.",
      );
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      console.error("Support Report Error:", error);
      const errorMsg =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support-container">
      <div className="hero">
        <div className="hero-logo">
          <img className="logo" src={logo} alt="SmartStudy Logo" />
          <h1 className="hero-title">Support</h1>
        </div>
        <p className="hero-text">We're here to help you study smarter</p>
      </div>

      <div className="support-box">
        <h1 className="support-title">Get in Touch</h1>
        <p className="support-text">
          Let us know how we can improve your experience
        </p>

        <form onSubmit={handleSubmit}>
          <p className="input-label">Name</p>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className="support-input"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <p className="input-label">Email</p>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="support-input"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <p className="input-label">Message Type</p>
          <select
            name="messageType"
            className="support-input"
            value={formData.messageType}
            onChange={handleInputChange}
          >
            <option value="bug" className="text-black">
              Report a Bug 🐛
            </option>
            <option value="feature" className="text-black">
              Suggest a Feature 💡
            </option>
            <option value="other" className="text-black">
              Other Inquiry ✉️
            </option>
          </select>

          <p className="input-label">Message</p>
          <textarea
            name="message"
            placeholder="How can we help you?"
            className="support-textarea"
            rows={5}
            value={formData.message}
            onChange={handleInputChange}
            required
          ></textarea>

          <button type="submit" className="support-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        <p className="back-text">
          Want to go back?
          <span className="back-link" onClick={() => navigate("/")}>
            Login
          </span>
          <span> /</span>
          <span className="back-link" onClick={() => navigate("/dashboard")}>
            Dashboard
          </span>
        </p>
      </div>
    </div>
  );
};

export default Support;
