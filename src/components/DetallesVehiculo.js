import React, { useState, useEffect } from 'react';
import {Table} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {Image, Container, Row, Col, Button, Form} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';

function DetallesVehiculo () {
    const [token, setToken] = useState(null);
    const [idlogin, setId] = useState(null);
    const [vehiculo, setVehiculos] = useState("[]");
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    let { id } = useParams();

    useEffect(() => {
        setToken(sessionStorage.getItem('token'));
        setId(sessionStorage.getItem('id'));
        fetch(process.env.REACT_APP_BASE_URL+"vehiculos/" + id).then
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
                                    <br/><br/>
                                    <Row>
                                        <Col><b>Propietario:</b></Col> <Col> {vehiculo.usuario.name} {vehiculo.usuario.apellidos} </Col>
                                    </Row>
                                    <br/>
                                    <Row>
                                        <Col><b>Modelo:</b></Col> <Col>{vehiculo.modelo}</Col>
                                    </Row>
                                    <br/>
                                    <Row>
                                        <Col><b>Color:</b></Col> <Col>{vehiculo.color}</Col>
                                    </Row>
                                    <br/>
                                    <Row>
                                        <Col><b>Matricula:</b></Col> <Col> {vehiculo.matricula} </Col>
                                    </Row>
                                    <br/>
                                    <Row>
                                        <Col><b>Plazas:</b></Col> <Col>{vehiculo.plazas}</Col>
                                    </Row>
                                    <br/>
                                    {idlogin == vehiculo.usuario.id && (
                                        <Row><Col><Button variant="primary" href={"/vehiculos/" + vehiculo.id + "/update"} >Editar</Button></Col></Row>
                                    )}
                                    
                                </Container>
                            </Col>
                            <Col>
                                <br/><br/><br/><br/>
                                <Image src={vehiculo.imagen} roundedCircle="true" width="250" height="250" />
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
        return (<Container>
            <Row>
                <Col></Col>
                <Col><ReactLoading type='bars' color='black' height={400} width={400} /></Col>
                <Col></Col>
            </Row>
            <Row>
                <Col></Col>
                <Col><h4>Cargando vehiculo...</h4></Col>
                <Col></Col>
            </Row>
        </Container>);
    }

}

export default DetallesVehiculo;