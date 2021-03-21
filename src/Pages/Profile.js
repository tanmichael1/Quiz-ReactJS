import React, { useState } from "react";

function Profile() {
  let createdQuizzes = [];
  let takenQuizzes = [];
  return (
    <div className="container">
      <h1>Username</h1>

      <h2>Created quizzes</h2>
      {createdQuizzes > 0 ? <div>Test</div> : <div>Empty</div>}

      <h2>Recently taken quizzes</h2>
      {takenQuizzes > 0 ? <div>Test</div> : <div>Taken no quizzes</div>}
    </div>
  );
}

export default Profile;
