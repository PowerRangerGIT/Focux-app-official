let timer;
let timeLeft;
let isWorkTime = true;
let isRunning = false;
let isAlwaysOnTop = false;

// Audio Control Functions
const whiteNoiseBtn = document.getElementById('whiteNoiseBtn');
const brownNoiseBtn = document.getElementById('brownNoiseBtn');
const whiteNoiseAudio = document.getElementById('whiteNoiseAudio');
const brownNoiseAudio = document.getElementById('brownNoiseAudio');

whiteNoiseBtn.addEventListener('click', () => toggleAudio(whiteNoiseAudio, whiteNoiseBtn));
brownNoiseBtn.addEventListener('click', () => toggleAudio(brownNoiseAudio, brownNoiseBtn));

function toggleAudio(audio, button) {
    if (audio.paused) {
        audio.play().then(() => {
            button.classList.remove('btn-outline-success');
            button.classList.add('active');
            button.innerHTML = `<i class="bi bi-volume-up-fill"></i> ${button.textContent.trim()}`;
        }).catch(error => {
            console.error('Error playing audio:', error);
        });
    } else {
        audio.pause();
        button.classList.remove('active');
        button.classList.add('btn-outline-success');
        button.innerHTML = `<i class="bi bi-volume-up"></i> ${button.textContent.trim()}`;
    }
}

// Stay on Top Functionality
document.getElementById('stayOnTopBtn').addEventListener('click', function() {
    isAlwaysOnTop = !isAlwaysOnTop;
    if (isAlwaysOnTop) {
        this.classList.remove('btn-outline-primary');
        this.classList.add('btn-primary');
        this.innerHTML = '<i class="bi bi-pin-angle-fill"></i> Siempre visible';
    } else {
        this.classList.remove('btn-primary');
        this.classList.add('btn-outline-primary');
        this.innerHTML = '<i class="bi bi-pin-angle"></i> Mantener en primer plano';
    }
    
    // Usar la API de Electron para mantener la ventana siempre visible
    if (window.electronAPI) {
        window.electronAPI.setAlwaysOnTop(isAlwaysOnTop);
    } else {
        console.log('Always on top functionality is only available in the desktop app');
    }
});

// Pomodoro Timer Functions
document.getElementById('startButton').addEventListener('click', function() {
    if (isRunning) {
        pauseTimer();
        this.textContent = 'Continuar';
    } else {
        startTimer();
        this.textContent = 'Pausar';
    }
});

document.getElementById('resetButton').addEventListener('click', function() {
    resetTimer();
});

function startTimer() {
    if (!isRunning) {
        const workMinutes = parseInt(document.getElementById('workTimeInput').value);
        const breakMinutes = parseInt(document.getElementById('breakTimeInput').value);
        
        if (isNaN(workMinutes) || workMinutes <= 0 || isNaN(breakMinutes) || breakMinutes <= 0) {
            alert('Por favor ingrese tiempos válidos');
            return;
        }

        if (timer) {
            clearInterval(timer);
        }

        timeLeft = (isWorkTime ? workMinutes : breakMinutes) * 60;
        updateDisplay();
        updateStatus();
        
        timer = setInterval(function() {
            timeLeft--;
            updateDisplay();

            if (timeLeft <= 0) {
                clearInterval(timer);
                isWorkTime = !isWorkTime;
                if (isWorkTime) {
                    alert('¡Tiempo de descanso terminado! ¡A trabajar!');
                } else {
                    alert('¡Tiempo de trabajo terminado! ¡A descansar!');
                }
                startTimer();
            }
        }, 1000);
        
        isRunning = true;
    }
}

function pauseTimer() {
    if (timer) {
        clearInterval(timer);
        isRunning = false;
    }
}

function resetTimer() {
    if (timer) {
        clearInterval(timer);
    }
    isWorkTime = true;
    isRunning = false;
    document.getElementById('startButton').textContent = 'Iniciar';
    updateStatus();
    updateDisplay();
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    const displayMinutes = minutes.toString().padStart(2, '0');
    const displaySeconds = seconds.toString().padStart(2, '0');
    
    document.getElementById('timer').textContent = `${displayMinutes}:${displaySeconds}`;
}

function updateStatus() {
    document.getElementById('timerStatus').textContent = isWorkTime ? 'Tiempo de Trabajo' : 'Tiempo de Descanso';
}

// Task List Functions
document.getElementById('addTaskButton').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        return;
    }

    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input me-2';
    
    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = taskText;
    
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            // Agregar animación de desvanecimiento
            li.style.transition = 'opacity 0.5s';
            li.style.opacity = '0';
            
            // Eliminar la tarea después de la animación
            setTimeout(() => {
                taskList.removeChild(li);
            }, 500);
        }
    });
    
    li.appendChild(checkbox);
    li.appendChild(taskTextSpan);
    taskList.appendChild(li);
    
    // Limpiar el input
    taskInput.value = '';
    taskInput.focus();
}

// Initialize the display
updateDisplay(); 