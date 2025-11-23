import "./App.css";
import React from "react";
import useHashScroll from "./hooks/useHashScroll";
import Navbar from "./mainpage/Navbar";
import Footer from "./mainpage/Footer";
import { Hero } from "./components/Hero";
import Calendar from "./pages/Calendar";
import Leaderboard from "./pages/Leaderboard";
import HomeCalendar from "./pages/HomeCalendar";
import ImageGallery from "./components/ImageGallery";
import Score from "./components/Score";
import Live from "./pages/Live";
import CountDown from "./pages/Countdown";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./components/About";
import Seasons from "./pages/Seasons";
import Community from "./components/Community";
import Excellence from "./components/Excellence";
import Sportsmanship from "./components/Sportsmanship";
import Manager from "./pages/Manager";


function App() {
  function HashScrollActivator() {
    useHashScroll();
    return null;
  }

  return (
    <Router>
      <HashScrollActivator />
      <Navbar />

      <div className="min-h-[80vh] flex flex-col justify-between">
        <Routes>
          <Route
            path="/"
            element={
              <div className="grow">
                <Hero />
                <About />

                <HomeCalendar />

                {/* About card Section */}
                <div id="community">
                  <Community />
                   <ImageGallery />
                </div>
                <div id="excellence">
                  <Excellence />
                </div>
                <div id="sportsmanship">
                  <Sportsmanship />
                </div>
              </div>
            }
          />
          <Route path="/Calendar" element={<Calendar />} />
          <Route path="/Leaderboard" element={<Leaderboard />} />
          <Route path="/Gallery" element={<ImageGallery />} />

          <Route path="/Countdown" element={<CountDown />} />
          <Route path="/Score" element={<Score />} />
          <Route path="/Live" element={<Live />} />

          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />

          <Route path="/About" element={<About />} />
          <Route path="/Seasons" element={<Seasons />} />
          <Route path="/Community" element={<Community />} />
          <Route path="/Excellence" element={<Excellence />} />
          <Route path="/Sportsmanship" element={<Sportsmanship />} />
          <Route path="/Manager" element={<Manager />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;
