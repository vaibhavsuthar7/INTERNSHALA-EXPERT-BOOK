import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ExpertList from './pages/ExpertList';
import ExpertDetail from './pages/ExpertDetail';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ExpertList />} />
          <Route path="/expert/:id" element={<ExpertDetail />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
