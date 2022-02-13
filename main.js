const baseUrl = "https://random-word-game-host.herokuapp.com";
let guess = [];
let wordCode;

// Helper Functions

function getNewWord() {
  fetch(`${baseUrl}/word`)
    .then((res) => res.json())
    .then((data) => {
      wordCode = data.wordCode;
    });
}

function addLetter(letter) {
  if (guess.length < 5) guess.push(letter);
  updateRow();
  console.log(guess);
}

function removeLetter() {
  guess.pop();
  updateRow();
  console.log(guess);
}

function updateRow() {
  const row = getAvailableBoardRows()[0];
  const tiles = row.querySelectorAll(".tile");
  tiles.forEach((tile, idx) => (tile.textContent = guess[idx]));
}

function getAvailableBoardRows() {
  return document.querySelectorAll(".board-row.available");
}

function compareWords() {
  if (guess.length === 5) {
    fetch(
      `${baseUrl}/word/dev/compare?wordCode=${wordCode}&guess=${guess.join("")}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          updateBoard(data.colors);
        } else {
          console.log("invalid word");
          guess = [];
          updateRow();
        }
      });
  }
}

function updateBoard(colors) {
  const row = getAvailableBoardRows()[0];
  const tiles = row.querySelectorAll(".tile");
  tiles.forEach((tile, idx) => {
    const guessCp = [...guess];
    setTimeout(() => {
      const color = colors[idx];
      tile.classList.add(color);
      document
        .querySelector(`[data-letter='${guessCp[idx]}']`)
        .classList.add(color);
    }, 500 * idx);
  });
  row.classList.remove("available");
  guess = [];
  if (checkWin(colors)) return onWin();
  if (getAvailableBoardRows().length < 1) return onLoss();
}

function handleKeydown(e) {
  const { key } = e;
  if (alphabet.includes(key)) {
    addLetter(key);
  }
  if (key === "Backspace") {
    removeLetter();
  }
  if (key === "Enter") {
    compareWords();
  }
}

const checkWin = (colors) =>
  colors.filter((color) => color === "green").length >= 5;

function onWin() {
  setTimeout(() => {
    document.removeEventListener("keydown", handleKeydown);
    document.querySelector(".modal").classList.remove("hidden");
    document.querySelector(".modal-text").textContent =
      "Congratulations you won";
  }, 3000);
}

function onLoss() {
  setTimeout(() => {
    document.removeEventListener("keydown", handleKeydown);
    document.querySelector(".modal").classList.remove("hidden");
    document.querySelector(".modal-text").textContent = "Bad luck you lost";
  }, 3000);
}

// Events
////////////////////////////////////////////////////////////////

window.onload = () => {
  getNewWord();
};

window.addEventListener("keydown", handleKeydown);

document
  .querySelectorAll(".keyboard-letter")
  .forEach((key) =>
    key.addEventListener("mousedown", () =>
      handleKeydown({ key: key.dataset.letter })
    )
  );

document
  .querySelector(".enter-btn")
  .addEventListener("mousedown", compareWords);

document
  .querySelector(".backspace-btn")
  .addEventListener("mousedown", removeLetter);

// Utilities
////////////////////////////////////////////////////////////////

const alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
