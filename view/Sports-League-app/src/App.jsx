import './App.css';
import Navbar from './mainpage/Navbar';
import Calendar from './pages/Calendar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        
        {/* Home Page */}
        <Route
          path="/"
          element={
            <h2 className="text-center text-2xl font-semibold text-orange-500 hover:text-orange-300 transition-colors duration-300 cursor-pointer">
              Youth Sports League
            </h2>
          }
        />

        {/* Calendar Page */}
        <Route path="/Calendar" element={<Calendar />} />
      </Routes>
    </Router>
  );
}

export default App;
