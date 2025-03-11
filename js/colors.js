
// Color utility functions

// Function to get a random color from the defined set
export function getRandomColor() {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff']; // Red, Green, Blue, Yellow, Cyan
  return colors[Math.floor(Math.random() * colors.length)];
}

// Function to check if two colors are similar
export function areColorsSimilar(color1, color2) {
  const similarPairs = [
    ['#ff0000', '#ff00ff'], // Red and Magenta (even though magenta is removed)
    ['#00ff00', '#ffff00'], // Green and Yellow
    ['#0000ff', '#00ffff']  // Blue and Cyan
  ];
  return similarPairs.some(pair => pair.includes(color1) && pair.includes(color2));
}
