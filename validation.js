/**
 * Validation Module for Mini Cactpot Calculator
 * Contains all input validation and sanitization logic
 */

/**
 * Validation utility class
 */
class Validation {
  /**
   * Validates if a number is within the valid range (1-9)
   * @param {number} value - The number to validate
   * @returns {boolean} True if valid, false otherwise
   */
  static isValidNumber(value) {
    const num = parseInt(value, 10);
    return !isNaN(num) && num >= 1 && num <= 9;
  }

  /**
   * Sanitizes input by removing non-digit characters
   * @param {string} input - The input string to sanitize
   * @returns {string} Sanitized string containing only digits
   */
  static sanitizeInput(input) {
    return input.replace(/[^0-9]/g, '');
  }

  /**
   * Validates and cleans a single input value
   * @param {string} value - The input value to validate
   * @returns {string} Cleaned and validated value
   */
  static validateAndCleanInput(value) {
    // Remove any non-digit characters
    let cleanedValue = this.sanitizeInput(value);

    // If value is not empty, ensure it's between 1-9
    if (cleanedValue !== '') {
      const numValue = parseInt(cleanedValue, 10);
      if (numValue < 1 || numValue > 9) {
        // If the number is outside 1-9 range, clear the input
        cleanedValue = '';
      } else {
        // Ensure we only keep the valid number
        cleanedValue = numValue.toString();
      }
    }

    return cleanedValue;
  }

  /**
   * Checks if a key press is allowed
   * @param {KeyboardEvent} event - The keyboard event
   * @returns {boolean} True if the key should be allowed, false otherwise
   */
  static isAllowedKey(event) {
    // Allow backspace, delete, tab, escape, enter, and arrow keys
    const allowedKeyCodes = [8, 9, 27, 13, 46, 37, 38, 39, 40];
    if (allowedKeyCodes.includes(event.keyCode)) {
      return true;
    }

    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    const ctrlKeys = [65, 67, 86, 88]; // A, C, V, X
    if (ctrlKeys.includes(event.keyCode) && event.ctrlKey) {
      return true;
    }

    // Allow only digits 1-9
    if (event.shiftKey || (event.keyCode < 49 || event.keyCode > 57)) {
      return false;
    }

    return true;
  }

  /**
   * Validates the entire board state
   * @param {Array} board - Array of 9 values representing the board
   * @returns {Object} Validation result with isValid and errors
   */
  static validateBoard(board) {
    const errors = [];
    const filledValues = [];
    const duplicates = [];

    // Check each position
    board.forEach((value, index) => {
      if (value !== null) {
        // Check if value is valid
        if (!this.isValidNumber(value)) {
          errors.push(`Position ${index + 1} has invalid value: ${value}`);
        } else {
          // Check for duplicates
          if (filledValues.includes(value)) {
            duplicates.push(value);
          } else {
            filledValues.push(value);
          }
        }
      }
    });

    // Add duplicate errors
    if (duplicates.length > 0) {
      errors.push(`Duplicate values found: ${duplicates.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      filledCount: filledValues.length,
      filledValues: filledValues
    };
  }

  /**
   * Checks if the board has enough inputs for calculation
   * @param {Array} board - Array of 9 values representing the board
   * @param {number} minimumRequired - Minimum number of inputs required
   * @returns {boolean} True if enough inputs are present
   */
  static hasEnoughInputs(board, minimumRequired = 4) {
    const filledCount = board.filter(value => value !== null).length;
    return filledCount >= minimumRequired;
  }

  /**
   * Gets available numbers for the board
   * @param {Array} board - Array of 9 values representing the board
   * @returns {Array} Array of available numbers (1-9 not used)
   */
  static getAvailableNumbers(board) {
    const allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const usedNumbers = board.filter(value => value !== null);
    return allNumbers.filter(num => !usedNumbers.includes(num));
  }

  /**
   * Validates input constraints for the Mini Cactpot game
   * @param {Array} board - Array of 9 values representing the board
   * @returns {Object} Validation result with specific game constraints
   */
  static validateGameConstraints(board) {
    const validation = this.validateBoard(board);
    
    if (!validation.isValid) {
      return validation;
    }

    // Additional game-specific validations
    const gameErrors = [];

    // Check if we have at least 4 inputs (minimum for meaningful calculation)
    if (validation.filledCount < 4) {
      gameErrors.push('At least 4 numbers are required for calculation');
    }

    // Check if we have too many inputs (shouldn't happen in normal gameplay)
    if (validation.filledCount > 9) {
      gameErrors.push('Too many inputs provided');
    }

    return {
      isValid: gameErrors.length === 0,
      errors: [...validation.errors, ...gameErrors],
      filledCount: validation.filledCount,
      filledValues: validation.filledValues
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Validation;
}
