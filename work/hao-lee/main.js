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
    draggableBox.style.cursor = 'url("move-cursor.png") 8 8, move';
  }
});

draggableBox.addEventListener('mouseout', function(e) {
  draggableBox.style.cursor = 'url("move-cursor.png") 8 8, move';
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
const wordsA = ["office","windmill", "smokehouse", "church", "bathhouse", "tannery", "factory", "foundry", "fire tower", "silo", "print shop", "temple", "castle", "prison", "train yard", "monument"];

// Function to get a random word from the list wordsA
function getRandomWordA() {
    return wordsA[Math.floor(Math.random() * wordsA.length)];
}

// Function to update the word in the HTML for wordsA
function updateWordA() {
    const wordContainer = document.getElementById('random-word-A');
    wordContainer.textContent = getRandomWordA();
}

setInterval(updateWordA, 1000);
updateWordA();


// RANDOM WORD B
const wordsB = ["apartment", "skate park", "incubator space", "shelter", "data center", "esports arena", "school", "library", "museum", "zoo", "park", "art museum", "garden", "aquarium", "garden"];

// Function to get a random word from the list
function getRandomWordB() {
    return wordsB[Math.floor(Math.random() * wordsB.length)];
}

// Function to update the word in the HTML
function updateWordB() {
    const wordContainer = document.getElementById('random-word-B');
    wordContainer.textContent = getRandomWordB();
}

setInterval(updateWordB, 1000);
updateWordB();

