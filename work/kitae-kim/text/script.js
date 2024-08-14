document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.sequence-image');
    const container = document.querySelector('.container');
    let currentImageIndex = 0;

    // Hide text descriptions initially
    const textDescriptionLeft = document.querySelector('.text-description-left');
    const textDescriptionRight = document.querySelector('.text-description-right');
    textDescriptionLeft.style.display = 'none';
    textDescriptionRight.style.display = 'none';

    // Function to show images in sequence
    function showNextImage() {
        if (currentImageIndex < images.length) {
            images[currentImageIndex].style.display = 'block';
            if (currentImageIndex === 3) { // When G4 or R4 is shown
                if (images[currentImageIndex].src.includes('G4.png')) {
                    textDescriptionLeft.style.display = 'block';
                } else if (images[currentImageIndex].src.includes('R4.png')) {
                    textDescriptionRight.style.display = 'block';
                }
            }
            currentImageIndex++;
        } else {
            container.style.visibility = 'visible';
            images.forEach(img => img.style.display = 'none');
        }
    }

    // Initial image show and set interval to cycle through images
    showNextImage();
    const interval = setInterval(showNextImage, 2000); // Change image every 2 seconds

    // Panel functionality
    const leftPanel = document.querySelector('.left-panel');
    const rightPanel = document.querySelector('.right-panel');

    let leftClickCount = 0;
    let rightClickCount = 0;

    // Add click event listeners to panels
    leftPanel.addEventListener('click', () => {
        handlePanelClick(leftPanel, leftClickCount, 'G');
        leftClickCount = Math.min(leftClickCount + 1, 5); // Stop incrementing after 5
    });

    rightPanel.addEventListener('click', () => {
        handlePanelClick(rightPanel, rightClickCount, 'R');
        rightClickCount = Math.min(rightClickCount + 1, 5); // Stop incrementing after 5
    });

    function handlePanelClick(panel, clickCount, imagePrefix) {
        const images = panel.querySelectorAll('.panel-image');
        const spans = panel.querySelectorAll('.highlight span');

        if (clickCount === 0) {
            panel.classList.toggle('clicked');
            images.forEach(img => img.style.display = 'none'); // Hide images
        } else if (clickCount < 5) {
            panel.classList.remove('clicked');
            images.forEach(img => img.style.display = 'none'); // Hide all images
            const imageToShow = panel.querySelector(`.panel-image[data-index="${clickCount - 1}"]`);
            if (imageToShow) {
                imageToShow.style.display = 'block'; // Show the current image
            }

            // Show text descriptions when G4 or R4 is shown
            if (clickCount === 4 && imagePrefix === 'G') {
                textDescriptionLeft.style.display = 'block';
            } else if (clickCount === 4 && imagePrefix === 'R') {
                textDescriptionRight.style.display = 'block';
            }
        }
    }
});
