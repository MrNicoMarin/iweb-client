import React, { useEffect, useState, useParams } from 'react';
import {Table, Row, Col, Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import ReactLoading from 'react-loading';
import Modal from 'react-bootstrap/Modal'

const KEY = '519cb5cfb8146d5c913f65c72c2abee5';

//https://media.giphy.com/media/xTiTnh5azRSd2UUgZW/giphy.gif
//https://media.giphy.com/media/PTDqrtdRCJCwbhmNot/giphy.gif
//https://media.giphy.com/media/8mbkWu1aYQeXqxXq1H/giphy.gif
const URL_IMAGEN_COCHE_DEFECTO = "https://media.giphy.com/media/nl8mtpULJOz3stJGpO/giphy.gif"; 

function AnadirVehiculo () {
    const [fileUrl, setFileUrl] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [usuarios, setUsuarios] = useState("[]");
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const [vehiculo, setVehiculo] = useState({
        modelo : '',
        color : '',
        matricula : '',
        imagen : '' ,
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
        if(vehiculo.modelo == null || vehiculo.modelo == "" ||
        vehiculo.plazas == null || vehiculo.plazas == 0 ||
        vehiculo.matricula == null || vehiculo.matricula == "" ||
        vehiculo.color == null || vehiculo.color == "" ||
        vehiculo.usuario == null){
                setShowModal(true);
        }else{
            if(vehiculo.imagen == ''){
                vehiculo.imagen = URL_IMAGEN_COCHE_DEFECTO;
                var requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(vehiculo)
                };
                fetch('http://localhost:8000/v1/vehiculos', requestOptions).then
                (response => {window.location.replace("/vehiculos")});
            }else{
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
                    fetch('http://localhost:8000/v1/vehiculos', requestOptions).then
                    (response => {window.location.replace("/vehiculos")});
                });
            }
            
        }
    }

    useEffect(() => { 
        fetch("http://localhost:8000/v1/usuarios").then
        (response => response.json()).then
        ((data) => {
            setUsuarios(data);
            setIsLoaded(true)
        }, (error) => {
            setError(true);
            console.log(error);
        })
    }, []);
    
    if (isLoaded) {
        return(
            <>
            <Modal show={showModal} onHide={handleCloseModal} backdrop="static" >
                <Modal.Header closeButton>
                    <Modal.Title>Error al crear vehiculo</Modal.Title>
                </Modal.Header>
                <Modal.Body>Faltan datos por rellenar</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseModal} >De acuerdo</Button>
                </Modal.Footer>
            </Modal>

            <h1>Nuevo vehiculo</h1>
            <Form>
                <Container>
                    <br/><br/><br/>
                    <Row>
                        <Col sm>
                        <FloatingLabel
                        controlId="floatingInput"
                        label="Modelo*"
                        className="mb-3"
                    >
                        <Form.Control onChange={handleModelo}/>
                    </FloatingLabel></Col>
                        <Col sm>
                        <FloatingLabel
                        controlId="floatingInput"
                        label="Color*"
                        className="mb-3"
                    >
                        <Form.Control onChange={handleColor} />
                    </FloatingLabel>
                    </Col>
                        <Col sm><FloatingLabel
                        controlId="floatingInput"
                        label="Matrícula*"
                        className="mb-3"
                    >
                        <Form.Control onChange={handleMatricula} />
                    </FloatingLabel></Col>
                        <Col sm>
                        <FloatingLabel
                        controlId="floatingInput"
                        label="Plazas*"
                        className="mb-3"
                    >
                        <Form.Control onChange={handlePlazas} />
                    </FloatingLabel>
                        </Col>
                    </Row>
                    <br/><br/>
                    <Row>
                        <Col sm={7}>
                        <Row>
                        <Col sm={10}><Form.Select aria-label="Default select example" onChange={handleUsuario}>
                            <option>Seleccione un usuario*</option>
                                {usuarios.map((usuario) => (
                            <option key={usuario.id} value={usuario.id}>{usuario.name + " " + usuario.apellidos}</option>
                            ))}
                        </Form.Select>
                        </Col>
                        </Row>
                        <br/><br/>
                        <Row>
                            <Col sm={10}><Form.Control type="file" accept="image/*" onChange={processImage} /></Col>
                        </Row>
                        </Col>
                        <Col sm={1}><Image src={fileUrl} width="350" height="250" hidden={fileUrl==null} /></Col>
                    </Row>
                    <br/><br/>
                </Container>
                <Button onClick={handleBoton} variant="primary">Guardar vehiculo</Button>
            </Form>
            </>
        );
    } else {
        return (<Container>
            <Row>
                <Col></Col>
                <Col><ReactLoading type='bars' color='black' height={400} width={400} /></Col>
                <Col></Col>
            </Row>
            <Row>
                <Col></Col>
                <Col><h4>Cargando...</h4></Col>
                <Col></Col>
            </Row>
        </Container>);
    } 

}

export default AnadirVehiculo;