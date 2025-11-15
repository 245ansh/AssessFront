import React, { useState, useEffect } from 'react';
import { Chrome } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthForm = () => {
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Check if the device is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google"; // Redirect to Google Auth
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const role = e.target.role?.value || 'ROLE_STUDENT';

    try {
      const response = await axios.post("http://localhost:2452/api/users/signup", {
        username,
        email,
        password,
        role
      }, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        }
      });

      console.log("Response received:", response.data);

      if (response.data.message && response.data.message.includes("already exists")) {
        alert("User already exists. Please use different credentials.");
      } else {
        alert("Registration successful! Please login.");
        setIsActive(false);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.response?.data?.message || "Registration failed! Please try again.");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post("http://localhost:2452/api/users/signin", {
        username,
        password
      }, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        }
      });
      
      console.log(response.data);
      
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify({
          id: response.data.id,
          username: response.data.username,
          roles: response.data.roles
        }));
        
        // Redirect based on user role
        const roles = response.data.roles || [];
        if (roles.includes('ROLE_TEACHER')) {
          window.location.href = "/teacher-dashboard";
        } else if (roles.includes('ROLE_STUDENT')) {
          window.location.href = "/student-dashboard";
        } else {
          alert("Invalid user role");
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed! Please check your credentials.");
    }
  };

  // Mobile version renders both forms with toggle button
  if (isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#001a2c] to-slate-950 p-4">
        <div className="bg-slate-800 rounded-2xl shadow-lg w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-6 text-white text-center">
            <h1 className="text-xl font-bold">
              {isActive ? "Create Account" : "Welcome Back!"}
            </h1>
            <p className="my-2 text-cyan-100 text-sm">
              {isActive 
                ? "Join us to get access to personalized learning experience" 
                : "Enter your personal details to use all of these educational features."}
            </p>
            <button
              onClick={() => setIsActive(!isActive)}
              className="bg-transparent border border-white text-white text-sm px-8 py-2 rounded-lg font-semibold tracking-wider mt-2 cursor-pointer hover:bg-white/10 transition-colors"
            >
              {isActive ? "Sign In" : "Sign Up"}
            </button>
          </div>

          {isActive ? (
            <form onSubmit={handleSignUp} className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-white text-center">Create Account</h2>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 w-full bg-white text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors hover:bg-gray-100 mb-4 shadow-md"
              >
                <div className="flex-shrink-0 w-5 h-5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-full h-full">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                </div>
                <span>Sign up with Google</span>
              </button>
              <div className="flex items-center gap-2 w-full my-4">
                <div className="flex-1 h-px bg-gray-600"></div>
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-600"></div>
              </div>
              <input
                type="text"
                placeholder="Username"
                name="username"
                required
                className="bg-slate-700 border-none mb-3 px-4 py-2 text-sm rounded-lg w-full outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                required
                className="bg-slate-700 border-none mb-3 px-4 py-2 text-sm rounded-lg w-full outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
              />
              <select
                name="role"
                className="bg-slate-700 border-none mb-3 px-4 py-2 text-sm rounded-lg w-full outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
              >
                <option value="ROLE_STUDENT">Student</option>
                <option value="ROLE_TEACHER">Teacher</option>
              </select>
              <input
                type="password"
                placeholder="Password"
                name="password"
                required
                className="bg-slate-700 border-none mb-3 px-4 py-2 text-sm rounded-lg w-full outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
              />
              <button 
                type="submit" 
                className="w-full bg-cyan-500 text-white text-sm px-4 py-2.5 border border-transparent rounded-lg font-semibold tracking-wider uppercase mt-2 cursor-pointer hover:bg-cyan-600 transition-colors"
              >
                Sign Up
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-white text-center">Sign In</h2>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 w-full bg-white text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors hover:bg-gray-100 mb-4 shadow-md"
              >
                <div className="flex-shrink-0 w-5 h-5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-full h-full">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                </div>
                <span>Sign in with Google</span>
              </button>
              <div className="flex items-center gap-2 w-full my-4">
                <div className="flex-1 h-px bg-gray-600"></div>
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-600"></div>
              </div>
              <input
                type="text"
                placeholder="Username"
                name="username"
                required
                className="bg-slate-700 border-none mb-3 px-4 py-2 text-sm rounded-lg w-full outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="bg-slate-700 border-none mb-3 px-4 py-2 text-sm rounded-lg w-full outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
              />
              <a href="#" className="text-xs text-gray-400 hover:text-cyan-500 block mb-4">Forgot Password?</a>
              <button 
                type="submit"
                className="w-full bg-cyan-500 text-white text-sm px-4 py-2.5 border border-transparent rounded-lg font-semibold tracking-wider uppercase mt-2 cursor-pointer hover:bg-cyan-600 transition-colors"
              >
                Sign In
              </button>
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">Demo Login:</p>
                <p className="text-xs text-gray-400">Student: Username - demo, Password - demo</p>
                <p className="text-xs text-gray-400">Teacher: Username - demo, Password - demo</p>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Desktop/Laptop version with the sliding animation
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#001a2c] to-slate-950 p-4">
      <div className={`bg-slate-800 rounded-[30px] shadow-lg relative overflow-hidden w-[768px] max-w-full min-h-[480px] ${isActive ? 'active' : ''}`}>
        {/* Sign Up Form */}
        <div className={`absolute top-0 h-full transition-all duration-600 ease-in-out ${isActive ? 'translate-x-[100%] opacity-100 z-[5]' : 'left-0 w-1/2 opacity-0 z-[1]'
          }`}>
          <form onSubmit={handleSignUp} className="bg-slate-800 h-full flex flex-col items-center justify-center px-8 lg:px-16">
            <h1 className="text-xl lg:text-2xl font-bold mb-4 text-white">Create Account</h1>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 w-full max-w-xs bg-white text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors hover:bg-gray-100 mb-4 shadow-md"
            >
              <div className="flex-shrink-0 w-5 h-5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-full h-full">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
              </div>
              <span>Sign up with Google</span>
            </button>
            <div className="flex items-center gap-4 w-full max-w-xs my-4">
              <div className="flex-1 h-px bg-gray-600"></div>
              <span className="text-sm text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-600"></div>
            </div>
            <input
              type="text"
              placeholder="Username"
              name="username"
              required
              className="bg-slate-700 border-none my-2 px-4 py-2 text-sm rounded-lg w-full max-w-xs outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              required
              className="bg-slate-700 border-none my-2 px-4 py-2 text-sm rounded-lg w-full max-w-xs outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
            />
            <select
              name="role"
              className="bg-slate-700 border-none my-2 px-4 py-2 text-sm rounded-lg w-full max-w-xs outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
            >
              <option value="ROLE_STUDENT">Student</option>
              <option value="ROLE_TEACHER">Teacher</option>
            </select>
            <input
              type="password"
              placeholder="Password"
              name="password"
              required
              className="bg-slate-700 border-none my-2 px-4 py-2 text-sm rounded-lg w-full max-w-xs outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
            />
            <button 
              type="submit" 
              className="bg-cyan-500 text-white text-sm px-8 py-2.5 border border-transparent rounded-lg font-semibold tracking-wider uppercase mt-4 cursor-pointer hover:bg-cyan-600 transition-colors"
            >
              Sign Up
            </button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className={`absolute top-0 h-full transition-all duration-600 ease-in-out ${isActive ? 'translate-x-[100%]' : 'left-0 w-1/2 z-[2]'
          }`}>
          <form onSubmit={handleSignIn} className="bg-slate-800 h-full flex flex-col items-center justify-center px-8 lg:px-16">
            <h1 className="text-xl lg:text-2xl font-bold mb-4 text-white">Sign In</h1>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 w-full max-w-xs bg-white text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors hover:bg-gray-100 mb-4 shadow-md"
            >
              <div className="flex-shrink-0 w-5 h-5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-full h-full">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
              </div>
              <span>Sign in with Google</span>
            </button>
            <div className="flex items-center gap-4 w-full max-w-xs my-4">
              <div className="flex-1 h-px bg-gray-600"></div>
              <span className="text-sm text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-600"></div>
            </div>
            <input
              type="text"
              placeholder="Username"
              name="username"
              required
              className="bg-slate-700 border-none my-2 px-4 py-2 text-sm rounded-lg w-full max-w-xs outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="bg-slate-700 border-none my-2 px-4 py-2 text-sm rounded-lg w-full max-w-xs outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
            />
            <a href="#" className="text-sm text-gray-400 hover:text-cyan-500 my-3">Forgot Password?</a>
            <button 
              type="submit"
              className="bg-cyan-500 text-white text-sm px-8 py-2.5 border border-transparent rounded-lg font-semibold tracking-wider uppercase mt-2 cursor-pointer hover:bg-cyan-600 transition-colors"
            >
              Sign In
            </button>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">Demo Login:</p>
              <p className="text-sm text-gray-400">Student: Username - demo, Password - demo</p>
              <p className="text-sm text-gray-400">Teacher: Username - teacher, Password - teacher</p>
            </div>
          </form>
        </div>

        {/* Toggle Container */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-600 ease-in-out rounded-l-[150px] rounded-bl-[100px] z-[1000] ${isActive ? '-translate-x-full rounded-l-none rounded-r-[150px] rounded-br-[100px]' : ''
          }`}>
          <div className={`bg-gradient-to-r from-cyan-500 to-cyan-600 text-white relative -left-full h-full w-[200%] transform ${isActive ? 'translate-x-1/2' : 'translate-x-0'
            } transition-transform duration-600 ease-in-out`}>
            {/* Toggle Left Panel */}
            <div className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-4 lg:px-8 text-center transform ${isActive ? 'translate-x-0' : '-translate-x-[200%]'
              } transition-transform duration-600 ease-in-out`}>
              <h1 className="text-xl lg:text-2xl font-bold mb-4">Welcome Back!</h1>
              <p className="mb-4 text-sm lg:text-base text-cyan-100">Enter your personal details to use all of these educational features.</p>
              <button
                onClick={() => setIsActive(false)}
                className="bg-transparent border border-white text-white text-sm px-8 py-2.5 rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer hover:bg-white/10 transition-colors"
              >
                Sign In
              </button>
            </div>

            {/* Toggle Right Panel */}
            <div className={`absolute right-0 w-1/2 h-full flex flex-col items-center justify-center px-4 lg:px-8 text-center transform ${isActive ? 'translate-x-[200%]' : 'translate-x-0'
              } transition-transform duration-600 ease-in-out`}>
              <div className="hidden md:block">
                <img src='learning.png' alt="Learning" className="w-32 h-32 lg:w-40 lg:h-40" />
              </div>
              <p className="my-4 text-sm lg:text-base text-cyan-100">Join us to get access to personalized learning experience</p>
              <button
                onClick={() => setIsActive(true)}
                className="bg-transparent border border-white text-white text-sm px-8 py-2.5 rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer hover:bg-white/10 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;