
// User interaction module

export function setupInteraction(triggerColorChange, getToggleState) {
  // Interaction zone to detect mouse/finger movement
  function isWithinZone(x, y) {
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;
    const rectTop = screenHeight * 0.2; // Top boundary of the zone
    const rectBottom = screenHeight * 0.9; // Bottom boundary of the zone
    const rectLeft = screenWidth * 0.2; // Left boundary of the zone
    const rectRight = screenWidth * 0.8; // Right boundary of the zone
    
    return y > rectTop && y < rectBottom && x > rectLeft && x < rectRight;
  }

  // For web: handle mouse movements
  document.addEventListener('mousemove', (event) => {
    const toggle = getToggleState();
    if (isWithinZone(event.clientX, event.clientY)) {
      if (!toggle) {
        triggerColorChange();
      }
    } else {
      if (toggle) {
        triggerColorChange();
      }
    }
  });

  // For mobile: handle touch events
  document.addEventListener('touchmove', (event) => {
    const toggle = getToggleState();
    const touch = event.touches[0];
    if (isWithinZone(touch.clientX, touch.clientY)) {
      if (!toggle) {
        triggerColorChange();
      }
    } else {
      if (toggle) {
        triggerColorChange();
      }
    }
  });
}
