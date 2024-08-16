function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.add('active');
            section.scrollIntoView({ behavior: 'smooth' });
        } else {
            section.classList.remove('active');
        }
    });
}

// Event listeners for navigation links
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const sectionId = this.getAttribute('href').substring(1);
        showSection(sectionId);
    });
});

// Change text color on scroll
const projectNameSection = document.getElementById('project-name-section');
const projectName = document.getElementById('project-name');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const sectionHeight = projectNameSection.offsetHeight;
    const opacity = scrollY / sectionHeight;

    if (opacity > 0.5) {
        projectName.style.color = '#ff006d';
    } else {
        projectName.style.color = `rgba(255, 0, 109, ${opacity})`;
    }
});
