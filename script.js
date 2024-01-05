const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
//cream variabile pentru joc  starea jocului, poziția șerpelui, poziția mâncării, viteza șerpelui, corpul șerpelui, intervalul de actualizare a jocului, și scorul.
let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  snakeY = 5;
let velocityX = 0,
  velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
//memoram in local storage cel mai mare scor acumulat de jucator
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = "High Score: " + highScore;
//generează poziția aleatoare pentru mâncare
const updateFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  clearInterval(setIntervalId);
  alert("Game Over! Press OK to replay...");
  location.reload();
};

const changeDirection = (e) => {
  //acest prim if verifica daca tasta apasata este cea de sus
  if (e.key === "ArrowUp" && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY !== -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
  }
};
//adaugă un eveniment de click pentru fiecare buton de control, astfel încât să cheme funcția changeDirection atunci când un buton este apăsat.
controls.forEach((button) =>
  button.addEventListener("click", () =>
    changeDirection({ key: button.dataset.key })
  )
);

const initGame = () => {
  // Verifica dacă jocul s-a încheiat, dacă da, apelează funcția handleGameOver
  if (gameOver) return handleGameOver();

  // Inițializarea șirului HTML cu div-ul pentru mâncare
  let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  // Verifică dacă șarpele a atins mâncarea
  if (snakeX === foodX && snakeY === foodY) {
    // Actualizează poziția mâncării și adaugă o nouă parte la corpul șarpelui
    updateFoodPosition();
    snakeBody.push([foodY, foodX]);
    // Actualizează scorul și scorul maxim
    score++;
    highScore = score >= highScore ? score : highScore;
    // Actualizează scorul în interfață
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = "Score: " + score;
    highScoreElement.innerText = "High Score: " + highScore;
  }

  // Actualizează poziția șarpelui în funcție de direcția curentă
  snakeX += velocityX;
  snakeY += velocityY;

  // Actualizează poziția fiecărui segment al corpului șarpelui
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  // Actualizează poziția capului șarpelui
  snakeBody[0] = [snakeX, snakeY];

  // Verifică dacă șarpele a lovit peretele
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    // Dacă șarpele a lovit peretele, setează gameOver la true
    return (gameOver = true);
  }

  // Verifică dacă șarpele a lovit propriul corp
  for (let i = 0; i < snakeBody.length; i++) {
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }

  // Actualizează conținutul div-ului cu clasa "play-board" cu noul HTML
  playBoard.innerHTML = html;
};

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);
