let pomodoroTime = 25 * 60;
let shortBreakTime = 5 * 60;
let longBreakTime = 15 * 60;
let intervalsBeforeLongBreak = 4;
let intervalCount = 0;

let currentMode = 'pomodoro';
let timerInterval;
let timeLeft = pomodoroTime;

const timerElement = document.getElementById('timer');
const pomodoroTab = document.getElementById('pomodoro');
const shortBreakTab = document.getElementById('shortBreak');
const longBreakTab = document.getElementById('longBreak');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsContainer = document.getElementById('settingsContainer');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const pomodoroTimeInput = document.getElementById('pomodoroTimeInput');
const shortBreakTimeInput = document.getElementById('shortBreakTimeInput');
const longBreakTimeInput = document.getElementById('longBreakTimeInput');
const intervalsBeforeLongBreakInput = document.getElementById('intervalsBeforeLongBreakInput');

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function switchMode(mode) {
    clearInterval(timerInterval);
    [pomodoroTab, shortBreakTab, longBreakTab].forEach(tab => tab.classList.remove('active-tab'));

    currentMode = mode;
    if (mode === 'pomodoro') {
        timeLeft = pomodoroTime;
        pomodoroTab.classList.add('active-tab');
    } else if (mode === 'shortBreak') {
        timeLeft = shortBreakTime;
        shortBreakTab.classList.add('active-tab');
    } else if (mode === 'longBreak') {
        timeLeft = longBreakTime;
        longBreakTab.classList.add('active-tab');
    }

    updateTimerDisplay();
    saveToLocalStorage();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('Time is up!');
            markTodosAsCompleted();
            handleNextTimer();
        }
        saveToLocalStorage();
    }, 1000);
}

function handleNextTimer() {
    if (currentMode === 'pomodoro') {
        intervalCount++;
        if (intervalCount >= intervalsBeforeLongBreak) {
            switchMode('longBreak');
            intervalCount = 0;
        } else {
            switchMode('shortBreak');
        }
    } else {
        switchMode('pomodoro');
    }
    startTimer();
}

function toggleStartPause() {
    if (startPauseBtn.textContent === 'Start') {
        startTimer();
        startPauseBtn.textContent = 'Pause';
        startPauseBtn.classList.remove('btn-success');
        startPauseBtn.classList.add('btn-secondary');
    } else {
        clearInterval(timerInterval);
        startPauseBtn.textContent = 'Start';
        startPauseBtn.classList.remove('btn-secondary');
        startPauseBtn.classList.add('btn-success');
    }
}

function resetTimer() {
    switchMode(currentMode);
    startPauseBtn.textContent = 'Start';
    startPauseBtn.classList.remove('btn-secondary');
    startPauseBtn.classList.add('btn-success');
}

function openSettings() {
    settingsContainer.style.display = 'block';
}

function closeSettings() {
    settingsContainer.style.display = 'none';
}

function saveSettings() {
    pomodoroTime = parseInt(pomodoroTimeInput.value) * 60;
    shortBreakTime = parseInt(shortBreakTimeInput.value) * 60;
    longBreakTime = parseInt(longBreakTimeInput.value) * 60;
    intervalsBeforeLongBreak = parseInt(intervalsBeforeLongBreakInput.value);
    saveToLocalStorage();
    closeSettings();
    switchMode(currentMode);
}

function markTodosAsCompleted() {
    document.querySelectorAll('#todoList li').forEach(item => {
        item.classList.add('completed');
    });
    saveToLocalStorage();
}

pomodoroTab.addEventListener('click', () => switchMode('pomodoro'));
shortBreakTab.addEventListener('click', () => switchMode('shortBreak'));
longBreakTab.addEventListener('click', () => switchMode('longBreak'));
startPauseBtn.addEventListener('click', toggleStartPause);
resetBtn.addEventListener('click', resetTimer);
settingsBtn.addEventListener('click', openSettings);
closeSettingsBtn.addEventListener('click', closeSettings);
saveSettingsBtn.addEventListener('click', saveSettings);

// To-Do List functionality
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');

function saveToLocalStorage() {
    const todos = [];
    document.querySelectorAll('#todoList li').forEach(item => {
        todos.push({
            text: item.textContent.replace('✔', '').trim(),
            completed: item.classList.contains('completed')
        });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('timeLeft', timeLeft);
    localStorage.setItem('currentMode', currentMode);
    localStorage.setItem('pomodoroTime', pomodoroTime);
    localStorage.setItem('shortBreakTime', shortBreakTime);
    localStorage.setItem('longBreakTime', longBreakTime);
    localStorage.setItem('intervalsBeforeLongBreak', intervalsBeforeLongBreak);
    localStorage.setItem('intervalCount', intervalCount);
}

function loadFromLocalStorage() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.textContent = todo.text;
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        if (todo.completed) {
            listItem.classList.add('completed');
        }

        const checkBtn = document.createElement('button');
        checkBtn.textContent = '✔';
        checkBtn.className = 'btn btn-success btn-sm';
        checkBtn.addEventListener('click', () => {
            listItem.classList.toggle('completed');
            saveToLocalStorage();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.addEventListener('click', () => {
            listItem.remove();
            saveToLocalStorage();
        });

        listItem.appendChild(checkBtn);
        listItem.appendChild(deleteBtn);
        todoList.appendChild(listItem);
    });

    timeLeft = parseInt(localStorage.getItem('timeLeft')) || pomodoroTime;
    currentMode = localStorage.getItem('currentMode') || 'pomodoro';
    pomodoroTime = parseInt(localStorage.getItem('pomodoroTime')) || 25 * 60;
    shortBreakTime = parseInt(localStorage.getItem('shortBreakTime')) || 5 * 60;
    longBreakTime = parseInt(localStorage.getItem('longBreakTime')) || 15 * 60;
    intervalsBeforeLongBreak = parseInt(localStorage.getItem('intervalsBeforeLongBreak')) || 4;
    intervalCount = parseInt(localStorage.getItem('intervalCount')) || 0;
    pomodoroTimeInput.value = pomodoroTime / 60;
    shortBreakTimeInput.value = shortBreakTime / 60;
    longBreakTimeInput.value = longBreakTime / 60;
    intervalsBeforeLongBreakInput.value = intervalsBeforeLongBreak;
    switchMode(currentMode);
    updateTimerDisplay();
}

document.getElementById('addTodoBtn').addEventListener('click', () => {
    const task = todoInput.value.trim();
    if (task) {
        const listItem = document.createElement('li');
        listItem.textContent = task;
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

        const checkBtn = document.createElement('button');
        checkBtn.textContent = '✔';
        checkBtn.className = 'btn btn-success btn-sm';
        checkBtn.addEventListener('click', () => {
            listItem.classList.toggle('completed');
            saveToLocalStorage();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.addEventListener('click', () => {
            listItem.remove();
            saveToLocalStorage();
        });

        listItem.appendChild(checkBtn);
        listItem.appendChild(deleteBtn);
        todoList.appendChild(listItem);
        todoInput.value = '';
        saveToLocalStorage();
    }
});

loadFromLocalStorage();
updateTimerDisplay();
