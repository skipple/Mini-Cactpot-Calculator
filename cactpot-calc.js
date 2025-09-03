// Runs after the page loads
window.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("calculate-btn");
  button.addEventListener("click", handleCalculate);
});


function handleCalculate() {
  
  //set the options for all posible combinations
  const options = [
    [0, 1, 2], // row 1
    [3, 4, 5], // row 2
    [6, 7, 8], // row 3
    [0, 3, 6], // col 1
    [1, 4, 7], // col 2
    [2, 5, 8], // col 3
    [0, 4, 8], // diag top-left to bottom-right
    [2, 4, 6]  // diag top-right to bottom-left
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

  for (let i = 0; i <= 8, i++){
    let optionEV = calculateOptionEV(optionValues[i], availableNumbers);
  }

  const resultDiv = document.getElementById("result");
  resultDiv.textContent = JSON.stringify(optionValues);

}

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
  // to do:
  // find the null values in the optionValues set
  // if no null values exists, simply return the sole gilValue as the EV.
  // else, for the number of null values that exists, itterate through all possible unique comindations of available numbers
    // Take the first null position.
    // For each number in availableNumbers:
      // Create a copy of optionValues with that null filled in.
      // Create a copy of availableNumbers without that number.
      // Call the same function again to fill the next null.
      // Base case: when no nulls remain, evaluate the gil value.
  // add these combinations to a new array
  // for each item in the array, total them, and call gilValue. Store the resulting gil values in a new array
  // return the total gilValue devided by the number of values as the EV.
}
