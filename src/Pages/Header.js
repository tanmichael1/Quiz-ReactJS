import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { firebase } from "../Config";

function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [done, setDone] = useState(false);
  const [currentUser, setCurrentUser] = useState("");

  function begin() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
        document.getElementById("logoutVisible").classList.remove("hidden");
        const dbRefUsers = firebase
          .database()
          .ref("Users/" + user.uid + "/username");

        dbRefUsers.on("value", function (snap) {
          setCurrentUser(snap.val());
        });
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
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">
          Navbar
        </a>
        <h1 id="user">{currentUser}</h1>
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
              <a className="nav-link active" aria-current="page" href="/">
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

                <li className="nav-item dropdown ">
                  <a
                    className="nav-link dropdown-toggle"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    User
                  </a>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <a className="dropdown-item" href="/profile">
                        Profile
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/profile">
                        My Quizzes
                      </a>
                    </li>
                  </div>
                </li>
              </>
            ) : (
              <div className="">
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
              </div>
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
