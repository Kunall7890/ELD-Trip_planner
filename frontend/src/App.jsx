import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import PlanTrip from './pages/PlanTrip.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plan" element={<PlanTrip />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
