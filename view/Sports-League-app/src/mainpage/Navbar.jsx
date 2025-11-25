import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes, FaHome, FaCalendarAlt, FaTrophy, FaEnvelope, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { CiMenuFries } from 'react-icons/ci';      

const Navbar = () => {
  const [click, setClick] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setIsLoggedIn(true);
      setUserRole(user.role);
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, []);

  const handleClick = () => setClick(!click);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserRole(null);
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
              <Link to="/Profile" onClick={handleClick} className="flex items-center justify-center gap-2">
                <FaUser /> Profile
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
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-orange-500 to-orange-800 py-0 px-3 shadow-md">
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

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link to="/Profile" className="flex items-center gap-2 hover:text-orange-300">
                <FaUser />
                <span>Profile</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-white text-orange-700 px-5 py-2 rounded-md font-semibold hover:bg-orange-200 transition flex items-center gap-2"
              >
                <FaSignOutAlt />
                Logout
              </button>
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

        {/* Hamburger menu - visible on all screens */}
        <div className="transition">
          {click && content}
        </div>

        {/* Menu toggle button - visible on all screens */}
        <button className="transition text-3xl ml-4 hover:text-orange-300" onClick={handleClick}>   
          {click ? <FaTimes /> : <CiMenuFries />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
