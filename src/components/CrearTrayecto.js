import React, { useEffect, useState, useParams } from 'react';
import { Row, Col, Container, ButtonGroup, ToggleButton, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import {MapContainer, TileLayer, Marker, Popup, useMapEvents} from 'react-leaflet';

function CrearTrayecto () {

    const [latitud, setLatitud] = useState("");
    const [longitud, setLongitud] = useState("");
    const [location, setLocation] = useState(false);
    const [vehiculos, setVehiculos] = useState("[]");
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [origen, setOrigen] = useState('');
    const [paradas, setParadas] = useState([]);
    const [destino, setDestino] = useState('');
    const [seleccion, setSeleccion] = useState('0');
    const [trayecto, setTrayecto] = useState({
        origen : '',
        paradas : [],
        destino : '',
        piloto : {
            id : 2
        },
        vehiculo : {},
        precio : 0,
        fechaSalida : ''
    });

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

    const Clicks = () => {
        const map = useMapEvents({
            click(e) {
                let {lat, lng} = e.latlng;
                if (seleccion == '0') {
                    setOrigen({'lat' : lat, 'long' : lng});
                } else if (seleccion == '1') {
                    setParadas(paradas.concat({'lat' : lat, 'long' : lng}));
                } else {
                    setDestino({'lat' : lat, 'long' : lng});
                }
            }
        })
        return null;
    }

    function handleVehiculo (e) {
        trayecto.vehiculo.id = e.target.value;
        setTrayecto(trayecto);
    }

    function handleFecha (e) {
        trayecto.fechaSalida = e.target.value;
        setTrayecto(trayecto);
    }

    function handlePrecio (e) {
        trayecto.precio = parseFloat(e.target.value);
        setTrayecto(trayecto);
    }

    function handleBoton (e) {
        trayecto.origen = {latitud : origen.lat, longitud : origen.long};
        setTrayecto(trayecto);
        trayecto.paradas = [];
        paradas.forEach(function(parada, index) {
            console.log(parada);
            var paradasNew = trayecto.paradas.concat([{latitud : parada.lat, longitud : parada.long}])
            trayecto.paradas = paradasNew;
            setTrayecto(trayecto);
        })
        trayecto.destino = {latitud : destino.lat, longitud : destino.long};
        setTrayecto(trayecto);
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trayecto)
        };
        fetch('http://localhost:8000/v1/trayectos', requestOptions);

        window.location.replace('/trayectos');
    }

    if (location && isLoaded) {
        return(
            <div className="CrearTrayecto">        
                <h1>Nuevo trayecto</h1>
                <Container fluid="md">
                    <Row>
                        <Col>
                            <Row><Col>Vehiculo: 
                            <Form.Select aria-label="Default select example" onChange={handleVehiculo}>
                                <option value="-1">Seleccione un vehiculo</option>
                            {vehiculos.map((vehiculo) => (
                                    <option value={vehiculo.id}>{vehiculo.matricula}</option>
                            ))}</Form.Select>
                            </Col></Row>
                            <Row><Col>Precio:</Col><Col><input type="text" size={5} onChange={handlePrecio}/></Col></Row>
                            <Row><Col>Fecha salida:</Col><Col><input type="datetime-local" onChange={handleFecha}/></Col></Row>
                            <Row><Col><Button onClick={handleBoton}>Publicar trayecto</Button></Col></Row>
                        </Col>
                        <Col>                    
                        <MapContainer center={[latitud,longitud]} zoom={10} scrollWheelZooms style={{height: '350px'}}>
                            <Clicks></Clicks>
                            <TileLayer
                                attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {origen != '' && 
                                <Marker position={[origen.lat,origen.long]}>
                                    <Popup>
                                        Origen
                                    </Popup>
                                </Marker>
                            }
                            {paradas.length > 0 && 
                                paradas.map(parada => (
                                    <Marker position={[parada.lat,parada.long]}>
                                        <Popup>
                                            Parada
                                        </Popup>
                                    </Marker>
                                ))
                            }
                            {destino != '' && 
                                <Marker position={[destino.lat,destino.long]}>
                                    <Popup>
                                        Destino
                                    </Popup>
                                </Marker>
                            }
                        </MapContainer>
                        <Row>
                        Haga click en el mapa para seleccionar:
                        </Row>
                        <ButtonGroup size="lg" className="mb-2">
                            <ToggleButton type='radio' checked={seleccion == '0'} onClick={function () {setSeleccion('0')}}>Origen</ToggleButton>
                            <ToggleButton type='radio' checked={seleccion == '1'} onClick={function () {setSeleccion('1')}}>Paradas</ToggleButton>
                            <ToggleButton type='radio' checked={seleccion == '2'} onClick={function () {setSeleccion('2')}}>Destino</ToggleButton>
                        </ButtonGroup>
                        <Row>
                            <Col>
                                <Button variant='danger' onClick={function() {setOrigen(''); setParadas([]); setDestino(''); setSeleccion('0')}} >Borrar selecciones</Button>
                            </Col>
                        </Row>
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