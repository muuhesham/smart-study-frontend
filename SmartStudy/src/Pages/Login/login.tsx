import './login.css'
import logo from "../../assets/logo.png"
import { backendUrl } from "../../constants/backendUrl"
import { useState } from "react"
import axios from "axios"
import { useNavigate } from 'react-router'
import { Eye, EyeOff, HelpCircle } from 'lucide-react'
import toast from 'react-hot-toast'


function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const handleLogIn = async () => {
        if (!email || !password) {
            toast.error("All fields are required");
            return;
        }
        try {
            const response = await axios.post(`${backendUrl}/api/login`, { email, password })
            if (response.data && response.data.data.token) {
                toast.success(`Welcome back ${response.data.data.user.name}!`);
                navigate("/dashboard")
                localStorage.setItem("auth", response.data.data.token)
            }
        }
        catch (error) {
            toast.error("Login failed. Please check your credentials.");
        }
    }
    const handleRegister = () => {
        navigate("/register")
    }

    return (
      <div className="login-container">
        <div className="hero">
          <div className="hero-logo">
            <img className="logo" src={logo} alt="" />
            <h1 className="hero-title">SmartStudy</h1>
          </div>
          <p className="hero-text">Study Smarter, Not Harder</p>
        </div>
        <div className="login-box">
          <h1 className="login-title">Welcome Back !</h1>
          <p className="login-text">Sign in into your account</p>
          <p className="email-text">Email</p>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            className="email-input"
          />
          <p className="password-text">Password</p>
          <div className="password-wrapper">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              className="password-input"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button onClick={handleLogIn} className="login-btn">
            Login
          </button>
          <p className="register-text">
            Don't Have An Acoount?
            <span className="register" onClick={handleRegister}>
              Register
            </span>
            <p className="forgetPassword" onClick={() => navigate("/forgot-password")}>
              Forget your password?
            </p>
          </p>
        </div>
        <div className="fixed bottom-5 right-5 z-50">
          <button
            id="helpBtn"
            onClick={() => navigate("/support")}
            className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all"
            title="Help Center"
          >
            <HelpCircle />
          </button>
        </div>
      </div>
    );
}

export default Login
