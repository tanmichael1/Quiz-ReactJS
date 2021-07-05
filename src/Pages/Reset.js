import { firebase } from "./../Config";

const auth = firebase.auth();

function resetPasswordFunction() {
  const email = document.getElementById("mail").value;
  if (email) {
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        console.log("Password Reset Email Sent Successfully");
        alert(
          "Email sent successfully, check for email to reset your password"
        );
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    alert("Issue with your inputted email, try again");
  }
}

function reset() {
  return (
    <div className="container box">
      <h1>Reset Password</h1>
      <label>Enter your email address</label>
      <br />
      <input type="email" id="mail" name="mail" />
      <br />
      <button
        className="btn btn-primary"
        onClick={() => resetPasswordFunction()}
        id="resetPasswordLogin"
      >
        Reset Password
      </button>
    </div>
  );
}

export default reset;
