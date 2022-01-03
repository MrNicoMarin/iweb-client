import React, { useEffect, useState } from 'react';
import {Image} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {Table, Row, Col, Container, Button} from 'react-bootstrap';
import ReactLoading from 'react-loading';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner'

function Vehiculos () {
    const [vehiculos, setVehiculos] = useState("[]");
    const [isLoaded, setIsLoaded] = useState(false);
    const [isFiltring, setIsFiltring ] = useState(false);
    const [error, setError] = useState(false);
    const [params, setParams] = useState({});

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

    function handleFiltrar(event){
        setIsFiltring(true);
        fetch("http://localhost:8000/v1/vehiculos?" + new URLSearchParams(params)).then
        (response => response.json()).then
        ((data) => {
            setVehiculos(data);
            setIsLoaded(true);
            setIsFiltring(false);
        }, (error) => {
            setError(true);
            console.log(error);
        })
    }

    function handleModelo(event){
        if (event.target.value == ""){
            delete params.modelo
        }else{
            params.modelo = event.target.value;
            setParams(params);
        }
    }

    function handleColor(event){
        if (event.target.value == ""){
            delete params.color
        }else{
            params.color = event.target.value;
            setParams(params);
        }
    }

    function handleMatricula(event){
        if (event.target.value == ""){
            delete params.matricula
        }else{
            params.matricula = event.target.value;
            setParams(params);
        }
    }

    function handlePlazas(event){
        if (event.target.value == ""){
            delete params.plazas
        }else{
            params.plazas = parseInt(event.target.value);
            setParams(params);
        }
    }

    if (isLoaded) {
        return (
            <>
            <h1>Vehiculos</h1>
            <Container>
            <Form>
            <h3>Filtros</h3>
            <Form.Group as={Row}>
                <Col xs="1">Modelo</Col>
                <Col xs="3"><Form.Control type="text" onChange={handleModelo}/></Col>
                <Col xs="1">Color</Col>
                <Col xs="1"><Form.Control type="text" onChange={handleColor}/></Col>
                <Col xs="1">Matricula</Col>
                <Col xs="2"><Form.Control type="text"onChange={handleMatricula} /></Col>
                <Col xs="1">Plazas</Col>
                <Col xs="1"><Form.Control type="text" onChange={handlePlazas} /></Col>
            </Form.Group>
            <br/>
            <Form.Group as={Row}>
                    <Col xs="12"><Button variant="primary" onClick={handleFiltrar}><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" hidden={!isFiltring} />{!isFiltring?"Filtrar":"Loading..."}</Button></Col>
            </Form.Group>
            <br/>
            </Form>
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
            </Table>
            </Container>
            </>);
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