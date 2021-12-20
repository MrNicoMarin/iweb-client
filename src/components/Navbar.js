import logo from '../assets/zoomLogo.png'
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

function NavbarWeb () {
    return (<Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="/">
                        <img 
                            src={logo}
                            alt="Logo"
                            className="d-inline-block align-top"
                            width="30"
                            height="30"
                        />{' '}
                        Zoomcar
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav className="me-auto my-2 my-lg-0" navbarScroll style={{ maxHeight: '150px' }} >
                            <Nav.Link href="/trayectos">Trayectos</Nav.Link>
                            <Nav.Link href="/vehiculos">Vehiculos</Nav.Link>
                            <Nav.Link href="/perfiles">Perfiles</Nav.Link>
                            <Nav.Link href="/perfiles/2">Mi Perfil</Nav.Link> 
                            <Nav.Link href="/trayectos/new">Crear trayectos</Nav.Link>
                        </Nav>
                    </ Navbar.Collapse>
                </Container>
            </Navbar>);
}

export default NavbarWeb;