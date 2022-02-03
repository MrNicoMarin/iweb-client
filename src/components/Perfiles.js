import React, { useEffect, useState } from 'react';
import {Row, Col, Container, Button, Table, Image} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import ReactLoading from 'react-loading';

function Perfiles () {
    const [usuarios, setUsuarios] = useState("[]");
    const [id, setId] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => { 
        fetch(process.env.REACT_APP_BASE_URL+"usuarios").then
        (response => response.json()).then
        ((data) => {
            setUsuarios(data);
            setId(sessionStorage.getItem('id'));
            setIsLoaded(true);
        }, (error) => {
            setError(true);
            console.log(error);
        })
    }, []);

    if (isLoaded) {
        return (
            <>
            <h1>Perfiles</h1>
            <Container>
            <Table className='align-middle' hover>
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Email</th>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Fecha Nacimiento</th>
                        </tr>
                    </thead>
                    <tbody>
                    {usuarios.map((usuario) => (
                        id != usuario.id && 
                            <tr key={usuario.id}>
                                <td> <Image src={usuario.imagen} referrerPolicy="no-referrer" roundedCircle="true" width="60" height="60" /></td>
                                <td>{usuario.email}</td>
                                <td>{usuario.name}</td>
                                <td>{usuario.apellidos}</td>
                                <td>{usuario.fechaNacimiento}</td>
                                <td><a href={"/perfiles/" + usuario.id}>Mas info</a></td>
                            </tr>
                        ))}
                    </tbody>
            </Table>
            </Container>
            </>);
    } else if (error) {
        return (<div>Error</div>);
    } else {
        return (<Container>
            <Row>
                <Col></Col>
                <Col><ReactLoading type='bars' color='black' height={400} width={400} /></Col>
                <Col></Col>
            </Row>
            <Row>
                <Col></Col>
                <Col><h4>Cargando perfiles...</h4></Col>
                <Col></Col>
            </Row>
        </Container>);
    }

    
}

export default Perfiles;