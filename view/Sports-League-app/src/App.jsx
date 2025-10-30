// App.jsx
import "./App.css";
import Navbar from "./mainpage/Navbar";
import Footer from "./mainpage/Footer";
import { Hero } from "./components/Hero"; 
import Calendar from "./pages/Calendar";
import Leaderboard from "./pages/Leaderboard";
import HomeCalendar from "./pages/HomeCalendar";
import ImageGallery from "./components/ImageGallery";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
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
                <h2 className="text-center text-4xl font-bold text-orange-500 mb-4">
                  Youth Sports League
                </h2>
                <HomeCalendar />
              </div>
            }
          />
          <Route path="/Calendar" element={<Calendar />} />
          <Route path="/Leaderboard" element={<Leaderboard />} />
          <Route path="/Gallery" element={<ImageGallery />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;
