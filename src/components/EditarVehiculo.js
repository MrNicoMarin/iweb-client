import React, { useEffect, useState } from 'react';
import {Table, Row, Col, Container, Button} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import FloatingLabel from 'react-bootstrap/FloatingLabel'
const KEY = '519cb5cfb8146d5c913f65c72c2abee5';

function EditarVehiculo () {
    let { id } = useParams();
    const [fileUrl, setFileUrl] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [imagenCambiada, setImagenCambiada] = useState(false);
    const [error, setError] = useState(false);
    const [vehiculo, setVehiculo] = useState({
        modelo : '',
        color : '',
        matricula : '',
        imagen : null ,
        usuario : {},
        plazas : 0
    });

    function processImage(event){
        const imageFile = event.target.files[0];
        if (imageFile != null){
            const imageUrl = URL.createObjectURL(imageFile);
            setFileUrl(imageUrl)
            vehiculo.imagen = imageFile
            setImagenCambiada(true)
            setVehiculo(vehiculo)
        }
    }

    function handleModelo(event){
        vehiculo.modelo = event.target.value
        setVehiculo(vehiculo)
    }
    function handleColor(event){
        vehiculo.color = event.target.value
        setVehiculo(vehiculo)        
    }
    function handleMatricula(event){
        vehiculo.matricula = event.target.value
        setVehiculo(vehiculo)
    }

    function handlePlazas(event){
        vehiculo.plazas = parseInt(event.target.value)
        setVehiculo(vehiculo)
    }

    function handleUsuario(event){
        vehiculo.usuario.id = event.target.value
        setVehiculo(vehiculo)
    }
    function handleBoton(event){
        console.log(vehiculo)
        if (imagenCambiada){
            const formData = new FormData();
            formData.append("image", vehiculo.imagen);
            var requestOptions = {
                method: 'POST',
                body: formData
            };
            fetch('https://api.imgbb.com/1/upload?key=' + KEY, requestOptions).then
            (response => response.json()).then
            ((respuesta) => {
                vehiculo.imagen = respuesta.data.url
                setVehiculo(vehiculo)
                var requestOptions = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(vehiculo)
                };
                fetch('http://localhost:8000/v1/vehiculos/' + id , requestOptions).then
                (response => {window.location.replace("/vehiculos/"+id)});
            });
        }else{
            var requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vehiculo)
            };
            fetch('http://localhost:8000/v1/vehiculos/'+ id, requestOptions).then
            (response => {window.location.replace("/vehiculos/"+id)});
        }
    }

    useEffect(() => { 
        fetch("http://localhost:8000/v1/vehiculos/"+ id).then
        (response => response.json()).then
        ((data) => {
            setVehiculo(data);
            setFileUrl(data.imagen)
            setIsLoaded(true);
            console.log(data)
        }, (error) => {
            setError(true);
            console.log(error);
        })
    }, []);
    
    if (isLoaded) {
        return( 
            <Form>
                <Container>
                    <br/><br/><br/><br/><br/><br/>
                    <Row>
                        <Col sm={8}>Propietario: {vehiculo.usuario.name}</Col>
                        <Col sm={4}><Image src={fileUrl} width="150" height="150" hidden={fileUrl==null} /><br/><Form.Control type="file" accept="image/*" onChange={processImage} /></Col>
                    </Row>
                    <Row>
                        <Col sm>
                        <FloatingLabel
                        controlId="floatingInput"
                        label="Modelo"
                        className="mb-3"
                    >
                        <Form.Control defaultValue={vehiculo.modelo} onChange={handleModelo}/>
                    </FloatingLabel></Col>
                        <Col sm>
                        <FloatingLabel
                        controlId="floatingInput"
                        label="Color"
                        className="mb-3"
                    >
                        <Form.Control defaultValue={vehiculo.color} onChange={handleColor} />
                    </FloatingLabel>
                    </Col>
                        <Col sm><FloatingLabel
                        controlId="floatingInput"
                        label="Matrícula"
                        className="mb-3"
                    >
                        <Form.Control defaultValue={vehiculo.matricula} onChange={handleMatricula} />
                    </FloatingLabel></Col>
                        <Col sm>
                        <FloatingLabel
                        controlId="floatingInput"
                        label="Plazas"
                        className="mb-3"
                    >
                        <Form.Control defaultValue={vehiculo.plazas} onChange={handlePlazas} />
                    </FloatingLabel>
                        </Col>
                    </Row>
                </Container>
                <Button onClick={handleBoton} variant="primary">Guardar vehiculo</Button>
            </Form>
        );
    } else {
        return <div>Loading</div>
    } 

}

export default EditarVehiculo;