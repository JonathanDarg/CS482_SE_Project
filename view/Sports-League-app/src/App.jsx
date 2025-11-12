import "./App.css";
import React from "react";
import Navbar from "./mainpage/Navbar";
import Footer from "./mainpage/Footer";
import { Hero } from "./components/Hero";
import Calendar from "./pages/Calendar";
import Leaderboard from "./pages/Leaderboard";
import HomeCalendar from "./pages/HomeCalendar";
import ImageGallery from "./components/ImageGallery";
import Score from "./components/Score";
import Live from "./pages/Live";
import CountDownTimer from "./components/CountDownTimer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./components/About";


function App() {

  const targetDate = "2025-12-31T23:59:59"; // Example target date

  return (
    <Router>
      <Navbar />

      <div className="min-h-[80vh] flex flex-col justify-between">
        <Routes>
          <Route
            path="/"
            element={
              <div className="grow">
                <Hero />
                <About />

                {/* Calendar and Gallery */}
                <div className="flex gap-2 p-4 items-start justify-center">
                  <HomeCalendar />
                  <ImageGallery />
                </div>
              </div>
            }
          />
          <Route path="/Calendar" element={<Calendar />} />
          <Route path="/Leaderboard" element={<Leaderboard />} />
          <Route path="/Gallery" element={<ImageGallery />} />

          <Route path="/Countdown" element={<CountDownTimer targetDate={new Date(targetDate).getTime()} />} />
          <Route path="/Score" element={<Score />} />
          <Route path="/Live" element={<Live />} />

          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />

          <Route path="/About" element={<About />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;
