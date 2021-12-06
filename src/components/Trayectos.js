import React from 'react';
import {Table} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

function Trayectos () {
    return (<Table striped bordered hover>

        <thead>
            <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>John</td>
                <td>Doe</td>
                <td>john@example.com</td>
            </tr>
            <tr>
                <td>Smith</td>
                <td>Thomas</td>
                <td>smith@example.com</td>
            </tr>
            <tr>
                <td>Merry</td>
                <td>Jim</td>
                <td>merry@example.com</td>
            </tr>
        </tbody>
    </Table>);
}

export default Trayectos;