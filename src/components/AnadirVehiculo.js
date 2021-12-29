import React, { useEffect, useState, useParams } from 'react';
import {Table, Row, Col, Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';

const KEY = '519cb5cfb8146d5c913f65c72c2abee5';

const IMAGEN_PRUEBA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLfn6eqrsbTp6+zg4uOwtrnJzc/j5earsbW0uby4vcDQ09XGyszU19jd3+G/xMamCvwDAAAFLklEQVR4nO2d2bLbIAxAbYE3sDH//7WFbPfexG4MiCAcnWmnrzkjIRaD2jQMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMw5wQkHJczewxZh2lhNK/CBOQo1n0JIT74/H/qMV0Z7GU3aCcVPuEE1XDCtVLAhgtpme7H0s1N1U7QjO0L8F7llzGeh1hEG/8Lo7TUmmuSrOfns9xnGXpXxsONPpA/B6OqqstjC6Ax/0ujkNdYQQbKNi2k64qiiEZ+ohi35X+2YcZw/WujmslYewiAliVYrxgJYrdwUmwXsU+RdApUi83oNIE27YvrfB/ZPg8+BJETXnqh9CVzBbTQHgojgiCvtqU9thFJg/CKz3VIMKMEkIXxIWqIpIg2SkjYj+xC816mrJae2aiWGykxRNsW0UwiJghJDljYI5CD8GRiCtIsJxizYUPQ2pzItZy5pcisTRdk/a9m4amtNNfBuQkdVhSaYqfpNTSFGfb9GRIakrE2Pm+GFLaCQPqiu0OpWP+HMPQQcgQMiQprWXNmsVwIjQjYi/ZrhAqNTCgr2gu0Jnz85RSSjso0HkMFZ0YZjKkc26a/jlmh9JiDyDxi9oeorTYAzZkwwoMz19pzj9bnH/GP/+qbchjSGflneWYhtTuKdMOmNKZcJ5TjInQKcYXnESd/jQxy0ENpULTNGOGgxpap/oyw9pbUAqhfx2Dbkhovvfgz4iUzoM9+GlK6/Mh4q29hyC1mwro30hpVVLPF9wYQr71RazOeM5/cw81iBRD+A03aM9/C/obbrKjbYSpCmIVG3qT/Q8oeUo3Rz0IL7vI1tEbCB9pSiu8I/aV8x3Kg/BGWrWp4ZVs0nZfmAoEG4h/61yHYIJiFSl6Q0Vk6tTW1N8kYp8hdOkfHYYMXd2Qft+8CYwqYDSKvqIh+MCF8Wgca2u/cwdgeW3TtuVn6+1oBs3yLo5C2JpK6CvQzGpfUkz9UG/87gCsi5o2LIXolxN0FbwAsjOLEr+YJmXn7iR6N0BCt5p5cMxm7eAsfS+/CACQf4CTpKjzgkvr2cVarVTf96372yut7XLJ1sa7lv6VcfgYrWaxqr3Wlo1S6pvStr22sxOtTNPLzdY3nj20bPP+ejFdJYkLsjGLdtPBEbe/mr2bQKiXWJDroA+vtzc0p9aahuwqHMDYrQEXHEw9jwQl3drMpts9JBU1SdktPe5FBRdJQ6bwXBpa57ib2A8kukQDzMjh++Uo7Fo6Wd02Pkf4fknqoo4HtvAIjsqUcjx6DIPgWCaOML9rKI/oqD9/lgNrn+eF+p7j8tnzHBiR7+kdUGw/+V1Kzkc75mMy6U+FMaxjPibiM1U1uGM+puInHpmALZCgP4pt7i840MV8+0R1zPsRB6UTcqpizncYwZ89syDydfyWCwXB1l8/zRNGWbTG/GHKUm9AkxHMc/EGSk3z2+ArEhPEV5TUBLEvUGFcjEUH80J/jveTGOAJEljJbILWGQT3zRYiwuKsUXN1EEJAzBhRJFll7mBUG7KD8EqPkKekBREaL8hMDZLQSG6AQjtHPYmvTQnX0TtpC1SYCe2YdkkyLP3jj5BSbKiuR585eQhTgoje6yIb0Yb0C+mV6EYvebqw5SDy2WmubogZiF2AVxPC2FpDf8H2Q9QWo6IkjUxTWVEI3WY/wrCeSuqJ+eRWzXR/JXwgVjUMozbCOfoEZiSiKVGepqv5CJ8RyR4D7xBeamqa7z3BJ/z17JxuBPdv93d/a2Ki878MMAzDMAzDMAzDMAzDMF/KP09VUmxBAiI3AAAAAElFTkSuQmCC"

function AnadirVehiculo () {
    const [fileUrl, setFileUrl] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [usuarios, setUsuarios] = useState("[]");

    var vehiculo = {
        usuario : {},
        modelo: '',
        color: '',
        matricula: '',
        imagen: '',
        plazas: -1
    }

    function processImage(event){
        const imageFile = event.target.files[0];
        if (imageFile != null){
            const formData = new FormData();
            formData.append("image", imageFile);
            var requestOptions = {
                method: 'POST',
                body: formData
            };
            fetch('https://api.imgbb.com/1/upload?key=' + KEY, requestOptions).then
            (response => response.json()).then
            ((respuesta) => {
                vehiculo.imagen = respuesta.data.url
                console.log(vehiculo.imagen)
            });
        }
    }

    function handleModelo(event){
        vehiculo.modelo = event.target.value;
    }
    function handleColor(event){
        vehiculo.color= event.target.value;
    }
    function handleMatricula(event){
        vehiculo.matricula= event.target.value;
    }

    function handlePlazas(event){
        vehiculo.plazas= parseInt(event.target.value);
        console.log(vehiculo)
    }

    function handleUsuario(event){
        fetch("http://localhost:8000/v1/usuarios/" + event.target.value).then
        (response => response.json()).then
        ((data) => {
            vehiculo.usuario = data;
        });
    }
    function handleBoton(event){
        console.log(vehiculo)
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vehiculo)
        };
        fetch('http://localhost:8000/v1/vehiculos', requestOptions);
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
                <Form.Group as={Row} className="mb-3" controlId="formGroupModelo">
                    <Form.Label column sm="2">
                        Modelo
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control onChange={handleModelo}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formGroupColor">
                    <Form.Label column sm="2">
                        Color
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control onChange={handleColor} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formGroupMatricula">
                    <Form.Label column sm="2">
                        Matricula
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control onChange={handleMatricula} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formGroupPlazas">
                    <Form.Label column sm="2">
                        Plazas
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control onChange={handlePlazas} />
                    </Col>
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Imagen del coche</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={processImage} />
                </Form.Group>
                <Image src={fileUrl} width="150" height="150" hidden={fileUrl==null} />
                <Form.Select aria-label="Default select example" onChange={handleUsuario}>
                <option>Seleccione un usaurio</option>
                    {usuarios.map((usuario) => (
                        <option key={usuario.id} value={usuario.id}>{usuario.name + " " + usuario.apellidos}</option>
                    ))}
                </Form.Select>
                <Button onClick={handleBoton} variant="primary">Guardar vehiculo</Button>
            </Form>
        );
    } else {
        return <div>Loading</div>
    } 

}

export default AnadirVehiculo;