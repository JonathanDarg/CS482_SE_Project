import { useState } from 'react';
import { Link } from 'react-scroll';
import { FaTimes } from 'react-icons/fa';
import { CiMenuFries } from 'react-icons/ci';   

const Navbar = () => {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    
    const content = (
        <div className="lg:hidden block absolute top-16 w-full left-0 bg-orange-500 transition z-40">
            <ul className="text-center text-xl p-20">
                <Link spy={true} smooth={true} to="Home" onClick={handleClick}>
                    <li className="my-4 py-4 border-b border-slate-800 hover:bg-orange-600 hover:rounded cursor-pointer">Home</li>
                </Link> 
                <Link spy={true} smooth={true} to="About" onClick={handleClick}>
                    <li className="my-4 py-4 border-b border-slate-800 hover:bg-orange-600 hover:rounded cursor-pointer">About</li>
                </Link>
                <Link spy={true} smooth={true} to="Contact" onClick={handleClick}>
                    <li className="my-4 py-4 border-b border-slate-800 hover:bg-orange-600 hover:rounded cursor-pointer">Contact</li>
                </Link>
            </ul>
        </div>
    );

    return (
        <nav className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 to-orange-800 py-0 px-3 rounded-md">
            <div className="h-10vh flex justify-between items-center text-white lg:py-5 px-20 py-4">
                <div className="flex items-center flex-1">
                    <span className="text-3xl font-bold">Youth Sports League</span>
                </div>
                <div className="lg:flex md:flex lg:flex-1 items-center justify-end font-normal hidden">
                    <div className="flex-10">
                        <ul className="flex gap-8 mr-16 text-[18px]">    
                            <Link spy={true} smooth={true} to="Home">
                                <li className="hover:text-orange-300 cursor-pointer">Home</li>
                            </Link>
                            <Link spy={true} smooth={true} to="About">
                                <li className="hover:text-orange-300 cursor-pointer">About</li>
                            </Link>
                            <Link spy={true} smooth={true} to="Contact">
                                <li className="hover:text-orange-300 cursor-pointer">Contact</li>
                            </Link>
                        </ul>
                    </div>
                </div>
                
                <div className="block lg:hidden transition">
                    {click && content}
                </div>
                
                <button className="block lg:hidden transition text-2xl" onClick={handleClick}>   
                    {click ? <FaTimes /> : <CiMenuFries />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;