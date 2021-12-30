import React, { useState, useEffect } from 'react';
import {Table} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {Image, Container, Row, Col, Button, Form} from 'react-bootstrap';
import { useParams } from 'react-router-dom';

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
        return (
            <Container>
                <Row>
                    <Container>
                        <Row>
                            <Col>
                                <Container>
                                    <Row>
                                        <h1>Hola, {usuario.name} </h1> 
                                    </Row>
                                    <Row>
                                        <Col>Nombre:</Col> <Col> {usuario.name} </Col>
                                    </Row>
                                    <Row>
                                        <Col>Correo:</Col> <Col>{usuario.email}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Fecha nacimiento:</Col> <Col>{usuario.fechaNacimiento}</Col>
                                    </Row>
                                    <Row><Button variant="primary" href={"/perfiles/" + usuario.id + "/update"} >Editar</Button></Row>
                                    <Row>
                                        <Col>Mis vehiculos:</Col> 
                                        <Col>
                                        <Container>
                                            {vehiculos.map((vehiculo) => (
                                                <Row>
                                                    <div key={vehiculo.id}>
                                                        <Button variant="info" href={"/vehiculos/" + vehiculo.id} >{vehiculo.matricula}</Button>
                                                    </div>
                                                </Row>
                                            ))}
                                            </Container>
                                        </Col>
                                    </Row>
                                </Container>
                            </Col>
                            <Col>
                                <Image src={usuario.imagen} roundedCircle="true" width="150" height="150" />
                            </Col>
                        </Row>
                    </Container>
                </Row>
                <Row> 
                </Row>
            </Container>      
        );
    } else if (error) {
        return (<div>Error</div>);
    } else {
        return (<div>Loading</div>);
    }

}

export default DetallesPerfil;