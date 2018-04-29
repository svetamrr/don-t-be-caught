var GAME_AREA_WIDTH = 800;
var GAME_AREA_HEIGHT = 550;
var area = document.getElementById('game-area');
var rect = area.getBoundingClientRect();
var allSquares = [];
var colors = ['#F08080', '#DC143C', '#FF0000', '#FF4500', '#FFD700', '#BA55D3', '#9400D3', '#483D8B', '#32CD32', '#20B2AA', '#008B8B', '#000080', '#708090', '#ADFF2F', '#00FF00', '#C71585', '#800080'];

var timer = document.getElementById('timer').getElementsByClassName('timer-inner')[0];
var allBonus = document.getElementById('bonus').getElementsByClassName('bonus-inner')[0];
var bonus = 0;
var newResult = {};

var audioDisplaySquare = new Audio(["../dev/audio/sent.mp3"]);
var audioWhenSquareTouched = new Audio(["../dev/audio/boom.WAV"]);

var startGameTime = null;
var timeWhenGameWasStarted = null;
var isSquareTouched = false;

var ObjectPlayer = new Player();
ObjectPlayer.show();
ObjectPlayer.move();

function startCountdown() {
  var count = 3;
  hideStartButton();
  animateCountdown(count)
  count -= 1;

  var countdown = setInterval(function() {
    if (count > 0) {
      animateCountdown(count);
      count -= 1;
    } else {
      clearInterval(countdown);
      startGame();
      showEndGameButton();
    }
  }, 1000);
}

function startGame() {
  clickSoundInit();
  setTimeWhenGameWasStarted();
  computeGameNextState();
}

function computeGameNextState() {
  if (isSquareTouched) return;
  requestAnimationFrame(state);
}

function state() {
  if (!startGameTime || Date.now() - startGameTime > 5000) {
    createAndDisplaySquare();
    startGameTime = Date.now();
  }

  updateSquaresPosition();
  updateTime();
  updateBonus();
  computeGameNextState();
}

function Squares() {
  this.size = null
  this.posX = null;
  this.posY = null;
  this.speedX = 3;
  this.speedY = 3;
  this.color = 'black';
  this.square = null;

  this.prepare = function() {
    this.size = randomNumbersWithinSpecificRange(10, 50);
    this.posX = randomNumbersWithinSpecificRange(50, GAME_AREA_WIDTH - 50);
    this.posY = randomNumbersWithinSpecificRange(50, GAME_AREA_HEIGHT - 50);
    this.color = colors[randomNumbersWithinSpecificRange(0, colors.length - 1)];
  };

  this.spawn = function() {
    this.square = document.createElement('div');
    this.square.style.width = this.size + 'px';
    this.square.style.height = this.size + 'px';
    this.square.style.background = this.color;
    this.square.style.position = 'absolute';
    this.square.style.top = this.posY + 'px';
    this.square.style.left = this.posX + 'px';
    area.appendChild(this.square);
  };

  this.update = function() {
    this.posY += this.speedY;
    this.posX += this.speedX;

    if (this.posX + this.size > GAME_AREA_WIDTH) {
      this.speedX = -this.speedX;
      this.posX = GAME_AREA_WIDTH - this.size;
    }

    if (this.posX < 0) {
      this.speedX = -this.speedX;
      this.posX = 0;
    }

    if (this.posY + this.size > GAME_AREA_HEIGHT) {
      this.speedY = -this.speedY;
      this.posY = GAME_AREA_HEIGHT - this.size;
    }

    if (this.posY < 0) {
      this.speedY = -this.speedY;
      this.posY = 0;
    }

    this.square.style.top = this.posY + 'px';
    this.square.style.left = this.posX + 'px';
  }
}

function Player() {
  var that = this;
  this.width = 20;
  this.height = 20;
  this.posX = null;
  this.posY = null;
  this.color = "black";
  this.ObjectPlayer = null;

  this.show = function() {
    this.ObjectPlayer = document.createElement('div');
    this.ObjectPlayer.className = 'gamer';
    this.ObjectPlayer.style.width = this.width + 'px';
    this.ObjectPlayer.style.height = this.height + 'px';
    this.ObjectPlayer.style.background = this.color;
    this.ObjectPlayer.style.borderRadius = '50%';
    this.ObjectPlayer.style.position = 'absolute';
    this.ObjectPlayer.style.top = this.posY + 'px';
    this.ObjectPlayer.style.left = this.posX + 'px';
    area.appendChild(this.ObjectPlayer);
  };

  this.move = function() {
    document.addEventListener('mousemove', function(event) {
      that.posX = event.pageX - rect.left - that.width / 2;
      if (that.posX + that.width > GAME_AREA_WIDTH) {
        that.posX = GAME_AREA_WIDTH - that.width;
      } else if (that.posX < 0) {
        that.posX = 0;
      }

      that.posY = event.pageY - rect.top - that.height / 2;
      if (that.posY + that.height > GAME_AREA_HEIGHT) {
        that.posY = GAME_AREA_HEIGHT - that.height;
      } else if (that.posY < 0) {
        that.posY = 0;
      }

      that.ObjectPlayer.style.top = that.posY + 'px';
      that.ObjectPlayer.style.left = that.posX + 'px';
    }, false);
  }
}

function updateTime() {
  var timeDifference = new Date() - timeWhenGameWasStarted;
  var minutesAndSeconds = millisToMinutesAndSeconds(timeDifference);
  timer.innerHTML =  minutesAndSeconds;
}

function addZero(i) {
  if (i < 10) {
      i = "0" + i;
  }
  return i;
}

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + addZero(seconds);
}

function updateBonus() {
  allBonus.innerHTML = bonus;
  if (startGameTime > 1000) {
    bonus += 1;
  }
}

function createAndDisplaySquare() {
  var newSquare = new Squares();
  allSquares.push(newSquare);
  newSquare.prepare();
  clickSoundDisplaySquare();
  newSquare.spawn();
  newSquare.square.addEventListener('mouseover', endGame, false);
}

function updateSquaresPosition() {
  var length = allSquares.length;
  for (var i = 0; i <= length; i++) {
    if (allSquares[i]) {
      allSquares[i].update();
    }
  }
}

function clickSoundInit() {
    audioDisplaySquare.play(); 
    audioDisplaySquare.pause(); 
    audioWhenSquareTouched.play();
    audioWhenSquareTouched.pause();
}

function clickSoundDisplaySquare() {
    audioDisplaySquare.currentTime = 0;   
    audioDisplaySquare.play();
}

function clickSoundWhenSquareTouched() {
    audioWhenSquareTouched.currentTime = 0;
    audioWhenSquareTouched.play();
}

function randomNumbersWithinSpecificRange(from, to) {
  return Math.floor(Math.random() * (to - from + 1)) + from;
}

function setTimeWhenGameWasStarted() {
  timeWhenGameWasStarted = new Date();
}

function animateCountdown(count) {
  $("#countdown p").text(count);
  $("#countdown p").animate({ opacity: 1 }, 500, function() {
    $("#countdown p").animate({ opacity: 0 }, 500);
  });
}

function hideStartButton() {
  $('#start-game').attr('disabled', true);
  $('#start-game').fadeOut('slow');
}

function showEndGameButton() {
  $('#end-game').fadeIn('slow');
}

function endGame() {
  isSquareTouched = true;
  clickSoundWhenSquareTouched();
  computeGameNextState();
  openModalWindow();
}


function openModalWindow() {
  var modal = document.getElementById('modal');
  modal.style.display = 'block';
}

function closeModalWindow(response) {
  var modal = document.getElementById('modal');
  var saveButton = document.getElementById('save-button');
  modal.style.display = 'none';
  saveButton.disabled = false;
  window.location.reload();
}

function saveResult() {
  var username = document.getElementById('username').value;
  var warning = document.getElementsByClassName('warning')[0];
  var saveButton = document.getElementById('save-button');
  if (username == '') {
    warning.style.display = 'block';
    return;
  }

  warning.style.display = 'none';
  saveButton.disabled = true;
  newResult = {
    name: username,
    score: bonus
  };
  getLeaderboard(saveResultToLeaderboard);
}

window.addEventListener('resize', function() {
  rect = area.getBoundingClientRect();
});

window.onbeforeunload = function(e) {
  var dialogText = 'Your progress can be lost. Are you sure you want to leave this page?';
  e.returnValue = dialogText;
  return dialogText;
};

// SPA control

window.onhashchange = switchToStateFromUrlHash;

function switchToStateFromUrlHash() {
  var page = window.location.hash.substr(1);
  if (page == '') {
    page = 'main';
  }

  switch (page) {
    case 'main':
      document.getElementById('screen').style.display = 'block';
      document.getElementById('rules').style.display = 'none';
      document.getElementById('leaderboard').style.display = 'none';
      break;
    case 'rules':
      document.getElementById('rules').style.display = 'block';
      document.getElementById('leaderboard').style.display = 'none';
      document.getElementById('screen').style.display = 'none';
      break;
    case 'leaderboard':
      getLeaderboard(parseLeaderboardData);
      document.getElementById('leaderboard').style.display = 'block';
      document.getElementById('rules').style.display = 'none';
      document.getElementById('screen').style.display = 'none';
      break;
    default:
      document.getElementById('screen').style.display = 'block';
      document.getElementById('rules').style.display = 'none';
      document.getElementById('leaderboard').style.display = 'none';
      break;
  }
}

switchToStateFromUrlHash();

// ajax

var AjaxHandlerScript = "http://fe.it-academy.by/AjaxStringStorage2.php";

function getLeaderboard(callback) {
  $.ajax({
    url: AjaxHandlerScript,
    type: 'POST',
    data: {
      f: 'READ',
      n: 'SVETLANA_MARKELOVA_LEADERBOARD'
    },
    cache: false,
    success: callback,
    error: errorHandler
  });
}

function saveResultToLeaderboard(response) {
  var result = response.result;
  if (result !== '') {
    result = JSON.parse(result);
    result.push(newResult);
    result = JSON.stringify(result);
    unlockAndUpdateLeaderboard(result);
  } else {
    result = [];
    result.push(newResult);
    result = JSON.stringify(result);
    insertLeaderboardData(result);
  }
}

function insertLeaderboardData(result) {
  $.ajax({
    url: AjaxHandlerScript,
    type: 'POST',
    data: {
      f: 'INSERT',
      n: 'SVETLANA_MARKELOVA_LEADERBOARD',
      v: result
    },
    cache: false,
    success: closeModalWindow,
    error: errorHandler
  });
}

function unlockAndUpdateLeaderboard(result) {
  var password = 'vasyapupkin';
  $.ajax({
    url: AjaxHandlerScript,
    type: 'POST',
    data: {
      f: 'LOCKGET',
      n: 'SVETLANA_MARKELOVA_LEADERBOARD',
      p: password
    },
    cache: false,
    success: function() {
      $.ajax({
        url: AjaxHandlerScript,
        type: 'POST',
        data: {
          f: 'UPDATE',
          n: 'SVETLANA_MARKELOVA_LEADERBOARD',
          v: result,
          p: password
        },
        cache: false,
        success: closeModalWindow,
        error: errorHandler
      })
    },
    error: errorHandler
  })
}

function parseLeaderboardData(response) {
  var data = response.result;
  var leaderboard = document.getElementById('leaderboard');
  leaderboard.innerHTML = "";

  if (data == '') {
    leaderboard.innerHTML = "There are no high scores yet.";
  } else {
    data = JSON.parse(data);
    data.sort(sortScoreArray);
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tr = document.createElement('tr');
    var tdPlace = document.createElement('td');
    var tdName = document.createElement('td');
    var tdScore = document.createElement('td');
    table.className = 'leaderboard-table';
    tdPlace.innerHTML = "Place";
    tdName.innerHTML = "Name";
    tdScore.innerHTML = "Result ";
    tr.appendChild(tdPlace);
    tr.appendChild(tdName);
    tr.appendChild(tdScore);
    thead.appendChild(tr);
    table.appendChild(thead);
    var tbody = document.createElement('tbody');

    for (var i = 0; i < data.length; i++) {
      tr = document.createElement('tr');
      tdPlace = document.createElement('td');
      tdName = document.createElement('td');
      tdScore = document.createElement('td');
      tdPlace.innerHTML = i + 1;
      tdName.innerHTML = data[i].name;
      tdScore.innerHTML = data[i].score;
      tr.appendChild(tdPlace);
      tr.appendChild(tdName);
      tr.appendChild(tdScore);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    leaderboard.appendChild(table);
  }
}

function sortScoreArray(a, b) {
  if (a.score > b.score) return -1;
  if (a.score < b.score) return 1;
}

function errorHandler() {
  alert("Sorry, error has occured!");
  closeModalWindow();
}
