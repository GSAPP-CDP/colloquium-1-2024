const draggableBox = document.getElementById('draggableBox');
let mouseX, mouseY, boxLeft, boxTop;

draggableBox.addEventListener('mousedown', function(e) {
  e.preventDefault(); // Prevent default browser behavior

  // Capture initial mouse and box positions
  mouseX = e.clientX;
  mouseY = e.clientY;
  boxLeft = draggableBox.offsetLeft;
  boxTop = draggableBox.offsetTop;

  function onMouseMove(e) {
    // Calculate the new box position based on initial offsets and mouse movement
    const deltaX = e.clientX - mouseX;
    const deltaY = e.clientY - mouseY;
    draggableBox.style.left = boxLeft + deltaX + 'px';
    draggableBox.style.top = boxTop + deltaY + 'px';
  }

  function onMouseUp() {
    // Remove mousemove and mouseup event listeners
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  // Add mousemove and mouseup event listeners to document for dragging
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

// Prevent default browser drag behavior
draggableBox.ondragstart = function() {
  return false;
};
