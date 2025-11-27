import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// We'll import FaCog for the settings/dashboard icon
import { FaTimes, FaHome, FaCalendarAlt, FaTrophy, FaEnvelope, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { CiMenuFries } from 'react-icons/ci';      

const Navbar = () => {
  const [click, setClick] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null); 
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setIsLoggedIn(true);
      setUserRole(user.role);
      setUserName(user.name); 
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
      setUserName(null);
    }
  }, []);

  const handleClick = () => {
    setClick(!click);
    // Close profile dropdown when opening the mobile menu
    setProfileOpen(false); 
  };
  
  const toggleProfile = () => setProfileOpen(!profileOpen);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName(null);
    setProfileOpen(false); 
    navigate("/");
    setClick(false);
  };
    
  const content = (
    <div className="block absolute top-16 w-full left-0 bg-orange-500 transition z-40">
      <ul className="text-center text-xl p-20">
        <li className="my-4 py-4 border-b border-slate-800 hover:bg-orange-600 hover:rounded cursor-pointer">
          <Link to="/" onClick={handleClick} className="flex items-center justify-center gap-2">
            <FaHome /> Home
          </Link>
        </li>
        {userRole === 'admin' && (
          <li className="my-4 py-4 border-b border-slate-800 hover:bg-orange-600 hover:rounded cursor-pointer">
            <Link to="/AdminDash" onClick={handleClick} className="flex items-center justify-center gap-2">
              ⚙️ Admin Dashboard
            </Link>
          </li>
        )}
        {userRole === 'manager' && (
          <li className="my-4 py-4 border-b border-slate-800 hover:bg-orange-600 hover:rounded cursor-pointer">
            <Link to="/ManagerDashboard" onClick={handleClick} className="flex items-center justify-center gap-2">
              👥 Manager Dashboard
            </Link>
          </li>
        )}
        {(userRole === 'child' || userRole === 'parent') && (
          <li className="my-4 py-4 border-b border-slate-800 hover:bg-orange-600 hover:rounded cursor-pointer">
            <Link to="/TeamInvites" onClick={handleClick} className="flex items-center justify-center gap-2">
              📩 Team Invites
            </Link>
          </li>
        )}
        <li className="my-4 py-4 border-b border-slate-800 hover:bg-orange-600 hover:rounded cursor-pointer">
          <Link to="/Calendar" onClick={handleClick} className="flex items-center justify-center gap-2">
            <FaCalendarAlt /> Calendar
          </Link>
        </li>
        <li className="my-4 py-4 border-b border-slate-800 hover:bg-orange-600 hover:rounded cursor-pointer">
          <Link to="/Leaderboard" onClick={handleClick} className="flex items-center justify-center gap-2">
            <FaTrophy /> Leaderboard
          </Link>
        </li>
        <li className="my-4 py-4 border-b border-slate-800 hover:bg-orange-600 hover:rounded cursor-pointer">
          <Link to="/Contact" onClick={handleClick} className="flex items-center justify-center gap-2">
            <FaEnvelope /> Contact
          </Link>
        </li>
        {isLoggedIn ? (
          <>
            <li className="my-4 py-4 border-b border-slate-800 hover:bg-orange-600 hover:rounded cursor-pointer">
              <Link to="/Profile" onClick={handleClick} className="flex items-center justify-center gap-2 font-bold">
                <FaUser /> {userName || "Profile"}
              </Link>
            </li>
            <li className="my-4 py-4 border-b border-slate-800 hover:bg-orange-600 hover:rounded cursor-pointer">
              <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full bg-white text-orange-700 px-6 py-2 rounded-md font-semibold hover:bg-orange-200 transition">
                <FaSignOutAlt /> Logout
              </button>
              
            </li>
          </>
        ) : (
          <li className="my-4 py-4 border-b border-slate-800 hover:bg-orange-600 hover:rounded cursor-pointer">
            <Link to="/Login" onClick={handleClick} className="flex items-center justify-center gap-2">
              <FaUser />
              <button className="bg-white text-orange-700 px-6 py-2 rounded-md font-semibold hover:bg-orange-200 transition">
                Login
              </button>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 w-full bg-linear-to-r from-orange-500 to-orange-800 py-0 px-3 shadow-md">
      <div className="h-10vh flex justify-between items-center text-white lg:py-5 px-20 py-4">
        
        {/* logo */}
        <div className="flex items-center flex-1 gap-3">
          <img
            src="/images/logo1.png"
            alt="Logo"
            className="w-12 h-12 object-contain rounded-full"
          />
          <Link to="/" className="text-3xl font-bold hover:text-orange-300 transition">
            Youth Sports League
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="lg:flex md:flex lg:flex-1 items-center justify-end font-normal hidden">
          <ul className="flex gap-8 mr-16 text-[18px]">    
            <li className="hover:text-orange-300 cursor-pointer flex items-center gap-2">
              <FaHome />
              <Link to="/">Home</Link>
            </li>
            <li className="hover:text-orange-300 cursor-pointer flex items-center gap-2">
              <FaCalendarAlt />
              <Link to="/Calendar">Calendar</Link>
            </li>
            <li className="hover:text-orange-300 cursor-pointer flex items-center gap-2">
              <FaTrophy />
              <Link to="/Leaderboard">Leaderboard</Link>
            </li>
            <li className="hover:text-orange-300 cursor-pointer flex items-center gap-2">
              <FaEnvelope />
              <Link to="/Contact">Contact</Link>
            </li>
            
          </ul>

          <div className="relative">
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={toggleProfile}
                  className="flex items-center gap-2 p-2 rounded-md font-semibold hover:bg-orange-600 transition"
                >
                  {/* Corrected size class to text-xl */}
                  <FaUser className="text-xl"/> 
                  <span className="hidden sm:inline">{userName}</span> 
                </button>

                {/* Profile Dropdown Menu */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-xl py-1 z-50">
                        {/* 1. Admin Dashboard Link (Conditional) */}
                        {userRole === 'admin' && (
                            <Link 
                                to="/AdminDash" 
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                            >
                                <FaCog className="text-blue-500" /> Admin Dashboard
                            </Link>
                        )}
                        {/* Separate line if Admin Dashboard is present */}
                        {userRole === 'admin' && <div className="border-t border-gray-100 my-1"></div>}

                        {/* 2. View Profile Link */}
                    <Link 
                      to="/Profile" 
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      <FaUser className="text-orange-500" /> View Profile
                    </Link>

                        {/* 3. Logout Separator and Button */}
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/Login" className="flex items-center gap-2">
                <FaUser />
                <button className="bg-white text-orange-700 px-5 py-2 rounded-md font-semibold hover:bg-orange-200 transition">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Hamburger menu - visible on mobile/tablet */}
        <div className="transition">
          {click && content}
        </div>

        {/* Menu toggle button */}
        <button className="transition text-3xl ml-4 hover:text-orange-300" onClick={handleClick}>   
          {click ? <FaTimes /> : <CiMenuFries />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;