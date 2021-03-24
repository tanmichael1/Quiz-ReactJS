import React, { useState } from "react";
import { firebase } from "./../Config";

export default function Create() {
  const [questionsForm, setQuestionsForm] = useState(["Question"]);
  const [numAnswers, setNumAnswers] = useState(["Answer 1", "Answer 2"]);
  const [savedQuestions, setSavedQuestions] = useState([]);

  function test() {
    // var testRef = firebase.database().ref('Quizzes/TestUser');
    var database = firebase.database();
    var testRef = firebase.database().ref("Quizzes/TestUser");

    firebase.database().ref("Quizzes/AnotherUser").set({
      text: "test2",
    });
  }

  function replace() {
    firebase.database().ref("Quizzes/TestUser/TestQuiz").push({
      text: "test2",
    });
  }

  function addQuizTest() {
    //Add check that title doesn't already exist
    var title = "Test title";
    if (document.getElementById("upload-title").value != null) {
      title = document.getElementById("upload-title").value;
    }
    // var answerOptionsTest: [1, { answerText: "4", isCorrect: false }];

    //Num questions

    //All questions
    var answerOptionsTest1 = [
      { answerText: "4", isCorrect: false },
      { answerText: "5", isCorrect: false },
      { answerText: "20", isCorrect: false },
      { answerText: "60", isCorrect: true },
    ];

    //First things
    firebase.database().ref(`Quizzes/AnotherUser/${title}`).set({
      NumQuestions: 1,
      Title: title,
      // 1: [answerOptions: [answerOptionsTest1]],
    });

    //Each question

    var index = 1;
    var question = "What is 3/5 of 100?";

    for (var i = 1; i < index + 1; i++) {
      firebase.database().ref(`Quizzes/AnotherUser/${title}/${index}`).set({
        questionText: question,
        answerOptions: answerOptionsTest1,
      });
    }
  }

  function addQuestion() {
    let newAnswer = [];
    let newQuestion = document.getElementById("question");
    // var database = firebase.database();

    //add question
    //add answers
  }

  //set - write or replace data to a defined path
  //update - update some of the keys for a defined path
  //push - add to a list of data in the database

  function addAnswerOption() {
    var num = numAnswers;
    setNumAnswers(num++);
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

        <div id="storedQuestions">
          {savedQuestions.map((question) => (
            <div></div>
          ))}
        </div>

        <div>
          {questionsForm.map((question) => (
            <div>
              <label>{question}</label>
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
                  {}
                  <input
                    type="text"
                    className="form-control"
                    id="answer"
                    placeholder="Answer"
                  />
                  <button>Add Answer</button>
                </div>
                <button>Add Question</button>
              </form>
            </div>
          ))}{" "}
        </div>
      </form>
      <button onClick={() => addQuizTest()} className="btn btn-primary">
        Submit Quiz
      </button>
    </div>
  );
}
