import React, { useState } from "react";
import { firebase } from "./../Config";
import { Link } from "react-router-dom";
import Slideshow from "./components/Slideshow";

function Home() {
  // Setup
  const [done, setDone] = useState(false);
  const latestQuizzesRef = firebase.database().ref("Quizzes");
  const [latestQuizzes, setLatestQuizzes] = useState(null);

  // Slideshow
  const [index, setIndex] = React.useState(0);
  const colors = ["#0088FE", "#00C49F", "#FFBB28"];
  const delay = 3000;

  if (!done) {
    setup();
    var quizArray = [];

    latestQuizzesRef.on("value", (quizzes) =>
      quizzes.forEach((user) => {
        console.log(user.val());
        user.forEach((quiz) => {
          quizArray.push(quiz.val());
        });
        quizArray.sort(function (a, b) {
          if (a.createdSortDate < b.createdSortDate) {
            return 1;
          } else if (a.createdSortDate > b.createdSortDate) {
            return -1;
          }
          return 0;
        });

        setValues(quizArray);
      })
    );

    setDone(true);
  }

  function setValues(latestArray) {
    var newArray = [];
    newArray.push(latestArray[0]);
    newArray.push(latestArray[1]);
    newArray.push(latestArray[2]);
    setLatestQuizzes(newArray);
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

  /* Slideshow */

  const timeoutRef = React.useRef(null);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  React.useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === colors.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  return (
    <div className="container box">
      <h1>Welcome to the Website</h1>
      <hr />
      <h2>Latest Quizzes</h2>

      {latestQuizzes != null ? (
        <div className="slideshow">
          <div
            className="slideshowSlider"
            style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
          >
            {latestQuizzes.map((quiz, index) => (
              <div
                className="slide"
                key={index}
                style={{
                  // backgroundColor: "#0088FE"
                  backgroundColor: "white",
                }}
                // style={{ backgroundColor }}
              >
                <div className="slideText">
                  <span>
                    <a href={`${quiz.creatorID}/${quiz.Title}`}>{quiz.Title}</a>{" "}
                    from{" "}
                    <Link
                      to={{
                        pathname: `users/${quiz.creatorID}`,
                      }}
                    >
                      {quiz.creator}
                    </Link>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="slideshowDots">
            {colors.map((_, idx) => (
              <div
                key={idx}
                className={`slideshowDot${index === idx ? " active" : ""}`}
                onClick={() => {
                  setIndex(idx);
                }}
              ></div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p>Loading quizzes</p>{" "}
        </div>
      )}
    </div>
  );
}

export default Home;
