import React from "react";

function Widget(props) {
  function handleClick() {
    props.onDelete(props.id);
  }

  return (
    <div className="widget">
      <h2>{props.question}</h2>

      {props.answers.map((answer, i) => (
        <div key={i} className={answer.color}>
          {answer.answerText}{" "}
        </div>
      ))}
      <button className="btn btn-danger delete-btn" onClick={handleClick}>
        DELETE
      </button>
    </div>
  );
}

export default Widget;
