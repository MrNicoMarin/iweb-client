import React, { useEffect, useState } from 'react';
import {Table, Image} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

function Perfiles () {
    const [usuarios, setUsuarios] = useState("[]");
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

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
        return (
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
                            <tr key={usuario.id}>
                                <td> <Image src={usuario.imagen} roundedCircle="true" width="60" height="60" /></td>
                                <td>{usuario.email}</td>
                                <td>{usuario.name}</td>
                                <td>{usuario.apellidos}</td>
                                <td>{usuario.fechaNacimiento}</td>
                                <td><a href={"/perfiles/" + usuario.id}>Mas info</a></td>
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

export default Perfiles;