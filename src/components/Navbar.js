import logo from '../assets/zoomLogo.png'
import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import GoogleLogin from 'react-google-login';

function NavbarWeb () {
    const [token, setToken] = useState(null);
    const [id, setId] = useState(null);
    const [nombre, setNombre] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const responseGoogleOnSuccess = (response) => {
        setToken(response.tokenId)
        sessionStorage.setItem('token',response.tokenId)
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json','Authorization' : response.tokenId }
        };
        fetch(process.env.REACT_APP_BASE_URL+"oauth",requestOptions).then(response => response.json()).then
        ((data) => {
           if(data.mensaje != null){
                setId(null)
                setNombre(null);
           }else{
                setId(data.id)
                setNombre(data.name);
                sessionStorage.setItem('id', data.id);
                sessionStorage.setItem('nombre', data.name);
           }
        })

    }

    const handleLogOut = (e) => {
        e.preventDefault();
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('nombre');
        setToken(null);
        setId(null);
        setNombre(null);
    }

    useEffect (() => {
        setToken(sessionStorage.getItem('token'));
        setId(sessionStorage.getItem('id'));
        setNombre(sessionStorage.getItem('nombre'));
    }, []); 

    return (<Navbar bg="dark" variant="dark" expand="lg">

                <Modal show={showModal} onHide={handleCloseModal} backdrop="static" >
                    <Modal.Header closeButton>
                        <Modal.Title>Error al iniciar sesión</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Error al iniciar sesión con su cuenta de Google</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleCloseModal}>De acuerdo</Button>
                    </Modal.Footer>
                </Modal>

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
                        {token !== null && <>
                            <Nav.Link href="/perfiles">Usuarios</Nav.Link>
                            <Nav.Link href="/trayectos/new">Crear trayecto</Nav.Link>
                            <Nav.Link href="/vehiculos/new">Crear vehiculo</Nav.Link>
                            </>
                        }       
                        </Nav>
                    </ Navbar.Collapse>
                    <Nav>
                        {token === null && (
                            <GoogleLogin
                                clientId="860266555787-337c130jdi6jar97gkmomb1dq71sv02i.apps.googleusercontent.com"
                                buttonText="Login"
                                onSuccess={responseGoogleOnSuccess}
                                onFailure={handleShowModal}
                                cookiePolicy={'single_host_origin'}
                            />
                        )}
                        {nombre !== null && (
                            <Navbar.Text>
                                Hola, {nombre} | 
                            </Navbar.Text>
                        )}
                        {token !== null && (
                            <>
                            <Nav.Link href={"/perfiles/"+id}>Mi perfil</Nav.Link>
                            <Nav.Link href="/vehiculos/">Mis vehiculos</Nav.Link>
                            <Nav.Link href="/misTrayectos/">Mis trayectos</Nav.Link>
                            <Button onClick={handleLogOut}>Logout</Button>
                            </>
                        )}
                    </Nav>
                </Container>
            </Navbar>);
}

export default NavbarWeb;