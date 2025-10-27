import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { CiMenuFries } from 'react-icons/ci';      

const Navbar = () => {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    
    const content = (
    <div className="lg:hidden block absolute top-16 w-full left-0 bg-orange-500 transition z-40">
      <ul className="text-center text-xl p-20">
        <li className="my-4 py-4 border-b border-slate-800 hover:bg-orange-600 hover:rounded cursor-pointer">
          <Link to="/" onClick={handleClick}>Home</Link>
        </li>
        <li className="my-4 py-4 border-b border-slate-800 hover:bg-orange-600 hover:rounded cursor-pointer">
          <Link to="/Calendar" onClick={handleClick}>Calendar</Link>
        </li>
        <li className="my-4 py-4 border-b border-slate-800 hover:bg-orange-600 hover:rounded cursor-pointer">
          <Link to="/Leaderboard" onClick={handleClick}>Leaderboard</Link>
        </li>
        <li className="my-4 py-4 border-b border-slate-800 hover:bg-orange-600 hover:rounded cursor-pointer">
          <Link to="/Contact" onClick={handleClick}>Contact</Link>
        </li>
        <li className="my-4 py-4 border-b border-slate-800 hover:bg-orange-600 hover:rounded cursor-pointer">
          <Link to="/Login" onClick={handleClick}>
            <button className="bg-white text-orange-700 px-6 py-2 rounded-md font-semibold hover:bg-orange-200 transition">
              Login
            </button>
          </Link>
        </li>
      </ul>
    </div>
  );

return (
    <nav className="sticky top-0 z-50 w-full bg-linear-to-r from-orange-500 to-orange-800 py-0 px-3">
      <div className="h-10vh flex justify-between items-center text-white lg:py-5 px-20 py-4">
        {/* Brand */}
        <div className="flex items-center flex-1">
          <Link to="/" className="text-3xl font-bold hover:text-orange-300 transition">
            Youth Sports League
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="lg:flex md:flex lg:flex-1 items-center justify-end font-normal hidden">
          <ul className="flex gap-8 mr-16 text-[18px]">    
            <li className="hover:text-orange-300 cursor-pointer">
              <Link to="/">Home</Link>
            </li>
            <li className="hover:text-orange-300 cursor-pointer">
              <Link to="/Calendar">Calendar</Link>
            </li>
            <li className="hover:text-orange-300 cursor-pointer">
              <Link to="/Leaderboard">Leaderboard</Link>
            </li>
            <li className="hover:text-orange-300 cursor-pointer">
              <Link to="/Contact">Contact</Link>
            </li>
          </ul>

          <Link to="/Login">
            <button className="bg-white text-orange-700 px-5 py-2 rounded-md font-semibold hover:bg-orange-200 transition">
              Login
            </button>
          </Link>
        </div>

        {/* Mobile menu */}
        <div className="block lg:hidden transition">
          {click && content}
        </div>

        {/* Menu toggle button */}
        <button className="block lg:hidden transition text-2xl" onClick={handleClick}>   
          {click ? <FaTimes /> : <CiMenuFries />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;