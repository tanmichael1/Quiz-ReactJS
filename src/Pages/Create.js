import React, { useState } from "react";

export default function Create() {
  const [questionsForm, setQuestionsForm] = useState(["Question"]);
  const [numAnswers, setNumAnswers] = useState(2);

  function addQuestion() {
    let newAnswer = [];
    let newQuestion = document.getElementById("question");

    //add question
    //add answers
  }
  return (
    <div className="container">
      <h1>Create Quiz</h1>

      <form>
        <div>
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Enter quiz title"
          />
        </div>

        <div id="answer-buttons" className="answer-section">
          {questionsForm.map((question) => (
            <div>
              <label>{question}</label>
            </div>
          ))}{" "}
        </div>

        <form id="addQuestions">
          <div>
            <label>Question</label>
            <input
              type="text"
              className="form-control"
              id="question"
              placeholder="Enter question"
            />
          </div>

          <div>
            <label>Answers</label>
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

        <button type="submit" className="btn btn-primary">
          Submit Quiz
        </button>
      </form>
    </div>
  );
}
