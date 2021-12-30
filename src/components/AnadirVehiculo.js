import React, { useEffect, useState, useParams } from 'react';
import {Table, Row, Col, Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import FloatingLabel from 'react-bootstrap/FloatingLabel'

const KEY = '519cb5cfb8146d5c913f65c72c2abee5';

function AnadirVehiculo () {
    const [fileUrl, setFileUrl] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [usuarios, setUsuarios] = useState("[]");
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
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vehiculo)
            };
            fetch('http://localhost:8000/v1/vehiculos', requestOptions);
        });
    }

    useEffect(() => { 
        fetch("http://localhost:8000/v1/usuarios").then
        (response => response.json()).then
        ((data) => {
            setUsuarios(data);
            setIsLoaded(true);
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
                        <Col sm={8}><Form.Select aria-label="Default select example" onChange={handleUsuario}>
                <option>Seleccione un usaurio</option>
                    {usuarios.map((usuario) => (
                        <option key={usuario.id} value={usuario.id}>{usuario.name + " " + usuario.apellidos}</option>
                    ))}
                </Form.Select></Col>
                        <Col sm={4}><Image src={fileUrl} width="150" height="150" hidden={fileUrl==null} /><br/><Form.Control type="file" accept="image/*" onChange={processImage} /></Col>
                    </Row>
                    <Row>
                        <Col sm>
                        <FloatingLabel
                        controlId="floatingInput"
                        label="Modelo"
                        className="mb-3"
                    >
                        <Form.Control onChange={handleModelo}/>
                    </FloatingLabel></Col>
                        <Col sm>
                        <FloatingLabel
                        controlId="floatingInput"
                        label="Color"
                        className="mb-3"
                    >
                        <Form.Control onChange={handleColor} />
                    </FloatingLabel>
                    </Col>
                        <Col sm><FloatingLabel
                        controlId="floatingInput"
                        label="Matrícula"
                        className="mb-3"
                    >
                        <Form.Control onChange={handleMatricula} />
                    </FloatingLabel></Col>
                        <Col sm>
                        <FloatingLabel
                        controlId="floatingInput"
                        label="Plazas"
                        className="mb-3"
                    >
                        <Form.Control onChange={handlePlazas} />
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

export default AnadirVehiculo;