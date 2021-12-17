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
    const [trayecto, setTrayecto] = useState("");
    const [error, setError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    let {id} = useParams();

    useEffect(() => {
        fetch("http://localhost:8000/v1/trayectos/" + id).then
        (response => response.json()).then
        ((data) => {
            setTrayecto(data);
            setIsLoaded(true);},
        (error) => {setError(true);});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoaded) {
        return (
            <Container>
            <Row>
                <Col>
                    <ListGroup>
                        <ListGroup.Item>Piloto: {trayecto.piloto.name} </ListGroup.Item>
                        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                        <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                        <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col>
                    <MapContainer center={[trayecto.origen.latitud, trayecto.origen.longitud]} zoom={5} scrollWheelZooms style={{height: '350px'}}>
                        <TileLayer
                            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[trayecto.origen.latitud, trayecto.origen.longitud]}></Marker>
                        <Marker position={[trayecto.destino.latitud, trayecto.destino.longitud]}></Marker>
                    </MapContainer>
                </Col>
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