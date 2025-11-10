import React from "react";

export function Hero() {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/field.png"
          alt="Baseball field"
          className="w-full h-full object-cover brightness-50"
        />
      </div>
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl mb-6 font-semibold">
          Welcome to Orange County Little League
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-bold">
          Building Champions, One Game at a Time
        </p>
      </div>
    </section>
  );
}