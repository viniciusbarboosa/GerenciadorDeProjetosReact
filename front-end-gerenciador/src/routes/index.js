import React, { Fragment } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';


const RouteApp = () => {
    return (
        <BrowserRouter>
            <Fragment>
                <Routes>
                    <Route exact path="/" element={<Home/>} />
                    <Route path="/Login" element={<Login />} />
                    <Route exact path="/cadastro" element={<Cadastro />} />
                    <Route path="*" element={<Login />} />
                </Routes>
            </Fragment>
        </BrowserRouter>
    );
}

export default RouteApp;
