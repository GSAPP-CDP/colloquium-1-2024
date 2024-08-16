// Add click event listeners to all elements with the class 'box'
document.querySelectorAll('.box').forEach(box => {
    box.addEventListener('click', function(event) {
        event.preventDefault();
        
        // Get the URL of the image to display from the 'data-image' attribute
        const imageUrl = this.getAttribute('data-image');
        const viewer = document.getElementById('image-viewer'); // Image element in the modal
        
        // Set the source of the image viewer to the selected image URL
        viewer.src = imageUrl;
        viewer.setAttribute('data-image-url', imageUrl); // Optional: Store the image URL in a data attribute

        // Display the modal
        document.getElementById('image-modal').style.display = 'flex';
    });
});

// Add click event listener to the modal close button
document.querySelector('.modal .close').addEventListener('click', function(event) {
    event.stopPropagation();
    document.getElementById('image-modal').style.display = 'none'; // Hide the modal
});

// Add click event listener to the window to close the modal when clicking outside of it
window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('image-modal')) {
        document.getElementById('image-modal').style.display = 'none'; // Hide the modal
    }
});
