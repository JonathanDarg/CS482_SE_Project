import './App.css';
import Navbar from './mainpage/Navbar';
import Footer from './mainpage/Footer'; 
import Calendar from './pages/Calendar';
import Leaderboard from './pages/Leaderboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      {/* Navbar appears at the top on all pages */}
      <Navbar />

      {/* Main content changes based on route */}
      <div className="min-h-[80vh] flex flex-col justify-between">
        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <div className="flex-grow">
                <h2 className="text-center text-2xl font-semibold text-orange-500 hover:text-orange-300 transition-colors duration-300 cursor-pointer">
                  Youth Sports League
                </h2>
              </div>
            }
          />

          {/* Calendar Page */}
          <Route path="/Calendar" element={<Calendar />} />
          {/* Scoreboard Page */}
          <Route path="/Leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>

      {/* Footer appears at the bottom on all pages */}
      <Footer />
    </Router>
  );
}

export default App;
