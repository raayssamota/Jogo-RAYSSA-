const images = [
  "https://thumbs.dreamstime.com/b/design-animado-de-jogos-astronaut-pixel-art-bits-e-%C3%ADcone-do-vetor-arte-astronauta-isolado-302367159.jpg",
  "https://img.freepik.com/premium-vector/pixel-art-illustration-rocket-pixelated-rocket-rocket-space-icon-pixelated-pixel-art-game_1038602-485.jpg",
  "https://thumbs.dreamstime.com/b/pixel-art-meteor-illustration-vector-game-design-pixelated-space-icon-website-video-old-school-retro-327010911.jpg",
  "https://www.shutterstock.com/image-vector/pixel-art-green-gray-cartoon-600nw-2131390057.jpg",
  "https://static.vecteezy.com/system/resources/thumbnails/027/517/526/small_2x/pixel-art-alien-ufo-character-png.png",
  "https://static.vecteezy.com/system/resources/thumbnails/048/106/126/small_2x/planet-saturn-pixel-art-png.png",
  "https://thumbs.dreamstime.com/b/vetor-de-ilustra%C3%A7%C3%A3o-da-lua-pixel-art-para-o-jogo-arte-pixelizada-brilhante-pixelada-em-e-%C3%ADcone-site-v%C3%ADdeo-retro-escolar-antigo-324991619.jpg",
  "https://static.vecteezy.com/ti/vetor-gratis/p1/10966336-icone-de-pixel-do-sol-gratis-vetor.jpg"
];

const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const gameScreen = document.getElementById('game-screen');
const gameBoard = document.getElementById('game-board');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restart-button');

let flippedCards = [];
let matchedPairs = 0;
let lockBoard = false;

// Embaralha o array (Fisher-Yates)
function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function createCards() {
  const gameImages = shuffle([...images, ...images]); // duplica e embaralha

  gameBoard.innerHTML = '';
  matchedPairs = 0;
  statusDisplay.textContent = 'Encontre os pares!';
  flippedCards = [];
  lockBoard = false;

  gameImages.forEach(imgSrc => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.image = imgSrc;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back" style="background-image: url('${imgSrc}');"></div>
      </div>
    `;

    card.addEventListener('click', () => flipCard(card));
    gameBoard.appendChild(card);
  });
}

function flipCard(card) {
  if (lockBoard) return;
  if (flippedCards.includes(card)) return;
  if (card.classList.contains('matched')) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkForMatch();
  }
}

function checkForMatch() {
  lockBoard = true;

  const [card1, card2] = flippedCards;
  const isMatch = card1.dataset.image === card2.dataset.image;

  if (isMatch) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedPairs++;
    statusDisplay.textContent = `Pares encontrados: ${matchedPairs} de ${images.length}`;

    resetTurn();

    if (matchedPairs === images.length) {
      statusDisplay.textContent = 'Parabéns! Você completou a Memória Galáctica! 🚀';
    }
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  flippedCards = [];
  lockBoard = false;
}

function startGame() {
  startScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  createCards();
}

function restartGame() {
  createCards();
  statusDisplay.textContent = 'Encontre os pares!';
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);






