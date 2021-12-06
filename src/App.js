import './App.css';
import NavbarWeb from './components/Navbar.js';
import { Routes, Route } from 'react-router-dom';
import Home from './webs/Home';
import Trayectos from './components/Trayectos';

function App() {
  return (
    <div className="App">
      <NavbarWeb />
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="trayectos" element={<Trayectos />} />
      </Routes>
    </div>
  );
}

export default App;
