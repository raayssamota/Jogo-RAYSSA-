const images = [
  "https://images.vexels.com/media/users/3/205380/isolated/preview/e1a15bb6fc4fc34825ec545536887e31-illustration-black-hole.png",
  "https://png.pngtree.com/png-clipart/20210309/original/pngtree-blue-gray-meteor-clip-art-png-image_5875242.png",
  "https://static.vecteezy.com/system/resources/thumbnails/048/106/126/small_2x/planet-saturn-pixel-art-png.png",
  "https://png.pngtree.com/png-clipart/20230818/original/pngtree-star-pixel-art-logo-template-isolated-marketing-arrow-vector-picture-image_11034909.png",
  "https://static.vecteezy.com/system/resources/thumbnails/013/519/071/small/pixel-art-fictional-planet-png.png",
  "https://cdn.pixabay.com/photo/2023/06/29/18/16/space-8096886_1280.png",
  "https://static.vecteezy.com/system/resources/previews/048/106/124/non_2x/comet-falling-pixel-art-png.png",
  "https://static.vecteezy.com/system/resources/previews/013/743/331/non_2x/pixel-art-moon-png.png"
];

const startScreen = document.getElementById('start-screen');
const btnStart = document.getElementById('btn-start');
const btnFunctions = document.getElementById('btn-functions');
const functionsScreen = document.getElementById('functions-screen');
const btnFunctionsBack = document.getElementById('btn-functions-back');
const btnFunctionsStart = document.getElementById('btn-functions-start');
const gameScreen = document.getElementById('game-screen');
const gameBoard = document.getElementById('game-board');
const alerta = document.getElementById('alerta');
const btnRadar = document.getElementById('btn-radar');
const btnRestart = document.getElementById('btn-restart');
const btnBackToStart = document.getElementById('btn-back-to-start');
const vidasContainer = document.getElementById('vidas-container');

let vidas, erros, escudoAtivo, radarUsado;
let flippedCards = [];
let lockBoard = false;
let matchedPairs = 0;

function iniciarJogo() {
  vidas = 8;
  erros = 0;
  escudoAtivo = false;
  radarUsado = false;
  flippedCards = [];
  lockBoard = false;
  matchedPairs = 0;
  alerta.textContent = '';
  atualizarVidas();
  criarTabuleiro();
}

function atualizarVidas() {
  vidasContainer.innerHTML = '';
  for (let i = 0; i < vidas; i++) {
    const heart = document.createElement('div');
    heart.classList.add('vida');
    vidasContainer.appendChild(heart);
  }
}

function embaralharCartasRestantes() {
  const cards = Array.from(document.querySelectorAll('.card:not(.matched)'));
  const imagens = cards.map(card => card.dataset.image);
  const embaralhadas = imagens.sort(() => 0.5 - Math.random());

  cards.forEach((card, i) => {
    card.dataset.image = embaralhadas[i];
    card.querySelector('.card-back').style.backgroundImage = `url('${embaralhadas[i]}')`;
  });
}

function criarTabuleiro() {
  const embaralhadas = [...images, ...images].sort(() => 0.5 - Math.random());
  gameBoard.innerHTML = '';

  embaralhadas.forEach(src => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.image = src;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back" style="background-image: url('${src}');"></div>
      </div>
    `;
    card.addEventListener('click', () => virarCarta(card));
    gameBoard.appendChild(card);
  });
}

function virarCarta(card) {
  if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checarPar();
  }
}

function checarPar() {
  lockBoard = true;
  const [card1, card2] = flippedCards;

  if (card1.dataset.image === card2.dataset.image) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedPairs++;
    if (vidas < 8) {
      vidas++;
      alerta.textContent = "Par encontrado! +1 vida";
    } else {
      alerta.textContent = "Par encontrado!";
    }
    atualizarVidas();
    resetarViradas();
    if (matchedPairs === images.length) {
      alerta.textContent = "Missão completa! Parabéns!";
    }
  } else {
    setTimeout(() => {
      if (escudoAtivo) {
        alerta.textContent = "Escudo ativado! Erro ignorado.";
        escudoAtivo = false;
      } else {
        vidas--;
        erros++;
        alerta.textContent = `Você perdeu uma vida. Vidas restantes: ${vidas}`;
        atualizarVidas();

        if (vidas === 2) {
          alerta.textContent = "Pulso Magnético ativado!";
          embaralharCartasRestantes();
        } else if (vidas === 1 && !escudoAtivo) {
          escudoAtivo = true;
          alerta.textContent = "Escudo ativado automaticamente!";
        } else if (vidas <= 0) {
          alerta.textContent = "Game Over!";
          lockBoard = true;
        }
      }

      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      resetarViradas();
    }, 1200);
  }
}

function resetarViradas() {
  flippedCards = [];
  lockBoard = false;
}

// Navegação entre telas
btnStart.onclick = () => {
  startScreen.classList.remove('active');
  gameScreen.classList.add('active');
  iniciarJogo();
};

btnFunctions.onclick = () => {
  startScreen.classList.remove('active');
  functionsScreen.classList.add('active');
};

btnFunctionsBack.onclick = () => {
  functionsScreen.classList.remove('active');
  startScreen.classList.add('active');
};

btnFunctionsStart.onclick = () => {
  functionsScreen.classList.remove('active');
  gameScreen.classList.add('active');
  iniciarJogo();
};

btnRestart.onclick = iniciarJogo;

btnBackToStart.onclick = () => {
  gameScreen.classList.remove('active');
  startScreen.classList.add('active');
};

// Radar
btnRadar.onclick = () => {
  if (radarUsado) {
    alerta.textContent = "Radar já foi usado!";
    return;
  }
  radarUsado = true;
  const todas = document.querySelectorAll('.card:not(.matched)');
  todas.forEach(card => card.classList.add('flipped'));
  lockBoard = true;
  alerta.textContent = "Radar ativado!";
  setTimeout(() => {
    todas.forEach(card => card.classList.remove('flipped'));
    lockBoard = false;
    alerta.textContent = "";
  }, 2000);
};




