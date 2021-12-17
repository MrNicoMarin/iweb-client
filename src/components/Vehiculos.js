import React, { useEffect, useState } from 'react';
import {Table, Image} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

function Vehiculos () {
    const [vehiculos, setVehiculos] = useState("[]");
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => { 
        fetch("http://localhost:8000/v1/vehiculos").then
        (response => response.json()).then
        ((data) => {
            setVehiculos(data);
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
                            <th>Usuario</th>
                            <th>Modelo</th>
                            <th>Color</th>
                            <th>Matricula</th>
                            <th>Plazas</th>
                            <th>Imagen</th>
                        </tr>
                    </thead>
                    <tbody>
                    {vehiculos.map((vehiculo) => (
                            <tr key={vehiculo.id}>
                                <td>{vehiculo.usuario.name}, {vehiculo.usuario.apellidos}</td>
                                <td>{vehiculo.modelo}</td>
                                <td>{vehiculo.color}</td>
                                <td>{vehiculo.matricula}</td>
                                <td>{vehiculo.plazas}</td>
                                <td>{<Image src={vehiculo.imagen} roundedCircle="true" width="100" height="100" />}</td>
                                <td><a href={"/vehiculos/" + vehiculo.id}>Mas info</a></td>
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

export default Vehiculos;