import React, { useEffect, useState } from 'react';
import {Table} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

function Trayectos () {
    const [trayectos, setTrayectos] = useState("[]");
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => { 
        fetch("http://localhost:8000/v1/trayectos").then
        (response => response.json()).then
        ((data) => {
            setTrayectos(data);
            setIsLoaded(true);
        }, (error) => {
            setError(true);
            console.log(error);
        })
    }, []);

    if (isLoaded) {
        return (
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
                                <td>{trayecto.piloto.name}, {trayecto.piloto.apellidos}</td>
                                <td>{trayecto.precio}</td>
                                <td>{trayecto.fechaSalida}</td>
                                <td><a href={"/trayectos/" + trayecto.id}>Mas info</a></td>
                            </tr>
                        ))}
                    </tbody>
            </Table>);
    } else if (error) {
        return (<div>Error</div>);
    } else {
        return (<div>Loading</div>);
    }

    
}

export default Trayectos;