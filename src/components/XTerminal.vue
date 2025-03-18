<template>
  <div ref="terminalContainer" class="terminal-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import wsService, { isOnline } from '@/services/ws.service';
import 'xterm/css/xterm.css';

const PROMPT = 'ibdsp$ ';
const terminalContainer = ref(null);

let commandHistory = [];
let historyIndex = -1;
let currentCommand = '';
let cursorPosition = 0;
let isSendingCommand = false;

const term = new Terminal({
  theme: {
    background: '#1e1e1e',
    foreground: '#00ff00'
  },
  fontSize: 14,
  fontFamily: 'monospace'
});

const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

onMounted(() => {
  if (terminalContainer.value) {
    term.open(terminalContainer.value);
    fitAddon.fit();

    term.onData(handleInput);
    term.onKey(handleKey);

    term.write(PROMPT);
    wsService.addEventListener('response', handleResponse);
  }
});

onUnmounted(() => {
  term.dispose();
  wsService.removeEventListener('response', handleResponse);
});

function handleInput(data) {
  if (data.length > 1 || isSendingCommand) {
    return;
  }
  if (data === '\r') {
    term.write('\r\n');
    handleCommand(currentCommand);
    currentCommand = '';
    cursorPosition = 0;
  } else if (data === '\x7F') {
    if (cursorPosition > 0) {
      currentCommand = currentCommand.slice(0, cursorPosition - 1) + currentCommand.slice(cursorPosition);
      cursorPosition--;
      term.write('\b \b');
    }
  } else {
    const lastPart = currentCommand.slice(cursorPosition);
    currentCommand = currentCommand.slice(0, cursorPosition) + data + lastPart;
    cursorPosition++;
    term.write('\x1b[K');
    term.write(data + lastPart);
    term.write(`\x1b[${cursorPosition + 1 + PROMPT.length}G`);
  }
}

function handleKey(event) {
  const { key, domEvent } = event;
  if (domEvent.key === 'ArrowUp') {
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      updateCommandFromHistory();
    }
  } else if (domEvent.key === 'ArrowDown') {
    if (historyIndex > 0) {
      historyIndex--;
      updateCommandFromHistory();
    } else {
      historyIndex = -1;
      clearCurrentCommand();
    }
  } else if (domEvent.key === 'ArrowLeft') {
    if (cursorPosition > 0) {
      cursorPosition--;
      term.write('\x1b[D');
    }
  } else if (domEvent.key === 'ArrowRight') {
    if (cursorPosition < currentCommand.length) {
      cursorPosition++;
      term.write('\x1b[C');
    }
  } else if (domEvent.key === 'Delete') {
    if (cursorPosition < currentCommand.length) {
      currentCommand = currentCommand.slice(0, cursorPosition) + currentCommand.slice(cursorPosition + 1);
      term.write('\x1b[P');
    }
  }
}

function handleResponse(data) {
  if (data === 'EOF') {
    writePrimpt();
    isSendingCommand = false;
    return;
  }
  term.writeln(data);
}

function handleCommand(str) {
  commandHistory.unshift(str);
  const regex = /"[^"]+"|\S+/g;
  const words = str.match(regex);
  const command = words[0];
  switch (command) {
    case 'help':
      term.writeln('Доступные команды: help, \r\n clear \r\n log');
      writePrimpt();
      break;
    case 'clear':
      term.clear();
      term.write(PROMPT);
      break;
    case 'log':
      if (words.length < 3 || words[1] === '--help') {
        writeLogHelp();
        break;
      }
      sendDataToServer(words);
      break;
    default:
      term.writeln(`Команда "${command}" не найдена. Введите "help" для списка команд.`);
      writePrimpt();
  }
}

function writeLogHelp() {
  term.writeln('Формат команды: log [параметры]');
  term.writeln('Параметры:');
  term.writeln('\t-u <имя сервиса>');
  term.writeln('\t-t <имя тэга>, необходимо указать как минимум один из параметров -u или -t');
  term.writeln('\t-g <шаблон фильтрации>, шаблон аналогичен используемым с командой grep');
  term.writeln('\t--since <дата начала>, по умолчанию 2 часа назад');
  term.writeln('\t--until <дата окончания>, по умолчанию текущая дата и время');
  term.writeln('\t--help - выводит данную справку');
  writePrimpt();
}

function updateCommandFromHistory() {
  currentCommand = commandHistory[historyIndex];
  cursorPosition = currentCommand.length;
  term.write(`\x1b[${PROMPT.length + 1}G`);
  term.write('\x1b[K');
  term.write(currentCommand);
}

function clearCurrentCommand() {
  currentCommand = '';
  cursorPosition = 0;
  term.write(`\x1b[${PROMPT.length + 1}G`);
  term.write('\x1b[K');
}

function parseLogCommand(words) {
  let result = {
    type: 'command',
    data: {
      command: 'log'
    }
  };

  for (let i = 1; i < words.length; i++) {
    let param = words[i];
    if (param === '-u' && i + 1 < words.length) {
      result.data.service = words[++i];
      continue;
    }

    if (param === '-t' && i + 1 < words.length) {
      result.data.tag = words[++i];
      continue;
    }

    if (param === '-g' && i + 1 < words.length) {
      result.data.filter = words[++i];
      continue;
    }

    if (param === '--since' && i + 1 < words.length) {
      result.data.since = new Date(Date.parse(words[++i].replaceAll('"', '')));
      continue;
    }

    if (param === '--until' && i + 1 < words.length) {
      result.data.until = new Date(Date.parse(words[++i].replaceAll('"', '')));
    }
  }
  if (!result.data.since) {
    result.data.since = new Date(new Date().getTime() - 2 * 60 * 60 * 1000);
  }
  if (!result.data.until) {
    result.data.until = new Date();
  }
  return result;
}

function sendDataToServer(words) {
  let data = parseLogCommand(words);
  if (!data.data.tag && !data.data.service) {
    term.writeln('\r\n**Необходимо указать хотя бы один из параметров -u или -t');
    writePrimpt();
    return;
  }
  if (!isValidDate(data.data.since) || !isValidDate(data.data.until)) {
    term.writeln('\r\n**Неверный формат даты!');
    writePrimpt();
    return;
  }
  if (isOnline) {
    isSendingCommand = true;
    wsService.send(data);
  } else {
    term.writeln('\r\n**Сервер не доступен!');
  }
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

function writePrimpt() {
  term.write('\r\n' + PROMPT);
}
</script>

<style scoped>
.terminal-container {
  width: 70vw;
  height: 80vh;
  background-color: #1e1e1e;
  padding: 10px;
  box-sizing: border-box;
}
</style>
