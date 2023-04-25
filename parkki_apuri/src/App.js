import React, { useState, useEffect } from 'react';
import * as ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from 'axios';
import './App.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import Reservation from './components/Reservation';

function ParkingApp () {

  return (
    <BrowserRouter>
      <div>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reservation" element={<Reservation />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default ParkingApp;