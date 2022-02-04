import React, { useState, useEffect } from 'react';
import {Table} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {Image, Container, Row, Col, Button, Form, Dropdown, Modal} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';
import Badge from 'react-bootstrap/Badge'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Card from 'react-bootstrap/Card'

function DetallesPerfil () {
    const [token, setToken] = useState(null);
    const [comentarios, setComentarios] = useState(null);
    const [idlogin, setId] = useState(null);
    const [usuario, setUsuario] = useState("[]");
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [vehiculos, setVehiculos] = useState("[]");
    const [comentario, setComentario] = useState(null);
    let { id } = useParams();
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    useEffect(() => {
        setToken(sessionStorage.getItem('token'));
        setId(sessionStorage.getItem('id'));
        fetch(process.env.REACT_APP_BASE_URL+"usuarios/" + id).then
        (response => response.json()).then
        ((data) => {
            setUsuario(data);
            //setIsLoaded(true);
            fetch(process.env.REACT_APP_BASE_URL+"usuarios/"+id+"/vehiculos").then
            (response => response.json()).then
            ((data) => {
                setVehiculos(data);
                //setIsLoaded(true);
                fetch(process.env.REACT_APP_BASE_URL+"usuarios/"+id+"/comentarios").then
        (response => response.json()).then
        ((data) => {
            setComentarios(data);
            setIsLoaded(true);
        }, (error) => {
            setError(true);
            console.log(error);
        });
            }, (error) => {
                setError(true);
                console.log(error);
            });
        }, (error) => {
            setError(true);
            console.log(error);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function onChangeComentario(e){
        setComentario(e.target.value);
    }

    function comentar(event){
        if(comentario != null && comentario != ""){
            var requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem('token') },
                body: JSON.stringify({"usuario":{"id":usuario.id},"text":comentario})
            };
            fetch(process.env.REACT_APP_BASE_URL+'comentarios', requestOptions).then
            (response => {window.location.replace("/perfiles/"+id)});
        }else{
            setShowModal(true)
        }
    }

    if (isLoaded) {
        return( 
            <>
            <Modal show={showModal} onHide={handleCloseModal} backdrop="static" >
                <Modal.Header closeButton>
                    <Modal.Title>Error en el comentario</Modal.Title>
                </Modal.Header>
                <Modal.Body>No hay mensaje de texto. Para comentar hay que escribir algo :)</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseModal}>De acuerdo</Button>
                </Modal.Footer>
            </Modal>

            <Container>
                <Row>
                    <Col sm={3}>
                        <h1>{usuario.name} </h1> <br/>
                        <Image src={usuario.imagen} roundedCircle referrerPolicy="no-referrer" width="150" height="150" />
                        <br/><br/>
                        <Dropdown>
                                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                                Mis vehiculos:
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                            {vehiculos != null && vehiculos.map((vehiculo) => (
                                                        <div key={vehiculo.id}>
                                                            <Dropdown.Item href={"/vehiculos/" + vehiculo.id} >{vehiculo.matricula}</Dropdown.Item>
                                                        </div>
                                                ))}
                                            </Dropdown.Menu>
                                            </Dropdown>
                                            <br/><br/>
                        {idlogin == usuario.id && (
                            <Button href={'/perfiles/' + id + '/update'}>Editar perfil</Button>
                        )}
                        <br/><br/>
                        {idlogin == usuario.id && usuario.twitterToken == null && (
                        <Button href={'https://twitter.com/i/oauth2/authorize?response_type=code&client_id=a20wU2JuTnE3SGlfSmh0NnAtcDQ6MTpjaQ&redirect_uri=' + 'http://localhost:3000/loginTwitter' + '&scope=tweet.write%20tweet.read%20users.read%20follows.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain'}>Vincular con Twitter</Button>)}
                        {idlogin == usuario.id && usuario.twitterToken != null && (
                        <Button disabled>Twitter vinculado</Button>)}
                    </Col>
                    <Col sm={8}>
                        <br/><br/><br/><br/><br/>
                            <Row>
                                <Col sm="3"><b>Correo:</b></Col>
                                <Col sm="3">
                                    {usuario.email}
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col sm="3"><b>Nombre:</b></Col>
                                <Col sm="3">
                                    {usuario.name}
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col sm="3"><b>Apellidos:</b></Col>
                                <Col sm="3">
                                    {usuario.apellidos}
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col sm="3"><b>Fecha de nacimiento:</b></Col>
                                <Col sm="3">
                                    {usuario.fechaNacimiento}
                                </Col>
                            </Row>
                            <Row>
                            
                            </Row>
                    </Col>
                </Row>
                <Row>
                <h1>Comentarios</h1>
                </Row>
                <br/>
                <Row md={4} className="g-4">
                    {comentarios != null && comentarios.map((comentario) => (
                        <Col>
                        <Card style={{ width: '18rem' }}>
                        <Card.Body>
                        <Image src={comentario.creador.imagen} referrerpolicy="no-referrer" roundedCircle="true" width="40" height="40" />
                          {' '}
                          <h9><b>{comentario.creador.email}</b></h9><br/>
                          <Card.Text>{comentario.text}</Card.Text>
                        </Card.Body>
                      </Card>
                      </Col>
                    ))}
                </Row>
                    {comentarios != null && comentarios.length == 0 && idlogin != usuario.id && (
                        <Row>
                            <Col>No hay comentarios aún. Sé el primero en comentarle :)</Col>
                        </Row>
                    )}
                    {comentarios != null && comentarios.length == 0 && idlogin == usuario.id && (
                        <Row>
                            <Col>No tienes comentarios por ahora</Col>
                        </Row>
                    )}
                    <br/>
                    <br/>
                    { idlogin != usuario.id && (<Row>
                        <Col></Col>
                        <Col>
                        <FloatingLabel controlId="floatingTextarea2" label="Comentario">
                        <Form.Control
                        as="textarea"
                        placeholder="Leave a comment here"
                        style={{ height: '100px' }}
                        onChange={onChangeComentario}
                        />
                        </FloatingLabel>
                        <br/>
                        <Button onClick={comentar}>Enviar comentario</Button>
                        </Col>
                        <Col></Col>
                    </Row>)}
            </Container>
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
                <Col><h4>Cargando perfil...</h4></Col>
                <Col></Col>
            </Row>
        </Container>);
    } 

}

export default DetallesPerfil;