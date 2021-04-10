import React, { useState } from "react";
import { firebase } from "./../Config";

export default function Create() {
  const [done, setDone] = useState(false);
  const [questionsForm, setQuestionsForm] = useState(["Question"]);
  const [numAnswers, setNumAnswers] = useState(["Answer 1", "Answer 2"]);
  const [displayQuestions, setDisplayQuestions] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [answerOptions, setAnswerOptions] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [currentUserID, setCurrentUserID] = useState();
  const [displaySetQuestions, setDisplaySetQuestions] = useState(true);
  let array = [{ questionText: "questiontitle" }];
  //console.log(window.location.href);
  const answerFieldsElement = document.getElementById("answer-buttons");

  if (!done) {
    setup();
    setDone(true);
  }
  function setup() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const dbRefUsers = firebase
          .database()
          .ref("Users/" + user.uid + "/username");
        console.log(user.uid);
        setCurrentUserID(user.uid);
        dbRefUsers.on("value", function (snap) {
          setCurrentUser(snap.val());
        });
      } else {
      }
    });
  }

  function replace() {
    firebase.database().ref("Quizzes/TestUser/TestQuiz").push({
      text: "test2",
    });
  }

  function addQuizTest() {
    //Add check that title doesn't already exist
    console.log(document.getElementById("upload-title").value);

    if (
      document.getElementById("upload-title").value == null ||
      document.getElementById("upload-title").value == ""
    ) {
    } else if (savedQuestions.length == 0) {
      alert("Need at least one question before submitting");
    } else {
      var title = document.getElementById("upload-title").value;

      // var answerOptionsTest: [1, { answerText: "4", isCorrect: false }];

      //Add quiz
      const dbQuizForUser = firebase
        .database()
        .ref("Users/" + currentUserID + "/createdQuizzes/" + title);

      dbQuizForUser.set({ title: title });
      //Num questions

      //All questions
      var answerOptionsTest1 = [
        { answerText: "4", isCorrect: false },
        { answerText: "5", isCorrect: false },
        { answerText: "20", isCorrect: false },
        { answerText: "60", isCorrect: true },
      ];

      //1 question upload

      //First things
      // firebase
      //   .database()
      //   .ref(`Quizzes/${currentUser}/${title}`)
      //   .set({
      //     NumQuestions: 1,
      //     Title: title,
      //     creator: currentUser,
      //     dateCreated: new Date().toLocaleDateString("en-NZ"),
      //     timeCreated: new Date().toLocaleTimeString("en-NZ"),
      //     createdSortDate: new Date().toISOString(),
      //     updatedSortDate: new Date().toISOString(),
      //     // 1: [answerOptions: [answerOptionsTest1]],
      //   });

      // //Each question

      // var index = 1;
      // var question = "What is 3/5 of 100?";

      // for (var i = 1; i < index + 1; i++) {
      //   firebase
      //     .database()
      //     .ref(`Quizzes/${currentUser}/${title}/${index}`)
      //     .set({
      //       questionText: question,
      //       answerOptions: answerOptionsTest1,
      //     });
      // }

      //2 uploads

      //First things
      firebase
        .database()
        .ref(`Quizzes/${currentUser}/${title}`)
        .set({
          NumQuestions: savedQuestions.length,
          Title: title,
          creator: currentUser,
          dateCreated: new Date().toLocaleDateString("en-NZ"),
          timeCreated: new Date().toLocaleTimeString("en-NZ"),
          createdSortDate: new Date().toISOString(),
          updatedSortDate: new Date().toISOString(),
          // 1: [answerOptions: [answerOptionsTest1]],
        });

      //Each question

      var index = savedQuestions.length;
      // var question = "What is 3/5 of 100?";

      for (var i = 1; i < index + 1; i++) {
        var questionArray = savedQuestions;
        //var question = document.getElementById("upload-question").value;
        var question = questionArray[i - 1];
        firebase
          .database()
          .ref(`Quizzes/${currentUser}/${title}/${i}`)
          .set({
            answerOptions: answerOptions[i - 1],
            questionText: question,
            // answerOptions: answerOptionsTest1,
          });
      }

      const createQuizForm = document.querySelector("#createQuizForm");
      createQuizForm.reset();
      alert("Your quiz has been submitted");
    }
  }
  //set - write or replace data to a defined path
  //update - update some of the keys for a defined path
  //push - add to a list of data in the database

  function addAnswerOption() {
    var num = numAnswers;
    setNumAnswers(num++);
  }

  function addQuestion(e) {
    e.preventDefault();
    var correctIndex = document.getElementById("correctAnswerIndex").value;
    console.log("correctIndex: " + correctIndex);

    let newQuestion = document.getElementById("upload-question").value;
    if (newQuestion == null || newQuestion == "") {
      alert("Needs a question");
    } else if (correctIndex == "" || correctIndex == null) {
      alert("Must specify which option is correct");
    }
    //Check that correct Index is valid value
    else if (
      correctIndex < 0 ||
      correctIndex > document.getElementsByClassName("Answer").length
    ) {
      alert("Must input a valid index");
    } else {
      setTimeout(() => {
        setDisplaySetQuestions(false);
      }, 2000);

      //Save answer options
      var answerArray = [];
      var displayArray = [];
      var newSavedAnswers = answerOptions;
      var x = document.getElementsByClassName("Answer");

      var i;

      //If less than 2 options are filled in
      var min2Options = false;
      var numOptionsCount = 0;

      //If correct answer is blank
      var validAnswer = false;

      //If any options are blank - CHECK

      for (i = 0; i < x.length; i++) {
        console.log(x[i].value);
        if (x[i].value != "" && x[i].value != null) {
          numOptionsCount++;
          console.log("i: " + (i + 1));
          console.log("correctIndex: " + correctIndex);
          if (i + 1 == correctIndex) {
            if (x[i].value != "") {
              validAnswer = true;
            }
            answerArray.push({ answerText: x[i].value, isCorrect: true });
            displayArray.push({ answerText: x[i].value, color: "green" });
          } else {
            answerArray.push({ answerText: x[i].value, isCorrect: false });
            displayArray.push({ answerText: x[i].value, color: "red" });
          }
        }
      }
      if (numOptionsCount >= 2) {
        min2Options = true;
      }

      if (min2Options) {
        if (validAnswer) {
          console.log(displayArray);
          newSavedAnswers.push(answerArray);
          console.log(correctIndex);

          console.log(answerArray);
          console.log(newSavedAnswers);
          setAnswerOptions(newSavedAnswers);

          //Save question
          var currentQuestions = savedQuestions;
          currentQuestions.push(newQuestion);

          setSavedQuestions(currentQuestions);

          //Display questions

          var tempQuestions = displayQuestions;
          tempQuestions.push({
            question: newQuestion,
            answerOptions: displayArray,
          });
          console.log(tempQuestions);

          setDisplayQuestions(tempQuestions);
          console.log(displayQuestions);

          console.log(savedQuestions);
          console.log(savedQuestions.length);
          setTimeout(() => {
            setDisplaySetQuestions(true);
          }, 2000);
        } else {
          alert("Chosen correct answer is blank");
        }
      } else {
        alert("Need to fill in at least 2 options");
      }

      // document.getElementById("storedQuestions").innerHTML()
    }
    // var database = firebase.database();

    //add question
    //add answers
  }

  function writeUserData(userId, name, email, imageUrl) {
    firebase
      .database()
      .ref("users/" + userId)
      .set({
        username: name,
        email: email,
        profile_picture: imageUrl,
      });
  }

  function test(e) {
    e.preventDefault();
    //console.log(document.getElementById("answer").value);
    var answerArray = [];
    var newSavedAnswers = answerOptions;
    var x = document.getElementsByClassName("Answer");
    var correctIndex = document.getElementById("correctAnswerIndex").value;
    var i;
    for (i = 0; i < x.length; i++) {
      console.log(x[i].value);
      if (i + 1 == correctIndex) {
        answerArray.push({ answerText: x[i].value, isCorrect: true });
      } else {
        answerArray.push({ answerText: x[i].value, isCorrect: false });
      }
    }
    newSavedAnswers.push(answerArray);
    console.log(correctIndex);

    console.log(answerArray);
    console.log(newSavedAnswers);
    setAnswerOptions(newSavedAnswers);
  }
  return (
    <div className="container">
      <h1>Create Quiz</h1>

      <form id="createQuizForm">
        <div>
          <label>Title</label>
          <input
            required
            type="text"
            className="form-control"
            id="upload-title"
            placeholder="Enter quiz title"
          />
        </div>
        <p id="demo"></p>

        {displaySetQuestions ? (
          <div>
            <h1>displaySetQuestions</h1>
            {displayQuestions.map((section) => (
              <div>
                <h2>{section.question}</h2>
                {section.answerOptions.map((answer, i) => (
                  <div className={answer.color}>{answer.answerText} </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div></div>
        )}

        <div id="storedQuestions">
          {array.map((question) => (
            <div>{question.title}</div>
          ))}
        </div>

        <div>
          <form id="addQuestions">
            <div>
              <label>Question</label>
              <input
                type="text"
                className="form-control"
                id="upload-question"
                placeholder="Enter question"
              />
            </div>

            <div>
              <label>Answers</label>
              {numAnswers.map((answer) => (
                <input
                  type="text"
                  className="form-control Answer"
                  id="answer"
                  placeholder="Answer"
                />
              ))}
              {/* <input
                id="correctAnswerNum"
                type="number"
                placeholder="Number of correct answer, i.e. 2"
              /> */}
              <input
                id="correctAnswerIndex"
                type="number"
                placeholder="Index of correct answer, i.e. 1, 2"
              />
              <br />
            </div>
            <button
              id="addQuestionID"
              onClick={(e) => addQuestion(e)}
              className="btn btn-primary"
            >
              Add Question
            </button>
          </form>
        </div>
      </form>
      <button onClick={() => addQuizTest()} className="btn btn-primary">
        Submit Quiz
      </button>
    </div>
  );
}
