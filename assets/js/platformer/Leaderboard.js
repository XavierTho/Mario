// Function to switch to the leaderboard screen
function showLeaderboard() {
  const id = document.getElementById("gameOver");
  id.hidden = false;
  // Hide game canvas and controls
  document.getElementById('canvasContainer').style.display = 'none';
  document.getElementById('controls').style.display = 'none';

// Create and display leaderboard section
const leaderboardSection = document.createElement('div');
leaderboardSection.id = 'leaderboardSection';
leaderboardSection.innerHTML = '<h1 style="text-align: center; font-size: 18px;">Leaderboard </h1>';
document.querySelector(".page-content").appendChild(leaderboardSection)
// document.body.appendChild(leaderboardSection);

const playerScores = localStorage.getItem("playerScores")
const playerScoresArray = playerScores.split(";")
const scoresObj = {}
const scoresArr = []
for(let i = 0; i< playerScoresArray.length-1; i++){
  const temp = playerScoresArray[i].split(",")
  scoresObj[temp[0]] = parseInt(temp[1])
  scoresArr.push(parseInt(temp[1]))
}

scoresArr.sort()

const finalScoresArr = []
for (let i = 0; i<scoresArr.length; i++) {
  for (const [key, value] of Object.entries(scoresObj)) {
    if (scoresArr[i] ==value) {
      finalScoresArr.push(key + "," + value)
      break;
    }
  }
}
let rankScore = 1;
for (let i =0; i<finalScoresArr.length; i++) {
  const rank = document.createElement('div');
  rank.id = `rankScore${rankScore}`;
  rank.innerHTML = `<h2 style="text-align: center; font-size: 18px;">${finalScoresArr[i]} </h2>`;
  document.querySelector(".page-content").appendChild(rank)    
}
}

// Event listener for leaderboard button to be clicked
document.getElementById('leaderboardButton').addEventListener('click', showLeaderboard);