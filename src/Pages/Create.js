import React, { useState } from "react";
import { firebase } from "./../Config";
import Widget from "./Widget";

export default function Create() {
  const [done, setDone] = useState(false);
  const [numAnswers, setNumAnswers] = useState(["Answer 1", "Answer 2"]);
  const [displayQuestions, setDisplayQuestions] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [answerOptions, setAnswerOptions] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [currentUserID, setCurrentUserID] = useState();

  const [notes, setNotes] = useState([]);
  let array = [{ questionText: "questiontitle" }];

  if (!done) {
    setup();
    setDone(true);
  }

  function deleteNote(id) {
    console.log(id);
    setSavedQuestions((prevQuestions) => {
      return prevQuestions.filter((noteItem, index) => {
        return index !== id;
      });
    });
    setDisplayQuestions((prevQuestions) => {
      return prevQuestions.filter((noteItem, index) => {
        return index !== id;
      });
    });
    setNotes((prevNotes) => {
      return prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
    });
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

  function addQuizTest() {
    //Add check that title doesn't already exist
    console.log(document.getElementById("upload-title").value);

    if (
      document.getElementById("upload-title").value == null ||
      document.getElementById("upload-title").value == ""
    ) {
      alert("Requires a title");
    } else if (savedQuestions.length == 0) {
      alert("Need at least one question before submitting");
    } else {
      var title = document.getElementById("upload-title").value;

      //Add quiz
      const dbQuizForUser = firebase
        .database()
        .ref("Users/" + currentUserID + "/createdQuizzes/" + title);

      dbQuizForUser.set({ title: title });
      //Num questions

      //All questions

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
        });

      //Each question

      var index = savedQuestions.length;

      for (var i = 1; i < index + 1; i++) {
        var questionArray = savedQuestions;

        var question = questionArray[i - 1];
        console.log(answerOptions);
        firebase
          .database()
          .ref(`Quizzes/${currentUser}/${title}/${i}`)
          .set({
            answerOptions: answerOptions[i - 1],
            questionText: question,
          });
      }

      setNotes([]);

      const createQuizForm = document.querySelector("#createQuizForm");
      createQuizForm.reset();
      alert("Your quiz has been submitted");
    }
  }
  //set - write or replace data to a defined path
  //update - update some of the keys for a defined path
  //push - add to a list of data in the database

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
          //setAnswerOptions(newSavedAnswers);

          //Save question
          var currentQuestions = savedQuestions;
          currentQuestions.push(newQuestion);

          //setSavedQuestions(currentQuestions);

          //Display questions

          var tempQuestions = displayQuestions;
          tempQuestions.push({
            question: newQuestion,
            answerOptions: displayArray,
          });
          console.log(tempQuestions);

          //setDisplayQuestions(tempQuestions);
          console.log(displayQuestions);

          console.log(savedQuestions);
          console.log(savedQuestions.length);

          setNotes(tempQuestions);
          document.getElementById("addQuestions").reset();
          setNumAnswers(["Answer 1", "Answer 2"]);
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

  function addAnswerOption(e) {
    e.preventDefault();
    var length = numAnswers.length;
    if (length == 2) {
      setNumAnswers(["Answer 1", "Answer 2", "Answer 3"]);
    } else if (length == 3) {
      setNumAnswers(["Answer 1", "Answer 2", "Answer 3", "Answer 4"]);
    }
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

        <div>
          <h1>Saved Questions</h1>
          {notes.map((noteItem, index) => {
            return (
              <Widget
                key={index}
                answers={noteItem.answerOptions}
                question={noteItem.question}
                id={index}
                onDelete={deleteNote}
              />
            );
          })}
        </div>

        <div id="storedQuestions">
          {array.map((question, i) => (
            <div key={i}>{question.title}</div>
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
              {numAnswers.map((answer, i) => (
                <input
                  key={i}
                  type="text"
                  className="form-control Answer"
                  id="answer"
                  placeholder="Answer"
                />
              ))}

              {numAnswers.length < 4 ? (
                <button
                  id="addAnswerOption"
                  onClick={(e) => addAnswerOption(e)}
                  className="btn btn-secondary"
                >
                  Add Answer Option
                </button>
              ) : (
                <div></div>
              )}
              <br />

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
              className="centre btn btn-primary"
            >
              Save Question
            </button>
          </form>
        </div>
      </form>
      <br />
      <button onClick={() => addQuizTest()} className="btn btn-success">
        Submit Quiz
      </button>
    </div>
  );
}
