import logo from "../../assets/logo.png";
import "./register.css";
import "../Login/login.css";
import { useNavigate } from "react-router";
import { useState } from "react";
import { backendUrl } from "../../constants/backendUrl";
import axios from "axios";
import { Eye, EyeOff, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [studyTime, setStudyTime] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !password || !rePassword || !studyTime) {
      toast.error("All fields are required");
      return;
    }
    if (password !== rePassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(`${backendUrl}/api/register`, {
        name,
        email,
        password,
        dailyStudyHours: Number(studyTime),
      });
      if (response.data && response.data.data && response.data.data.token) {
        toast.success(`Welcome ${response.data.data.user.name}!`);
        navigate("/dashboard");
        localStorage.setItem("auth", response.data.data.token);
      }
    } catch (error) {
      toast.error("Register failed. Please try again.");
    }
  };
  const handleLogin = () => {
    navigate("/");
  };

  return (
    <div className="register-container">
      <div className="hero">
        <div className="hero-logo">
          <img className="logo" src={logo} alt="" />
          <h1 className="hero-title">SmartStudy</h1>
        </div>
        <p className="hero-text">Study Smarter, Not Harder</p>
      </div>

      <form className="register-box" onSubmit={handleRegister}>
        <p className="name-text">Name</p>
        <input
          type="text"
          className="name-input"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p className="email-text">Email</p>

        <input
          type="text"
          className="email-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <p className="password-text">Password</p>

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            className="password-input"
            placeholder="Enter your password. Min 6 chars (A-z, a-z)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        <p className="re-password-text">Re-type Password</p>

        <div className="password-wrapper">
          <input
            type={showRePassword ? "text" : "password"}
            className="re-password-input"
            placeholder="Re-type your password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowRePassword((prev) => !prev)}
            aria-label={showRePassword ? "Hide password" : "Show password"}
          >
            {showRePassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <p className="study-hours-text">Daily Study hours</p>

        <input
          type="number"
          className="Study-Time"
          placeholder="Daily Study Time (in hours)"
          value={studyTime}
          onChange={(e) => setStudyTime(e.target.value)}
        />

        <button type="submit" className="register-btn">
          Register
        </button>
        <p className="login-text">
          Already Have An Account?
          <span className="login" onClick={handleLogin}>
            Login
          </span>{" "}
        </p>
      </form>
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

export default Register;
