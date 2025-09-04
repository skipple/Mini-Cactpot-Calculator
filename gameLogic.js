/**
 * Game Logic Module for Mini Cactpot Calculator
 * Contains all the core calculation functions for determining optimal strategies
 */

/**
 * Returns the MGP value for a given total
 * @param {number} total - The sum of three numbers
 * @returns {number} The MGP reward for that total
 */
function gilValue(total) {
  const valueToGil = {
    6: 10000,
    7: 36,
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
  };

  return valueToGil[total] || 0;
}

/**
 * Calculates the expected value (EV) for a given option with available numbers
 * @param {Array} optionValues - Array of three values (some may be null)
 * @param {Array} availableNumbers - Array of numbers that can fill null positions
 * @returns {number} The expected value for this option
 */
function calculateOptionEV(optionValues, availableNumbers) {
  // Find the null values in the optionValues set
  const nullCount = optionValues.filter(item => item === null).length;

  // If no null values exist, simply return the sole gilValue as the EV
  if (nullCount === 0) {
    const total = optionValues.reduce((sum, val) => sum + val, 0);
    return gilValue(total);
  }

  // If null values exist, we need to calculate the EV across all possible combinations
  else {
    // Find the index of the first null value
    const nullIndex = optionValues.indexOf(null);
    let evTotal = 0;
    let combinationCount = 0;
    
    // Iterate through all available numbers, substituting each one in turn and recursively calculating the EV
    for (let i = 0; i < availableNumbers.length; i++) {
      const number = availableNumbers[i];
      const newOptionValues = [...optionValues];
      newOptionValues[nullIndex] = number;
      const newAvailableNumbers = availableNumbers.filter((_, index) => index !== i);
      
      // Recursively calculate the EV for this new set of option values
      const ev = calculateOptionEV(newOptionValues, newAvailableNumbers);
      evTotal += ev;
      combinationCount++;
    }
    return evTotal / combinationCount;
  }
}

/**
 * Calculates the best options and expected value for the current board state
 * @param {Array} board - Array of 9 values representing the current board state
 * @returns {Object} Object containing bestOptions and maxEV
 */
function calculateBestOptions(board) {
  // Set the options for all possible combinations
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

  // Map the board values to all possible combinations
  const optionValues = options.map(line => line.map(i => board[i]));

  // Create a list of all taken and available numbers
  const takenNumbers = board.filter(element => element !== null);
  const allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const availableNumbers = allNumbers.filter(item => !takenNumbers.includes(item));

  const evs = optionValues.map(option => calculateOptionEV(option, availableNumbers));
  const maxEV = Math.max(...evs);
  const bestOptions = evs
    .map((ev, index) => ({ ev, index }))
    .filter(item => item.ev === maxEV)
    .map(item => options[item.index]);

  return {
    bestOptions,
    maxEV,
    optionNames: [
      'Row 1', 'Row 2', 'Row 3',
      'Column 1', 'Column 2', 'Column 3',
      'Diagonal (Top-Left)', 'Diagonal (Top-Right)'
    ]
  };
}

/**
 * Formats the best options for display
 * @param {Array} bestOptions - Array of best option indices
 * @param {Array} optionNames - Array of option names
 * @returns {string} Formatted string of best options
 */
function formatBestOptions(bestOptions, optionNames) {
  if (bestOptions.length === 0) {
    return 'No valid options';
  }
  
  const optionStrings = bestOptions.map(option => {
    const optionIndex = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ].findIndex(opt => 
      opt[0] === option[0] && opt[1] === option[1] && opt[2] === option[2]
    );
    return optionNames[optionIndex];
  });
  
  return optionStrings.join(', ');
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    gilValue,
    calculateOptionEV,
    calculateBestOptions,
    formatBestOptions
  };
}
