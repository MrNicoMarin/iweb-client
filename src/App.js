import './App.css';
import NavbarWeb from './components/Navbar.js';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './webs/Home';
import Trayectos from './components/Trayectos';
import Perfil from './components/Perfil';
import DetallesTrayecto from './components/DetallesTrayecto';
import CrearTrayecto from './components/CrearTrayecto';
import Vehiculos from './components/Vehiculos';

function App() {
  return (
    <div className="App">
      <NavbarWeb />
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="trayectos" element={<Trayectos />} />
          <Route path="trayectos/:id" element={<DetallesTrayecto />} />
          <Route path="trayectos/new" element={<CrearTrayecto />} />
          <Route path="perfil/:id" element={<Perfil />} />
          <Route path="vehiculos" element={<Vehiculos />} />
          <Route path="*" element={<Navigate to="/" replace={true} />} />
      </Routes>
    </div>
  );
}

export default App;
