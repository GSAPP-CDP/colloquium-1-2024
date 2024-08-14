document.addEventListener('DOMContentLoaded', function() {
    // Make the draggable box draggable
    makeDraggable(document.getElementById('draggableBox'));

    // Smooth scrolling for links
    document.querySelectorAll('.scroll-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Function to create and add a video box
    function createVideoBox(src, left, top, isClickable = false, sizeMultiplier = 1) {
        const videoBox = document.createElement('div');
        videoBox.style.width = `${500 * sizeMultiplier}px`; // 30% larger than 300px, multiplied by sizeMultiplier
        videoBox.style.height = `${281 * sizeMultiplier}px`; // Maintain 16:9 aspect ratio for width, multiplied by sizeMultiplier
        videoBox.style.border = '0px solid #000';
        videoBox.style.padding = '0px';
        videoBox.style.position = 'absolute';
        videoBox.style.left = left;
        videoBox.style.top = top;
        videoBox.style.backgroundColor = '#fff';
        videoBox.style.cursor = 'move'; // Change cursor to move when hovering over the box
        videoBox.style.overflow = 'hidden'; // Hide overflow to crop the logo
        videoBox.style.borderRadius = '10px'; // Round off the corners of the box

        let mediaElement = document.createElement('video');
        mediaElement.src = src; // Replace with the path to your video file
        mediaElement.controls = false; // Remove video controls (play, pause, etc.)
        mediaElement.loop = true; // Play each video on a loop
        mediaElement.autoplay = true; // Automatically start playing the video
        mediaElement.style.width = '100%';
        mediaElement.style.height = '100%';
        mediaElement.style.objectFit = 'cover'; // Ensure the video covers the box while maintaining aspect ratio
        mediaElement.addEventListener('ended', function() {
            mediaElement.currentTime = 0;
            mediaElement.play();
        });

        if (isClickable) {
            mediaElement.style.cursor = 'pointer';
            mediaElement.addEventListener('click', function() {
                videoBox.style.width = `${1000 * sizeMultiplier}px`; // Double the current width
                videoBox.style.height = `${562 * sizeMultiplier}px`; // Double the current height, maintaining 16:9 aspect ratio
            });
        }

        videoBox.appendChild(mediaElement);
        document.body.appendChild(videoBox);

        // Make the videoBox draggable
        makeDraggable(videoBox);
    }

    // Add video boxes centered in pairs in three rows
    const videoSources = [
        { src: 'media/P1.mp4', left: '25%', top: '10%' },
        { src: 'media/P2.mp4', left: '55%', top: '10%' },
        { src: 'media/W1.mp4', left: '25%', top: '40%' },
        { src: 'media/W2.mp4', left: '55%', top: '40%' },
        { src: 'media/C1.mp4', left: '25%', top: '70%' },
        { src: 'media/C2.mp4', left: '55%', top: '70%', isClickable: true, sizeMultiplier: 1, pointerEvents: 'auto' }
    ];

    videoSources.forEach(video => {
        createVideoBox(video.src, video.left, video.top, video.isClickable, video.sizeMultiplier);
    });
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

let textbox;

document.addEventListener('click', (e) => {
    if (e.target.tagName === 'VIDEO' && e.target.src.includes('C2.mp4')) {
        if (!textbox) {
            textbox = document.createElement('div');
            textbox.style.display = 'flex';
            textbox.style.justifyContent = 'center';
            textbox.style.alignItems = 'center';
            textbox.style.position = 'absolute';
            textbox.style.zIndex = '1000'; // Ensure the textbox is above other elements
            textbox.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            textbox.style.color = 'black';
            textbox.style.padding = '10px';
            const listItems = [
                '[upcycled plastic]     I did it because it was there.',
                '[reclaimed wood]       I did it because it was there.',
                '[mycelium module]      I did it because it was there.',
                '[what is next?]'      
            ];

            const ul = document.createElement('ul');
            ul.style.listStyleType = 'none';
            ul.style.padding = '0';
            ul.style.margin = '0';
            ul.style.marginTop = '15px';

            listItems.forEach(item => {
                const li = document.createElement('li');
                li.style.color = 'black';
                li.style.textDecoration = 'none';
                li.style.fontFamily = '\'Host Grotesk\', sans-serif';
                li.style.fontSize = '2rem';
                li.style.padding = '0.15rem';
                li.style.margin = '0.3rem';
                li.style.marginTop = '35px';
                li.style.marginLeft = '10px';
                li.style.lineHeight = '1.5';
                li.style.fontWeight = 'normal';
                li.textContent = item;
                ul.appendChild(li);
            });

            textbox.appendChild(ul);
            document.body.appendChild(textbox);
        }

        const videoRect = e.target.getBoundingClientRect();
        textbox.style.left = `${videoRect.left - videoRect.width}px`; // Position the textbox to the left of the video
        textbox.style.top = `${videoRect.top}px`; // Align the top of the textbox with the top of the video
        textbox.style.width = `${videoRect.width}px`;
        textbox.style.height = `${videoRect.height}px`;
    }
});
