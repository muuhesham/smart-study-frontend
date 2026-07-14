import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import "./navbar.css";
import { useNavigate } from "react-router";
import pomodoro from "../assets/clock.png";
import dashboard from "../assets/dashboard.png";
import subjects from "../assets/book.png";
import studyplan from "../assets/task.png";
import profile from "../assets/profile.png";
import { LogOut, X } from "lucide-react";
import axios from "axios";
import { backendUrl } from "../constants/backendUrl";
import toast from "react-hot-toast";

interface NavbarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

function Navbar({ isOpen, onClose }: NavbarProps) {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState("");
    const [user, setUser] = useState<any>(null);


    const token = localStorage.getItem("auth");

    useEffect(() => {
    if(user) return;
    if (!token) {
      toast.error(`You aren't logged in. Return to Login Page!`);
      setTimeout(() => {
        navigate("/");
      }, 3000);
      return;
    }

    axios
      .get(`${backendUrl}/api/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.data))
      .catch((err) => {
        toast.error(`Failed to load user data`);
        console.error("Failed to load user data", err);
      })
    }, [user]);

    const handleLogout = async () => {
        try {
            await axios.post(
                `${backendUrl}/api/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error) {
            console.log(error);
        }

        localStorage.removeItem("auth");
        navigate("/");
    };

    return (
      <div className={`navbar ${isOpen ? "open" : ""}`}>
        <div className="nav-header-container">
          <img className="nav-logo" src={logo} alt="" />
          <h1 className="nav-header">SmartStudy</h1>
          {onClose && (
            <button
              className="nav-close-btn"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="nav-list">
          <p className="overview-label">Overview</p>

          <ul>
            <li
              className={`list-item ${activeItem === "Dashboard" ? "active" : ""}`}
              onClick={() => {
                setActiveItem("Dashboard");
                navigate("/dashboard");
                onClose?.();
              }}
            >
              <img src={dashboard} alt="" className="invert brightness-200" />
              Dashboard
            </li>

            <li
              className={`list-item ${activeItem === "subjects" ? "active" : ""}`}
              onClick={() => {
                setActiveItem("subjects");
                navigate("/subjects");
                onClose?.();
              }}
            >
              <img src={subjects} alt="" className="invert brightness-200" />
              Subjects
            </li>

            <li
              className={`list-item ${activeItem === "Study Plan" ? "active" : ""}`}
              onClick={() => {
                setActiveItem("Study Plan");
                navigate("/studyplan");
                onClose?.();
              }}
            >
              <img src={studyplan} alt="" className="invert brightness-200" />
              Study Plan
            </li>

            <li
              className={`list-item ${activeItem === "Pomodoro Timer" ? "active" : ""}`}
              onClick={() => {
                setActiveItem("Pomodoro Timer");
                navigate("/pomodorotimer");
                onClose?.();
              }}
            >
              <img src={pomodoro} alt="" className="invert brightness-200" />
              Pomodoro Timer
            </li>
          </ul>
        </div>

        <div
          className="profile"
          onClick={() => {
            navigate("/profile");
            onClose?.();
          }}
        >
          <img src={profile} className="profile-img" alt="" />

          <p className="profile-text">{user?.name}</p>
        </div>

        <div
          className="logout-btn"
          onClick={() => {
            handleLogout();
            onClose?.();
          }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    );
}

export default Navbar;