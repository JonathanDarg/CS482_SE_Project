import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaTimes, FaHome, FaCalendarAlt, FaTrophy, FaEnvelope,
  FaUser, FaSignOutAlt, FaCog, FaFacebook, FaInstagram, FaLinkedin
} from 'react-icons/fa';
import { CiMenuFries } from 'react-icons/ci';

const Navbar = () => {
  const [click, setClick] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const auth = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    // populate from auth hook when available
    if (auth) {
      setIsLoggedIn(Boolean(auth.isLoggedIn));
      setUserRole(auth.user?.role || null);
      setUserName(auth.user?.name || (auth.user ? auth.user.name : null));
    }
  }, [auth]);

  const handleClick = () => {
    setClick(!click);
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
    window.location.reload();
  };

  const NavLink = ({ to, icon, text }) => (
    <li className="relative group h-full flex items-center">
      <Link 
        to={to} 
        className={`flex items-center gap-2 px-1 py-1 transition-colors duration-300 hover:text-orange-200 
        ${location.pathname === to ? 'text-white font-semibold' : 'text-white/90'}`}
      >
        {icon} {text}
      </Link>
      {/* Animated Highlight Line CSS only */}
      <span className={`absolute bottom-0 left-0 h-[3px] bg-white transition-all duration-300 group-hover:w-full 
        ${location.pathname === to ? 'w-full' : 'w-0'}`}>
      </span>
    </li>
  );
    
  const content = (
    <div className="lg:hidden block absolute top-24 w-full left-0 bg-orange-700/90 transition-all z-40 border-t border-orange-400">
      <ul className="text-center text-xl p-8">
        <li className="my-4 py-4 border-b border-orange-400/30 hover:bg-orange-800 hover:rounded cursor-pointer">
          <Link to="/" onClick={handleClick} className="flex items-center justify-center gap-2 text-white">
            <FaHome /> Home
          </Link>
        </li>
        {userRole === 'admin' && (
          <li className="my-4 py-4 border-b border-orange-400/30 hover:bg-orange-800 hover:rounded cursor-pointer">
            <Link to="/AdminDash" onClick={handleClick} className="flex items-center justify-center gap-2 text-white">
              <FaCog /> Admin Dashboard
            </Link>
          </li>
        )}
        {userRole === 'manager' && (
          <li className="my-4 py-4 border-b border-orange-400/30 hover:bg-orange-800 hover:rounded cursor-pointer">
            <Link to="/ManagerDashboard" onClick={handleClick} className="flex items-center justify-center gap-2 text-white">
              👥 Manager Dashboard
            </Link>
          </li>
        )}
        {(userRole === 'child' || userRole === 'parent') && (
          <li className="my-4 py-4 border-b border-orange-400/30 hover:bg-orange-800 hover:rounded cursor-pointer">
            <Link to="/TeamInvites" onClick={handleClick} className="flex items-center justify-center gap-2 text-white">
              📩 Team Invites
            </Link>
          </li>
        )}
        <li className="my-4 py-4 border-b border-orange-400/30 hover:bg-orange-800 hover:rounded cursor-pointer">
          <Link to="/Calendar" onClick={handleClick} className="flex items-center justify-center gap-2 text-white">
            <FaCalendarAlt /> Calendar
          </Link>
        </li>
        <li className="my-4 py-4 border-b border-orange-400/30 hover:bg-orange-800 hover:rounded cursor-pointer">
          <Link to="/Leaderboard" onClick={handleClick} className="flex items-center justify-center gap-2 text-white">
            <FaTrophy /> Leaderboard
          </Link>
        </li>
        <li className="my-4 py-4 border-b border-orange-400/30 hover:bg-orange-800 hover:rounded cursor-pointer">
          <Link to="/Contact" onClick={handleClick} className="flex items-center justify-center gap-2 text-white">
            <FaEnvelope /> Contact
          </Link>
        </li>
        {isLoggedIn ? (
          <>
            <li className="my-4 py-4 border-b border-orange-400/30 hover:bg-orange-800 hover:rounded cursor-pointer">
              <Link to="/Profile" onClick={handleClick} className="flex items-center justify-center gap-2 font-bold text-white">
                <FaUser /> {userName || "Profile"}
              </Link>
            </li>
            <li className="my-4 py-4 border-b border-orange-400/30 hover:bg-orange-800 hover:rounded cursor-pointer">
              <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full bg-white text-orange-700 px-6 py-2 rounded-md font-semibold hover:bg-orange-100 transition">
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </>
        ) : (
          <li className="my-4 py-4 border-b border-orange-400/30 hover:bg-orange-800 hover:rounded cursor-pointer">
            <Link to="/Login" onClick={handleClick} className="flex items-center justify-center gap-2">
              <button className="bg-white text-orange-700 px-6 py-2 rounded-md font-semibold hover:bg-orange-100 transition">
                Login
              </button>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 w-full bg-linear-to-r from-orange-500/90 to-orange-800/90 shadow-xl backdrop-blur-sm">
      <div className="h-24 flex justify-between items-center text-white lg:px-12 px-6">
        
        <div className="flex items-center gap-4">
          <img
            src="/images/logo1.png"
            alt="Logo"
            className="w-20 h-20 object-contain" 
          />
          <Link to="/" className="text-2xl md:text-3xl font-bold hover:text-orange-200 transition whitespace-nowrap">
            OC Little League
          </Link>
        </div>

        {/* Desktop links & Auth */}
        <div className="hidden lg:flex items-center gap-8">
          
          <ul className="flex gap-6 text-[18px] font-medium mr-4 h-full items-stretch">    
            <NavLink to="/" icon={<FaHome />} text="Home" />
            <NavLink to="/Calendar" icon={<FaCalendarAlt />} text="Calendar" />
            <NavLink to="/Leaderboard" icon={<FaTrophy />} text="Leaderboard" />
            <NavLink to="/Contact" icon={<FaEnvelope />} text="Contact" />
          </ul>

          <div className="flex items-center gap-4 border-l border-white/30 pl-8 h-full">
            
            {/* Social Media Links */}
            <div className="flex gap-3 text-xl">
               <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-200 transition-colors"><FaFacebook /></a>
               <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-200 transition-colors"><FaInstagram /></a>
               <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-blue-100 transition-colors"><FaLinkedin /></a>
            </div>

            {/* User/Auth Section */}
            <div className="relative">
              {isLoggedIn ? (
                <div className="relative">
                  <button 
                    onClick={toggleProfile}
                    className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold hover:bg-white/20 transition"
                  >
                    <FaUser className="text-xl"/> 
                    <span className="hidden xl:inline max-w-[100px] truncate">{userName}</span> 
                  </button>

                  {/* Dropdown menu */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded-lg shadow-xl py-2 z-50 ring-1 ring-black ring-opacity-5">
                      
                      {/* Admin/Manager Dashboard Links */}
                      {userRole === 'admin' && (
                        <>
                          <Link to="/AdminDash" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-sm transition-colors">
                            <FaCog className="text-blue-600 text-lg" /> Admin Dashboard
                          </Link>
                          <div className="border-t border-gray-100 my-1"></div>
                        </>
                      )}

                      {userRole === 'manager' && (
                        <>
                          <Link to="/ManagerDashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-sm transition-colors">
                            <span className="text-lg">👥</span> Manager Dashboard
                          </Link>
                          <div className="border-t border-gray-100 my-1"></div>
                        </>
                      )}

                      {/* 2. View Profile Link */}
                      <Link to="/Profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-sm transition-colors">
                        <FaUser className="text-orange-600 text-lg" /> View Profile
                      </Link>

                      {/* 3. Logout */}
                      <div className="border-t border-gray-100 my-1"></div>
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors">
                        <FaSignOutAlt className="text-lg" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/Login" className="flex items-center gap-2">
                  <button className="bg-white text-orange-700 px-6 py-2 rounded-full font-bold shadow-sm hover:bg-orange-100 hover:shadow-md transition">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <div className="lg:hidden">
            <button className="text-3xl text-white hover:text-orange-200 transition" onClick={handleClick}>   
            {click ? <FaTimes /> : <CiMenuFries />}
            </button>
        </div>
      </div>
      
      {/* Mobile Menu Content Rendered Here */}
      <div>
        {click && content}
      </div>
    </nav>
  );
};

export default Navbar;