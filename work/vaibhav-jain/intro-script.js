document.addEventListener('DOMContentLoaded', () => {
    const text1 = document.getElementById('text1');
    const text2 = document.getElementById('text2');
    const overlay = document.getElementById('overlay');

    // Show the first text
    text1.style.opacity = 1;
    text1.style.width = '100%';

    // Ensure the backspace animation starts after the typing animation
    setTimeout(() => {
        text1.classList.remove('show'); // Hide the first text after backspace

        // Show the second text after the first one disappears
        text2.classList.add('show');

        // Optionally hide the overlay or continue with next steps
        setTimeout(() => {
            overlay.style.opacity = 0; // Fade out the overlay if needed
            setTimeout(() => {
                overlay.style.display = 'none'; // Hide the overlay after fade out
                
                // Redirect to index.html after overlay is hidden
                window.location.href = 'index.html';
            }, 2000); // Adjust timing as needed for fade-out completion
        }, 9000); // Adjust timing to match the typing animation of the second proverb
    }, 11000); // Adjust timing to match the typing animation of the first proverb
});
