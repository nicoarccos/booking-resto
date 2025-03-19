import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Contacto from './pages/Contacto';
import AboutUs from './pages/AboutUs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
    </Router>
  );
}

export default App; 