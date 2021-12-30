import React, { useEffect, useState, useParams } from 'react';
import {Table, Row, Col, Container, Button} from 'react-bootstrap';
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';

const KEY = '519cb5cfb8146d5c913f65c72c2abee5';

function EditarPerfil () {
    const [trayecto, setTrayecto] = useState("[]");
    const [fileUrl, setFileUrl] = useState(null);
    const [isLoaded, setIsLoaded] = useState(true);
    const [error, setError] = useState(false);
    const [imagenCambiada, setimagenCambiada] = useState(true);
    //let { id } = useParams();

    useEffect(() => { 
        fetch("http://localhost:8000/v1/trayectos/1").then //+ id).then
        (response => response.json()).then
        ((data) => {
            setFileUrl(data.imagen)
            setTrayecto(data);
            setIsLoaded(true);
        }, (error) => {
            setError(true);
            console.log(error);
        })
    }, []);

    function processImage(event){
        const imageFile = event.target.files[0];
        const imageUrl = URL.createObjectURL(imageFile);
        usuario.imagen = imageFile
        setTrayecto(trayecto)
        setFileUrl(imageUrl)
        setimagenCambiada(true);
    }

    function handlePiloto(event){
        trayecto.piloto = event.target.value;
        setTrayecto(trayecto)
        console.log(trayecto);
    }

    function handleVehiculo(event){
        trayecto.vehiculo = event.target.value;
        setTrayecto(trayecto)
        console.log(trayecto);
    }

    function handlePrecio(event){
        trayecto.precio = event.target.value;
        setTrayecto(trayecto)
        console.log(trayecto);
    }

    function handlePrecio(event){
        trayecto.precio = event.target.value;
        setTrayecto(trayecto)
        console.log(trayecto);
    }

    function handleFechaSalida(event){
        trayecto.fechaSalida = event.target.value;
        setTrayecto(trayecto)
        console.log(trayecto);
    }

    function handleParadas(event){
        trayecto.fechaSalida = event.target.value;
        setTrayecto(trayecto)
        console.log(trayecto);
    }

    function handleOrigen(event){
        trayecto.fechaSalida = event.target.value;
        setTrayecto(trayecto)
        console.log(trayecto);
    }

    function handleDestino(event){
        trayecto.fechaSalida = event.target.value;
        setTrayecto(trayecto)
        console.log(trayecto);
    }
    
    function handleBoton(event){
        if(imagenCambiada){
            const formData = new FormData();
            formData.append("image", usuario.imagen);
            var requestOptions = {
                method: 'POST',
                body: formData
            };
            fetch('https://api.imgbb.com/1/upload?key=' + KEY, requestOptions).then
            (response => response.json()).then
            ((respuesta) => {
                usuario.imagen = respuesta.data.url
                setUsuario(usuario)
                var requestOptions = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(usuario)
                };
                fetch('http://localhost:8000/v1/usuarios/2', requestOptions);
            });
        }else{
            var requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
            };
            fetch('http://localhost:8000/v1/usuarios/2', requestOptions);
        }
        //window.location.replace("/perfiles/2"); //+ id);
    }
    
    if (isLoaded) {
        return( 
            <Form>
                <Form.Group as={Row} className="mb-3" controlId="paradas">
                    <Form.Label column sm="2">
                        Paradas
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control type="text" placeholder={trayecto.paradas} readOnly />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="Origen">
                    <Form.Label column sm="2">
                        Origen
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control type="text" defaultValue={trayecto.origen} onChange={handleOrigen} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="Destino">
                    <Form.Label column sm="2">
                        Destino
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control type="text" defaultValue={trayecto.destino} onChange={handleDestino} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="Piloto">
                    <Form.Label column sm="2">
                        Piloto
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control type="date" defaultValue={trayecto.piloto} onChange={handlePiloto}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="Piloto">
                    <Form.Label column sm="2">
                        Piloto
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control type="date" defaultValue={trayecto.piloto} onChange={handlePiloto}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="Vehiculo">
                    <Form.Label column sm="2">
                        Vehiculo
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control type="date" defaultValue={trayecto.vehiculo} onChange={handleVehiculo}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="Piloto">
                    <Form.Label column sm="2">
                        Piloto
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control type="date" defaultValue={trayecto.piloto} onChange={handlePiloto}/>
                    </Col>
                </Form.Group>
                <Form.Group controlId="ImagenPerfil" className="mb-3">
                    <Form.Label>Imagen de perfil</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={processImage} />
                    
                </Form.Group>
                <div><Image src={fileUrl} width="150" height="150" hidden={fileUrl==null} id="imagen"/></div>
                <Button onClick={handleBoton} variant="primary">Confirmar cambios</Button>
            </Form>
        );
    } else {
        return <div>Loading</div>
    } 

}

export default EditarTrayecto;