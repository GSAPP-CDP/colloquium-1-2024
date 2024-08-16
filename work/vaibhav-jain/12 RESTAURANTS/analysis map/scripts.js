document.querySelectorAll('.box').forEach(box => {
    box.addEventListener('click', function(event) {
        event.preventDefault();
        const imageUrl = this.getAttribute('data-image'); // Updated to get image URL
        const viewer = document.getElementById('image-viewer'); // Changed ID to image-viewer
        
        viewer.src = imageUrl; // Directly set image source
        viewer.setAttribute('data-image-url', imageUrl); // Store image URL

        document.getElementById('image-modal').style.display = 'flex'; // Changed modal ID to image-modal
    });
});

document.querySelector('.modal .close').addEventListener('click', function(event) {
    event.stopPropagation();
    document.getElementById('image-modal').style.display = 'none'; // Changed modal ID to image-modal
});

window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('image-modal')) {
        document.getElementById('image-modal').style.display = 'none'; // Changed modal ID to image-modal
    }
});
