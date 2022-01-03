import React, { useState, useEffect } from 'react';
import {Table} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {Image, Container, Row, Col, Button, Form, Dropdown} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';
import Badge from 'react-bootstrap/Badge'

function DetallesPerfil () {
    const [usuario, setUsuario] = useState("[]");
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [vehiculos, setVehiculos] = useState("[]");
    let { id } = useParams();

    useEffect(() => { 
        fetch("http://localhost:8000/v1/usuarios/" + id).then
        (response => response.json()).then
        ((data) => {
            setUsuario(data);
            //setIsLoaded(true);
        }, (error) => {
            setError(true);
            console.log(error);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
        fetch("http://localhost:8000/v1/usuarios/"+id+"/vehiculos").then
        (response => response.json()).then
        ((data) => {
            setVehiculos(data);
            setIsLoaded(true);
        }, (error) => {
            setError(true);
            console.log(error);
        });
    }, []);

    if (isLoaded) {
        return( 
            <Container>
                <Row>
                    <Col sm={3}>
                        <h1>Hola, {usuario.name} </h1> <br/>
                        <Image src={usuario.imagen} width="150" height="150" />
                        <br/><br/>
                        <Dropdown>
                                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                                Mis vehiculos:
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {vehiculos.map((vehiculo) => (
                                                        <div key={vehiculo.id}>
                                                            <Dropdown.Item href={"/vehiculos/" + vehiculo.id} >{vehiculo.matricula}</Dropdown.Item>
                                                        </div>
                                                ))}
                                            </Dropdown.Menu>
                                            </Dropdown>
                                            <br/><br/>
                        <Button href={'/perfiles/' + id + '/update'}>Editar perfil</Button>
                        </Col>
                    <Col sm={8}>
                        <br/><br/><br/><br/><br/>
                            <Row>
                                <Col sm="3"><b>Correo:</b></Col>
                                <Col sm="3">
                                    {usuario.email}
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col sm="3"><b>Nombre:</b></Col>
                                <Col sm="3">
                                    {usuario.name}
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col sm="3"><b>Apellidos:</b></Col>
                                <Col sm="3">
                                    {usuario.apellidos}
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col sm="3"><b>Fecha de nacimiento:</b></Col>
                                <Col sm="3">
                                    {usuario.fechaNacimiento}
                                </Col>
                            </Row>
                            <Row>
                            <Col></Col>
                            </Row>
                    </Col>
                </Row>
            </Container>
        );
    } else {
        return (<Container>
            <Row>
                <Col></Col>
                <Col><ReactLoading type='bars' color='black' height={400} width={400} /></Col>
                <Col></Col>
            </Row>
            <Row>
                <Col></Col>
                <Col><h4>Cargando perfil...</h4></Col>
                <Col></Col>
            </Row>
        </Container>);
    } 

}

export default DetallesPerfil;