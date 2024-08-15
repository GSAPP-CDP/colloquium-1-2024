document.addEventListener('DOMContentLoaded', function() {
    // Toggle grid background visibility
    const gridBackground = document.querySelector('.grid-background');
    const triggerImage = document.getElementById('trigger-image');

    if (triggerImage && gridBackground) {
        triggerImage.addEventListener('click', () => {
            gridBackground.classList.toggle('hidden');
        });
    }

    // Make the draggable box draggable
    const draggableBox = document.getElementById('draggableBox');
    if (draggableBox) {
        makeDraggable(draggableBox);
    }

    // Smooth scrolling for links
    document.querySelectorAll('.scroll-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
    
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    e.preventDefault(); // Prevent the default link behavior
                }
            }
        });
    });

    // Highlight nav links based on scroll position
    const sections = document.querySelectorAll('.section'); // Updated selector
    const navLinks = document.querySelectorAll('#draggableBox ul li a');

    if (sections.length && navLinks.length) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const targetId = entry.target.getAttribute('id');
                const navLink = document.querySelector(`#draggableBox ul li a[href="#${targetId}"]`);
    
                if (navLink) {
                    navLink.classList.toggle('active', entry.isIntersecting);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Highlight nav links on hover
    navLinks.forEach(link => {
        link.addEventListener('mouseover', () => {
            link.classList.add('hovered');
        });

        link.addEventListener('mouseout', () => {
            link.classList.remove('hovered');
        });
    });
});

// Function to make an element draggable
function makeDraggable(draggableElement) {
    let mouseX, mouseY, boxLeft, boxTop;

    draggableElement.addEventListener('mousedown', (e) => {
        e.preventDefault();

        mouseX = e.clientX;
        mouseY = e.clientY;
        boxLeft = draggableElement.offsetLeft;
        boxTop = draggableElement.offsetTop;

        const onMouseMove = (e) => {
            const deltaX = e.clientX - mouseX;
            const deltaY = e.clientY - mouseY;
            draggableElement.style.left = boxLeft + deltaX + 'px';
            draggableElement.style.top = boxTop + deltaY + 'px';
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    draggableElement.ondragstart = () => false;
}

// Smooth horizontal scrolling on wheel
document.addEventListener('wheel', (event) => {
    if (event.deltaY !== 0) {
        window.scrollBy({
            left: event.deltaY * 2,
            behavior: 'smooth'
        });
        // event.preventDefault();
    }
});

// Define the text without the bold text effect
const text = "Inspired by Philippe Petit's statement, 'I did it because they (towers) were there,' I challenge the overlooked potential of reusable and forageable resources in our modern world. By prototyping natural building materials from mycelium, plastics, and reclaimed wood, I reveal a symbiotic system where sustainability enhances the built environment. My future work aims to demonstrate that eco-friendly practices can extend beyond profitability to create lasting impact. I did it too because it was there.";

const speed = 40; // Typing speed in milliseconds
let index = 0; // Initialize index for typing effect

const typingEffectElement = document.getElementById("typingEffect");
typingEffectElement.style.fontFamily = "'Host Grotesk', sans-serif"; // Set the font

function typeWriter() {
    if (index < text.length) {
        const currentChar = text.charAt(index);

        // Check if the current character is part of an HTML tag
        if (currentChar === '<') {
            // Find the closing tag
            const endTagIndex = text.indexOf('>', index);
            if (endTagIndex !== -1) {
                // Extract the full tag
                const tag = text.substring(index, endTagIndex + 1);
                typingEffectElement.innerHTML += tag;
                index = endTagIndex + 1; // Move index to after the tag
            }
        } else {
            typingEffectElement.innerHTML += currentChar;
            index++;
        }
        setTimeout(typeWriter, speed);
    }
}

// const typingEffectElement2 = document.getElementById("typingEffect2");
// const text2 = typingEffectElement2.textContent.trim(); // Get the text content from the span
// function typeWriter2() {
//     if (index < text2.length) {
//         const currentChar2 = text2.charAt(index);

//         // Check if the current character is part of an HTML tag
//         if (currentChar2 === '<') {
//             // Find the closing tag
//             const endTagIndex2 = text2.indexOf('>', index);
//             if (endTagIndex2 !== -1) {
//                 // Extract the full tag
//                 const tag2 = text2.substring(index, endTagIndex2 + 1);
//                 typingEffectElement2.innerHTML += tag2;
//                 index = endTagIndex2 + 1; // Move index to after the tag
//             }
//         } else {
//             typingEffectElement2.innerHTML += currentChar2;
//             index++;
//         }
//         setTimeout(typeWriter2, speed);
//     }
// }

// Limit the text to a certain width
const maxWidth = 1500; // Set a maximum width for the text
if (typingEffectElement) {
    typingEffectElement.style.maxWidth = `${maxWidth}px`;
    typingEffectElement.style.overflow = 'visible'; // Allow text to overflow
    typingEffectElement.style.whiteSpace = 'normal'; // Allow text to wrap to the next line
    typingEffectElement.style.marginLeft = 'auto'; // Center the text horizontally
    typingEffectElement.style.marginRight = 'auto'; // Center the text horizontally
}

// Start the typing effect
typeWriter();

document.addEventListener('click', (e) => {
    console.log(e.target); // This will log the element you clicked on
});
