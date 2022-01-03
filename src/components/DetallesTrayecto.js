import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { useParams } from "react-router-dom";
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import termRojo from '../assets/termometro_rojo.png';
import termAzul from '../assets/termometro_azul.png';
import ReactLoading from 'react-loading';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [35, 46],
    iconAnchor: [17, 46]
});

L.Marker.prototype.options.icon = DefaultIcon; 

function DetallesTrayecto () {
    function handleSubmit(e) {
        e.preventDefault();
        alert("A desarrollar en la siguiente iteracion");
    }

    const [trayecto, setTrayecto] = useState("");
    const [error, setError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [gasolineras,setGasolineras] = useState([]);
    const [markerG, setMarkerG] = useState('');
    const [prediccion, setPrediccion] = useState('');
    let {id} = useParams();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        fetch("http://localhost:8000/v1/trayectos/" + id).then
        (response => response.json()).then
        ((data) => {
            setTrayecto(data);
            setIsLoaded(true);
            const date = new Date(data.fechaSalida);
            const stringDate = date.getFullYear() + '-' + ((date.getMonth() + 1).toString().length == 1 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + (date.getDate().toString().length == 1 ? '0' + date.getDate() : date.getDate());
            fetch("http://localhost:8000/v1/predicciones?" + new URLSearchParams({municipio : data.origen.municipio, fecha : stringDate, hora : date.getHours()})).then
            (response => response.json()).then
            ((dataP) => {
                console.log(dataP)
                setPrediccion(dataP);},
            (error) => {setError(true);})
            fetch("http://localhost:8000/v1/gasolineras?" + new URLSearchParams({latitud : data.origen.latitud, longitud : data.origen.longitud, distancia: 10})).then
            (response => response.json()).then
            ((dataG) => {
                setGasolineras(dataG);},
            (error) => {setError(true);});},
            
        (error) => {setError(true);});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function formatoFecha(f) {
        var fecha = new Date(f);
        var date = (fecha.getDate() < 10 ? '0' + fecha.getDate() : fecha.getDate()) +'/'+((fecha.getMonth()+1) < 10 ? ('0' + (fecha.getMonth()+1)) : ((fecha.getMonth()+1))) +'/'+fecha.getFullYear();
        var time = fecha.getHours() + ":" + (fecha.getMinutes() < 10? "0" + fecha.getMinutes() : fecha.getMinutes());
        return(date+' '+time);
    }

    function handleDelete(event){
        var requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trayecto)
        };
        fetch('http://localhost:8000/v1/trayectos/'+id, requestOptions).then
        (response => {window.location.replace("/trayectos")})
    }

    if (isLoaded) {
        return (
            <div>
                <br/>
            <h1>Trayecto desde {trayecto.origen.municipio} a {trayecto.destino.municipio}</h1>
            <br/>
            <br/>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title>Borrar trayecto</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                ¿Está seguro que desea borrar este trayecto? 
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

            <Container>
            <Row>
                <Col>
                    <Container>  
                        <Col>
                            <Row>
                                <Col>
                                <ListGroup>
                                    <ListGroup.Item>Piloto: {trayecto.piloto.name + ' ' + trayecto.piloto.apellidos} </ListGroup.Item>
                                    <ListGroup.Item>Correo: {trayecto.piloto.email} </ListGroup.Item>
                                </ListGroup>
                                </Col>
                                <Col>
                                <Image src = {trayecto.piloto.imagen} thumbnail width='50%'></Image>
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col>
                                <ListGroup>
                                    <ListGroup.Item>Modelo: {trayecto.vehiculo.modelo}</ListGroup.Item>
                                    <ListGroup.Item>Plazas: {trayecto.vehiculo.plazas}</ListGroup.Item>
                                    <ListGroup.Item>Precio: {trayecto.precio}€</ListGroup.Item>
                                </ListGroup>
                                </Col>
                                <Col>
                                <Image src = {trayecto.vehiculo.imagen} thumbnail></Image>
                                </Col>
                            </Row>

                            
                        </Col>
                    </Container>

                </Col>
                <Col>
                    <MapContainer center={[trayecto.origen.latitud, trayecto.origen.longitud]} zoom={5} scrollWheelZooms style={{height: '350px'}}>
                        <TileLayer
                            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[trayecto.origen.latitud, trayecto.origen.longitud]}>
                            <Popup>
                                Origen: {trayecto.origen.municipio}
                            </Popup>
                        </Marker>
                        <Marker position={[trayecto.destino.latitud, trayecto.destino.longitud]}>
                            <Popup>
                                Destino: {trayecto.destino.municipio}
                            </Popup>
                        </Marker>
                        {trayecto.paradas.map(marker => (
                            <Marker key={marker.id} position={[marker.latitud, marker.longitud]}>
                                <Popup>
                                    Parada: {marker.municipio}
                                </Popup>
                            </Marker>
                        ))}
                        {markerG != '' && (
                            <Marker position={[markerG.lat, markerG.lon]}>
                                <Popup>
                                    Gasolinera<br/>{markerG.direccion}
                                </Popup>
                            </Marker>
                        )}
                    </MapContainer>

                    <ListGroup horizontal>
                        <ListGroup.Item>Fecha: {formatoFecha(trayecto.fechaSalida)} </ListGroup.Item>
                        <ListGroup.Item>Precio: {trayecto.precio} €</ListGroup.Item>
                        <ListGroup.Item><Button onClick={handleSubmit} variant="success">Unirme!</Button>{' '}</ListGroup.Item>
                        <ListGroup.Item><Button onClick={handleShow} variant="danger">Borrar</Button>{' '}</ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
            <Row>
                <Col></Col>
                <Col></Col>
                <Col>
                    
                </Col></Row>
                <br/><br />
            <Row>
                <Col>
                {gasolineras.length == 0 && (<Container>
                <Row>
                    <Col></Col>
                    <Col><ReactLoading type='spin' color='black' height={200} width={200} /></Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col><h4>Cargando gasolineras...</h4></Col>
                    <Col></Col>
                </Row>
            </Container>)}
                {gasolineras.length > 0 && (
                    <><h1>Gasolineras cercanas</h1>
                                <Table hover style={{'overflowY' : 'scroll','height':'500px','display':'block'}}>
                                    <thead>
                                        <tr>
                                            <th>Dirección</th>
                                            <th>Horario</th>
                                            <th>Precio Gasoil</th>
                                            <th>Precio Gasoil+</th>
                                            <th>Precio 95</th>
                                            <th>Precio 98</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gasolineras.map(gasolinera => (
                                            <tr>
                                                <td>{gasolinera.Direccion}</td>
                                                <td>{gasolinera.Horario}</td>
                                                <td>{gasolinera.PrecioGA}</td>
                                                <td>{gasolinera.PrecioGPremium}</td>
                                                <td>{gasolinera.Precio95}</td>
                                                <td>{gasolinera.Precio98}</td>
                                                <td><Button onClick={function () { setMarkerG({ lat: gasolinera.Latitud.replace(',', '.'), lon: gasolinera.Longitud.replace(',', '.'), direccion: gasolinera.Direccion }); } }>Mostrar en mapa</Button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table></>
                )}
                </Col>
                <Col>
                {prediccion == '' && (<Container>
                <Row>
                    <Col></Col>
                    <Col><ReactLoading type='spin' color='black' height={200} width={200} /></Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col><h4>Cargando prediccion...</h4></Col>
                    <Col></Col>
                </Row>
            </Container>)}
                {prediccion != '' && prediccion.hasOwnProperty('mensaje') && (<h1>No existe prediccion para ese dia</h1>)}
                {prediccion != '' && !prediccion.hasOwnProperty('mensaje') && (
                <><h1>Predicción en {trayecto.origen.municipio}</h1>
                <Table hover>
                    <tbody>
                        <tr>
                            <th>Estado del cielo</th>
                            <td>{prediccion.estadoCielo} <Image roundedCircle height={'40em'} src={require('../assets/tiempoMeteorologico/' + prediccion.estadoCielo + '.png').default} /></td>
                        </tr>
                        <tr>
                            <th>Probabilidad de lluvia</th>
                            <td>{prediccion.probPrecipitacion}%</td>
                        </tr>
                        <tr>
                            <th>Temperatura máxima</th>
                            <td>{prediccion.temperaturaMax}°C <Image height={'40em'} src={termRojo} /></td>
                        </tr>
                        <tr>
                            <th>Temperatura mínima</th>
                            <td>{prediccion.temperaturaMin}°C <Image height={'30em'} src={termAzul} /></td>
                        </tr>
                        <tr>
                            <th>Viento</th>
                            <td>{prediccion.viento.velocidad} km/h {prediccion.viento.direccion != 'C' && ('Dirección: ' + prediccion.viento.direccion)} </td>
                        </tr>
                    </tbody>

                </Table></>
                )}
                </Col>
            </Row>
            
            </Container>
            </div>
        );
    } else if (error) {
        return (<div>Error</div>)
    } else {
        return (<Container>
            <Row>
                <Col></Col>
                <Col><ReactLoading type='bars' color='black' height={400} width={400} /></Col>
                <Col></Col>
            </Row>
            <Row>
                <Col></Col>
                <Col><h4>Cargando trayecto...</h4></Col>
                <Col></Col>
            </Row>
        </Container>);
    }
}

export default DetallesTrayecto;