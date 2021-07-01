$(document).ready(function () {
  $("#refresh").on("click", function () {
    $("#finished").load("index.html");
    return false;
  });
});

$(document).ready(function () {
  $("#editAddQuestionID").on("click", function () {
    $("#editForm").load("index.html");
    return false;
  });
});

$("#editAddQuestionID").click(function () {
  // page repaint code, image change, etc.

  setTimeout(function () {
    window.location.reload();
    // use window.location.href = "my/new/url.html";
    // or window.location.replace("my/new/url.html");
    // to change the page instead of just reloading.
  }, 1000);
});
