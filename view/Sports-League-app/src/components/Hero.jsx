import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    setIsLoggedIn(!!userData);
  }, []);

  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1623947453126-3652fc16b2b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNlYmFsbCUyMGZpZWxkfGVufDF8fHx8MTc2MTgyMTcxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Baseball field"
          className="w-full h-full object-cover brightness-50"
        />
      </div>
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl mb-6 font-semibold">
          Welcome to Orange County Little League
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-bold"> 
          Building Champions, One Game at a Time </p>
          <div className="flex gap-4 justify-center flex-wrap">
          {!isLoggedIn && (
            <Link to="/Signup">
              <Button className="bg-orange-500 hover:bg-accent px-8 py-6">Register Now</Button>
            </Link>
          )}
          <Button variant="outline" className="bg-white text-black hover:bg-gray-100 px-8 py-6">Learn More</Button>
        </div>
      </div>
    </section>
  );
}