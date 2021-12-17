import React, { useEffect, useState } from 'react';
import {Table, Row, Col, Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';

function CrearTrayecto () {

    const [latitud, setLatitud] = useState("");
    const [longitud, setLongitud] = useState("");
    const [location, setLocation] = useState(false);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function(position) {
            setLatitud(position.coords.latitude);
            setLongitud(position.coords.longitude);
            setLocation(true);
        });
    }, []);
    
    if (location) {
        return(
            <div className="CrearTrayecto">        
                <h1>Nuevo trayecto</h1>
                <Container fluid="md">
                    <Row>
                        <Col>
                            <Row><Col>Origen: </Col></Row>
                            <Row><Col>Destino: </Col></Row>
                            <Row><Col>Piloto: </Col></Row>
                            <Row><Col>Vehiculo: </Col></Row>
                            <Row><Col>Precio:</Col><Col><input type="text" size={5}/></Col></Row>
                            <Row><Col>Fecha salida:</Col><Col><input type="datetime-local" value={""}/></Col></Row>
                        </Col>
                        <Col>                    
                        <MapContainer center={[latitud,longitud]} zoom={10} scrollWheelZooms style={{height: '350px'}}>
                            <TileLayer
                                attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </MapContainer>
                        </Col>
                    </Row>
                </Container>
            </div>
            
        );
    } else {
        return <div>Obteniendo ubicacion</div>
    }

}

export default CrearTrayecto;