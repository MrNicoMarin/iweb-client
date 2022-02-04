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
import Card from 'react-bootstrap/Card'

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import termRojo from '../assets/termometro_rojo.png';
import termAzul from '../assets/termometro_azul.png';
import ReactLoading from 'react-loading';
import Badge from 'react-bootstrap/Badge'

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
const CLIENT_ID = "AZuujy15eu4mxSrgWPnE7K3kcpwX4NviNei1a2hKeLoUuPmZu0nNR7iFdZqYqKSE1vDvtpNSfmd2PEOf"

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [35, 46],
    iconAnchor: [17, 46]
});

L.Marker.prototype.options.icon = DefaultIcon; 

function DetallesTrayecto () {
    const [token, setToken] = useState(null);
    const [idlogin, setId] = useState(null);
    function handleSubmit() {
        //e.preventDefault();
        console.log("hola");
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem('token') },
            body: JSON.stringify({"trayecto": {"id":trayecto.id}})
        };
        fetch(process.env.REACT_APP_BASE_URL + 'reservas', requestOptions).then
        (response => {window.location.replace("/trayectos/"+ trayecto.id)});
    }

    const [trayecto, setTrayecto] = useState("");
    const [error, setError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [gasolineras,setGasolineras] = useState([]);
    const [markerG, setMarkerG] = useState('');
    const [prediccion, setPrediccion] = useState('');
    const [reservas, setReservas] = useState([]);
    let {id} = useParams();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [showPaypal, setShowPaypal] = useState(false);
    const handleClosePaypal = () => setShowPaypal(false);
    const handleShowPaypal = () => setShowPaypal(true);

    useEffect(() => {
        setToken(sessionStorage.getItem('token'));
        setId(sessionStorage.getItem('id'));

        fetch(process.env.REACT_APP_BASE_URL+"trayectos/" + id + "/reservas").then
        (response => response.json()).then
        ((data) =>{
            setReservas(data);
            fetch(process.env.REACT_APP_BASE_URL+"trayectos/" + id).then
        (response => response.json()).then
        ((data) => {
            setTrayecto(data);
            const date = new Date(data.fechaSalida);
            const stringDate = date.getFullYear() + '-' + ((date.getMonth() + 1).toString().length == 1 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + (date.getDate().toString().length == 1 ? '0' + date.getDate() : date.getDate());
            setIsLoaded(true);
            fetch(process.env.REACT_APP_BASE_URL+"predicciones?" + new URLSearchParams({municipio : data.origen.municipio, fecha : stringDate, hora : date.getHours()})).then
            (response => response.json()).then
            ((dataP) => {
                console.log(dataP)
                setPrediccion(dataP);},
            (error) => {setError(true);})
            fetch(process.env.REACT_APP_BASE_URL+"gasolineras?" + new URLSearchParams({latitud : data.origen.latitud, longitud : data.origen.longitud, distancia: 10})).then
            (response => response.json()).then
            ((dataG) => {
                setGasolineras(dataG);},
            (error) => {setError(true);});},
            
        (error) => {setError(true);});
        }, (error) => {});

        


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
            headers: { 'Content-Type': 'application/json' , 'Authorization' : sessionStorage.getItem('token')},
            body: JSON.stringify(trayecto)
        };
        fetch(process.env.REACT_APP_BASE_URL + 'trayectos/'+id, requestOptions).then
        (response => {window.location.replace("/trayectos")})
    }

    function fechaValida() {
        var now = new Date();
        var fechaSalida = new Date(trayecto.fechaSalida);
        return fechaSalida.getTime() > now.getTime();
    }

    function tengoReserva() {
        for (var i = 0; i < reservas.length; i++) {
            if (reservas[i].usuario.id == idlogin) {
                return true;
            }
        }
        return false;
    }

    const initialOptions = {
        "client-id": CLIENT_ID,
        currency: "EUR",
        intent: "capture",
    };

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
            <Modal show={showPaypal} onHide={handleClosePaypal} backdrop="static" keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title>Metodo de pago</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <>
        <PayPalScriptProvider  options={initialOptions}>
        <PayPalButtons
           style={{ layout: "horizontal" }}
            createOrder={(data, actions) => {return actions.order.create({
                purchase_units: [
                    {
                        description: "Trayecto desde" +trayecto.origen.municipio+ "a" + trayecto.destino.municipio,
                        amount: {
                            value: trayecto.precio,
                        },
                    },
                ],
            });}}
            onApprove={(data, actions) => {
                return actions.order.capture().then((details) => {
                    handleSubmit();
                });
            }}
         />
        </PayPalScriptProvider>
        </>
              </Modal.Body>
            </Modal>

            <Container>
            <Row>
                <Row xs={1} md={3} className="g-4">
                    <Col>
                        <Card>
                        <Card.Body>
                        <Card.Title>Piloto</Card.Title>
                        <Image src={trayecto.piloto.imagen} referrerpolicy="no-referrer" roundedCircle="true" width="75" height="75" />
                        <Card.Text></Card.Text>
                          <Card.Text>Email: {trayecto.piloto.email}</Card.Text>
                          <Card.Text></Card.Text>
                          <Card.Text>Nombre: {trayecto.piloto.name}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>Datos</Card.Title>
                                <Card.Text></Card.Text>
                                <Card.Text>Fecha: {formatoFecha(trayecto.fechaSalida)}</Card.Text>
                                <Card.Text></Card.Text>
                                <Card.Text>Precio: {trayecto.precio} €</Card.Text>
                                <Card.Text></Card.Text>
                                {token != null && idlogin != trayecto.piloto.id && fechaValida() && !tengoReserva() && reservas.length < (trayecto.vehiculo.plazas - 1) && (
                                    <Button onClick={handleShowPaypal} variant="success">Reservar</Button>
                                )}
                                {token != null && idlogin != trayecto.piloto.id && tengoReserva() && (
                                    <Button disabled variant="warning">Reservado</Button>
                                )}
                                {token != null && idlogin != trayecto.piloto.id && !tengoReserva() && reservas.length >= (trayecto.vehiculo.plazas - 1) && (
                                    <Button disabled variant="warning">No quedan plazas</Button>
                                )}
                                {token != null && idlogin == trayecto.piloto.id && (
                                    <Button onClick={handleShow} variant="danger">Borrar</Button>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>Vehiculo</Card.Title>
                                <Image src={trayecto.vehiculo.imagen} referrerpolicy="no-referrer" roundedCircle="true" width="75" height="75" />
                                    <Card.Text></Card.Text>
                                <Card.Text>Modelo: {trayecto.vehiculo.modelo}</Card.Text>
                                <Card.Text></Card.Text>
                                <Card.Text>Plazas: {trayecto.vehiculo.plazas}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <br/>
                </Row>
                <Row>
                    <MapContainer center={[trayecto.origen.latitud, trayecto.origen.longitud]} zoom={5} scrollWheelZooms style={{height: '500px'}}>
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
                </Row>
            </Row>
            <br/>
            {reservas != null && (tengoReserva() || idlogin == trayecto.piloto.id) && (
                    <h2>Reservas</h2>
                )}
            <Row md={trayecto.vehiculo.plazas - 1} className="g-4">
                {reservas != null && reservas.length > 0 && (tengoReserva() || idlogin == trayecto.piloto.id) && reservas.map((reserva) => (
                        <Col>
                        <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title><b>{reserva.usuario.name}</b></Card.Title>
                        <Image src={reserva.usuario.imagen} referrerpolicy="no-referrer" roundedCircle="true" width="40" height="40" />
                          <Card.Text>{reserva.usuario.email}</Card.Text>
                        </Card.Body>
                      </Card>
                      </Col>
                     
                    ))}
                {reservas != null && idlogin == trayecto.piloto.id && reservas.length == 0 && (
                    <h4>No hay reservas aun.</h4>
                )}
            </Row>
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
                    <><h2>Gasolineras cercanas</h2>
                                <Table hover style={{'overflowY' : 'scroll','height':'385px','display':'block'}}>
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
                <Col xs={4}>
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
                    <Card>
                        <Card.Body>
                            <Card.Title><b>Predicción en {trayecto.origen.municipio}</b></Card.Title>
                            <Card.Text></Card.Text>
                            <Image src={require('../assets/tiempoMeteorologico/' + prediccion.estadoCielo + '.png').default}  referrerpolicy="no-referrer" roundedCircle="true" width="80" height="80" />
                            <Card.Text></Card.Text>
                            <Card.Text><b>Estado del cielo:</b> {prediccion.estadoCielo}</Card.Text>
                            <Card.Text><b>Probabilidad de lluvia:</b> {prediccion.probPrecipitacion}%</Card.Text>
                            <Card.Text><b>Temperatura máxima:</b> {prediccion.temperaturaMax}°C <Image height={'40em'} src={termRojo} /></Card.Text>
                            <Card.Text><b>Temperatura mínima:</b> {prediccion.temperaturaMin}°C <Image height={'30em'} src={termAzul} /></Card.Text>
                            <Card.Text><b>Viento:</b> {prediccion.viento.velocidad} km/h {prediccion.viento.direccion != 'C' && ('Dirección: ' + prediccion.viento.direccion)} </Card.Text>
                        </Card.Body>
                    </Card>
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