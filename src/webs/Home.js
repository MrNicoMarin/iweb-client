import React, { useEffect, useState } from 'react';
import {Container, Table, Row, Col, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import ReactLoading from 'react-loading';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Spinner from 'react-bootstrap/Spinner'

const INITIAL_OFFSET = 0;

function Home () {

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
      var date = new Date();
      var dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      params.fechaMin = dateString;
      fetch(process.env.REACT_APP_BASE_URL+"trayectos?" + new URLSearchParams(params)).then
      (response => response.json()).then
      ((data) => {
          setTrayectos(data);
          setIsLoaded(true);
      }, (error) => {
          setError(true);
          console.log(error);
      })
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

  if (isLoaded) {
      return (
          <>
          <h1>Bienvenido a Zoomcar</h1>
          <h2>Trayectos que te pueden interesar</h2>
          <Container>
              <Col></Col>
              <Col>
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
        <><h1>Bienvenido a Zoom Car</h1><Container>
          <Row>
            <Col></Col>
            <Col><ReactLoading type='bars' color='black' height={400} width={400} /></Col>
            <Col></Col>
          </Row>
          <Row>
            <Col></Col>
            <Col><h4>Cargando trayectos interesantes ...</h4></Col>
            <Col></Col>
          </Row>
        </Container></>
          );
  }
}

export default Home;