import React, { useEffect, useState } from 'react';
import {Image} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {Table, Row, Col, Container, Button} from 'react-bootstrap';
import ReactLoading from 'react-loading';

function Vehiculos () {
    const [vehiculos, setVehiculos] = useState("[]");
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => { 
        fetch("http://localhost:8000/v1/vehiculos").then
        (response => response.json()).then
        ((data) => {
            setVehiculos(data);
            setIsLoaded(true);
        }, (error) => {
            setError(true);
            console.log(error);
        })
    }, []);

    if (isLoaded) {
        return (
            <Table className='align-middle' hover>
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Usuario</th>
                            <th>Modelo</th>
                            <th>Color</th>
                            <th>Matricula</th>
                            <th>Plazas</th>
                        </tr>
                    </thead>
                    <tbody>
                    {vehiculos.map((vehiculo) => (
                            <tr key={vehiculo.id}>
                                <td>{<Image src={vehiculo.imagen} roundedCircle="true" width="100" height="100" />}</td>
                                <td>{vehiculo.usuario.name}, {vehiculo.usuario.apellidos}</td>
                                <td>{vehiculo.modelo}</td>
                                <td>{vehiculo.color}</td>
                                <td>{vehiculo.matricula}</td>
                                <td>{vehiculo.plazas}</td>
                                <td><a href={"/vehiculos/" + vehiculo.id}>Mas info</a></td>
                            </tr>
                        ))}
                    </tbody>
            </Table>);
    } else if (error) {
        return (<div>Error</div>);
    } else {
        return (
            <Container>
            <Row>
                <Col></Col>
                <Col><ReactLoading type='bars' color='black' height={400} width={400} /></Col>
                <Col></Col>
            </Row>
            <Row>
                <Col></Col>
                <Col><h4>Cargando vehiculos...</h4></Col>
                <Col></Col>
            </Row>
        </Container>);
    }

    
}

export default Vehiculos;