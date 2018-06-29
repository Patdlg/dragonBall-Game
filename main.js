var ctx = document.getElementById('ctx').getContext('2d');
var gokuOne = new Image();
var gokuTwo = new Image();
var gokuThree = new Image();
var gokuFour = new Image();
var background = new Image();
var blood = new Image();
var dollar = new Image();
var dragonball = new Image();
var eth = new Image();


// Global Variables
var score = 0;
var level = 100;
var animation = 0;
var dragonballTimer = 0;
var ethTimer = 0;
var gameover = false;
var intervalVar;
var paused;
var dragonballList = [];
var dollarList = [];
var ethList = [];
var dragonballDrop = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450];

var dollarObject = {
  'height': 20,
  'width': 50
};

var goku = {
  'x': 100,
  'y': 350,
  'width': 40,
  'height': 50,
  'jump': 0, // How many pixels will it go up?
  'onair': false, // Whether the goku is already in the air
  'jumpUnit': 5, // Go up or down per frame
  'spd': 0,
  'leftPressed': false,
  'rightPressed': false,
  'gravity': 10,
  'safe': true
};


var dragonballObject = {
  'height': 50,
  'width': 50,
  'spd': 3
};


var ethObject = {
  'height': 40,
  'width': 40,
  'spd': 3
}

sound = function (src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  }
  this.stop = function () {
    this.sound.pause();
  }
}

var backgroundSound = new sound("dbz.mp3");
var eatingSound = new sound("eat.mp3");
var droppingSound = new sound("drop.mp3");

background.onload = function () {
  blood.onload = function () {
    gokuOne.onload = function () {
      gokuTwo.onload = function () {
        gokuThree.onload = function () {
          gokuFour.onload = function () {
            dragonball.onload = function () {
              dollar.onload = function () {
                eth.onload = function () {

                  ctx.drawImage(background, 0, 0, 500, 500);
                  ctx.fillStyle = "#FFFFFF";
                  ctx.font = "30px Calibri"
                  ctx.fillText("Click here to start the game", 80, 250);

                  drawObject = function (object, x, y, width, height) {
                    ctx.drawImage(object, x, y, width, height);
                  }

                  document.getElementById('ctx').onmousedown = function () {
                    if (!gameover) {
                      clearInterval(intervalVar);
                    }
                    startGame();
                  }


                  document.onkeydown = function (event) {
                    if (event.keyCode == 37 && goku.x > 0) {
                      goku.spd = -5;
                      goku.leftPressed = true;
                    }
                    if (event.keyCode == 39 && goku.x < 500 - goku.width) {
                      goku.spd = 5;
                      goku.rightPressed = true;
                    }
                    if (event.keyCode == 38 && !goku.onair && goku.y == 350) {
                      if (!goku.onair) {
                        goku.jump = 100;
                        goku.onair = true;
                      }
                    }
                    if (event.keyCode == 32) {
                      if (paused)
                        paused = false;
                      else
                        paused = true;
                    }
                  }

                  document.onkeyup = function (event) {
                    if (event.keyCode == 37) {
                      goku.leftPressed = false;
                    }
                    if (event.keyCode == 39) {
                      goku.rightPressed = false;
                    }
                  }

                  dragonball_goku_collision = function (f) {
                    return ((f.x < goku.x + goku.width) &&
                      (goku.x < f.x + dragonballObject.width) &&
                      (f.y < goku.y + goku.height) &&
                      (goku.y < f.y + dragonballObject.height));
                  }

                  dragonball_dollar_collision = function (f, t) {
                    return ((f.x < t.x + dollarObject.width) &&
                      (t.x < f.x + dragonballObject.width) &&
                      (f.y < t.y + dollarObject.height) &&
                      (t.y < f.y + dragonballObject.height));
                  }

                  eth_goku_collision = function (f) {
                    return ((f.x < goku.x + goku.width) &&
                      (goku.x < f.x + ethObject.width) &&
                      (f.y < goku.y + goku.height) &&
                      (goku.y < f.y + ethObject.height));
                  }


                  goku_dollar_collision = function (t) {
                    return ((goku.x <= t.x + dollarObject.width) &&
                      (t.x <= goku.x + goku.width) &&
                      (goku.y + goku.height <= t.y));
                  }


                  jump = function () {
                    // Moving up
                    if (goku.jump > 0 && goku.onair) {
                      goku.y -= goku.jumpUnit;
                      goku.jump -= goku.jumpUnit;
                    }
                    if (goku.jump <= 0 && goku.jump > -100 && goku.onair) {
                      goku.y += goku.jumpUnit;
                      goku.jump -= goku.jumpUnit;
                    }
                    if (goku.jump <= -100 && goku.onair) {
                      goku.onair = false;
                    }
                  }

                  updateDragonballPosition = function () {
                    for (var i in dragonballList) {
                      if (dragonballList[i].y > 500) {
                        dragonballList.splice(i, 1);
                      }
                      else {
                        dragonballList[i].y += dragonballObject.spd;
                      }
                    }
                  }

                  updateEthPosition = function () {
                    for (var i in ethList) {
                      if (ethList[i].y > 500) {
                        ethList.splice(i, 1);
                      }
                      else {
                        ethList[i].y += ethObject.spd;
                      }
                    }
                  }

                  updateGokuPosition = function () {
                    if (goku.leftPressed && goku.x > 0) {
                      goku.x += goku.spd;
                    }
                    if (goku.rightPressed && goku.x < 500 - goku.width) {
                      goku.x += goku.spd;
                    }
                    if (goku.y > 450) {
                      gameover = true;
                      goku.y = 450;
                      droppingSound.play();

                    }
                  }

                  gameOver = function () {
                    ctx.save();
                    ctx.globalAlpha = 0.8;
                    drawObject(blood, 100, 100, 300, 300);
                    ctx.globalAlpha = 1.0;
                    ctx.fillStyle = "black";
                    ctx.font = "33px Calibri"
                    ctx.fillText("Game Over", 180, 155);
                    ctx.fillText("Next Player", 160, 280);
                    ctx.restore();
                    clearInterval(intervalVar);
                  }

                  updatePosition = function () {
                    if (!paused) {
                      ctx.clearRect(0, 0, 500, 500);
                      ctx.drawImage(background, 0, 0, 500, 500);
                      dragonballTimer++;
                      ethTimer++;

                      if (dragonballTimer > level) {
                        dragonballList.push({ 'x': dragonballDrop[Math.round(Math.random() * 9)], 'y': 0 });
                        dragonballTimer = 0;
                      }

                      if (ethTimer > 3 * level) {
                        ethList.push({ 'x': dragonballDrop[Math.round(Math.random() * 9)], 'y': -25 });
                        ethTimer = 0;
                      }

                      for (var i in ethList) {
                        if (eth_goku_collision(ethList[i])) {
                          droppingSound.play();
                          gameover = true;
                        }
                      }

                      if (startGame) {
                        backgroundSound.play();
                      }

                      if (gameover) {
                        if (goku.y >= 450)
                          drawObject(gokuThree, goku.x, goku.y + 20, 50, 30);
                        else
                          drawObject(gokuOne, goku.x, goku.y, 30, 50);
                        gameOver();
                      }

                      else if (goku.onair) {
                        drawObject(gokuFour, goku.x, goku.y, goku.width, goku.height);
                      }
                      else if (animation == 0) {
                        drawObject(gokuOne, goku.x, goku.y, goku.width, goku.height);
                        animation = 1;
                      }
                      else if (animation == 1) {
                        drawObject(gokuTwo, goku.x, goku.y, goku.width, goku.height);
                        animation = 0;
                      }

                      for (var i in dragonballList) {
                        drawObject(dragonball, dragonballList[i].x, dragonballList[i].y, dragonballObject.width, dragonballObject.height);
                      }

                      for (var i = 0; i < dollarList.length; i++) {
                        drawObject(dollar, dollarList[i].x, dollarList[i].y, dollarObject.width, dollarObject.height);
                      }

                      for (var i in ethList) {
                        drawObject(eth, ethList[i].x, ethList[i].y, ethObject.width, ethObject.height);
                      }

                      for (var i in dragonballList) {
                        if (dragonball_goku_collision(dragonballList[i])) {
                          score++;
                          eatingSound.play();
                          if (score % 7 == 0)
                            level--;
                          dragonballList.splice(i, 1);
                        }
                      }
                      for (var i in dragonballList) {
                        for (var j in dollarList) {
                          if (dragonball_dollar_collision(dragonballList[i], dollarList[j])) {
                            dollarList.splice(j, 1);
                          }
                        }
                      }

                      if (!goku.onair) {
                        for (var i in dollarList) {
                          if (goku_dollar_collision(dollarList[i])) {
                            goku.safe = true;
                            break;
                          }
                          goku.safe = false;
                        }
                        if (!goku.safe) {
                          goku.y += goku.gravity;
                        }
                      }

                      drawObject(dragonball, 440, 10, 20, 20);
                      ctx.fillStyle = "#FFFFFF";
                      ctx.font = "20px Calibri";
                      ctx.fillText(score, 465, 27);
                      ctx.fillText("Level " + (100 - level + 1), 10, 27);
                      updateEthPosition();
                      updateDragonballPosition();
                      updateGokuPosition();
                      jump();
                    }
                    else {
                      ctx.save();
                      ctx.fillStyle = "#FFFFFF";
                      ctx.font = "30px Calibri"
                      ctx.fillText("Game Paused", 165, 250);
                      ctx.restore();
                    }
                  }

                  startGame = function () {
                    score = 0;
                    level = 100;
                    goku.y = 350;
                    goku.x = 100;
                    goku.onair = false;
                    goku.leftPressed = false;
                    goku.rightPressed = false;
                    goku.safe = true;
                    animation = 0;
                    dragonballTimer = 0;
                    paused = false;
                    gameover = false;
                    dollarList = [];
                    dragonballList = [];
                    ethList = [];

                    for (var i = 0; i <= 9; i++) {
                      dollarList.push({ 'x': i * 50, 'y': 400 });
                    }


                    intervalVar = setInterval(updatePosition, 10); // 100 fps game
                  }

                }
                eth.src = "bomb.png";
              }
              dollar.src = "rock2.png";
            }
            dragonball.src = "1star.png";
          }
          gokuFour.src = "super.png";
        }
        gokuThree.src = "gokuHurt.png";
      }
      gokuTwo.src = "gokuNormal.png";
    }
    gokuOne.src = "gokuNormal.png";
  }
  blood.src = "end.jpg";
}
background.src = "Friezasship.png";

