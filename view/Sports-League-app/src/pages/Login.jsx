import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa"; // Imported Icons
import { MdOutlineEmail } from "react-icons/md"; // Email Icon

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading indicator
  const [error, setError] = useState(null); // New state for error messages
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to home
    const userData = localStorage.getItem("user");
    if (userData) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Route based on user role
        if (data.user.role === "admin") {
          navigate("/AdminDash");
        } else if (data.user.role === "manager") {
          navigate("/ManagerDashboard");
        } else {
          navigate("/");
        }
        window.location.reload();
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Error connecting to server. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // FULL PAGE CONTAINER with Dark Background
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* LOGIN CARD */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 md:p-10 border border-gray-100/50">
        
        <div className="text-center mb-8">
          <FaSignInAlt className="text-4xl text-orange-600 mx-auto mb-3" />
          <h2 className="text-3xl font-extrabold text-gray-800">Welcome Back!</h2>
          <p className="text-gray-500 mt-1">Sign in to access your league dashboard.</p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* EMAIL INPUT */}
          <div className="relative">
            <MdOutlineEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          {/* PASSWORD INPUT */}
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full py-3 bg-orange-600 text-white rounded-lg text-lg font-bold shadow-md hover:bg-orange-700 transition duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500/50 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <FaUser className="mr-2" /> Login
              </>
            )}
          </button>
        </form>
        
        {/* FOOTER LINK */}
        <div className="text-center mt-6 text-sm text-gray-600">
          Don't have an account? 
          <Link to="/Signup" className="text-orange-600 font-semibold hover:text-orange-700 ml-1 transition duration-200">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;