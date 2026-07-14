import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import Navbar from "./components/navbar";
import { Menu, HelpCircle } from "lucide-react";
import logo from "./assets/logo.png";
import "./mainlayout.css";

function Mainlayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="main-layout-container">
      {/* Mobile top header */}
      <header className="mobile-header">
        <div className="mobile-header-brand">
          <img
            src={logo}
            alt="SmartStudy logo"
            className="mobile-header-logo"
          />
          <h1 className="mobile-header-title">SmartStudy</h1>
        </div>
        <button
          className="hamburger-btn"
          onClick={toggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Sidebar Navigation */}
      <Navbar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Overlay backdrop for mobile */}
      <div
        className={`sidebar-backdrop ${isSidebarOpen ? "visible" : ""}`}
        onClick={closeSidebar}
      />

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => navigate("/support")}
          className="w-10 h-10 bg-[#10b981] hover:bg-[#059669] text-white rounded-full shadow-xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95"
          title="Support"
        >
          <HelpCircle size={24} />
        </button>
      </div>
    </div>
  );
}

export default Mainlayout;
