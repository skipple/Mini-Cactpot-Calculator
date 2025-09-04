// Runs after the page loads
window.addEventListener("DOMContentLoaded", () => {
  const resetButton = document.getElementById("reset-btn");
  resetButton.addEventListener("click", handleReset);
  
  // Add event listeners to all number inputs to toggle background image and validate input
  for (let i = 1; i <= 9; i++) {
    const input = document.getElementById(`num-${i}-entry`);
    input.addEventListener('input', handleCalculate);
    input.addEventListener('input', toggleBackgroundImage);
    input.addEventListener('input', validateInput);
  }
});

function toggleBackgroundImage(event) {
  const input = event.target;
  if (input.value.trim() !== '') {
    input.classList.add('filled');
  } else {
    input.classList.remove('filled');
  }
  
  // Check field count and manage input states when fields are cleared
  manageInputStates();
}

function validateInput(event) {
  const input = event.target;
  let value = input.value;
  
  // Remove any non-digit characters
  value = value.replace(/[^0-9]/g, '');
  
  // If value is not empty, ensure it's between 1-9
  if (value !== '') {
    const numValue = parseInt(value, 10);
    if (numValue < 1 || numValue > 9) {
      // If the number is outside 1-9 range, clear the input
      value = '';
    } else {
      // Ensure we only keep the valid number
      value = numValue.toString();
    }
  }
  
  // Update the input value if it changed
  if (input.value !== value) {
    input.value = value;
  }
  
  // Check field count and manage input states
  manageInputStates();
}

function manageInputStates() {
  // Count filled fields
  let filledCount = 0;
  const allInputs = [];
  
  for (let i = 1; i <= 9; i++) {
    const input = document.getElementById(`num-${i}-entry`);
    allInputs.push(input);
    if (input.value.trim() !== '') {
      filledCount++;
    }
  }
  
  // If 4 fields are filled, disable all empty fields
  if (filledCount >= 4) {
    allInputs.forEach(input => {
      if (input.value.trim() === '') {
        input.disabled = true;
        input.classList.add('disabled');
      }
    });
  } else {
    // If less than 4 fields are filled, enable all fields
    allInputs.forEach(input => {
      input.disabled = false;
      input.classList.remove('disabled');
    });
  }
}

function handleReset() {
  for (let i = 1; i <= 9; i++) {
    const input = document.getElementById(`num-${i}-entry`);
    input.value = '';
    input.disabled = false;
    input.classList.remove('disabled');
    input.classList.remove('filled');
  }
  const bestOptionsDiv = document.getElementById("best-options");
  const expectedValueDiv = document.getElementById("expected-value");
  bestOptionsDiv.textContent = '';
  expectedValueDiv.textContent = '';
  manageInputStates();
}


function handleCalculate() {
  
  //set the options for all posible combinations
  const options = [
    [0, 1, 2], // row 1
    [3, 4, 5], // row 2
    [6, 7, 8], // row 3
    [0, 3, 6], // col 1
    [1, 4, 7], // col 2
    [2, 5, 8], // col 3
    [0, 4, 8], // diag top-left
    [2, 4, 6]  // diag top-right
  ];
  
  // grab values from the grid
  const board = [];
  for (let i = 1; i <= 9; i++) {
    const value = document.getElementById(`num-${i}-entry`).value;
    board.push(value === "" ? null : parseInt(value, 10));
  }

  //map the board values to all possible combinations
  const optionValues = options.map(line => line.map(i => board[i]));

  // create a list of all taken and available numbers
  const takenNumbers = board.filter(element => element !== null);
  const allNumbers = [1,2,3,4,5,6,7,8,9]
  const availableNumbers = allNumbers.filter(item => !takenNumbers.includes(item));

  const bestOptionsDiv = document.getElementById("best-options");
  const expectedValueDiv = document.getElementById("expected-value");
  

  const evs = optionValues.map(option => calculateOptionEV(option, availableNumbers));
  const maxEV = Math.max(...evs);
  const bestOptions = evs
    .map((ev, index) => ({ ev, index }))
    .filter(item => item.ev === maxEV)
    .map(item => options[item.index]);

  // display the best options and their expected EV
  bestOptionsDiv.textContent = `Best Options: ${JSON.stringify(bestOptions)}`;
  expectedValueDiv.textContent = `Expected Value: ${maxEV.toFixed(0)} gil`;

}

// returns the gil value for a given total
function gilValue(total){
  const valueToGil = {
    6:10000,
    7:36,
    8: 720,
    9: 360,
    10: 80,
    11: 252,
    12: 108,
    13: 72,
    14: 54,
    15: 180,
    16: 72,
    17: 180,
    18: 119,
    19: 36,
    20: 306,
    21: 1080,
    22: 144,
    23: 1800,
    24: 3600
  }

  return valueToGil[total]
}

function calculateOptionEV(optionValues, availableNumbers) {
  // find the null values in the optionValues set
  const nullCount = optionValues.filter(item => item === null).length;

  // if no null values exists, simply return the sole gilValue as the EV.
  if (nullCount === 0) {
    const total = optionValues.reduce((sum, val) => sum + val, 0);
    return gilValue(total);
  }

  // if null values exist, we need to calculate the EV across all possible combinations
  else {
    // find the index of the first null value
    const nullIndex = optionValues.indexOf(null);
    let evTotal = 0;
    let combinationCount = 0;
    // iterate through all available numbers, substituting each one in turn and recursively calculating the EV
    for (let i = 0; i < availableNumbers.length; i++) {
      const number = availableNumbers[i];
      const newOptionValues = [...optionValues];
      newOptionValues[nullIndex] = number;
      const newAvailableNumbers = availableNumbers.filter((_, index) => index !== i);
      // recursively calculate the EV for this new set of option values
      const ev = calculateOptionEV(newOptionValues, newAvailableNumbers);
      evTotal += ev;
      combinationCount++;
    }
    return evTotal / combinationCount;
  }
}
