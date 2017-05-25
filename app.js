var canvas;
var canvasContext;

var ballX = 50;
var ballY = 50;

var ballSpeedX = 10;
var ballSpeedY = 4;

var paddle1Y = 250;
var paddle2Y = 250;
const WINNING_SCORE = 5;

var showingWinScreen = false;

const PADDLE_HEIGHT = 200;
const PADDLE_WIDTH = 10;

var player1Score = 0;
var player2Score = 0;

function calculateMousePosition(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;

  return {
    x: mouseX,
    y: mouseY
  };
}

function handleMouseClick(evt) {
  if(showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvas.width  = window.innerWidth * 0.7;
  canvas.height = window.innerHeight * 0.7;
  canvasContext = canvas.getContext("2d");
  var framesPerSecond = 30;
  setInterval(function () {
    moveEveything();
    drawEverything();
  }, 1000 / framesPerSecond);

  canvas.addEventListener('mousemove', function (evt) {
    var mousePos = calculateMousePosition(evt);
    paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
  });

  canvas.addEventListener('mousedown', handleMouseClick);
}

function computerMovement() {
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 6;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 6;
  }
}

function moveEveything() {
  if (showingWinScreen) {
    return;
  }
  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;
  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;

    } else {
      player1Score++;
      ballReset();
    }
  }

  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;

    } else {
      player2Score++;
      ballReset();
    }
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
}

function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function drawNet() {
  for(var i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
  }
}

function drawEverything() {
  //Blanks out the screen
  colorRect(0, 0, canvas.width, canvas.height, "black");
    canvasContext.fillStyle = "White";
  if (showingWinScreen) {
    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillText("PLAYER WON!", canvas.width/2 - 9, canvas.height/2 - 100);
    } else if(player2Score >= WINNING_SCORE) {
      canvasContext.fillText("COMPUTER WON", canvas.width/2 - 9, canvas.height/2 - 100);
    }
    canvasContext.fillText("CLICK TO CONTINUE", canvas.width/2 - 9, canvas.height/2);
    return;
  }
  drawNet();
  //Left Player Paddle
  colorRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, "white");

  //Right Computer Paddle
  colorRect(canvas.width - PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, "white");

  //Ball
  colorCircle(ballX, ballY, 10, "white");

  canvasContext.font = "20px monospace";
  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

function colorRect(leftX, TopY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, TopY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
  canvasContext.fill();
  canvasContext.closePath();
}
