// SCROLL SNAPPING
  // Query sections by specific IDs
  const sections = document.querySelectorAll('#chapter-1, #chapter-2, #chapter-3'); // Add more as needed
  let currentSection = 0;
  let isScrolling = false;

  function scrollToSection(index) {
    isScrolling = true;
    sections[index].scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      isScrolling = false;
    }, 1000); // Adjust the timeout duration as needed
  }

  document.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    if (e.deltaY > 0) { // Scrolling down
      currentSection = Math.min(currentSection + 1, sections.length - 1);
    } else { // Scrolling up
      currentSection = Math.max(currentSection - 1, 0);
    }
    scrollToSection(currentSection);
    e.preventDefault(); // Prevent default scroll behavior
  });

  document.addEventListener('keydown', (e) => {
    if (isScrolling) return;
    if (e.key === 'ArrowDown') {
      currentSection = Math.min(currentSection + 1, sections.length - 1);
      scrollToSection(currentSection);
    } else if (e.key === 'ArrowUp') {
      currentSection = Math.max(currentSection - 1, 0);
      scrollToSection(currentSection);
    }
  });


// FULLSCREEN BUTTON
document.getElementById('fullscreenButton').addEventListener('click', function() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    document.exitFullscreen().catch(err => {
      alert(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
    });
  }
});

// CURSOR

// Create vertical and horizontal lines
const verticalLine = document.createElement('div');
const horizontalLine = document.createElement('div');
const dotCursor = document.createElement('div');

// Style the lines
verticalLine.style.position = 'fixed';
verticalLine.style.width = '1.5px';
verticalLine.style.height = '100vh';
verticalLine.style.backgroundColor = 'black';
verticalLine.style.pointerEvents = 'none';
verticalLine.style.zIndex = '999';
verticalLine.style.left = '0px';  // Initialize position
verticalLine.style.top = '0px';  // Ensure the top property is set
verticalLine.style.opacity = '0.2';  // Set opacity to 50%

horizontalLine.style.position = 'fixed';
horizontalLine.style.width = '100vw';
horizontalLine.style.height = '1.5px';
horizontalLine.style.backgroundColor = 'black';
horizontalLine.style.pointerEvents = 'none';
horizontalLine.style.zIndex = '999';
horizontalLine.style.top = '0px';  // Initialize position
horizontalLine.style.left = '0px';  // Ensure the left property is set
horizontalLine.style.opacity = '0.2';  // Set opacity to 50%

// Style the dot
dotCursor.style.position = 'fixed';
dotCursor.style.width = '8px';
dotCursor.style.height = '8px';
dotCursor.style.backgroundColor = 'black';
dotCursor.style.borderRadius = '50%';
dotCursor.style.pointerEvents = 'none';
dotCursor.style.zIndex = '1001';
dotCursor.style.display = 'none'; // Initially hidden

// Append lines and dot to the body
document.body.appendChild(verticalLine);
document.body.appendChild(horizontalLine);
document.body.appendChild(dotCursor);

// Update line and dot positions on mouse move
document.addEventListener('mousemove', function(e) {
  verticalLine.style.left = e.clientX + 'px';
  horizontalLine.style.top = e.clientY + 'px';
  
  if (e.clientY < 130) { // Show the dot when near the top of the window
    dotCursor.style.display = 'block';
    dotCursor.style.left = e.clientX + 'px';
    dotCursor.style.top = e.clientY + 'px';
  } else {
    dotCursor.style.display = 'none';
  }
});



// DRAGGABLE BOX
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

// Change cursor to move-cursor.png when hovering over the box, except for the texts
draggableBox.addEventListener('mouseover', function(e) {
  if (!e.target.matches('a, li, ul')) {
    draggableBox.style.cursor = none;
  }
});

draggableBox.addEventListener('mouseout', function(e) {
  draggableBox.style.cursor = none;
});

document.querySelectorAll('.scroll-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    const offset = 150; // Adjust this value as needed
    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
});



// DRAGGABLE BOX - TEXT

document.addEventListener('DOMContentLoaded', function () {
  const headings = document.querySelectorAll('h1[id]'); // Select h1 elements with id
  const navLinks = document.querySelectorAll('#draggableBox ul li a');

  function changeNavLinkColor() {
    let index = headings.length;

    while (--index && window.scrollY + 500 < headings[index].offsetTop) {}
    
    navLinks.forEach((link) => link.classList.remove('active'));
    navLinks[index].classList.add('active');
  }

  window.addEventListener('scroll', changeNavLinkColor);
  changeNavLinkColor(); // Call once to set initial active link
});
// HIGHLIGHTED NAV LINKS
document.querySelectorAll('#draggableBox ul li a').forEach(link => {
  link.addEventListener('mouseover', function() {
    this.style.backgroundColor = '#ffcc00';
    this.style.color = '#000000'; // Make the text black
  });

  link.addEventListener('mouseout', function() {
    this.style.backgroundColor = '';
    this.style.color = ''; // Reset the text color
  });
});



// MODEL VIEWER
document.addEventListener('DOMContentLoaded', (event) => {
  const modelWrapper = document.querySelector('.model-wrapper');
  const leftArrow = document.getElementById('leftArrow');
  const rightArrow = document.getElementById('rightArrow');
  const models = document.querySelectorAll('model-viewer');

  let currentModelIndex = 0;

  function updateModelPosition() {
    const offset = -currentModelIndex * 33.3; // Adjust the offset percentage to match the model width
    modelWrapper.style.transform = `translateX(${offset}%)`;
  }

  leftArrow.addEventListener('click', () => {
    currentModelIndex = (currentModelIndex === 0) ? models.length - 1 : currentModelIndex - 1;
    updateModelPosition();
  });

  rightArrow.addEventListener('click', () => {
    currentModelIndex = (currentModelIndex === models.length - 1) ? 0 : currentModelIndex + 1;
    updateModelPosition();
  });
});

// CSV SCROLLABLE WINDOW
document.addEventListener('DOMContentLoaded', function() {
  const csvContent = document.getElementById('csv-content');
  const csvUrl = 'https://raw.githubusercontent.com/halfward/data/main/High-Line-Arts.csv'; // Replace with the actual URL of your CSV file

  fetch(csvUrl)
    .then(response => response.text())
    .then(data => displayCSV(data))
    .catch(error => console.error('Error fetching CSV:', error));

  function displayCSV(data) {
    const rows = data.split('\n');
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    
    rows.forEach((row, index) => {
      const tr = document.createElement('tr');
      const cells = row.split(',');

      cells.forEach(cell => {
        const cellElement = document.createElement(index === 0 ? 'th' : 'td');
        cellElement.textContent = cell;
        tr.appendChild(cellElement);
      });

      if (index === 0) {
        thead.appendChild(tr);
      } else {
        tbody.appendChild(tr);
      }
    });

    table.appendChild(thead);
    table.appendChild(tbody);

    csvContent.innerHTML = ''; // Clear previous content
    csvContent.appendChild(table);
  }
});


// RANDOM WORD A
const wordsA = ["office", "windmill", "smokehouse", "church", "bathhouse", "tannery", "factory", "foundry", "fire tower", "silo", "print shop", "temple", "castle", "prison", "train yard", "monument"];

function getRandomWordA() {
    return wordsA[Math.floor(Math.random() * wordsA.length)];
}

function updateWordA() {
    const wordContainer = document.getElementById('random-word-A');
    const newWord = getRandomWordA();
    
    // Create a temporary element to measure the width of the new word
    const temp = document.createElement('span');
    temp.style.visibility = 'hidden';
    temp.style.whiteSpace = 'nowrap';
    temp.textContent = newWord;
    document.body.appendChild(temp);
    const newWidth = temp.offsetWidth;
    document.body.removeChild(temp);
    
    // Update width first, then opacity and text
    wordContainer.style.width = newWidth + 'px';
    wordContainer.style.opacity = 0;
    
    setTimeout(() => {
        wordContainer.textContent = newWord;
        wordContainer.style.opacity = 1;
    }, 500); // Match the CSS transition duration
}

setInterval(updateWordA, 2000);
updateWordA();


// RANDOM WORD B
const wordsB = ["apartment", "skate park", "incubator space", "shelter", "data center", "esports arena", "school", "library", "museum", "zoo", "park", "art museum", "garden", "aquarium", "garden"];

function getRandomWordB() {
    return wordsB[Math.floor(Math.random() * wordsB.length)];
}

function updateWordB() {
    const wordContainer = document.getElementById('random-word-B');
    const newWord = getRandomWordB();
    
    // Create a temporary element to measure the width of the new word
    const temp = document.createElement('span');
    temp.style.visibility = 'hidden';
    temp.style.whiteSpace = 'nowrap';
    temp.textContent = newWord;
    document.body.appendChild(temp);
    const newWidth = temp.offsetWidth;
    document.body.removeChild(temp);
    
    // Update width first, then opacity and text
    wordContainer.style.width = newWidth + 'px';
    wordContainer.style.opacity = 0;
    
    setTimeout(() => {
        wordContainer.textContent = newWord;
        wordContainer.style.opacity = 1;
    }, 500); // Match the CSS transition duration
}

setInterval(updateWordB, 2000);
updateWordB();

