document.addEventListener('DOMContentLoaded', function() {
    // Toggle grid background visibility
    const gridBackground = document.querySelector('.grid-background');
    const triggerImage = document.getElementById('trigger-image');

    if (triggerImage && gridBackground) {
        triggerImage.addEventListener('click', function() {
            gridBackground.classList.toggle('hidden');
        });
    }

    // Make the draggable box draggable
    const draggableBox = document.getElementById('draggableBox');
    if (draggableBox) {
        makeDraggable(draggableBox);
    }

    // Smooth scrolling for links
    document.querySelectorAll('.scroll-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
    
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Add images to the "waste from consumption" section
    const wasteSection = document.getElementById('section2');
    if (wasteSection) {
        // First image
        const imgElement1 = document.createElement('img');
        imgElement1.src = 'media/DIAGRAMS-06.png'; // Replace with your image path
        imgElement1.style.width = '900px';
        imgElement1.style.height = '900px';
        imgElement1.style.position = 'absolute';
        imgElement1.style.top = '50px';
        imgElement1.style.left = '10px';
        imgElement1.style.objectFit = 'contain';
        wasteSection.appendChild(imgElement1);
        makeDraggable(imgElement1);

        // Second image
        const imgElement2 = document.createElement('img');
        imgElement2.src = 'media/DIAGRAMS-01.png'; // Replace with your second image path
        imgElement2.style.width = '1000px';
        imgElement2.style.height = '1000px';
        imgElement2.style.position = 'absolute';
        imgElement2.style.top = '800px';
        imgElement2.style.left = '10px';
        imgElement2.style.objectFit = 'contain';
        wasteSection.appendChild(imgElement2);
        makeDraggable(imgElement2);
    }
});

// Function to make an element draggable
function makeDraggable(draggableElement) {
    let mouseX, mouseY, boxLeft, boxTop;

    draggableElement.addEventListener('mousedown', function(e) {
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

    draggableElement.ondragstart = function() {
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
