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
import Create from "./Pages/Create";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import Quizzes from "./Pages/Quizzes";

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
      <Route exact path="/create" component={Create} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/quizzes" component={Quizzes} />

     
      
      
      
    </div>
    
  );
}

