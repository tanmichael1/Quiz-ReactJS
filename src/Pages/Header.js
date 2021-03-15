import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import "../node_modules/jquery/dist/jquery.min.js";
// import "bootstrap/js/src/collapse.js";

function Header() {
  const [index, setIndex] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [answers, setAnswers] = useState(["test"]);
  const [done, setDone] = useState(false);
  return (
    <div>
      {/* <div className="navbar">
     
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
        <a href="#cv">CV</a>
      </div> */}
     <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
<ul class="navbar-nav me-auto mb-2 mb-lg-0">
      {loggedIn ? ( 
      <div><li class="nav-item">
          <a class="nav-link active" aria-current="page" href="/">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/quiz">Quiz</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Quizzes List</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Create Quiz</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            User
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            
            <li><hr class="dropdown-divider"></hr></li>
            <li><a class="dropdown-item" href="#">Log Out</a></li>
          </ul>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
        </li> </div>)
      : ( <div><li class="nav-item">
      <a class="nav-link active" aria-current="page" href="/">Home</a>
    </li>
    <li class="nav-item">
          <a class="nav-link" href="/quiz">Quiz</a>
        </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Quizzes List</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Create Quiz</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Log In</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="/register">Register</a>
    </li>
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        Dropdown
      </a>
      <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
        <li><a class="dropdown-item" href="#">Action</a></li>
        <li><a class="dropdown-item" href="#">Another action</a></li>
        
        <li><hr class="dropdown-divider"></hr></li>
        <li><a class="dropdown-item" href="#">Something else here</a></li>
      </ul>
    </li>
    <li class="nav-item">
      <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
    </li></div>)}
      
       
      </ul>
    </div>
  </div>
</nav>
    </div>
  );
}

export default Header;
