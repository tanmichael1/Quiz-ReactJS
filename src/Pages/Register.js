import React from "react";

function Register() {
  return (
    <div className="container box">
      <h1>Register</h1>
      <form id="signup-form">
        <div>
          <label>Username</label>
          <input
            required
            type="text"
            className="form-control"
            id="signup-username"
            placeholder="Enter username"
          />
        </div>

        <div>
          <label>Email address</label>
          <input
            required
            type="email"
            className="form-control"
            id="signup-email"
            placeholder="Enter email"
          />
        </div>

        <div>
          <label>Password</label>
          <input
            required
            type="password"
            className="form-control"
            id="signup-password"
            placeholder="Password"
          />
        </div>
        <button className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}

export default Register;
