var before = document.getElementById("before");
var liner = document.getElementById("liner");
var command = document.getElementById("typer"); 
var textarea = document.getElementById("texter"); 
var terminal = document.getElementById("terminal");

var git = 0;
var pw = false;
let pwd = false;
var commands = [];

setTimeout(async function() {
  const weather = await getUserWeather();
  await loopLines(banner, "", 80);
  await loopLines(weather, "", 80);
  await loopLines(banner_welcome, "", 80);
  textarea.focus();
}, 10);

window.addEventListener("keyup", enterKey);

console.log(
  "%cYou hacked my password!😠",
  "color: #04ff00; font-weight: bold; font-size: 24px;"
);
console.log("%cPassword: '" + password + "' - I wonder what it does?🤔", "color: grey");

//init
textarea.value = "";
command.innerHTML = textarea.value;

function enterKey(e) {
  if (e.keyCode == 181) {
    document.location.reload(true);
  }
  if (pw) {
    let et = "*";
    let w = textarea.value.length;
    command.innerHTML = et.repeat(w);
    if (textarea.value === password) {
      pwd = true;
    }
    if (pwd && e.keyCode == 13) {
      loopLines(secret, "color2 margin", 120);
      command.innerHTML = "";
      textarea.value = "";
      pwd = false;
      pw = false;
      liner.classList.remove("password");
    } else if (e.keyCode == 13) {
      addLine("Wrong password", "error", 0);
      command.innerHTML = "";
      textarea.value = "";
      pw = false;
      liner.classList.remove("password");
    }
  } else {
    if (e.keyCode == 13) {
      commands.push(command.innerHTML);
      git = commands.length;
      addLine("visitor@matt88.netlify.app:~$ " + command.innerHTML, "no-animation", 0);
      // remove nbsp from variable, it was added to show spaces on terminal
      commander(command.innerHTML.toLowerCase().replace(/&nbsp;/g, ""));
      command.innerHTML = "";
      textarea.value = "";
    }
    if (e.keyCode == 38 && git != 0) {
      git -= 1;
      textarea.value = commands[git];
      command.innerHTML = textarea.value;
    }
    if (e.keyCode == 40 && git != commands.length) {
      git += 1;
      if (commands[git] === undefined) {
        textarea.value = "";
      } else {
        textarea.value = commands[git];
      }
      command.innerHTML = textarea.value;
    }
  }
}

function commander(cmd) {
  switch (cmd.toLowerCase()) {
    case "help":
      loopLines(help, "color2 margin", 80);
      break;
    case "about":
      loopLines(about, "color2 margin", 80);
      break;
    case "whoami":
      loopLines(whoami, "color2 margin", 80);
      break;
    case "sudo":
      addLine("Oh no, you're not admin...", "color2", 80);
      setTimeout(function() {
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      }, 1000); 
      break;
    case "resume":
      addLine('A pigeon is bringing the paper', "color2", 80);
      setTimeout(() => {
        window.open('https://www.cs.drexel.edu/~mn839/matt.pdf', '_blank');
      }, 80*6); // Match the delay in addLine
      break;
    case "linkedin":
      addLine('Opening: <a href="https://www.linkedin.com/in/nghiantm/" target="_blank">linkedin.com/in/nghiantm/</a>', "color2", 80);
      setTimeout(() => {
        window.open('https://www.linkedin.com/in/nghiantm/', '_blank');
      }, 80*6); // Match the delay in addLine
      break;
    case "github":
      addLine('Opening: <a href="https://github.com/nghiantm" target="_blank">github.com/nghiantm</a>', "color2", 80);
      setTimeout(() => {
        window.open('https://github.com/nghiantm', '_blank');
      }, 80*6); // Match the delay in addLine
      break;
    case "website":
      addLine('Duh, what did you expect?', "color2", 80);
      break;
    case "secret":
      liner.classList.add("password");
      pw = true;
      break;
    case "projects":
      loopLines(projects, "color2 margin", 80);
      break;
    case "password":
      addLine("<span class=\"inherit\"> Lol! You're joking, right? You\'re gonna have to try harder than that!😂</span>", "error", 100);
      break;
    case "history":
      addLine("<br>", "", 0);
      loopLines(commands, "color2", 80);
      addLine("<br>", "command", 80 * commands.length + 50);
      break;
    case "email":
      addLine('Sending a pigeon to: <a href="mailto:mn839@drexel.edu" target="_blank">mn839@drexel.edu</a>', "color2", 80);
      setTimeout(function() {
        newTab(email);
      }, 80*6); // Match the delay in addLine
      break;
    case "clear":
      setTimeout(function() {
        terminal.innerHTML = '<a id="before"></a>';
        before = document.getElementById("before");
      }, 1);
      break;
    case "rtalk":
      addLine("Opening the rTalk project...", "color2", 80);
      setTimeout(function() {
        newTab("https://r-talk.netlify.app/");
      }, 80*6); // Match the delay in addLine
      break;
    case "studybuddy":
      addLine("Opening the Study Buddy project...", "color2", 80);
      setTimeout(function() {
        newTab("https://study-buddyy.netlify.app/");
      }, 80*6); // Match the delay in addLine
      break;
    case "tradequest":
      addLine("Opening the Trade Quest project...", "color2", 80);
      setTimeout(function() {
        newTab("https://tradequest.netlify.app/");
      }, 80*6); // Match the delay in addLine
      break;
    case "movierecommender":
      addLine("Opening the Movie Recommender repo...", "color2", 80);
      setTimeout(function() {
        newTab("https://github.com/nghiantm/movie-rec");
      }, 80*6); // Match the delay in addLine
      break;
    case "personalwebsite":
      addLine("Opening the Personal Website project...", "color2", 80);
      setTimeout(function() {
        newTab("#");
      }, 80*6); // Match the delay in addLine
      break;
    default:
      addLine("<span class=\"inherit\">Command not found. For a list of commands, type <span class=\"command\">'help'</span>.</span>", "error", 100);
      break;
  }
}

function newTab(link) {
  setTimeout(function() {
    window.open(link, "_blank");
  }, 500);
}

function addLine(text, style, time) {
  var t = "";
  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) == " " && text.charAt(i + 1) == " ") {
      t += "&nbsp;&nbsp;";
      i++;
    } else {
      t += text.charAt(i);
    }
  }
  setTimeout(function() {
    var next = document.createElement("p");
    next.innerHTML = t;
    next.className = style;

    before.parentNode.insertBefore(next, before);

    window.scrollTo(0, document.body.offsetHeight);
  }, time);
}

function loopLines(name, style, time) {
  return new Promise((resolve) => {
    name.forEach(function (item, index) {
      addLine(item, style, index * time);
    });

    // Resolve the promise after the last line is added
    setTimeout(resolve, name.length * time);
  });
}
