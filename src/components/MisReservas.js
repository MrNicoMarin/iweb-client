import React, { useEffect, useState } from 'react';
import {Container, Table, Row, Col, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import ReactLoading from 'react-loading';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Spinner from 'react-bootstrap/Spinner'
import Modal from 'react-bootstrap/Modal';

const INITIAL_OFFSET = 0;


function Trayectos(props) {
    const [reservas, setReservas] = useState("[]");
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [params, setParams] = useState({limit : 10, offset: INITIAL_OFFSET});
    const [isLoadingMas, setIsLoadingMas] = useState(false);
    const [masResultados, setMasResultados] = useState(true);
    const [show, setShow] = useState(false);
    const [reserva, setReserva] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => { 
        fetch(process.env.REACT_APP_BASE_URL+"usuarios/"+sessionStorage.getItem('id')+"/reservas").then
        (response => response.json()).then
        ((data) => {
            setReservas(data);
            setIsLoaded(true);
        }, (error) => {
            setError(true);
            console.log(error);
        })
    }, []);

    function formatoFecha(f) {
        var fecha = new Date(f);
        var date = (fecha.getDate() < 10 ? '0' + fecha.getDate() : fecha.getDate()) +'/'+((fecha.getMonth()+1) < 10 ? ('0' + (fecha.getMonth()+1)) : ((fecha.getMonth()+1))) +'/'+fecha.getFullYear();
        var time = fecha.getHours() + ":" + (fecha.getMinutes() < 10? "0" + fecha.getMinutes() : fecha.getMinutes());
        return(date+' '+time);
    }

    function borrarReserva(reserva){
        setReserva(reserva);
        setShow(true);
    }

    function handleDelete(){
        var requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' , 'Authorization' : sessionStorage.getItem('token')},
            body: JSON.stringify(reserva)
        };
        fetch('http://localhost:8000/v1/reservas/'+ reserva.id, requestOptions).then
        (response => {window.location.replace("/misReservas")})
    }

    if (isLoaded) {
        return (
            <>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title>Borrar reserva</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                ¿Está seguro que desea borrar esta reserva? 
                Pulse "confirmar eliminación" para borrarlo definitivamente.
                Pulse "cancelar" para evitar la acción.
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleDelete}>
                    Confirmar eliminación
                </Button>
              </Modal.Footer>
            </Modal>
            <h1>Reservas</h1>
            <Container>
                <Col></Col>
            <Table hover>
                <thead>
                    <tr>
                        <th>Origen</th>
                        <th>Destino</th>
                        <th>Piloto</th>
                        <th>Precio</th>
                        <th>Fecha salida</th>
                        <th>Fecha reserva</th>
                    </tr>
                </thead>
                <tbody>
                    {reservas.map((reserva) => (
                        <tr key={reserva.id}>
                            <td>{reserva.trayecto.origen.municipio}</td>
                            <td>{reserva.trayecto.destino.municipio}</td>
                            <td>{reserva.trayecto.piloto.name}</td>
                            <td>{reserva.trayecto.precio}€</td>
                            <td>{formatoFecha(reserva.trayecto.fechaSalida)}</td>
                            <td>{formatoFecha(reserva.fechaReserva)}</td>
                            <td><a href={"/trayectos/" + reserva.trayecto.id}>Mas info</a></td>
                            <td><Button onClick={function () {borrarReserva(reserva)}} variant="danger" > Borrar </Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
                <Col></Col>
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
                    <Col><h4>Cargando reservas...</h4></Col>
                    <Col></Col>
                </Row>
            </Container>
            );
    }

    
}

export default Trayectos;