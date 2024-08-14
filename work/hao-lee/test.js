document.addEventListener("DOMContentLoaded", function() {
    const numSlides = 7; // Number of slides
    const container = document.getElementById('slideshow-container');
    const imagePaths = Array.from({length: numSlides}, (_, i) => `screenshots/screenshots-0${i + 1}.webp`);

    // Create slides
    for (let i = 0; i < numSlides; i++) {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        slide.style.backgroundImage = `url(${imagePaths[i]})`;
        container.appendChild(slide);
    }

    const slides = Array.from(container.children);
    let currentIndex = 0;

    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.classList.remove('previous-slide', 'current-slide', 'next-slide');
            if (index === (currentIndex - 1 + numSlides) % numSlides) {
                slide.classList.add('previous-slide');
            } else if (index === currentIndex) {
                slide.classList.add('current-slide');
            } else if (index === (currentIndex + 1) % numSlides) {
                slide.classList.add('next-slide');
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % numSlides;
        updateSlides();
    }

    // Initialize slides
    updateSlides();

    // Change slides every 3 seconds
    setInterval(nextSlide, 3000);
});
