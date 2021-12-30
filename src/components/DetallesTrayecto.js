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

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

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
    let {id} = useParams();

    useEffect(() => {
        fetch("http://localhost:8000/v1/trayectos/" + id).then
        (response => response.json()).then
        ((data) => {
            setTrayecto(data);
            setIsLoaded(true);
            fetch("http://localhost:8000/v1/gasolineras?" + new URLSearchParams({latitud : data.origen.latitud, longitud : data.origen.longitud, distancia: 10})).then
            (response => response.json()).then
            ((dataG) => {
                setGasolineras(dataG);},
            (error) => {setError(true);});},
            
        (error) => {setError(true);});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoaded) {
        return (
            <Container>
            <Row>
                <Col>
                    <Container>  
                        <Col>
                            <Row>
                                <Col>
                                <ListGroup>
                                    <ListGroup.Item>Piloto: {trayecto.piloto.name + trayecto.piloto.apellidos} </ListGroup.Item>
                                    <ListGroup.Item>Correo: {trayecto.piloto.email} </ListGroup.Item>
                                </ListGroup>
                                </Col>
                                <Col>
                                <Image src = {trayecto.piloto.imagen} thumbnail width='50%'></Image>
                                </Col>
                            </Row>
                            
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
                        <ListGroup.Item>Fecha: {trayecto.fechaSalida} </ListGroup.Item>
                        <ListGroup.Item>Precio: {trayecto.precio} €</ListGroup.Item>
                        <ListGroup.Item><Button onClick={handleSubmit} variant="success">Unirme!</Button>{' '}</ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                {gasolineras.length == 0 && (<div>Loading...</div>)}
                {gasolineras.length > 0 && (
                    <><h1>Gasolineras cercanas</h1>
                                <Table hover style={{'overflow-y' : 'scroll','height':'500px','display':'block'}}>
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
                <Col></Col>
            </Row>
            
            </Container>
        );
    } else if (error) {
        return (<div>Error</div>)
    } else {
        return (<div>Loading</div>);
    }
}

export default DetallesTrayecto;