const images = [];
for (let i = 1; i <= 17; i++) {
  const img = document.createElement('img');
  img.src = `source/image${i}.png`;
  img.alt = `Image ${i}`;
  img.style.display = 'none';
  document.querySelector('.rectangle').appendChild(img);
  images.push(img);
}

let currentImageIndex = 0;

function showNextImage() {
  images[currentImageIndex].style.display = 'none'; // Hide the current image
  currentImageIndex = (currentImageIndex + 1) % images.length; // Move to the next image
  images[currentImageIndex].style.display = 'block'; // Show the next image
}

images[currentImageIndex].style.display = 'block'; // Show the first image initially
setInterval(showNextImage, 1000); // Change image every 1 second (1000 ms)
