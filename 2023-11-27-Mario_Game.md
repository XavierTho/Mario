---
layout: base
title: Mario Game
type: ccc
courses: { csse: {week: 14}, csp: {week: 14}, csa: {week: 14} }
image: /images/platformer/backgrounds/hills.png
---

<style>
    #gameBegin, #controls, #gameOver, #settings {
      position: relative;
        z-index: 2; /*Ensure the controls are on top*/
    }
    .sidenav {
      position: fixed;
      height: 100%; /* 100% Full-height */
      width: 0px; /* 0 width - change this with JavaScript */
      z-index: 3; /* Stay on top */
      top: 0; /* Stay at the top */
      left: 0;
      overflow-x: hidden; /* Disable horizontal scroll */
      padding-top: 60px; /* Place content 60px from the top */
      transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
      background-color: black;
    }
    #toggleCanvasEffect, #background, #foreground, #platform {
      animation: fadein 1s;
    }
    #startGame {
      animation: flash 0.5s infinite;
    }
    #score {
      position: absolute;
      top: 75px;
      left: 10px;
      color: black;
      font-size: 20px;
      margin-left: 50%;
      background-color: #dddddd;
    }

    @keyframes flash {
      50% {
        opacity: 0;
      }
    }
    @keyframes fadeout {
      from {opacity: 1}
      to {opacity: 0}
    }
    @keyframes fadein {
      from {opacity: 0}
      to {opacity: 1}
    }
</style>
<!-- Load the YouTube Iframe API script -->
<script async src="https://www.youtube.com/iframe_api"></script>
<!-- Prepare DOM elements -->
<!-- Wrap both the canvas and controls in a container div -->
<div id="canvasContainer">
    <!-- Add this div to contain the YouTube video player -->
    <div id="youtubePlayer"></div>
    <div id="mySidebar" class="sidenav">
      <a href="javascript:void(0)" id="toggleSettingsBar1" class="closebtn">&times;</a>
    </div>
    <div id="canvasContainer">
    <div id="gameBegin" hidden>
        <button id="startGame">Start Game</button>
    </div>
    <div id="controls"> <!-- Controls -->
        <!-- Background controls -->
        <button id="toggleCanvasEffect">Invert</button>
    </div>
    <div id="settings"> <!-- Controls -->
        <!-- Background controls -->
        <button id="toggleSettingsBar">Settings</button>
        <button id="leaderboardButton">Leaderboard</button>
    </div>
    <div id="gameOver" hidden>
        <button id="restartGame">Restart</button>
    </div>
    </div>
</div>
<div id="score">
  Time: <span id="timeScore">0</span>
</div>

<script type="module">
    // Imports
    import GameEnv from '{{site.baseurl}}/assets/js/platformer/GameEnv.js';
    import GameLevel from '{{site.baseurl}}/assets/js/platformer/GameLevel.js';
    import GameControl from '{{site.baseurl}}/assets/js/platformer/GameControl.js';
    import Controller from '{{site.baseurl}}/assets/js/platformer/Controller.js';
    import {playMusic} from '{{site.baseurl}}/assets/js/platformer/Music.js';
    import '{{site.baseurl}}/assets/js/platformer/Leaderboard.js';
    var myController = new Controller();

    /*  ==========================================
     *  ======= Data Definitions =================
     *  ==========================================
    */

    // Define assets for the game
    var assets = {
      obstacles: {
        tube: { src: "/images/platformer/obstacles/tube.png" },
      },
      floors: {
        grass: { src: "/images/platformer/platforms/grass.png" },
        alien: { src: "/images/platformer/platforms/alien.png" }
      },
      platforms: {
        brick: { src: "/images/platformer/platforms/brick_wall.png" },
      },
      powers: {
        coin: { src: "/images/platformer/Coin.png"},
      },
      backgrounds: {
        start: { src: "/images/platformer/backgrounds/home.png" },
        hills: { src: "/images/platformer/backgrounds/hills.png" },
        clouds: { src: "/images/platformer/backgrounds/clouds.jpg"},
        planet: { src: "/images/platformer/backgrounds/planet.jpg" },
        castles: { src: "/images/platformer/backgrounds/castles.png" },
        end: { src: "/images/platformer/backgrounds/game_over.png" }
      },
      players: {
        mario: {
          src: "/images/platformer/sprites/mario.png",
          width: 256,
          height: 256,
          w: { row: 10, frames: 15 },
          wa: { row: 11, frames: 15 },
          wd: { row: 10, frames: 15 },
          a: { row: 3, frames: 7, idleFrame: { column: 7, frames: 0 } },
          s: {  },
          d: { row: 2, frames: 7, idleFrame: { column: 7, frames: 0 } }
        },
        monkey: {
          src: "/images/platformer/sprites/monkey.png",
          width: 40,
          height: 40,
          w: { row: 9, frames: 15 },
          wa: { row: 9, frames: 15 },
          wd: { row: 9, frames: 15 },
          a: { row: 1, frames: 15, idleFrame: { column: 7, frames: 0 } },
          s: { row: 12, frames: 15 },
          d: { row: 0, frames: 15, idleFrame: { column: 7, frames: 0 } }
        },
        lopez: {
          src: "/images/platformer/sprites/lopez.png",
          width: 46,
          height: 52.5,
          idle: { row: 6, frames: 1, idleFrame: {column: 1, frames: 0} },
          a: { row: 1, frames: 4, idleFrame: { column: 1, frames: 0 } },
          d: { row: 2, frames: 4, idleFrame: { column: 1, frames: 0 } },
          runningLeft: { row: 5, frames: 4, idleFrame: {column: 1, frames: 0} },
          runningRight: { row: 4, frames: 4, idleFrame: {column: 1, frames: 0} },
          s: {}, // Stop the movement 
        }
      },
      enemies: {
        goomba: {
          src: "/images/platformer/sprites/goomba.png",
          width: 448,
          height: 452,
        }
      }
    }

    // add File to assets, ensure valid site.baseurl
    Object.keys(assets).forEach(category => {
      Object.keys(assets[category]).forEach(assetName => {
        assets[category][assetName]['file'] = "{{site.baseurl}}" + assets[category][assetName].src;
      });
    });

    /*  ==========================================
     *  ===== Game Level Call Backs ==============
     *  ==========================================
    */

    // Level completion tester
    function testerCallBack() {
        // console.log(GameEnv.player?.x)
        if (GameEnv.player?.x > GameEnv.innerWidth) {
            return true;
        } else {
            return false;
        }
    }

    // Helper function for button click
    function waitForButton(buttonName) {
      // resolve the button click
      return new Promise((resolve) => {
          const waitButton = document.getElementById(buttonName);
          const waitButtonListener = () => {
              resolve(true);
          };
          waitButton.addEventListener('click', waitButtonListener);
      });
    }
  
    // Start button callback
    async function startGameCallback() {
      const id = document.getElementById("gameBegin");
      id.hidden = false;

      // Use waitForRestart to wait for the restart button click
      await waitForButton('startGame');
      id.hidden = true;

      // Play music after start game button is pressed
      playMusic();

      return true;
    }

    // Home screen exits on Game Begin button
    function homeScreenCallback() {
      // gameBegin hidden means the game has started
      const id = document.getElementById("gameBegin");
      return id.hidden;
    }

    // Game Over callback
   async function gameOverCallBack() {
    const id = document.getElementById("gameOver");
    id.hidden = false;

    // Store whether the game over screen has been shown before
    const gameOverScreenShown = localStorage.getItem("gameOverScreenShown");

    // Check if the game over screen has been shown before
    if (!gameOverScreenShown) {
      const playerScore = document.getElementById("timeScore").innerHTML;
      let playerName = prompt(`You scored ${playerScore}! What is your name?`);

      // Check if playerName is not null, undefined, or an empty string
      if (playerName != null && playerName.trim() !== "") {
        let temp = localStorage.getItem("playerScores") || ""; // Initialize to an empty string if null
        temp += playerName + ":" + playerScore.toString() + ";";
        localStorage.setItem("playerScores", temp);
      }

      // Set a flag in local storage to indicate that the game over screen has been shown
      localStorage.setItem("gameOverScreenShown", "true");
    }
    

    // Use waitForRestart to wait for the restart button click
    await waitForButton('restartGame');
    id.hidden = true;
    // Change currentLevel to start/restart value of null
    GameEnv.currentLevel = null;
    // Reset the flag so that the game over screen can be shown again on the next game over
    localStorage.removeItem("gameOverScreenShown");
    return true;
  }

    /*  ==========================================
     *  ========== Game Level setup ==============
     *  ==========================================
     * Start/Home sequence
     * a.) the start level awaits for button selection
     * b.) the start level automatically cycles to home level
     * c.) the home advances to the 1st game level when the button selection is made
    */
    // Start/Home screens
    new GameLevel( {tag: "start", callback: startGameCallback } );
    new GameLevel( {tag: "home", background: assets.backgrounds.start, callback: homeScreenCallback } );
    // Game screens
    new GameLevel( {tag: "hills", background: assets.backgrounds.hills, clouds: assets.backgrounds.clouds, floor: assets.floors.grass, platform: assets.platforms.brick, player: assets.players.mario, enemy: assets.enemies.goomba, tube: assets.obstacles.tube, coin: assets.powers.coin, callback: testerCallBack } );
    new GameLevel( {tag: "alien", background: assets.backgrounds.planet, floor: assets.floors.alien, player: assets.players.lopez, callback: testerCallBack } );
    // Game Over screen
    new GameLevel( {tag: "end", background: assets.backgrounds.end, callback: gameOverCallBack } );

    /*  ==========================================
     *  ========== Game Control ==================
     *  ==========================================
    */

    // create listeners
    toggleCanvasEffect.addEventListener('click', GameEnv.toggleInvert);
    window.addEventListener('resize', GameEnv.resize);

    // start game
    GameControl.gameLoop();

    // Initialize Local Storage
    myController.initialize();
    var table = myController.levelTable;
    document.getElementById("mySidebar").append(table);
    var toggle = false;
    function toggleWidth(){
      toggle = !toggle;
      document.getElementById("mySidebar").style.width = toggle?"250px":"0px";
    }
    document.getElementById("toggleSettingsBar").addEventListener("click",toggleWidth);
    document.getElementById("toggleSettingsBar1").addEventListener("click",toggleWidth);

    var div = myController.speedDiv;
    document.getElementById("mySidebar").append(div);
</script>
