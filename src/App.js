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
import EditarVehiculo from './components/EditarVehiculo'
import MisReservas from './components/MisReservas';
import Footer from './components/Footer';
import LoginTwitter from './components/LoginTwitter';

function App() {

  return (
    <div className="App">
      <NavbarWeb />
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="trayectos" element={<Trayectos mis="False" />} />
          <Route path="misTrayectos" element={<Trayectos mis="True"/>} />
          <Route path="trayectos/:id" element={<DetallesTrayecto />} />
          <Route path="trayectos/new" element={<CrearTrayecto />} />
          <Route path="perfiles" element={<Perfiles />} />
          <Route path="perfiles/:id" element={<DetallesPerfil />} />
          <Route path="perfiles/:id/update" element={<EditarPerfil />} />
          <Route path="vehiculos" element={<Vehiculos />} />
          <Route path="vehiculos/:id" element={<DetallesVehiculo />} />
          <Route path="vehiculos/new" element={<AnadirVehiculo />} />
          <Route path="vehiculos/:id/update" element={<EditarVehiculo />} />
          <Route path="misReservas" element={<MisReservas />} />
          <Route path="loginTwitter" element={<LoginTwitter />} />
          <Route path="*" element={<Navigate to="/" replace={true} />} />
      </Routes>
    </div>
  );
}

export default App;
