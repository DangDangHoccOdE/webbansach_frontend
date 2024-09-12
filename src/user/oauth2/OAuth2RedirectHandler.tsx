import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OAuth2RedirectHandler = () => {
    const { setLoggedIn } = useAuth();

    const getUrlParameter = (name:any) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(window.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const accessToken = getUrlParameter('accessToken');
    const refreshToken = getUrlParameter('refreshToken');
    const error = getUrlParameter('error');

    console.log(accessToken);
    console.log(refreshToken);

    if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setLoggedIn(true);
        console.log("Thành công")
        return <Navigate to="/" />;
    } else {
        console.log("Lỗi",error)
        return <Navigate to="/login" state={{ error: error }} />;
    }
};

export default OAuth2RedirectHandler;