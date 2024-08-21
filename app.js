// Slot Machine Game Logic
//The player deposits some money.
// They choose the number of lines to bet on.
// They place a bet for each line.
// The slot machine "spins" and generates a random arrangement of symbols.
// The game checks if the player has won based on the arrangement of symbols.
// Winnings are calculated and added to the player's balance.
// The player can choose to play again or exit the game.
const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
};

const SYMBOL_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
};

let balance = 0;

const updateBalanceDisplay = () => {
    document.getElementById('balance-display').textContent = `Balance: $${balance}`;
};

const updateWinningsDisplay = (winnings) => {
    document.getElementById('winnings-display').textContent = `Winnings: $${winnings}`;
};

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

const printRows = (rows) => {
    const slotMachine = document.getElementById('slot-machine');
    slotMachine.innerHTML = ''; // Clear previous result
    for (const row of rows) {
        const rowString = row.join(' | ');
        const rowElement = document.createElement('p');
        rowElement.textContent = rowString;
        slotMachine.appendChild(rowElement);
    }
};

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;
        for (const symbol of symbols) {
            if (symbol !== symbols[0]) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
};

// Event listener for deposit button
document.getElementById('deposit-btn').addEventListener('click', () => {
    const depositAmount = parseFloat(document.getElementById('deposit-amount').value);
    if (isNaN(depositAmount) || depositAmount <= 0) {
        alert('Invalid deposit amount');
    } else {
        balance += depositAmount;
        updateBalanceDisplay();
    }
});

// Event listener for spin button
document.getElementById('spin-btn').addEventListener('click', () => {
    const lines = parseInt(document.getElementById('lines').value);
    const bet = parseFloat(document.getElementById('bet').value);

    if (isNaN(lines) || lines < 1 || lines > 3) {
        alert('Invalid number of lines');
        return;
    }

    if (isNaN(bet) || bet <= 0 || bet > balance / lines) {
        alert('Invalid bet amount');
        return;
    }

    balance -= bet * lines;
    updateBalanceDisplay();

    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);

    const winnings = getWinnings(rows, bet, lines);
    balance += winnings;
    updateBalanceDisplay();
    updateWinningsDisplay(winnings);

    if (balance <= 0) {
        alert("You've run out of money!");
    }
});
