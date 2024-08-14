// Function to show the first video section and play the video
function playVideoWhenInView() {
    const video = document.getElementById('firstVideo');
    const story1 = document.getElementById('story1');
    
    // Show the first story section
    story1.style.display = 'block';

    // Create an IntersectionObserver to observe when #story1 enters the viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Play the video when #story1 is in view
                video.play();
            } else {
                // Optionally pause the video when #story1 is out of view
                video.pause();
            }
        });
    }, { threshold: 0.5 }); // Adjust threshold as needed

    // Start observing #story1
    observer.observe(story1);

    // Add an event listener for when the video ends
    video.addEventListener('ended', function() {
        // Hide the first story section
        story1.style.display = 'none';
        
        // Show the end story section
        document.getElementById('endstory').style.display = 'block';
    });
}

// Automatically start video logic without requiring user interaction
document.addEventListener('DOMContentLoaded', function() {
    playVideoWhenInView();
});