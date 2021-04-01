import "../App.css";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { firebase } from "./../Config";

export default function Post() {
  const [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState(["test"]);
  const [answers, setAnswers] = useState(["test"]);
  const [done, setDone] = useState(false);
  const [numQuestions, setNumQuestions] = useState(0);

  const [test, setTest] = useState(null);
  const [initial, setInitial] = useState(true);
  const [quiz, setQuiz] = useState(false);
  const [end, setEnd] = useState(false);
  const [results, setResults] = useState(false);
  const [score, setScore] = useState(0);
  const [response, setResponse] = useState([]);
  const [selected, setSelected] = useState(false);
  const [correct, setCorrect] = useState(0);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState(0);
  const [trueAnswer, setTrueAnswer] = useState(0);
  const [selectedButton, setSelectedButton] = useState(0);

  const [quizData, setQuizData] = useState([]);
  const [quizUser, setQuizUser] = useState();
  const [quizTitle, setQuizTitle] = useState(null);

  function editQuiz() {}

  function removeQuiz() {}

  const handleAnswerButtonClick = (text, isCorrect) => {
    const answerButtonsElement = document.getElementById("answer-buttons");
    setCurrentAnswer(text);
    setCorrect(isCorrect);

    quizData[currentQuestion].answerOptions.forEach((answer) => {
      if (answer.isCorrect) {
        setTrueAnswer(answer.answerText);
      }

      if (answer.answerText == text) {
        console.log(answer);
      }
    });
    setSelected(true);

    Array.from(answerButtonsElement.children).forEach((button) => {
      console.log(currentAnswer);

      if (text == button.innerHTML) {
        //Save button
        // button.classList.add('marked');
      } else {
        // button.classList.remove('marked');
      }
    });
  };

  if (!done) {
    const ref = firebase.database().ref();
    const dbRefObject = firebase.database().ref().child("object");
    const dbRefUsers = firebase.database().ref("Users");
    var currentURL = window.location.pathname;
    var splittable = currentURL.split("/");
    var user = splittable[1];
    var newQuizTitle = splittable[2];
    dbRefObject.on("value", (snap) => console.log(snap.val()));

    const dbTestQuiz = ref.child("Quizzes/" + user + "/" + newQuizTitle);

    dbTestQuiz.on("value", function (quizSnapshot) {
      var count = quizSnapshot.child("NumQuestions").val();
      console.log(quizSnapshot.val());

      setNumQuestions(count);
      var testTitle = quizSnapshot.child("Title").val();

      for (var i = 0; i < count; i++) {
        loadQuestions(quizSnapshot.child(i + 1).val());
      }
      setQuizTitle(newQuizTitle);
    });

    setDone(true);
  }

  function loadQuestions(quiz: object) {
    var answerOptionsData = quiz.answerOptions;
    console.log(answerOptionsData);
    var array = quizData;

    array.push({
      questionText: quiz.questionText,
      answerOptions: answerOptionsData,
    });
    setQuizData(array);
  }

  function handleStartButtonClick() {
    setInitial(false);
    setQuiz(true);
    // updateQuestion();
  }

  function updateQuestion() {
    // console.log(questions[0].text);
    // setIndex(index++);
    var question = document.getElementById("question");

    var tempAnswers = answers[0];
    console.log(tempAnswers);
    // tempAnswers.forEach(answer => {
    //   const button = document.createElement('button');
    //     button.innerText = answer.text;
    //     button.classList.add('question-btn');
    //     if(answer.correct){
    //         button.dataset.correct = answer.correct;

    //     }
    //     // button.addEventListener('click', markAnswer);
    //     if(answerButtonsElement!=null){

    //     answerButtonsElement.appendChild(button);
    //     }

    // });

    for (var i = 0; i < tempAnswers.length; i++) {
      const button = document.createElement("button");
      button.innerText = tempAnswers[i].text;
      button.classList.add("question-btn");
      if (tempAnswers[i].correct) {
        button.dataset.correct = tempAnswers[i].correct;
      }
      // button.addEventListener('click', markAnswer);
      // if(answerButtonsElement!=null){

      // answerButtonsElement.appendChild(button);
      // }
    }

    // question.innerText = questions;
  }

  function handleCheckButtonClick() {
    const answerButtonsElement = document.getElementById("answer-buttons");

    if (selected) {
      //Check
      var currentResponse = response;

      if (correct) {
        setScore(score + 1);
        currentResponse.push({
          question: quizData[currentQuestion].questionText,
          yourAnswer: currentAnswer,
          correctAnswer: trueAnswer,
          color: "green",
        });
      } else {
        currentResponse.push({
          question: quizData[currentQuestion].questionText,
          yourAnswer: currentAnswer,
          correctAnswer: trueAnswer,
          color: "red",
        });
      }

      setResponse(currentResponse);

      // setCurrentAnswer(null);

      Array.from(answerButtonsElement.children).forEach((button) => {
        console.log(currentAnswer);

        if (currentAnswer == button.innerHTML) {
          if (currentAnswer == trueAnswer) {
            button.classList.add("correct");
          } else {
            button.classList.add("incorrect");
          }

          //Save button
          // button.classList.add('marked');
        } else {
          if (button.innerHTML == trueAnswer) {
            button.classList.add("correct");
          }
          // button.classList.remove('marked');
        }
      });

      const nextQuestion = currentQuestion + 1;
      document.getElementById("check-btn").hidden = true;
      if (nextQuestion < quizData.length) {
        document.getElementById("next-btn").hidden = false;
      } else {
        document.getElementById("finish-btn").hidden = false;
      }
    }
  }

  function handleNextButtonClick() {
    setSelected(false);
    document.getElementById("next-btn").hidden = true;
    document.getElementById("check-btn").hidden = false;
    refreshButtons();

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.length) {
      setCurrentQuestion(nextQuestion);
      console.log(currentQuestion);
    } else {
      alert("You have reached the end of the quiz");
      handleNextButtonClick();
    }
  }

  function refreshButtons() {
    const answerButtonsElement = document.getElementById("answer-buttons");
    Array.from(answerButtonsElement.children).forEach((button) => {
      button.classList.remove("incorrect");
      button.classList.remove("correct");
    });
  }

  function handleFinishButtonClick() {
    setQuiz(false);
    setEnd(true);
  }

  function handleHomeButtonClick() {
    setCurrentQuestion(0);
    setScore(0);
    refreshResults();
    setInitial(true);
    setEnd(false);
  }

  function handleResultsButtonClick() {
    setResults(true);
    setEnd(false);
  }

  function handleRestartButtonClick() {
    setCurrentQuestion(0);
    setScore(0);
    refreshResults();
    setEnd(false);
    setQuiz(true);
  }
  function handleReturnEndButtonClick() {
    setResults(false);
    setEnd(true);
  }

  function refreshResults() {
    setResponse([]);
  }

  return (
    <div id="box" className="container">
      {initial ? (
        <div id="initial">
          {quizTitle != null ? (
            <div>
              <div id="title-section">
                <h1 id="quiz-title">{quizTitle}</h1>
              </div>
              <div className="initial-button">
                <Button
                  active
                  type="button"
                  onClick={handleStartButtonClick}
                  id="start-btn"
                  className="btn btn-lg btn-primary"
                >
                  Start
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <span>Loading</span>
            </div>
          )}
        </div>
      ) : (
        <div></div>
      )}

      {quiz ? (
        <div id="mainPage">
          <h1 id="title">{quizTitle}</h1>
          <hr />

          <div id="question-container">
            <p id="question">{quizData[currentQuestion].questionText}</p>

            {/* <div id="answer-buttons" >
           <Button variant="primary" size="lg" block className="question-btn neutral">Answer 1</Button>
           <Button variant="primary" size="lg" block className="question-btn neutral">Answer 2</Button>                
       <Button variant="primary" size="lg" block className="question-btn neutral">Answer 3</Button>
       <Button variant="primary" size="lg" block className="question-btn neutral">Answer 4</Button>
   </div> */}
            <div id="answer-buttons" className="answer-section">
              {quizData[currentQuestion].answerOptions.map(
                (answerOption, i) => (
                  <Button
                    key={i}
                    onClick={() =>
                      handleAnswerButtonClick(
                        answerOption.answerText,
                        answerOption.isCorrect
                      )
                    }
                    variant="primary"
                    size="lg"
                    className="question-btn "
                  >
                    {answerOption.answerText}
                  </Button>
                )
              )}{" "}
            </div>
          </div>
          <hr />
          <div id="footer">
            <div id="hud">
              <div id="progressText" className="hud-prefix"></div>
              <div>
                Question {currentQuestion + 1} of {quizData.length}{" "}
              </div>
              <div id="progressBar">
                <div id="progressBarFull"></div>
              </div>
            </div>

            <div id="control-buttons" className="controls hud-prefix">
              <Button
                active
                type="button"
                onClick={handleCheckButtonClick}
                id="check-btn"
                className="check-btn btn neutral hide"
              >
                Check
              </Button>
              <Button
                active
                type="button"
                hidden
                onClick={handleNextButtonClick}
                id="next-btn"
                className="next-btn btn neutral hide"
              >
                Next
              </Button>
              <Button
                active
                type="button"
                hidden
                onClick={handleFinishButtonClick}
                id="finish-btn"
                className="next-btn btn neutral hide"
              >
                Finish
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {end ? (
        <div id="end" className="">
          <h1>You have completed the Quiz</h1>
          <span>
            <span>
              Your Score: You scored {score} out of {numQuestions}{" "}
            </span>
            <span id="score"></span>
          </span>

          <div className="controls">
            <Button
              onClick={handleRestartButtonClick}
              id="restart-btn"
              className="restart-btn btn "
            >
              Restart
            </Button>
            <Button
              onClick={handleResultsButtonClick}
              id="results-btn"
              className="results-btn btn "
            >
              Results
            </Button>
            <Button
              onClick={handleHomeButtonClick}
              id="home-btn"
              className="home-btn btn"
            >
              Go home
            </Button>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {results ? (
        <div id="new-results" className="result-box">
          <h1>Results</h1>
          <table>
            <thead>
              <tr>
                <td>Total Questions</td>
                <td>
                  <span id="total-question">{quizData.length}</span>
                </td>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Correct</td>
                <td>
                  <span id="total-correct">{score}</span>
                </td>
              </tr>
              <tr>
                <td>Incorrect</td>
                <td>
                  <span id="total-incorrect">{quizData.length - score}</span>
                </td>
              </tr>
              <tr>
                <td>Percentage</td>
                <td>
                  <span id="percentage">
                    {Number(
                      Number(score).toFixed(2) /
                        Number(quizData.length).toFixed(2)
                    ).toFixed(2) * 100}
                    %
                  </span>
                </td>
              </tr>
              <tr>
                <td>Total Score</td>
                <td>
                  <span id="total-score">
                    {score} / {quizData.length}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <table id="breakdown">
            <thead>
              <tr>
                <th>Questions</th>
                <th>Your Answer</th>
                <th>Correct Answer</th>
              </tr>
            </thead>
            <tbody>
              {response.map((answer, i) => (
                <tr className={answer.color} key={i}>
                  <td>{answer.question}</td>
                  <td>{answer.yourAnswer}</td>
                  <td>{answer.correctAnswer}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Button
            active
            type="button"
            onClick={handleReturnEndButtonClick}
            id="toEndPage"
            className="toEndPage-btn btn"
          >
            Back to end page
          </Button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
