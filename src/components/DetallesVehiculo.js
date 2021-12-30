import React, { useState, useEffect } from 'react';
import {Table} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {Image, Container, Row, Col, Button, Form} from 'react-bootstrap';
import { useParams } from 'react-router-dom';

function DetallesVehiculo () {
    const [vehiculo, setVehiculos] = useState("[]");
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    let { id } = useParams();

    useEffect(() => { 
        fetch("http://localhost:8000/v1/vehiculos/" + id).then
        (response => response.json()).then
        ((data) => {
            setVehiculos(data);
            setIsLoaded(true);
        }, (error) => {
            setError(true);
            console.log(error);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                                        <h1>Vehiculo de {vehiculo.usuario.name} </h1> 
                                    </Row>
                                    <Row>
                                        <Col>Propietario:</Col> <Col> {vehiculo.usuario.name} {vehiculo.usuario.apellidos} </Col>
                                    </Row>
                                    <Row>
                                        <Col>Modelo:</Col> <Col>{vehiculo.modelo}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Color:</Col> <Col>{vehiculo.color}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Matricula:</Col> <Col> {vehiculo.matricula} </Col>
                                    </Row>
                                    <Row>
                                        <Col>Plazas:</Col> <Col>{vehiculo.plazas}</Col>
                                    </Row>
                                    <Row><Col><Button variant="primary" href={"/vehiculos/" + vehiculo.id + "/update"} >Editar</Button></Col></Row>
                                </Container>
                            </Col>
                            <Col>
                                <Image src={vehiculo.imagen} roundedCircle="true" width="150" height="150" />
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

export default DetallesVehiculo;