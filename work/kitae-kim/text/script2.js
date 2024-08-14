document.addEventListener("DOMContentLoaded", function() {
    function setupClickBox(clickBoxClass, panelClass, colorClass, redirectUrl) {
        const clickBox = document.querySelector(clickBoxClass);
        const panel = document.querySelector(panelClass);
        const paragraphs = panel.querySelectorAll(`.highlight.${colorClass}`);
        let currentIndex = 0;
        let allShown = false; // Flag to track if all paragraphs are shown

        clickBox.addEventListener("click", function(event) {
            const screenWidth = window.innerWidth;
            const clickX = event.clientX;

            // Check if the click is on the left or right of the screen center
            if (clickX < screenWidth / 2 && clickBoxClass === '.click-box1') {
                // Clicked on the left side of the screen center
                if (currentIndex < paragraphs.length) {
                    paragraphs[currentIndex].style.display = 'block';
                    currentIndex++;
                }
            } else if (clickX >= screenWidth / 2 && clickBoxClass === '.click-box2') {
                // Clicked on the right side of the screen center
                if (currentIndex < paragraphs.length) {
                    paragraphs[currentIndex].style.display = 'block';
                    currentIndex++;

                    // Check if all paragraphs are shown
                    if (currentIndex >= paragraphs.length) {
                        allShown = true;
                    }

                    // Redirect if all paragraphs are shown and the box is clicked again
                    clickBox.addEventListener("click", function() {
                        if (allShown) {
                            window.location.href = redirectUrl;
                        }
                    }, { once: true });
                }
            }
        });
    }

    setupClickBox('.click-box1', '.left-panel', 'green', '');
    setupClickBox('.click-box2', '.right-panel', 'red', 'text.html'); // Replace with your URL
});