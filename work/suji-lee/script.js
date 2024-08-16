document.addEventListener('mousemove', (e) => {
  const contents = document.querySelectorAll('.content');
  const descriptionBox = document.getElementById('description-box');

  let isHovering = false;

  contents.forEach((content) => {
    const rect = content.getBoundingClientRect();
    const dx = e.clientX - rect.left - rect.width / 2;
    const dy = e.clientY - rect.top - rect.height / 2;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 100) {
      content.classList.add('clear');
      const description = content.getAttribute('data-description');
      descriptionBox.textContent = description;

      // Change description box color based on content
      if (
        content.id === 'content1' ||
        content.id === 'content2' ||
        content.id === 'content3'
      ) {
        descriptionBox.classList.add('red-background');
        descriptionBox.classList.remove('green-background');
      } else if (
        content.id === 'content4' ||
        content.id === 'content5' ||
        content.id === 'content6' ||
        content.id === 'content7'
      ) {
        descriptionBox.classList.add('green-background');
        descriptionBox.classList.remove('red-background');
      }

      isHovering = true;
    } else {
      content.classList.remove('clear');
    }
  });

  // Reset description box color if not hovering over any content
  if (!isHovering) {
    descriptionBox.classList.remove('red-background', 'green-background');
    descriptionBox.textContent = ''; // Clear description when not hovering
  }
});
