import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaUsers, FaChild, FaUserShield, FaExclamationTriangle } from "react-icons/fa";
import { MdOutlineEmail, MdDriveFileRenameOutline, MdOutlineConfirmationNumber } from "react-icons/md";
import { ImSpinner2 } from "react-icons/im"; // Spinner icon for loading

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("parent");
  const [parentEmail, setParentEmail] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to home
    const userData = localStorage.getItem("user");
    if (userData) {
      navigate("/");
    }
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { name, email, password, role };
    
    if (role === "child") {
      if (!parentEmail) {
        setError("Parent's email is required for child registration.");
        setLoading(false);
        return;
      }
      payload.parentEmail = parentEmail;
    }
    if (role === "manager") {
      if (!teamCode) {
        setError("Team Code is required for manager registration.");
        setLoading(false);
        return;
      }
      payload.teamCode = teamCode;
    }
    if (role === "parent") {
      payload.disclaimerAgreed = !!agreed;
      if (!agreed) {
        setError("You must agree to the Responsibility Disclaimer.");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful! You can now log in.");
        navigate("/Login");
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("Error connecting to server. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'parent':
        return <FaUserShield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />;
      case 'child':
        return <FaChild className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />;
      case 'manager':
        return <FaUsers className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />;
      default:
        return <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Signup card */}
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 md:p-10 border border-gray-100/50">
        
        <div className="text-center mb-8">
          <FaUser className="text-4xl text-orange-600 mx-auto mb-3" />
          <h2 className="text-3xl font-extrabold text-gray-800">Create Account</h2>
          <p className="text-gray-500 mt-1">Join the league today!</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center" role="alert">
            <FaExclamationTriangle className="mr-3"/>
            <span className="block sm:inline font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          
          {/* Name inout */}  
          <div className="relative">
            <MdDriveFileRenameOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200 text-base"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          {/* Email input */}
          <div className="relative">
            <MdOutlineEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200 text-base"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          {/* Password input */}
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200 text-base"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Select a role */}
          <div className="relative">
            {getRoleIcon(role)} {/* Dynamic icon based on role */}
            <select 
              className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200 text-base"
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              required
              disabled={loading}
            >
              <option value="parent">Parent/Guardian</option>
              <option value="child">Child/Player</option>
              <option value="manager">Team Manager</option>
            </select>
            <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" /> {/* Static dropdown icon */}
          </div>

          {/* Conditional fields */}
          {role === "child" && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg shadow-inner transition duration-300">
              <p className="text-sm font-semibold text-orange-700 mb-2 flex items-center">
                <FaChild className="mr-2"/> Child/Player Registration
              </p>
              <div className="relative">
                <MdOutlineEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200 text-base"
                  placeholder="Parent's Email (Required)"
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  required={role === 'child'}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {role === "manager" && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-inner transition duration-300">
              <p className="text-sm font-semibold text-blue-700 mb-2 flex items-center">
                <FaUsers className="mr-2"/> Team Manager Registration
              </p>
              <div className="relative">
                <MdOutlineConfirmationNumber className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-base"
                  placeholder="Team Code (Required)"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value)}
                  required={role === 'manager'}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {/* Disclaimer */}
          {role === "parent" && (
            <div className="p-5 bg-orange-100 border border-orange-300 rounded-xl shadow-md space-y-3" aria-live="polite">
              <div className="text-center text-lg font-bold text-orange-800 mb-3 flex items-center justify-center">
                <FaExclamationTriangle className="mr-3 text-2xl"/> Responsibility Disclaimer
              </div>
              <p className="text-sm text-gray-700">By registering, you confirm the following for your child's participation:</p>
              
              {/* Bullet point list */}
              <ul className="list-disc text-sm text-gray-700 space-y-1 pl-5">
                <li>You’re the parent/guardian and the info you provided is accurate.</li>
                <li>Your child has permission to participate in league activities and follow basic league rules.</li>
                <li>You understand that sports come with some risk, and the league can’t be responsible for accidental injuries.</li>
                <li>If there’s an emergency, league staff may seek medical help if you can’t be reached.</li>
                <li>You’re okay with receiving updates about schedules, games, and team info.</li>
              </ul>

              <label className="flex items-center text-sm text-gray-800 pt-2">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  required={role === 'parent'}
                  disabled={loading}
                  className="w-5 h-5 text-orange-600 bg-white border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="ml-3 font-semibold">I acknowledge and agree to the above disclaimer.</span>
              </label>
            </div>
          )}

          {/* Sign up button*/}
          <button
            type="submit"
            className="w-full py-3 bg-orange-600 text-white rounded-lg text-lg font-bold shadow-md hover:bg-orange-700 transition duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500/50 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <ImSpinner2 className="animate-spin h-5 w-5 text-white mr-3" />
            ) : (
              <>
                <FaUser className="mr-2" /> Sign Up
              </>
            )}
          </button>
        </form>
        
        {/* Sign un link in footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          Already have an account? 
          <Link to="/Login" className="text-orange-600 font-semibold hover:text-orange-700 ml-1 transition duration-200">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;