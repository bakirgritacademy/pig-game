let players = [];
let currentPlayerIndex = 0;
let currentRoundScore = 0;
let roundCount = 0;
let gameActive = false;

const startForm = document.querySelector('#startForm');
const nameInput = document.querySelector('#names');
const playerCountSelect = document.querySelector('#playerCount');

const gameSection = document.querySelector('#gameSection');
const currentPlayerDisplay = document.querySelector('#currentPlayer');
const totalScoreSpan = document.querySelector('#totalScore');
const roundScoreSpan = document.querySelector('#roundScore');
const roundsSpan = document.querySelector('#rounds');
const diceSpan = document.querySelector('#dice');
const messageP = document.querySelector('#message');

const rollBtn = document.querySelector('#roll');
const holdBtn = document.querySelector('#hold');
const restartBtn = document.querySelector('#restart');
const diceImage = document.querySelector('#diceImage');

// Starta spelet
startForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const names = nameInput.value.split(',').map(n => n.trim()).filter(n => n);
  const playerCount = parseInt(playerCountSelect.value);

  if (names.length !== playerCount) {
    alert(`Du måste ange exakt ${playerCount} namn, separerade med komma.`);
    return;
  }

  players = names.map(name => ({ name, total: 0 }));
  currentPlayerIndex = 0;
  currentRoundScore = 0;
  roundCount = 0;
  gameActive = true;

  startForm.classList.add('hidden');
  gameSection.classList.remove('hidden');

  updateUI();
  messageP.innerText = `Välkommen ${players[currentPlayerIndex].name}, det är din tur!`;
});

// Kasta tärningen
rollBtn.addEventListener('click', () => {
  if (!gameActive) return;

  const roll = Math.floor(Math.random() * 6) + 1;
  diceSpan.innerText = roll;
  updateDiceImage(roll);

  if (roll === 1) {
    currentRoundScore = 0;
    roundCount++;
    messageP.innerText = `${players[currentPlayerIndex].name} slog en 1! Omgångens poäng nollställs.`;
    nextPlayer();
  } else {
    currentRoundScore += roll;
    messageP.innerText = `${players[currentPlayerIndex].name} slog ${roll}.`;
  }

  updateUI();
});

// Frys poängen
holdBtn.addEventListener('click', () => {
  if (!gameActive) return;

  players[currentPlayerIndex].total += currentRoundScore;
  roundCount++;
  messageP.innerText = `${players[currentPlayerIndex].name} frös poängen.`;

  if (players[currentPlayerIndex].total >= 100) {
    messageP.innerText = ` ${players[currentPlayerIndex].name} vann spelet på ${roundCount} omgångar!`;
    gameActive = false;
    rollBtn.disabled = true;
    holdBtn.disabled = true;
    restartBtn.classList.remove('hidden');
  } else {
    currentRoundScore = 0;
    nextPlayer();
    updateUI();
  }
});

// Starta om spelet
restartBtn.addEventListener('click', () => {
  players = [];
  currentPlayerIndex = 0;
  currentRoundScore = 0;
  roundCount = 0;
  gameActive = false;

  rollBtn.disabled = false;
  holdBtn.disabled = false;

  diceSpan.innerText = '-';
  diceImage.src = "./images/dice1.png";
  diceImage.alt = "Tärning";
  messageP.innerText = '';
  totalScoreSpan.innerText = '0';
  roundScoreSpan.innerText = '0';
  roundsSpan.innerText = '0';

  gameSection.classList.add('hidden');
  startForm.classList.remove('hidden');
  restartBtn.classList.add('hidden');
  nameInput.value = '';
});

// Nästa spelare
const nextPlayer = () => {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  messageP.innerText += ` Nu är det ${players[currentPlayerIndex].name}s tur.`;
};

// Uppdatera UI
const updateUI = () => {
  currentPlayerDisplay.innerText = `Aktuell spelare: ${players[currentPlayerIndex].name}`;
  totalScoreSpan.innerText = players[currentPlayerIndex].total;
  roundScoreSpan.innerText = currentRoundScore;
  roundsSpan.innerText = roundCount;
  renderScoreboard();
};

// Rendera poängtavlan
const renderScoreboard = () => {
  const tbody = document.querySelector('#scoreboard tbody');
  tbody.innerHTML = '';

  players.forEach((player, index) => {
    const isActive = index === currentPlayerIndex;
    const boldStyle = isActive ? 'font-weight: bold;' : '';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="${boldStyle}">${player.name}</td>
      <td>${player.total}</td>
      <td>${isActive ? currentRoundScore : 0}</td>
    `;
    tbody.appendChild(row);
  });
};

// Uppdatera tärningsbild
const updateDiceImage = (number) => {
  diceImage.src = `./images/dice${number}.png`;
  diceImage.alt = `Tärning visar ${number}`;
};
