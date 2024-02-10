const container = document.getElementById('container');
const songAnswer = document.getElementById('answer');
let audioPlayer;
let scoreBuffer = 0;
let score;
let songName;
let intervalId;
let currentIndex = 0;
let cells = [];

let quantity = prompt('Сколько команд играет?', 2);
addTeam(quantity);

function createTable() {
    fetch('assets/music/pack/SongList.txt')
    .then(response => response.text())
    .then(data => {
        const sections = data.split(/\d+\.\s/).filter(Boolean);
        const table = document.createElement('table');
        table.setAttribute('cellspacing', '15');

        sections.forEach((section, index) => {
            const lines = section.trim().split('\n');
            const tr = document.createElement('tr');
            tr.setAttribute('id', `line${index + 1}`);

            const td1 = document.createElement('td');
            td1.setAttribute('id', 'choosenLine');
            td1.textContent = lines[0];
            td1.addEventListener('click', function() {
                stopHighlighting();
                playSound('assets/music/game_sounds/choosenLine.mp3');
            })
            tr.appendChild(td1);
            cells.push(td1);

            for (let i = 1; i < lines.length; i++) {
                const match = lines[i].match(/(.+) \((\d+)\)/);
                if (match) {
                    const name = match[1];
                    const points = match[2];

                    const td = document.createElement('td');
                    td.setAttribute('name', name);
                    td.textContent = points;
                    td.addEventListener('click', function() {
                        stopHighlighting();
                        scoreBuffer = parseInt(points);
                        songName = name;

                        changeStyle(td);
                        playSound('assets/music/game_sounds/note.mp3', function() {
                            playSound('assets/music/pack/' + name + '.mp3');
                        });
                        addAnswer('');
                    })
                    tr.appendChild(td);
                }
            }

            table.appendChild(tr);
        });

        container.parentNode.insertBefore(table, container.nextSibling);
        startHighlighting();
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
}

function changeStyle(elem) {
    elem.classList.toggle("clicked");
}

function addTeam(num) {
    for (let i = 1; i <= num; i++) {
        let teamDiv = document.createElement('div');
        let teamName = document.createElement('h1');
        let teamScore = document.createElement('h2');
        let teamImage = document.createElement('img');

        teamDiv.id = 'team' + i;
        promptName = prompt("Как зовут команду №" + i, 'Команда ' + i);
        teamName.textContent = promptName;
        teamScore.id = "score" + i;
        teamScore.textContent = '0000';

        teamImage.src = 'assets/img/img' + i + '.jpg';
        teamImage.alt = 'Команда ' + i + ' логотип';

        teamDiv.appendChild(teamImage);
        teamDiv.appendChild(teamName);
        teamDiv.appendChild(teamScore);
        container.appendChild(teamDiv);
    }
}

function playSound(path, callback) {
    stopSound();
    audioPlayer = new Audio(path);
    audioPlayer.onended = callback;
    audioPlayer.play();
}

function stopSound() {
    if (audioPlayer instanceof Audio && !audioPlayer.paused) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }
};

function addAnswer(name) {
    if (name === '') {
        songAnswer.textContent = 'Answer';
        songAnswer.style.color = 'transparent';
    } else {
        songAnswer.textContent = name;
        songAnswer.style.color = 'white';
    }
}

function highlightNextCell() {
    cells[currentIndex].classList.remove('highlight');
    currentIndex = (currentIndex + 1) % cells.length;
    cells[currentIndex].classList.add('highlight');
}

function startHighlighting() {
    stopHighlighting();
    intervalId = setInterval(highlightNextCell, 550);
}

function stopHighlighting() {
    clearInterval(intervalId);
    cells[currentIndex].classList.remove('highlight');
    currentIndex = 0;
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'BracketLeft') {
        const melodyPath = 'assets/music/game_sounds/opening.mp3';

        playSound(melodyPath);
    }
});

document.addEventListener('keydown', function(event) {
    if (event.code === 'BracketRight') {
        const melodyPath = 'assets/music/game_sounds/ending.mp3';

        playSound(melodyPath);
    }
});

document.addEventListener('keydown', function(event) {
        if (event.code === 'Numpad1') {
            const melodyPath = 'assets/music/game_sounds/choosenTeam.mp3';
    
            score = document.getElementById('score1');
            
            

            playSound(melodyPath);
        }
});

document.addEventListener('keydown', function(event) {
    if (event.code === 'Numpad2') {
        const melodyPath = 'assets/music/game_sounds/choosenTeam.mp3';

        score = document.getElementById('score2');
        
        

        playSound(melodyPath);
    }
});

document.addEventListener('keydown', function(event) {
    if (event.code === 'Enter') {
        const melodyPath = 'assets/music/game_sounds/rightAnswer.mp3';
        const currentScore = score.textContent;
        const newScore = (parseInt(currentScore) + scoreBuffer).toString();
        score.textContent = newScore;

        playSound(melodyPath);
        addAnswer(songName);
        startHighlighting();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.code === 'Numpad0') {
        const melodyPath = 'assets/music/game_sounds/wrongAnswer.mp3';

        scoreBuffer = 0;
        playSound(melodyPath);
        addAnswer(songName);
    }
});

document.addEventListener('keydown', function(event) {
    if (event.code === 'Backspace') {
        stopSound();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.code === 'KeyR') {
        playSound('assets/music/pack/' + songName + '.mp3');
    }
})

createTable();