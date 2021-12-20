import React, { useEffect, useState, useParams } from 'react';
import {Table, Row, Col, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';

function AnadirVehiculo () {

    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    
    if (isLoaded) {
        return( 
            null
        );
    } else {
        return <div>Loading</div>
    } 

}

export default AnadirVehiculo;