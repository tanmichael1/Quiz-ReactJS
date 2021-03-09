import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import {firebase} from './Config';

import Header from "./Pages/Header.js"
import Quiz from "./Pages/Quiz.js";

const preObject = document.getElementById('object');
const preUsers = document.getElementById('Users');



export default function App() {
  

  return (
    <div className="App" >
      <Header />
      <Quiz />
      

     
      
      
      
    </div>
    
  );
}

