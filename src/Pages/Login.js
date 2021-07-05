import React from "react";

function Login() {
  return (
    <div className="container box">
      <h1>Login</h1>
      <form id="login-form">
        <div>
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            id="login-email"
            placeholder="Enter email"
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            id="login-password"
            placeholder="Password"
          />
          <a href="/reset">Forgot Password </a>
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
