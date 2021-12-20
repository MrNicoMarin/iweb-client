import React, { useEffect, useState, useParams } from 'react';
import {Table, Row, Col, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';

function CrearTrayecto () {

    const [latitud, setLatitud] = useState("");
    const [longitud, setLongitud] = useState("");
    const [location, setLocation] = useState(false);
    const [vehiculos, setVehiculos] = useState("[]");
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [radioValue, setRadioValue] = useState('1');

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function(position) {
            setLatitud(position.coords.latitude);
            setLongitud(position.coords.longitude);
            setLocation(true);
        });
        fetch("http://localhost:8000/v1/usuarios/2/vehiculos").then
        (response => response.json()).then
        ((data) => {
            setVehiculos(data);
            setIsLoaded(true);
        }, (error) => {
            setError(true);
            console.log(error);
        });
    }, []);
    
    if (location && isLoaded) {
        return(
            <div className="CrearTrayecto">        
                <h1>Nuevo trayecto</h1>
                <Container fluid="md">
                    <Row>
                        <Col>
                            <Row><Col>Origen: </Col></Row>
                            <Row><Col>Destino: </Col></Row>
                            <Row><Col>Piloto: </Col></Row>
                            <Row><Col>Vehiculo: 
                            <Form.Select aria-label="Default select example">
                            {vehiculos.map((vehiculo) => (
                                    <option value={vehiculo.id}>{vehiculo.matricula}</option>
                            ))}</Form.Select>
                            </Col></Row>
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
        return <div>Loading</div>
    } 

}

export default CrearTrayecto;