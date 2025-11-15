import React, { useState, useEffect } from "react";
import { ArrowRight, Menu, X, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
  // Check login status on component mount and when localStorage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      
      if (token && userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    
    checkLoginStatus();
    
    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = () => {
      checkLoginStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const handleLogin = async () => {
    try {  
      window.location.href = "/authform";  // Redirect to unified auth form
    } catch (error) {
      console.error("Error redirecting to auth:", error);
    }
  };
  
  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await axios.post("http://localhost:2452/api/users/signout", {}, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        }
      });
      
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Update state
      setIsLoggedIn(false);
      setUser(null);
      
      // Redirect to home
      window.location.href = "/";
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if API call fails, clear local storage and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUser(null);
      window.location.href = "/";
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <img src="education.png" alt="AssessAI Logo" className="h-8 w-8 sm:h-10 sm:w-10" />
            <span className="ml-2 text-xl sm:text-2xl font-bold">
              <span className="bg-clip-text text-transparent bg-gray-200">Assess</span>
              <span className="bg-clip-text text-transparent bg-cyan-500">AI</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-100 hover:text-blue-500 transition-colors">Home</a>
            <a href="/features" className="text-gray-100 hover:text-blue-500 transition-colors">Features</a>
            <a href="/about" className="text-gray-100 hover:text-blue-500 transition-colors">About</a>
          </nav>
          
          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 text-gray-200">
                  <User className="h-4 w-4" />
                  <span className="text-sm">Hello, {user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-indigo-50 bg-red-500 hover:bg-red-600 transition duration-150 ease-in-out"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="px-4 py-2 text-sm font-medium rounded-md text-indigo-50 bg-cyan-500 hover:bg-cyan-600 transition duration-150 ease-in-out"
              >
                Login / Signup
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu} 
              className="text-gray-200 hover:text-cyan-500 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a 
              href="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-cyan-500 hover:bg-slate-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </a>
            <a 
              href="/features" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-cyan-500 hover:bg-slate-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-cyan-500 hover:bg-slate-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
          </div>
          
          <div className="px-5 py-4 border-t border-slate-700">
            {isLoggedIn ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-200 px-4">
                  <User className="h-4 w-4" />
                  <span className="text-sm">Hello, {user?.username}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium rounded-md text-indigo-50 bg-red-500 hover:bg-red-600 transition duration-150 ease-in-out"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  handleLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-sm font-medium rounded-md text-indigo-50 bg-cyan-500 hover:bg-cyan-600 transition duration-150 ease-in-out"
              >
                Login / Signup
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;