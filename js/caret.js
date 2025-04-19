function $(elid) {
    return document.getElementById(elid);
  }
  
var cursor;
window.onload = init;

function init() {
  cursor = $("cursor");
  cursor.style.left = "0px";
  document.getElementById("texter").focus(); // Ensure textarea gets focus on load
}

function nl2br(txt) {
  return txt.replace(/\n/g, "").replace(/ /g, "&nbsp;"); // Replace spaces with non-breaking spaces
}

function typeIt(from, e) {
  e = e || window.event;
  var typer = $("typer");
  var value = from.value;
  setTimeout(() => {
    typer.innerHTML = nl2br(from.value);
  }, 0);
}

function moveIt(count, e) {
  e = e || window.event;
  var keycode = e.keyCode || e.which;
  if (keycode === 37 && parseInt(cursor.style.left) > -(count - 1) * 10) {
    cursor.style.left = parseInt(cursor.style.left) - 10 + "px";
  } else if (keycode === 39 && parseInt(cursor.style.left) + 10 < count * 10) {
      cursor.style.left = parseInt(cursor.style.left) + 10 + "px";
  }
}

function alert(txt) {
  console.log(txt);
}

// Ensuring focus returns to textarea
window.addEventListener("click", () => {
  document.getElementById("texter").focus();
});