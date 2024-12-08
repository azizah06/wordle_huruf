// Kata target
const targetWord = "MOUSE";
const maxAttempts = 6;
let currentAttempt = 0;
let currentInput = "";

const grid = document.getElementById("grid");
const keys = document.querySelectorAll(".key");
const enterKey = document.getElementById("enter");
const deleteKey = document.getElementById("delete");

// Inisialisasi grid
function initializeGrid() {
  for (let i = 0; i < maxAttempts * 5; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    grid.appendChild(tile);
  }
}

initializeGrid();

function updateTiles() {
  const tiles = Array.from(document.getElementsByClassName("tile"));
  const startIndex = currentAttempt * 5;

  for (let i = 0; i < 5; i++) {
    const tile = tiles[startIndex + i];
    if (currentInput[i]) {
      tile.textContent = currentInput[i];
    } else {
      tile.textContent = "";
    }
  }
}

function updateKeyboard(letter, status) {
  const key = Array.from(keys).find(k => k.textContent === letter);
  if (key && !key.classList.contains("correct")) {
    key.classList.remove("present", "absent");
    key.classList.add(status);
  }
}

function checkWord(inputWord) {
  const tiles = Array.from(document.getElementsByClassName("tile"));
  const startIndex = currentAttempt * 5;

  const letterCount = {};
  for (let letter of targetWord) {
    letterCount[letter] = (letterCount[letter] || 0) + 1;
  }

  for (let i = 0; i < 5; i++) {
    const tile = tiles[startIndex + i];
    tile.textContent = inputWord[i];

    if (inputWord[i] === targetWord[i]) {
      tile.classList.add("correct");
      updateKeyboard(inputWord[i], "correct");
      letterCount[inputWord[i]]--;
    }
  }

  for (let i = 0; i < 5; i++) {
    const tile = tiles[startIndex + i];
    if (!tile.classList.contains("correct")) {
      if (targetWord.includes(inputWord[i]) && letterCount[inputWord[i]] > 0) {
        tile.classList.add("present");
        updateKeyboard(inputWord[i], "present");
        letterCount[inputWord[i]]--;
      } else {
        tile.classList.add("absent");
        updateKeyboard(inputWord[i], "absent");
      }
    }
  }

  if (inputWord === targetWord) {
    alert("Congratulations! You guessed the word!");
    enterKey.disabled = true;
    deleteKey.disabled = true;
  } else if (currentAttempt === maxAttempts - 1) {
    alert(`Game Over! The word was ${targetWord}.`);
    enterKey.disabled = true;
    deleteKey.disabled = true;
  }

  currentAttempt++;
}

// Menangani input dari keyboard virtual
keys.forEach(key => {
  key.addEventListener("click", () => {
    if (currentInput.length < 5 && !key.classList.contains("action")) {
      currentInput += key.textContent;
      updateTiles();
    }
  });
});

// Menangani input dari tombol Enter
enterKey.addEventListener("click", () => {
  if (currentInput.length === 5) {
    checkWord(currentInput);
    currentInput = "";
    updateTiles();
  } else {
    alert("Please enter a 5-letter word.");
  }
});

// Menangani input dari tombol Delete
deleteKey.addEventListener("click", () => {
  currentInput = currentInput.slice(0, -1);
  updateTiles();
});

// Menangani input dari keyboard laptop
document.addEventListener("keydown", (event) => {
  const key = event.key.toUpperCase();

  if (/^[A-Z]$/.test(key) && currentInput.length < 5) {
    currentInput += key;
    updateTiles();
  } else if (event.key === "Enter" && currentInput.length === 5) {
    checkWord(currentInput);
    currentInput = "";
    updateTiles();
  } else if (event.key === "Backspace") {
    currentInput = currentInput.slice(0, -1);
    updateTiles();
  }
});
