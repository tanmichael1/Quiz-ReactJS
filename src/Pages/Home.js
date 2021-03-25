import React, { useState } from "react";
import { firebase } from "./../Config";

function Home() {
  const [done, setDone] = useState(false);
  let latestQuiz = "Test Quiz";
  function setup() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user.uid);
      } else {
      }
    });
    setDone(true);
  }
  if (!done) {
    setup();
  }

  return (
    <div className="container">
      <h1>Welcome to the Website</h1>
      {latestQuiz}
    </div>
  );
}

export default Home;
