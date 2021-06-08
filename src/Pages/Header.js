import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { firebase } from "../Config";

function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [setupDone, setSetupDone] = useState(false);

  function setup() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
        document.getElementById("logoutVisible").classList.remove("hidden");
      } else {
        document.getElementById("logoutVisible").classList.add("hidden");
      }
    });
  }

  if (!setupDone) {
    setup();
    setSetupDone(true);
  }

  return (
    <div>
      <nav className="navbar navbar-brand-center navbar-expand-md navbar-light bg-light ">
        <a className="navbar-brand mx-auto" href="/">
          The Ultimate Quiz
        </a>
        <div class="vl "></div>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <a className="nav-link " aria-current="page" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/quizzes">
                Quizzes List
              </a>
            </li>

            {loggedIn ? (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/create">
                    Create Quiz
                  </a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="/profile">
                    My Profile
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/login">
                    Log In
                  </a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="/register">
                    Register
                  </a>
                </li>
              </>
            )}
            <li className="nav-item" id="logoutVisible">
              <a href="/" className="nav-link" id="logout">
                Log Out
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Header;
