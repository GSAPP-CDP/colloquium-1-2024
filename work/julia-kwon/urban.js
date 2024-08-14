// Toggle grid background visibility
const gridBackground = document.querySelector('.grid-background');
const triggerImage = document.getElementById('trigger-image');

if (triggerImage) {
    triggerImage.addEventListener('click', function () {
        if (gridBackground) {
            gridBackground.classList.toggle('hidden');
        }
    });
}

// Make the draggable box draggable
makeDraggable(document.getElementById('draggableBox'));

// Smooth scrolling for links
document.querySelectorAll('.scroll-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Function to make an element draggable
function makeDraggable(draggableElement) {
    let mouseX, mouseY, boxLeft, boxTop;

    draggableElement.addEventListener('mousedown', function (e) {
        e.preventDefault();

        mouseX = e.clientX;
        mouseY = e.clientY;
        boxLeft = draggableElement.offsetLeft;
        boxTop = draggableElement.offsetTop;

        function onMouseMove(e) {
            const deltaX = e.clientX - mouseX;
            const deltaY = e.clientY - mouseY;
            draggableElement.style.left = boxLeft + deltaX + 'px';
            draggableElement.style.top = boxTop + deltaY + 'px';
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    draggableElement.ondragstart = function () {
        return false;
    };
}

// Smooth horizontal scrolling on wheel
document.addEventListener('wheel', (event) => {
    if (event.deltaY !== 0) {
        window.scrollBy({
            left: event.deltaY * 2,
            behavior: 'smooth'
        });
        event.preventDefault();
    }
});