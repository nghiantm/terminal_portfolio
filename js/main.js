var before = document.getElementById("before");
var liner = document.getElementById("liner");
var command = document.getElementById("typer");
var textarea = document.getElementById("texter");
var terminal = document.getElementById("terminal");

var git = 0;
var commands = [];
var cwd = [];

setTimeout(async function() {
  const weather = await getUserWeather();
  updatePrompt();
  await loopLines(banner, "", 80);
  await loopLines(weather, "", 80);
  await loopLines(banner_welcome, "", 80);
  textarea.focus();
}, 10);

window.addEventListener("keyup", enterKey);
window.addEventListener("keydown", function(e) {
  if (e.key === "Tab") {
    e.preventDefault();
    handleTabComplete();
  }
});

textarea.value = "";
command.innerHTML = textarea.value;
updatePrompt();

// --- Filesystem helpers ---

function getNode(pathArr) {
  let node = filesystem;
  for (let part of pathArr) {
    if (!node.children || !node.children[part]) return null;
    node = node.children[part];
  }
  return node;
}

function resolvePath(arg) {
  if (!arg || arg === '~') return [];
  let base = (arg.startsWith('~/') || arg === '/') ? [] : [...cwd];
  let cleaned = arg.replace(/^~\//, '').replace(/^\//, '').replace(/\/$/, '');
  let parts = cleaned.split('/').filter(p => p !== '');
  for (let part of parts) {
    if (part === '..') {
      if (base.length > 0) base.pop();
    } else if (part !== '.') {
      base.push(part);
    }
  }
  return base;
}

function getPromptPath() {
  return cwd.length === 0 ? '~' : '~/' + cwd.join('/');
}

function getPromptString() {
  return 'visitor@matt88.netlify.app:' + getPromptPath() + '$ ';
}

function getPromptHTML() {
  return '<span class="prompt-user-echo">visitor@matt88</span>' +
         '<span>:</span>' +
         '<span class="prompt-path-echo">' + getPromptPath() + '</span>' +
         '<span>$&nbsp;</span>';
}

function updatePrompt() {
  document.getElementById('prompt-path').textContent = getPromptPath();
}

// --- Filesystem commands ---

function handleLs(args) {
  const showHidden = args.some(a => a === '-a' || a === '-la' || a === '-al');
  const pathArg = args.find(a => !a.startsWith('-')) || '';
  const targetPath = pathArg ? resolvePath(pathArg) : [...cwd];
  const node = getNode(targetPath);

  if (!node) {
    addLine("ls: cannot access '" + pathArg + "': No such file or directory", 'error', 80);
    return;
  }
  if (node.type === 'file') {
    addLine(targetPath[targetPath.length - 1], 'color2 margin', 80);
    return;
  }

  const entries = Object.entries(node.children)
    .filter(([name]) => showHidden || !name.startsWith('.'))
    .sort(([a, aNode], [b, bNode]) => {
      if (aNode.type === 'dir' && bNode.type !== 'dir') return -1;
      if (aNode.type !== 'dir' && bNode.type === 'dir') return 1;
      return a.localeCompare(b);
    });

  if (entries.length === 0) return;

  const line = entries.map(([name, child]) => {
    if (child.type === 'dir') return '<span class="command">' + name + '/</span>';
    return name;
  }).join('&nbsp;&nbsp;&nbsp;');

  addLine('<br>', '', 0);
  addLine(line, 'color2 margin', 80);
  addLine('<br>', '', 160);
}

function handleCd(arg) {
  if (!arg || arg === '~') {
    cwd = [];
    updatePrompt();
    return;
  }
  const targetPath = resolvePath(arg);
  const node = getNode(targetPath);
  if (!node) {
    addLine("cd: " + arg + ": No such file or directory", 'error', 80);
  } else if (node.type === 'file') {
    addLine("cd: " + arg + ": Not a directory", 'error', 80);
  } else {
    cwd = targetPath;
    updatePrompt();
  }
}

function handleCat(arg) {
  if (!arg) {
    addLine('cat: missing file operand', 'error', 80);
    return;
  }
  const targetPath = resolvePath(arg);
  const node = getNode(targetPath);
  if (!node) {
    addLine("cat: " + arg + ": No such file or directory", 'error', 80);
  } else if (node.type === 'dir') {
    addLine("cat: " + arg + ": Is a directory", 'error', 80);
  } else {
    loopLines(node.content, 'color2 margin', 80);
  }
}

function handlePwd() {
  const path = cwd.length === 0 ? '/home/visitor' : '/home/visitor/' + cwd.join('/');
  addLine(path, 'color2 margin', 80);
}

// --- Tab completion ---

const ALL_COMMANDS = [
  'cat', 'cd', 'clear', 'email', 'github',
  'help', 'history', 'linkedin', 'ls', 'projects',
  'pwd', 'sudo'
];

function handleTabComplete() {
  const input = textarea.value;
  const parts = input.trim().split(/\s+/);
  if (parts.length <= 1) {
    completeCommand(parts[0] || '');
  } else {
    completePath(parts[0], parts.slice(1).join(' '));
  }
}

function completeCommand(partial) {
  const matches = ALL_COMMANDS.filter(c => c.startsWith(partial));
  if (matches.length === 1) {
    textarea.value = matches[0] + ' ';
    command.innerHTML = textarea.value;
  } else if (matches.length > 1) {
    addLine(matches.join('   '), 'color2', 0);
    const cp = commonPrefix(matches);
    if (cp.length > partial.length) {
      textarea.value = cp;
      command.innerHTML = cp;
    }
  }
}

function completePath(cmd, partial) {
  const slashIdx = partial.lastIndexOf('/');
  const dirPath  = slashIdx === -1 ? [...cwd] : resolvePath(partial.slice(0, slashIdx));
  const prefix   = slashIdx === -1 ? partial  : partial.slice(slashIdx + 1);
  const pathBase = slashIdx === -1 ? ''       : partial.slice(0, slashIdx + 1);

  const dirNode = getNode(dirPath);
  if (!dirNode || dirNode.type !== 'dir') return;

  const matches = Object.keys(dirNode.children).filter(n => n.startsWith(prefix));
  if (matches.length === 0) return;

  if (matches.length === 1) {
    const isDir = dirNode.children[matches[0]].type === 'dir';
    textarea.value = cmd + ' ' + pathBase + matches[0] + (isDir ? '/' : '');
    command.innerHTML = textarea.value;
  } else {
    addLine(matches.join('   '), 'color2', 0);
    const cp = commonPrefix(matches);
    if (cp.length > prefix.length) {
      textarea.value = cmd + ' ' + pathBase + cp;
      command.innerHTML = textarea.value;
    }
  }
}

function commonPrefix(strs) {
  if (!strs.length) return '';
  return strs.reduce((a, b) => {
    let i = 0;
    while (i < a.length && a[i] === b[i]) i++;
    return a.slice(0, i);
  });
}

// --- Input handling ---

function enterKey(e) {
  if (e.keyCode == 181) {
    document.location.reload(true);
  }
  {
    if (e.keyCode == 13) {
      commands.push(command.innerHTML);
      git = commands.length;
      addLine(getPromptHTML() + command.innerHTML, "no-animation", 0);
      commander(command.innerHTML.toLowerCase().replace(/&nbsp;/g, " ").trim());
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
  const parts = cmd.trim().split(/\s+/);
  const base = parts[0];
  const args = parts.slice(1);

  switch (base) {
    case "ls":
      handleLs(args);
      break;
    case "cd":
      handleCd(args[0] || '');
      break;
    case "cat":
      handleCat(args[0] || '');
      break;
    case "pwd":
      handlePwd();
      break;
    case "help":
      loopLines(help, "color2 margin", 80);
      break;
    case "sudo":
      addLine("Oh no, you're not admin...", "color2", 80);
      setTimeout(function() {
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      }, 1000);
      break;
    case "linkedin":
      addLine('Opening: <a href="https://www.linkedin.com/in/nghiantm/" target="_blank">linkedin.com/in/nghiantm/</a>', "color2", 80);
      setTimeout(() => {
        window.open('https://www.linkedin.com/in/nghiantm/', '_blank');
      }, 80 * 6);
      break;
    case "github":
      addLine('Opening: <a href="https://github.com/nghiantm" target="_blank">github.com/nghiantm</a>', "color2", 80);
      setTimeout(() => {
        window.open('https://github.com/nghiantm', '_blank');
      }, 80 * 6);
      break;
    case "website":
      addLine('Duh, what did you expect?', "color2", 80);
      break;
    case "projects":
      loopLines(projects, "color2 margin", 80);
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
      }, 80 * 6);
      break;
    case "clear":
      setTimeout(function() {
        terminal.innerHTML = '<a id="before"></a>';
        before = document.getElementById("before");
      }, 1);
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
    next.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, time);
}

function loopLines(name, style, time) {
  return new Promise((resolve) => {
    name.forEach(function (item, index) {
      addLine(item, style, index * time);
    });
    setTimeout(resolve, name.length * time);
  });
}
