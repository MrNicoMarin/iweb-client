import './App.css';
import NavbarWeb from './components/Navbar.js';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './webs/Home';
import Trayectos from './components/Trayectos';
import Perfiles from './components/Perfiles';
import DetallesPerfil from './components/DetallesPerfil';
import DetallesTrayecto from './components/DetallesTrayecto';
import DetallesVehiculo from './components/DetallesVehiculo';
import CrearTrayecto from './components/CrearTrayecto';
import Vehiculos from './components/Vehiculos';
import AnadirVehiculo from './components/AnadirVehiculo'
import EditarPerfil from './components/EditarPerfil'

function App() {
  return (
    <div className="App">
      <NavbarWeb />
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="trayectos" element={<Trayectos />} />
          <Route path="trayectos/:id" element={<DetallesTrayecto />} />
          <Route path="trayectos/new" element={<CrearTrayecto />} />
          <Route path="perfiles" element={<Perfiles />} />
          <Route path="perfiles/:id" element={<DetallesPerfil />} />
          <Route path="perfiles/:id/update" element={<EditarPerfil />} />
          <Route path="vehiculos" element={<Vehiculos />} />
          <Route path="vehiculos/:id" element={<DetallesVehiculo />} />
          <Route path="vehiculos/new" element={<AnadirVehiculo />} />
          <Route path="*" element={<Navigate to="/" replace={true} />} />
      </Routes>
    </div>
  );
}

export default App;
