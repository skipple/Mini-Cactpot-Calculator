/**
 * UI Manager Module for Mini Cactpot Calculator
 * Handles all DOM manipulation and user interface interactions
 */

/**
 * UI Manager class to handle all UI-related operations
 */
class UIManager {
  constructor() {
    this.minimumInputs = 4;
    this.initializeElements();
    this.setupEventListeners();
  }

  /**
   * Initialize DOM element references
   */
  initializeElements() {
    this.resetButton = document.getElementById("reset-btn");
    this.bestOptionsDiv = document.getElementById("best-options");
    this.expectedValueDiv = document.getElementById("expected-value");
    this.inputs = [];
    
    // Get all number inputs
    for (let i = 1; i <= 9; i++) {
      this.inputs.push(document.getElementById(`num-${i}-entry`));
    }
  }

  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // Reset button
    this.resetButton.addEventListener("click", () => this.handleReset());

    // Input event listeners
    this.inputs.forEach(input => {
      input.addEventListener('input', (e) => this.toggleBackgroundImage(e));
      input.addEventListener('input', (e) => this.validateInput(e));
      input.addEventListener('keydown', (e) => this.preventInvalidInput(e));
      input.addEventListener('input', () => this.checkNumberInputs());
    });
  }

  /**
   * Toggle background image based on input state
   * @param {Event} event - The input event
   */
  toggleBackgroundImage(event) {
    const input = event.target;
    if (input.value.trim() !== '') {
      input.classList.add('filled');
    } else {
      input.classList.remove('filled');
    }

    // Check field count and manage input states when fields are cleared
    this.manageInputStates();
  }

  /**
   * Prevent invalid input characters
   * @param {Event} event - The keydown event
   */
  preventInvalidInput(event) {
    // Allow backspace, delete, tab, escape, enter, and arrow keys
    if ([8, 9, 27, 13, 46, 37, 38, 39, 40].indexOf(event.keyCode) !== -1 ||
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (event.keyCode === 65 && event.ctrlKey === true) ||
      (event.keyCode === 67 && event.ctrlKey === true) ||
      (event.keyCode === 86 && event.ctrlKey === true) ||
      (event.keyCode === 88 && event.ctrlKey === true)) {
      return;
    }

    // Allow only digits 1-9
    if ((event.shiftKey || (event.keyCode < 49 || event.keyCode > 57))) {
      event.preventDefault();
    }
  }

  /**
   * Validate and clean input values
   * @param {Event} event - The input event
   */
  validateInput(event) {
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
    this.manageInputStates();
  }

  /**
   * Manage input states (enabled/disabled) based on filled field count
   */
  manageInputStates() {
    // Count filled fields
    let filledCount = 0;
    const allInputs = this.inputs;

    allInputs.forEach(input => {
      if (input.value.trim() !== '') {
        filledCount++;
      }
    });

    // If minimum fields are filled, disable all empty fields
    if (filledCount >= this.minimumInputs) {
      allInputs.forEach(input => {
        if (input.value.trim() === '') {
          input.disabled = true;
          input.classList.add('disabled');
        }
      });
    } else {
      // If less than minimum fields are filled, enable all fields
      allInputs.forEach(input => {
        input.disabled = false;
        input.classList.remove('disabled');
      });
    }
  }

  /**
   * Check if enough inputs are filled to trigger calculation
   */
  checkNumberInputs() {
    let counter = 0;
    this.inputs.forEach(input => {
      if (input.value.trim() !== '') {
        counter++;
      }
    });
    
    if (counter >= this.minimumInputs) {
      this.handleCalculate();
      return;
    }
  }

  /**
   * Handle the calculation process
   */
  handleCalculate() {
    try {
      // Get current board state
      const board = this.getBoardState();
      
      // Calculate best options using game logic
      const result = calculateBestOptions(board);
      
      // Display results
      this.displayResults(result);
    } catch (error) {
      console.error('Error during calculation:', error);
      this.displayError('An error occurred during calculation. Please try again.');
    }
  }

  /**
   * Get the current state of the board
   * @returns {Array} Array of 9 values representing the board state
   */
  getBoardState() {
    const board = [];
    this.inputs.forEach(input => {
      const value = input.value;
      board.push(value === "" ? null : parseInt(value, 10));
    });
    return board;
  }

  /**
   * Display calculation results
   * @param {Object} result - Result object from calculateBestOptions
   */
  displayResults(result) {
    const formattedOptions = formatBestOptions(result.bestOptions, result.optionNames);
    this.bestOptionsDiv.textContent = `Best Options: ${formattedOptions}`;
    this.expectedValueDiv.textContent = `Expected Value: ${result.maxEV.toFixed(0)} MGP`;
  }

  /**
   * Display error message
   * @param {string} message - Error message to display
   */
  displayError(message) {
    this.bestOptionsDiv.textContent = message;
    this.expectedValueDiv.textContent = '';
  }

  /**
   * Handle reset button click
   */
  handleReset() {
    this.inputs.forEach(input => {
      input.value = '';
      input.disabled = false;
      input.classList.remove('disabled');
      input.classList.remove('filled');
    });
    
    this.bestOptionsDiv.textContent = '';
    this.expectedValueDiv.textContent = '';
    this.manageInputStates();
  }

  /**
   * Set the minimum number of inputs required for calculation
   * @param {number} count - Minimum input count
   */
  setMinimumInputs(count) {
    this.minimumInputs = count;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIManager;
}

// Initialize the application when the DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  try {
    // Initialize the UI manager
    const uiManager = new UIManager();
    
    // Set minimum inputs required for calculation
    uiManager.setMinimumInputs(4);
    
    console.log('Mini Cactpot Calculator initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    // Fallback error display
    const errorDiv = document.createElement('div');
    errorDiv.textContent = 'Failed to initialize calculator. Please refresh the page.';
    errorDiv.style.color = 'red';
    errorDiv.style.textAlign = 'center';
    errorDiv.style.margin = '20px';
    document.body.appendChild(errorDiv);
  }
});
