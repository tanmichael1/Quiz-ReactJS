import React, { useState } from "react";
import { firebase } from "./../Config";
import Slideshow from "./components/Slideshow";

function Home() {
  const [done, setDone] = useState(false);
  const [latestQuiz, setLatestQuiz] = useState("");
  const [latestCreator, setLatestCreator] = useState("");
  const [latestCreatorID, setLatestCreatorID] = useState("");
  const colors = ["#0088FE", "#00C49F", "#FFBB28"];
  const delay = 2500;

  const latestQuizRef = firebase.database().ref("Quizzes");

  if (!done) {
    setup();
    var date = null;

    latestQuizRef.on("value", (quizzes) =>
      quizzes.forEach((user) => {
        user.forEach((quiz) => {
          var tempVal = setValues(quiz, date);

          if (tempVal != date) {
            date = tempVal;
          }
        });
      })
    );
    setDone(true);
  }

  function setValues(quiz, latestDate) {
    var object = quiz.val();
    if (latestDate === null || object.createdSortDate > latestDate) {
      setLatestQuiz(object.Title);
      let newDate = object.createdSortDate;

      setLatestCreator(object.creator);
      setLatestCreatorID(object.creatorID);
      return newDate;
    } else {
      return latestDate;
    }
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

  const [index, setIndex] = React.useState(0);
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
      <h2>Latest Quiz</h2>
      <div className="slideshow">
        <div
          className="slideshowSlider"
          style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
        >
          {colors.map((backgroundColor, index) => (
            <div
              className="slide"
              key={index}
              style={{ backgroundColor }}
            ></div>
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
      {latestQuiz !== "" ? (
        <div>
          <a href={`${latestCreatorID}/${latestQuiz}`}>
            <h3>
              {" "}
              {latestQuiz} from {latestCreator}{" "}
            </h3>{" "}
          </a>
        </div>
      ) : (
        <div>
          <p>Loading latest quiz</p>
        </div>
      )}
    </div>
  );
}

export default Home;
