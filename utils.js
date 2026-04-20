// Utility functions for randomization and helpers

export const Utils = {
  // Returns a random integer between min (inclusive) and max (inclusive)
  randomInt: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Returns a boolean with a given probability (0.0 to 1.0)
  chance: (probability) => {
    return Math.random() < probability;
  },

  // Pick a random element from an array
  pickRandom: (array) => {
    if (!array || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
  },

  // Returns a promise that resolves after ms milliseconds
  sleep: (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Gaussian/Normal distribution random number (Box-Muller transform)
  randomNormal: (mean, stdDev) => {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    return num * stdDev + mean;
  },
    
  // Current timestamp helper
  now: () => Date.now()
};
