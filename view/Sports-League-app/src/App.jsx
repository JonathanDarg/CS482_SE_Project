import "./App.css";
import Navbar from "./mainpage/Navbar";
import Footer from "./mainpage/Footer";
import Calendar from "./pages/Calendar";
import Leaderboard from "./pages/Leaderboard";
import HomeCalendar from "./pages/HomeCalendar";
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
                <h2 className="text-center text-4xl font-bold text-orange-500 mb-4">
                  Youth Sports League
                </h2>
                <HomeCalendar />
              </div>
            }
          />
          <Route path="/Calendar" element={<Calendar />} />
          <Route path="/Leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;
