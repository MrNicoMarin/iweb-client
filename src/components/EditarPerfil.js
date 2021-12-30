import React, { useEffect, useState } from 'react';
import {Table, Row, Col, Container, Button} from 'react-bootstrap';
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import { useParams } from 'react-router-dom';

const KEY = '519cb5cfb8146d5c913f65c72c2abee5';

function EditarPerfil () {
    const [usuario, setUsuario] = useState("[]");
    const [fileUrl, setFileUrl] = useState(null);
    const [isLoaded, setIsLoaded] = useState(true);
    const [error, setError] = useState(false);
    const [imagenCambiada, setimagenCambiada] = useState(true);
    let { id } = useParams();

    useEffect(() => { 
        fetch("http://localhost:8000/v1/usuarios/" + id).then
        (response => response.json()).then
        ((data) => {
            setFileUrl(data.imagen)
            setUsuario(data);
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
        setUsuario(usuario)
        setFileUrl(imageUrl)
        setimagenCambiada(true);
    }

    function handleNombre(event){
        usuario.name = event.target.value;
        setUsuario(usuario);
        console.log(usuario);
    }

    function handleApellidos(event){
        usuario.apellidos = event.target.value;
        setUsuario(usuario);
        console.log(usuario);
    }

    function handleFechaNacimiento(event){
        usuario.fechaNacimiento = event.target.value;
        setUsuario(usuario);
        console.log(usuario);
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
                fetch('http://localhost:8000/v1/usuarios/'+id, requestOptions).then
                (response => {window.location.replace("/perfiles/"+id)})
            });
        }else{
            var requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
            };
            fetch('http://localhost:8000/v1/usuarios/'+id, requestOptions).then
            (response => {window.location.replace("/perfiles/"+id)})
        }
        
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
                    <Form.Control type="text" defaultValue={usuario.name} onChange={handleNombre} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="Apellidos">
                    <Form.Label column sm="2">
                        Apellidos
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control type="text" defaultValue={usuario.apellidos} onChange={handleApellidos} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="FechaNacimiento">
                    <Form.Label column sm="2">
                        Fecha nacimiento
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control type="date" defaultValue={usuario.fechaNacimiento} onChange={handleFechaNacimiento}/>
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

export default EditarPerfil;