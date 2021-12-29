import React, { useEffect, useState, useParams } from 'react';
import {Table, Row, Col, Container, Button} from 'react-bootstrap';
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';

function EditarPerfil () {
    const [usuario, setUsuario] = useState("[]");
    const [fileUrl, setFileUrl] = useState(null);
    const [isLoaded, setIsLoaded] = useState(true);
    const [error, setError] = useState(false);
    //let { id } = useParams();

    useEffect(() => { 
        fetch("http://localhost:8000/v1/usuarios/2").then //+ id).then
        (response => response.json()).then
        ((data) => {
            setUsuario(data);
            //setIsLoaded(true);
        }, (error) => {
            setError(true);
            console.log(error);
        })
    }, []);

    const imagen = <Image src={usuario.imagen} width="150" height="150" hidden={false} />;

    function processImage(event){
        const imageFile = event.target.files[0];
        const imageUrl = URL.createObjectURL(imageFile);
        setFileUrl(imageUrl)
    }

    function handleNombre(event){
        usuario.nombre = event.target.value;
        console.log(usuario);
    }

    function handleApellidos(event){
        usuario.apellidos = event.target.value;
        console.log(usuario);
    }

    function handleFechaNacimiento(event){
        usuario.fechaNacimiento = event.target.value;
        console.log(usuario);
    }
    
    function handleBoton(event){
        var requestOptions = {
            method: 'Update',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        };
        fetch('http://localhost:8000/v1/usuario/2', requestOptions);
    }
    
    if (isLoaded) {
        return( 
            <Form>
                <Form.Group as={Row} className="mb-3" controlId="Correo">
                    <Form.Label column sm="2">
                        Correo
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control type="text" placeholder={usuario.email} readOnly />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="Nombre">
                    <Form.Label column sm="2">
                        Nombre
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control type="text" placeholder={usuario.name} onChange={handleNombre} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="Apellidos">
                    <Form.Label column sm="2">
                        Apellidos
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control type="text" placeholder={usuario.apellidos} onChange={handleApellidos} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="FechaNacimiento">
                    <Form.Label column sm="2">
                        Fecha nacimiento
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control type="text" placeholder={usuario.fechaNacimiento} onChange={handleFechaNacimiento}/>
                    </Col>
                </Form.Group>
                <Form.Group controlId="ImagenPerfil" className="mb-3">
                    <Form.Label>Imagen de perfil</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={processImage} />
                </Form.Group>
                <div>{imagen}</div>
                <Button onClick={handleBoton} variant="primary">Confirmar cambios</Button>
            </Form>
        );
    } else {
        return <div>Loading</div>
    } 

}

export default EditarPerfil;