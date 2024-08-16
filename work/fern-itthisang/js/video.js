// Function to show the first video section and play the video
function playVideoWhenInView() {
    const video = document.getElementById('firstVideo');
    const story1 = document.getElementById('story1');
    const nextSection = document.getElementById('endstory'); // The section to slide to after the video ends

    if (!video || !story1 || !nextSection) {
        console.error('Required elements not found');
        return;
    }

    // Show the first story section
    story1.style.display = 'block';

    // Create an IntersectionObserver to observe when #story1 enters the viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Play the video when #story1 is in view
                video.play().catch((error) => {
                    console.error('Video playback failed:', error);
                });
            } else {
                // Pause the video when #story1 is out of view
                video.pause();
            }
        });
    }, { threshold: 0.5 });

    // Start observing #story1 immediately
    observer.observe(story1);

    // Listen for the video ending to slide to the next section
    video.addEventListener('ended', () => {
        // Scroll to the next section smoothly
        nextSection.scrollIntoView({ behavior: 'smooth' });
    });
}

// Automatically start video logic when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    playVideoWhenInView();
});

// Function to add scroll text
function addScrollText(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) {
        console.error(`Section ${sectionId} not found`);
        return;
    }

    const scrollText = document.createElement('div');
    scrollText.textContent = "Scroll to Explore";
    scrollText.style.position = 'absolute';
    scrollText.style.bottom = '10px';
    scrollText.style.right = '10px';
    scrollText.style.color = '#ffffff'; // White text color
    scrollText.style.fontSize = '18px';
    scrollText.style.fontWeight = 'bold';
    scrollText.style.cursor = 'pointer';
    scrollText.style.zIndex = '2000';
    scrollText.style.fontFamily = '"Jersey 20", sans-serif';

    section.style.position = 'relative'; // Make sure the section is positioned relatively to contain the absolute text
    section.appendChild(scrollText);
}

// Apply scroll text to all sections
document.addEventListener('DOMContentLoaded', function() {
    addScrollText('story1');

});
