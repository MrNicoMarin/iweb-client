import React, { useEffect, useState } from 'react';
import {Container, Table, Row, Col, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import ReactLoading from 'react-loading';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Spinner from 'react-bootstrap/Spinner'

const INITIAL_OFFSET = 0;


function Trayectos(props) {
    const [trayectos, setTrayectos] = useState("[]");
    const [isLoaded, setIsLoaded] = useState(false);
    const [valueMin, setValueMin ] = useState(1);
    const [valueMax, setValueMax ] = useState(100);
    const [isFiltring, setIsFiltring ] = useState(false);
    const [error, setError] = useState(false);
    const [params, setParams] = useState({limit : 10, offset: INITIAL_OFFSET});
    const [isLoadingMas, setIsLoadingMas] = useState(false);
    const [masResultados, setMasResultados] = useState(true);

    useEffect(() => {
        if(props.mis == "True"){
            fetch(process.env.REACT_APP_BASE_URL+"usuarios/"+sessionStorage.getItem('id')+"/trayectos?" + new URLSearchParams(params)).then
            (response => response.json()).then
            ((data) => {
                setTrayectos(data);
                setIsLoaded(true);
            }, (error) => {
                setError(true);
                console.log(error);
            })
        }else if(props.mis == "False"){
            fetch(process.env.REACT_APP_BASE_URL+"trayectos?" + new URLSearchParams(params)).then
            (response => response.json()).then
            ((data) => {
                setTrayectos(data);
                setIsLoaded(true);
            }, (error) => {
                setError(true);
                console.log(error);
            })
        }
    }, []);

    function formatoFecha(f) {
        var fecha = new Date(f);
        var date = (fecha.getDate() < 10 ? '0' + fecha.getDate() : fecha.getDate()) +'/'+((fecha.getMonth()+1) < 10 ? ('0' + (fecha.getMonth()+1)) : ((fecha.getMonth()+1))) +'/'+fecha.getFullYear();
        var time = fecha.getHours() + ":" + (fecha.getMinutes() < 10? "0" + fecha.getMinutes() : fecha.getMinutes());
        return(date+' '+time);
    }

    function handleMas (e) {
        setIsLoadingMas(true);
        params.offset += 10;
        setParams(params);
        fetch(process.env.REACT_APP_BASE_URL+"trayectos?" + new URLSearchParams(params)).then
        (response => response.json()).then
        ((data) => {
            if (data.length > 0) {
                setTrayectos(trayectos.concat(data));
            } else {
                setMasResultados(false);
            }
            setIsLoadingMas(false);
        }, (error) => {
            setError(true);
            console.log(error);
        })
    }

    function handlePrecioMin(event){
        if (parseInt(event.target.value) >= valueMax){
            setValueMax(parseInt(event.target.value))
        }
        setValueMin(parseInt(event.target.value))
        params.precioMin = valueMin;
        setParams(params);
    }

    function handlePrecioMax(event){
        if (parseInt(event.target.value) <= valueMin){
            setValueMin(parseInt(event.target.value))
        }
        setValueMax(parseInt(event.target.value))
        params.precioMax = valueMax;
        setParams(params);
    }

    function handleOrigen(event){
        if (event.target.value == ""){
            delete params.origen
        }else{
            params.origen = event.target.value;
            setParams(params);
        }
    }

    function handleDestino(event){
        if (event.target.value == ""){
            delete params.destino
        }else{
            params.destino = event.target.value;
            setParams(params);
        }
    }

    function handleFechaSalidaMin(event){
        if (event.target.value == ""){
            delete params.fechaMin
        }else{
            params.fechaMin = event.target.value;
            setParams(params);
        }
    }

    function handleFechaSalidaMax(event){
        if (event.target.value == ""){
            delete params.fechaMax
        }else{
            params.fechaMax = event.target.value;
            setParams(params);
        }
    }

    function handleFiltrar(event){
        setIsFiltring(true);
        params.offset = INITIAL_OFFSET;
        setParams(params);
        fetch(process.env.REACT_APP_BASE_URL+"trayectos?" + new URLSearchParams(params)).then
        (response => response.json()).then
        ((data) => {
            setTrayectos(data);
            setMasResultados(true);
            setIsFiltring(false);
        }, (error) => {
            setError(true);
            console.log(error);
        })
    }

    if (isLoaded) {
        return (
            <>
            <h1>Trayectos</h1>
            <Container>
                <Col></Col>
                <Col><Form>
                <h3>Filtros</h3>
                <Form.Group as={Row}>
                <Col xs="2"><Form.Label >Precio Mínimo</Form.Label></Col>
                <Col xs="8"><Form.Range
                    min = {1}
                    max = {100}
                    value={valueMin}
                    onChange={handlePrecioMin}/></Col>
                <Col xs="1"><Form.Control value={valueMin}/></Col>
                </Form.Group>
                <Form.Group as={Row}>
                <Col xs="2"><Form.Label >Precio Máximo</Form.Label></Col>
                <Col xs="8"><Form.Range
                    min = {1}
                    max = {100}
                    value={valueMax}
                    onChange={handlePrecioMax}/></Col>
                <Col xs="1"><Form.Control value={valueMax}/></Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Col xs="2">Fecha de salida minima</Col>
                    <Col xs="2"><input type="datetime-local" onChange={handleFechaSalidaMin}/></Col>
                    <Col xs="3">Fecha de salida maxima</Col>
                    <Col xs="2"><input type="datetime-local" onChange={handleFechaSalidaMax}/></Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Col xs="2">Municipio de origen</Col>
                    <Col xs="2"><Form.Control type="text" onChange={handleOrigen}/></Col>
                    <Col xs="3">Municipio de destino</Col>
                    <Col xs="2"><Form.Control type="text" onChange={handleDestino}/></Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Col xs="12"><Button variant="primary" onClick={handleFiltrar}><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" hidden={!isFiltring} />{!isFiltring?"Filtrar":"Loading..."}</Button></Col>
                </Form.Group>
            </Form>
                
            <Table hover>
                <thead>
                    <tr>
                        <th>Origen</th>
                        <th>Destino</th>
                        <th>Piloto</th>
                        <th>Precio</th>
                        <th>Fecha salida</th>
                    </tr>
                </thead>
                <tbody>
                    {trayectos.map((trayecto) => (
                        <tr key={trayecto.id}>
                            <td>{trayecto.origen.municipio}</td>
                            <td>{trayecto.destino.municipio}</td>
                            <td>{trayecto.piloto.name}</td>
                            <td>{trayecto.precio}€</td>
                            <td>{formatoFecha(trayecto.fechaSalida)}</td>
                            <td><a href={"/trayectos/" + trayecto.id}>Mas info</a></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {masResultados && (
                <Container>
                    <Row>
                        <Button variant='secondary' disabled={isLoadingMas} onClick={handleMas}><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" hidden={!isLoadingMas} />Mostrar más</Button>
                    </Row>
                </Container>
            )}
            {!masResultados && (
                <Container>
                    <Row>
                        <Button variant='secondary' disabled >No hay mas resultados</Button>
                    </Row>
                </Container>
            )}</Col>
                <Col></Col>
            </Container>
            

            </>);
    } else if (error) {
        return (<div>Error</div>);
    } else {
        return (
            <Container>
                <Row>
                    <Col></Col>
                    <Col><ReactLoading type='bars' color='black' height={400} width={400} /></Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col><h4>Cargando trayectos...</h4></Col>
                    <Col></Col>
                </Row>
            </Container>
            );
    }

    
}

export default Trayectos;