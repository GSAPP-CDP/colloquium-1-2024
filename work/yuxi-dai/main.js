// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


// Draggable Floating Box
const movableBox = document.getElementById('movableBox');
const handle = movableBox.querySelector('.handle');
let isDragging = false;
let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

handle.addEventListener('mousedown', dragStart);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === handle) {
        isDragging = true;
    }
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, movableBox);
    }
}

function dragEnd() {
    initialX = currentX;
    initialY = currentY;

    isDragging = false;
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}

document.addEventListener('DOMContentLoaded', function() {
    const floatingBox = document.getElementById('movableBox');
    const header = document.getElementById('mainHeader');

    window.addEventListener('scroll', function() {
        const headerRect = header.getBoundingClientRect();
        if (headerRect.top <= 0) {
            floatingBox.style.display = 'none';
        } else {
            floatingBox.style.display = 'block';
        }
    });
});
