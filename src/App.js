// import logo from "./logo.svg";
import "./App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter, Switch } from "react-router-dom";

import Header from "./Pages/Header.js";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Create from "./Pages/Create";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import Quizzes from "./Pages/Quizzes";
import Reset from "./Pages/Reset";
import User from "./Pages/User";
import Post from "./Pages/Post";

export default function App() {
  return (
    <div className="App">
      <Header />
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/create" component={Create} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/quizzes" component={Quizzes} />
          <Route exact path="/reset" component={Reset} />
          <Route exact path="/users/:userId" component={User} />
          <Route exact path="/:user/:quizId" component={Post} />
          <Route path="/" render={() => <h1>404</h1>} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
