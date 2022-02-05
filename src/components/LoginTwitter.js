import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';


function LoginTwitter(){

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json','Authorization' : sessionStorage.getItem('token') },
            body : JSON.stringify({'token' : searchParams.get('code')})
        };
        fetch(process.env.REACT_APP_BASE_URL+"oauth/twitter", requestOptions).then
        (response => response.json()).then(window.location.replace('/'))
    }, []);

    return(
        <h3>Vinculando...</h3>
    );
}

export default LoginTwitter;
