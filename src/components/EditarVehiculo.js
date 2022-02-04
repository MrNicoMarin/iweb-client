import React, { useEffect, useState } from 'react';
import {Table, Row, Col, Container, Button} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Modal from 'react-bootstrap/Modal'
import ReactLoading from 'react-loading';
const KEY = '519cb5cfb8146d5c913f65c72c2abee5';

function EditarVehiculo () {
    let { id } = useParams();
    const [fileUrl, setFileUrl] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [imagenCambiada, setImagenCambiada] = useState(false);
    const [error, setError] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
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
                    headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem('token') },
                    body: JSON.stringify(vehiculo)
                };
                fetch(process.env.REACT_APP_BASE_URL + 'vehiculos/' + id , requestOptions).then
                (response => {window.location.replace("/vehiculos/"+id)});
            });
        }else{
            var requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem('token') },
                body: JSON.stringify(vehiculo)
            };
            fetch(process.env.REACT_APP_BASE_URL + 'vehiculos/'+ id, requestOptions).then
            (response => {window.location.replace("/vehiculos/"+id)});
        }
    }

    function handleDeleteVehiculo(event){
        var requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem('token') }
        };
        fetch(process.env.REACT_APP_BASE_URL + 'vehiculos/'+ id, requestOptions).then
        (response => {window.location.replace("/vehiculos")});
    }

    useEffect(() => { 
        fetch(process.env.REACT_APP_BASE_URL+"vehiculos/"+ id).then
        (response => response.json()).then
        ((data) => {
            setVehiculo(data);
            setFileUrl(data.imagen)
            setIsLoaded(true);
        }, (error) => {
            setError(true);
            console.log(error);
        })
    }, []);
    
    if (isLoaded) {
        return( 
            <div>
            <Modal show={showModal} onHide={handleCloseModal} backdrop="static" >
                <Modal.Header closeButton>
                    <Modal.Title>Eliminar el coche</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Estas seguro de eliminar el coche? Esto será de manera permanente</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Atras</Button>
                    <Button variant="primary" onClick={handleDeleteVehiculo}>Aceptar</Button>
                </Modal.Footer>
            </Modal>

            <Form>
                <Container>
                    <br/>
                    <Row>
                        <Col sm={8}><h1>Propietario: {vehiculo.usuario.name} </h1> 
                        
                        <br/>
                        <Row>
                            <Col sm>
                            <FloatingLabel
                            controlId="floatingInput"
                            label="Modelo*"
                            className="mb-3"
                        >
                            <Form.Control defaultValue={vehiculo.modelo} onChange={handleModelo}/>
                        </FloatingLabel></Col>
                            <Col sm>
                            <FloatingLabel
                            controlId="floatingInput"
                            label="Color*"
                            className="mb-3"
                        >
                            <Form.Control defaultValue={vehiculo.color} onChange={handleColor} />
                            </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm><FloatingLabel
                            controlId="floatingInput"
                            label="Matrícula*"
                            className="mb-3"
                        >
                            <Form.Control defaultValue={vehiculo.matricula} onChange={handleMatricula} />
                        </FloatingLabel></Col>
                            <Col sm>
                            <FloatingLabel
                            controlId="floatingInput"
                            label="Plazas*"
                            className="mb-3"
                        >
                            <Form.Control defaultValue={vehiculo.plazas} onChange={handlePlazas} />
                        </FloatingLabel>
                            </Col>
                        </Row>
                        </Col>
                    <Col sm={4}><Image src={fileUrl} width="150" height="150" hidden={fileUrl==null} /><br/><Form.Control type="file" accept="image/*" onChange={processImage} /></Col>
                    </Row>
                    <Row>
                    <Col sm={8}> 
                <Button onClick={handleBoton} variant="primary">Guardar vehiculo</Button>
                </Col>
                <Col sm={4}>
                <Button onClick={handleShowModal} variant="danger">Borrar vehiculo</Button>
                </Col>
                    </Row>
                </Container>
            </Form>
            </div>
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
                <Col><h4>Cargando vehiculo...</h4></Col>
                <Col></Col>
            </Row>
        </Container>);
    } 

}

export default EditarVehiculo;