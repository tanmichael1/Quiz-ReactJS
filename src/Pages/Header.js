import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { firebase } from "../Config";

function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [done, setDone] = useState(false);

  function begin() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
        document.getElementById("logoutVisible").classList.remove("hidden");
      } else {
        document.getElementById("logoutVisible").classList.add("hidden");
      }
    });
  }

  if (!done) {
    begin();
    setDone(true);
  }

  return (
    <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            Navbar
          </a>
          <h1 id="user"></h1>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <div>
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="/">
                    Home
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/quiz">
                    Quiz Test
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/quizzes">
                    Quizzes List
                  </a>
                </li>
              </div>
              {loggedIn ? (
                <div>
                  <li class="nav-item">
                    <a class="nav-link" href="/create">
                      Create Quiz
                    </a>
                  </li>

                  <li class="nav-item dropdown">
                    <a
                      class="nav-link dropdown-toggle"
                      href="#"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      User
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                      <li>
                        <a class="dropdown-item" href="/profile">
                          Profile
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item" href="/profile">
                          My Quizzes
                        </a>
                      </li>
                    </ul>
                  </li>
                </div>
              ) : (
                <div>
                  <li class="nav-item">
                    <a class="nav-link" href="/login">
                      Log In
                    </a>
                  </li>

                  <li class="nav-item">
                    <a class="nav-link" href="/register">
                      Register
                    </a>
                  </li>
                </div>
              )}
              <li className="nav-item" id="logoutVisible">
                <a className="nav-link" id="logout">
                  Log Out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
