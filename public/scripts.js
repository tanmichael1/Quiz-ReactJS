$(document).ready(function () {
  $("#refresh").on("click", function () {
    $("#finished").load("index.html");
    return false;
  });
});
