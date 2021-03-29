import React, { useState } from "react";
import { firebase } from "./../Config";

function Home() {
  const [done, setDone] = useState(false);
  const [latestQuiz, setLatestQuiz] = useState("");
  const [latestCreator, setLatestCreator] = useState("");
  const [latestDate, setLatestDate] = useState();
  const latestQuizRef = firebase.database().ref("Quizzes");

  if (!done) {
    latestQuizRef.on("value", (snap) =>
      snap.forEach((childSnapshot) => {
        childSnapshot.forEach((element) => {
          var tempDate = element.val().createdSortDate;
          if (tempDate != undefined) {
            console.log("Here: " + tempDate);
            console.log("Here: " + element.val().Title);
            if (latestQuiz == "") {
              setLatestQuiz(element.val().Title);
              setLatestDate(tempDate);
              setLatestCreator(element.val().creator);
            } else {
              if (tempDate > latestDate) {
                setLatestQuiz(element.val().Title);
                setLatestDate(tempDate);
                setLatestCreator(element.val().creator);
              }
            }
          }
        });
      })
    );
    setDone(true);
  }

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
      <h2>Latest Quiz</h2>
      {latestQuiz != "" ? (
        <div>
          <p>
            {" "}
            {latestQuiz} from {latestCreator}{" "}
          </p>{" "}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Home;
