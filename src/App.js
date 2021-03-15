import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import {firebase} from './Config';
import {Route, Link} from "react-router-dom";

import Header from "./Pages/Header.js";
import Home from "./Pages/Home";
import NavBar from "./Pages/NavBar";
import Register from "./Pages/Register";
import Quiz from "./Pages/Quiz.js";

const preObject = document.getElementById('object');
const preUsers = document.getElementById('Users');



export default function App() {
  

  return (
    <div className="App" >
      <Header />
      {/* <NavBar /> */}
      <Route exact path="/" component={Home} />
      <Route exact path="/quiz" component={Quiz} />
      <Route exact path="/register" component={Register} />
      {/* <Header />
      <Home />
      <Quiz /> */}
      

     
      
      
      
    </div>
    
  );
}

