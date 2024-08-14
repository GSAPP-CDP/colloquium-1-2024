// CURSOR
// Create vertical and horizontal lines
const verticalLine = document.createElement('div');
const horizontalLine = document.createElement('div');
const plusCursor = document.createElement('div');
const circleCursor = document.createElement('div');

// Style the lines
verticalLine.style.position = 'fixed';
verticalLine.style.width = '1.5px';
verticalLine.style.height = '100vh';
verticalLine.style.backgroundColor = 'rgb(170, 170, 170)';
verticalLine.style.pointerEvents = 'none';
verticalLine.style.zIndex = '10';
verticalLine.style.left = '0px';  // Adjusted position
verticalLine.style.top = '0px';  // Ensure the top property is set

horizontalLine.style.position = 'fixed';
horizontalLine.style.width = '100vw';
horizontalLine.style.height = '1.5px';
horizontalLine.style.backgroundColor = 'rgb(170, 170, 170)';
horizontalLine.style.pointerEvents = 'none';
horizontalLine.style.zIndex = '10';
horizontalLine.style.top = '0px';  // Adjusted position
horizontalLine.style.left = '0px';  // Ensure the left property is set

// Style the additional circle
circleCursor.style.position = 'fixed';
circleCursor.style.width = '5px'; // Adjusted width for the smaller circle
circleCursor.style.height = '5px'; // Adjusted height for the smaller circle
circleCursor.style.backgroundColor = 'rgb(170, 170, 170)';
circleCursor.style.pointerEvents = 'none';
circleCursor.style.zIndex = '1000'; // Ensure it's below the plusCursor
circleCursor.style.display = 'none'; // Initially hidden
circleCursor.style.left = '0px'; // Center the smaller circle relative to the plusCursor
circleCursor.style.top = '0px'; // Center the smaller circle relative to the plusCursor

// Append lines, plus cursor, and circle cursor to the body
document.body.appendChild(verticalLine);
document.body.appendChild(horizontalLine);
document.body.appendChild(plusCursor);
document.body.appendChild(circleCursor);

// Update line, plus cursor, and circle cursor positions on mouse move
document.addEventListener('mousemove', function(e) {
    verticalLine.style.left = (e.clientX + 0) + 'px'; // Adjusted for the vertical line position
    horizontalLine.style.top = (e.clientY + 0) + 'px'; // Adjusted for the horizontal line position


        plusCursor.style.display = 'none'; // Hide the plus cursor
        circleCursor.style.display = 'block'; // Show the additional circle
        circleCursor.style.left = (e.clientX -1.5) + 'px'; // Center the small circle relative to the cursor
        circleCursor.style.top = (e.clientY -1.5) + 'px'; // Center the small circle relative to the cursor
    }
);




// DRAGGABLE BOX
function makeDraggable(draggableElement) {
    let mouseX, mouseY, boxLeft, boxTop;

    draggableElement.addEventListener('mousedown', function(e) {
      e.preventDefault(); // Prevent default browser behavior

    // Capture initial mouse and box positions
    mouseX = e.clientX;
    mouseY = e.clientY;
    boxLeft = draggableElement.offsetLeft;
    boxTop = draggableElement.offsetTop;

    function onMouseMove(e) {
        // Calculate the new box position based on initial offsets and mouse movement
        const deltaX = e.clientX - mouseX;
        const deltaY = e.clientY - mouseY;
        draggableElement.style.left = boxLeft + deltaX + 'px';
        draggableElement.style.top = boxTop + deltaY + 'px';
    }

    function onMouseUp() {
        // Remove mousemove and mouseup event listeners
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    // Add mousemove and mouseup event listeners to document for dragging
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    });

    // Prevent default browser drag behavior
    draggableElement.ondragstart = function() {
    return false;
    };
}

  // Apply draggable functionality to both draggableBox and draggableBox2
makeDraggable(document.getElementById('draggableBox'));
makeDraggable(document.getElementById('draggableBox2'));
makeDraggable(document.getElementById('draggableBox3'));


// DRAGGABLE BOX - TEXT
document.addEventListener('DOMContentLoaded', function () {
    const headings = document.querySelectorAll('h1[id]'); // Select h1 elements with id
    const navLinks = document.querySelectorAll('#draggableBox ul li a');

    function changeNavLinkColor() {
        let index = headings.length;

        while (--index && window.scrollY + 500 < headings[index].offsetTop) {}

        navLinks.forEach((link) => link.classList.remove('active'));
        navLinks[index].classList.add('active');
    }

    window.addEventListener('scroll', changeNavLinkColor);
    changeNavLinkColor(); // Call once to set initial active link
});
// HIGHLIGHTED NAV LINKS
    document.querySelectorAll('#draggableBox ul li a').forEach(link => {
    link.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#ffcc00';
        this.style.color = '#000000'; // Make the text black
    });

    link.addEventListener('mouseout', function() {
        this.style.backgroundColor = '';
        this.style.color = ''; // Reset the text color
    });
});


// ACTIVE CHAPTER TEXT
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const sections = container.querySelectorAll('section');
    const navLinks = document.querySelectorAll('#draggableBox ul li a');

    const observerOptions = {
        root: container, // Set root to the scrollable container
        rootMargin: '0px',
        threshold: 0.5 // Trigger when at least 50% of the section is in view
    };

    const observer = new IntersectionObserver((entries) => {
        // Remove 'active' class from all links
        navLinks.forEach(link => link.classList.remove('active'));

        // Iterate through each entry and apply 'active' class
        entries.forEach(entry => {
            const targetId = entry.target.getAttribute('id');
            const navLink = document.querySelector(`#draggableBox ul li a[href="#${targetId}"]`);

            if (entry.isIntersecting) {
                navLink.classList.add('active');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});

// LINK TO SECTION
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#draggableBox ul li a.scroll-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                // Scroll within the container
                document.querySelector('.container').scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'instant' // Instant jump to target
                });
            }
        });
    });

    const sections = document.querySelectorAll('.container section');
    const links = document.querySelectorAll('#draggableBox ul li a');

    window.addEventListener('scroll', function() {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (pageYOffset >= sectionTop - 60 && pageYOffset < sectionTop + sectionHeight - 60) {
                currentSection = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
});





// RANDOM WORD A
const wordsA = ["Office", "Bank", "Penthouse", "Storage", "Complex", "Outlet", "Warehouse", "Auditorium"];
let lastWordA = '';
function getRandomWordA() {
    let newWord;
    do {
        newWord = wordsA[Math.floor(Math.random() * wordsA.length)];
    } while (newWord === lastWordA); // Ensure the new word is not the same as the last one
    lastWordA = newWord;
    return newWord;
}
function updateWordA() {
    const wordContainer = document.getElementById('random-word-A');
    const newWord = getRandomWordA();

    // Fade out, update word, then fade in
    wordContainer.style.opacity = 0;

    setTimeout(() => {
        wordContainer.textContent = newWord;
        wordContainer.style.opacity = 1;
    }, 100); // Match the CSS transition duration
}
// RANDOM WORD B
const wordsB = ["Apartment", "Theater", "Gym", "Shelter", "Church", "Temple", "Mosque", "Synagogue", "Market", "Zoo", "Park", "Museum", "Garden", "Aquarium", "Clinic", "Farm", "Condo", "Workshop"];
let lastWordB = '';
function getRandomWordB() {
    let newWord;
    do {
        newWord = wordsB[Math.floor(Math.random() * wordsB.length)];
    } while (newWord === lastWordB); // Ensure the new word is not the same as the last one
    lastWordB = newWord;
    return newWord;
}
function updateWordB() {
    const wordContainer = document.getElementById('random-word-B');
    const newWord = getRandomWordB();

    // Fade out, update word, then fade in
    wordContainer.style.opacity = 0;

    setTimeout(() => {
        wordContainer.textContent = newWord;
        wordContainer.style.opacity = 1;
    }, 100); // Match the CSS transition duration
}

setTimeout(() => {
    setInterval(updateWordA, 2500);
}, 1250);
setInterval(updateWordB, 2500);
// Initial word updates
updateWordA();
updateWordB();




// DARK MODE TOGGLE
document.getElementById('invert-toggle').addEventListener('click', function() {
    document.body.classList.toggle('inverted');
});
// FULLSCREEN TOGGLE
document.getElementById('navButton').addEventListener('click', function() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  });


// IFRAME
document.querySelectorAll('.iframe-overlay').forEach(overlay => {
    overlay.addEventListener('click', function() {
        const iframe = this.previousElementSibling;
        const modal = document.getElementById('modal');
        const modalImg = document.getElementById('modal-img');
        const caption = document.getElementById('caption');
        
        modal.style.display = 'block';
        modalImg.src = iframe.getAttribute('data-full');
        caption.textContent = iframe.getAttribute('data-description');
    });
});

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'none';
    }
});



// MODEL HOVER EFFECT
  document.addEventListener('mousemove', (event) => {
    const modelViewers = document.querySelectorAll('model-viewer');
    const radius = 200; // Define the radius of effect around the cursor
    const scaleHover = 1.2; // Scale factor for the model directly under the cursor
    const scaleNearby = 1.1; // Scale factor for models near the cursor
    
    modelViewers.forEach(viewer => {
      const rect = viewer.getBoundingClientRect();
      const viewerCenterX = rect.left + rect.width / 2;
      const viewerCenterY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        (event.clientX - viewerCenterX) ** 2 +
        (event.clientY - viewerCenterY) ** 2
      );
      
      if (distance < radius) {
        if (distance < radius / 2) {
          viewer.style.transform = `scale(${scaleHover})`;
        } else {
          viewer.style.transform = `scale(${scaleNearby})`;
        }
      } else {
        viewer.style.transform = `scale(1)`;
      }
    });
  });





// HIGHLIGHTED
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const span = entry.target.querySelector('span');
            if (span) {
                if (entry.isIntersecting) {
                    span.classList.add('highlighted');
                } else {
                    span.classList.remove('highlighted');
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('h2').forEach(h2 => {
        observer.observe(h2);
    });
});



// TOWER IMAGE SLIDER
document.addEventListener('DOMContentLoaded', () => {
    const section3c = document.getElementById('section3b');
    const image = document.getElementById('image');
    const windowHeight = window.innerHeight; // Get the height of the window

    // Define the range within which the image switching should happen
    const minScroll = 0.10; // 10% from the top
    const maxScroll = 0.90; // 90% from the top

    // Function to update image based on cursor position
    const updateImage = (event) => {
        // Get the vertical position of the cursor
        const cursorY = event.clientY;

        // Calculate the cursor position as a percentage of the window height
        const percentage = 1 - ((cursorY - minScroll * windowHeight) / ((maxScroll - minScroll) * windowHeight));

        // Clamp percentage between 0 and 1
        const clampedPercentage = Math.min(Math.max(percentage, 0), 1);

        // Calculate the corresponding image index
        // Assuming you have images named from Frame_00000.png to Frame_00231.png
        const imageIndex = Math.min(Math.max(Math.floor(clampedPercentage * 232), 0), 231); // Ensure index is within range

        // Format the index as a 5-digit number
        const value = imageIndex.toString().padStart(5, '0');

        // Set the image source based on the calculated index
        const src = `https://raw.githubusercontent.com/halfward/Coloquium-I-a/main/Frame_${value}.png`;
        image.src = src;
    };

    // Function to handle visibility changes
    const handleVisibilityChange = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Activate the background image update when in view
                document.addEventListener('mousemove', updateImage);
            } else {
                // Deactivate the background image update when out of view
                document.removeEventListener('mousemove', updateImage);
                // Optionally, reset the image source or do something else
                image.src = ''; // Clear the image or set to a default
            }
        });
    };

    // Create an Intersection Observer to watch for visibility changes
    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the section is in view
    };

    const observer = new IntersectionObserver(handleVisibilityChange, observerOptions);
    
    // Start observing the section
    observer.observe(section3c,)
});

// BOOLEANIFYING CURSOR
document.addEventListener('DOMContentLoaded', () => {
    const cursorText = document.createElement('div');
    cursorText.id = 'cursor-text';
    cursorText.innerHTML = 'Booleanifying...<br>BETA 0.2.1';
    document.body.appendChild(cursorText);
  
    const section3b = document.getElementById('section3b');
  
    section3b.addEventListener('mousemove', (e) => {
      cursorText.style.display = 'block';
      cursorText.style.left = `${e.pageX + 10}px`;
      cursorText.style.top = `${e.pageY + 10}px`;
    });
  
    section3b.addEventListener('mouseleave', () => {
      cursorText.style.display = 'none';
    });
  });

// BALLOONIFY CURSOR
document.addEventListener('DOMContentLoaded', () => {
    const cursorOverlay = document.createElement('div');
    cursorOverlay.className = 'cursor-overlay';
    document.body.appendChild(cursorOverlay);

    const section4b = document.getElementById('section4b');

    function updateCursorPosition(e) {
        if (cursorOverlay.style.display === 'block') {
            cursorOverlay.style.left = `${e.pageX}px`;
            cursorOverlay.style.top = `${e.pageY}px`;
        }
    }

    document.addEventListener('mousemove', updateCursorPosition);

    section4b.addEventListener('mouseenter', () => {
        cursorOverlay.style.display = 'block';
    });

    section4b.addEventListener('mouseleave', () => {
        cursorOverlay.style.display = 'none';
    });
});

// DVD SCREENSAVER
document.addEventListener('DOMContentLoaded', () => {
    const dvdScreensaver = document.getElementById('dvd-screensaver');
    const section4b = document.getElementById('section4b');
    const screensaverImg = dvdScreensaver.querySelector('img');

    let x = 0; // Starting position
    let y = 0; // Starting position
    let dx = 1; // Speed in x direction
    let dy = 1; // Speed in y direction
    const width = window.innerWidth;
    const height = window.innerHeight;

    function animateScreensaver() {
        if (dvdScreensaver.style.display === 'block') {
            x += dx;
            y += dy;

            // Bounce off edges
            if (x + screensaverImg.clientWidth > width || x < 0) {
                dx *= -1; // Reverse direction
            }
            if (y + screensaverImg.clientHeight > height || y < 0) {
                dy *= -1; // Reverse direction
            }

            dvdScreensaver.style.left = `${x}px`;
            dvdScreensaver.style.top = `${y}px`;

            requestAnimationFrame(animateScreensaver);
        }
    }

    section4b.addEventListener('mouseenter', () => {
        dvdScreensaver.style.display = 'block';
        animateScreensaver();
    });

    section4b.addEventListener('mouseleave', () => {
        dvdScreensaver.style.display = 'none';
    });

    // Initialize the DVD screensaver to be hidden
    dvdScreensaver.style.display = 'none';
});





// TITLE IMAGE SLIDER
document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('section1');
    const totalFrames = 200;
    const images = [];
    
    const startSlideY = 1; // 100% of the viewport height
    const endSlideY = 0; // 0% of the viewport height
    const totalLoops = 2; // Number of loops within the range

    // Preload all images
    for (let i = 0; i < totalFrames; i++) {
        const value = i.toString().padStart(5, '0');
        const img = new Image();
        img.src = `https://raw.githubusercontent.com/halfward/Colloquium-I/main/Frame_${value}.bmp`;
        images.push(img);
    }

    // Function to update the background image based on cursor position
    const updateBackgroundImage = (event) => {
        const cursorY = event.clientY; // Get the vertical position of the cursor
        const windowHeight = window.innerHeight; // Get the height of the window

        // Calculate the cursor position as a percentage of the window height
        const percentage = cursorY / windowHeight;

        // Only update the background image if within the specified range
        if (percentage <= startSlideY && percentage >= endSlideY) {
            // Calculate the percentage within the sliding range
            const adjustedPercentage = (startSlideY - percentage) / (startSlideY - endSlideY);

            // Calculate the corresponding image index, looping twice
            const imageIndex = Math.floor(adjustedPercentage * totalFrames * totalLoops) % totalFrames;

            // Set the preloaded image as the background
            section.style.backgroundImage = `url(${images[imageIndex].src})`;
        }
    };

    // Function to handle visibility changes
    const handleVisibilityChange = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Activate the background image update when in view
                document.addEventListener('mousemove', updateBackgroundImage);
            } else {
                // Deactivate the background image update when out of view
                document.removeEventListener('mousemove', updateBackgroundImage);
                // Optionally, clear the background image
                section.style.backgroundImage = '';
            }
        });
    };

    // Create an Intersection Observer to watch for visibility changes
    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the section is in view
    };

    const observer = new IntersectionObserver(handleVisibilityChange, observerOptions);
    
    // Start observing the section
    observer.observe(section);
});



// UI HOVER
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.UI-container');
    const overlay = document.querySelector('.UI-overlay');
    const cursorMask = document.querySelector('.UI-cursor-mask');

    // Preload images
    const preloadImages = [
        'UI-01.png',
        'UI-02.png'
    ];

    preloadImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    container.addEventListener('mousemove', function(event) {
        // Update the position of the cursor mask
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Center the cursor mask
        cursorMask.style.left = `${x - 150}px`; // 300px / 2
        cursorMask.style.top = `${y - 75}px`;  // 150px / 2

        // Update the clip-path of the overlay to match the cursor mask with rounded corners
        overlay.style.clipPath = `inset(${y - 75}px ${container.clientWidth - x - 150}px ${container.clientHeight - y - 75}px ${x - 150}px round 6px)`;
        cursorMask.style.display = 'block';    // Show the mask
    });

    container.addEventListener('mouseleave', function() {
        cursorMask.style.display = 'none'; // Hide the mask when leaving the container
        overlay.style.clipPath = 'inset(100% 100% 100% 100%)'; // Hide UI-02.png
    });
});


// DESCRIPTION BOX + AUTOSCROLL
document.addEventListener('DOMContentLoaded', function() {
    const descriptions = {
        section1: "Hi! Hao's it going? My future practice mainly revolves around adaptive reuse. With technological advancements, how can we treat the built environment as fixable, adjustable, and flexible spaces? How can we rebuild our urban surroundings in ways that honor the historical context, benefit the community, and is transformative to the way we view architecture?",

        'section2a': "The dominance of capital markets over actual housing needs is a global issue. This system heavily favors large-scale capitalism, leading to housing prices and rents being driven by investment gains rather than genuine demand. During my time in Taiwan, I paid 50% of my monthly income for an illegal 2-bedroom, 50-year-old metal sheet penthouse in New Taipei City. Despite Taiwan having the second-highest population density in the world as of 2024, the sky-high housing prices in Taipei and New Taipei are more a result of an unhealthy investment market than a reflection of real housing needs.",

        'section2b': "What shapes the New York skyline, and are all the high-rises justified? By comparing the designated and actual Floor Area Ratios (FARs) in NYC’s PLUTO data, we can see how codes and regulations influence the city's growth. But what about occupancy? NYC Open Data's Energy and Water Data Disclosure provides occupancy rates for individual buildings. Are there overbuilt structures with low occupancy? And if so, do these underutilized spaces benefit the community in any meaningful way?",
        
        'section2c': "These examples either navigate the legal fine print or delve into the fictional, each reacting to the socio-economic building environment. They all employ spatial transformations similar to Boolean operations—difference, intersection, subtraction, and more. The juxtaposition of these simple yet powerful design languages against the complexity of the modern environment is what truly inspires me. How can I utilize computational tools to better the urban environment in similar ways?",

        'section3a': "I believe architecture is inherently political because architects and designers work within systemic frameworks that influence how and what we build. The act of building (legally) itself is essentially a formal way of fortifying the status quo through capital, labor, and goods. Codes and regulations could change drastically within months, but the built environment often stays for decades before any alteration. For so many unused and underutilized spaces in crowded cities, are there ways to transform them into more responsive and reflective spaces?",

        'section3b': "This analysis utilizes the daylight analysis GH definition developed by Luc Wilson and Meli Harvey. While the change in daylight exposure appears minimal, the current analysis only accounts for direct daylight and does not factor in diffuse lighting. Additionally, the booleaned space mitigating building facade glare could be advantageous for neighboring spaces.",

        'section4a': 'What will happen in 100 years, where there are no more new buildings? This is the design fiction assignment from Colloquium I, where I develop a pseudo-product that explores how we might approach adaptive reuse or the living environment as a whole.',

        'section4b': "BALLOONIFY! is a long-awaited design project. For my undergraduate thesis in 2019, I aimed to create a spatial imprint or documentation process by placing inflatable objects in complex spaces. In this model, I utilized Blender's soft body sim, because Grasshopper's clunky handling of meshes and physics don't bode so well for this project. The model features letter-shaped (I & E) meshes that simulate large balloons pressing against each other within an existing space.",

        'section5a': "Booleans. Lots of Booleans. Some are good for pure aesthetics and others are better suited for environmental performances. Can we realistically transform the urban landscape through unbuliding in the future? As of now, I don't necessarily want to be a pure guerrilla artist or activist. I think I'm better at analyzing, executing, and building. However, I believe it's crucial for me to recognize and absorb every possible related piece of information. This is especially important given that my current project is politically driven. My focus is on understanding the broader context and intricacies of the field to effectively apply my skills in a meaningful way.",

        'section5b': "This is a VERY general outline for my future practice.It's floating, it's wobbly, it's up in the air; but has a general direction for me to garner more information and slowly build up the foundations.",
        
        'section6a': "This section mainly features assignments from Colloquium I and Computational Modeling. They are all related to this practice, but are somewhat more experimental/unrefined."
    };

    const descriptionContent = document.getElementById('descriptionContent');
    let autoScrollInterval;
    let currentSection = '';
    let isScrollingManually = false;

    // Function to update the content based on the current section
    function updateDescription(sectionId) {
        descriptionContent.textContent = descriptions[sectionId] || '';
        resetAutoScroll(); // Reset auto-scroll for the new section
    }

    // Function to get the closest section (parent or current)
    function getClosestSection(element) {
        while (element && !element.matches('section')) {
            element = element.parentElement;
        }
        return element ? element.id : null;
    }

    // Function to start auto-scrolling the content
    function startAutoScroll(content) {
        const scrollStep = 1; // Number of pixels to scroll each step
        const scrollDelay = 40; // Delay in milliseconds between scrolls (slower speed)
        const delayBeforeScroll = 2000; // 2-second delay before starting scroll

        setTimeout(() => {
            autoScrollInterval = setInterval(() => {
                if (content.scrollTop + content.clientHeight < content.scrollHeight) {
                    content.scrollBy(0, scrollStep); // Scroll down
                } else {
                    clearInterval(autoScrollInterval); // Stop scrolling when reaching the bottom
                }
            }, scrollDelay); // Adjust scroll speed interval as needed
        }, delayBeforeScroll); // Delay before starting scroll
    }

    // Function to reset auto-scroll
    function resetAutoScroll() {
        clearInterval(autoScrollInterval); // Clear existing auto-scroll interval
        const content = document.querySelector('#draggableBox3 .scrollable-content');
        if (content) {
            content.scrollTop = 0; // Reset scroll position
            if (!isScrollingManually) {
                startAutoScroll(content); // Start auto-scroll for the new section if not manually scrolled
            }
        }
    }

    // Function to handle section visibility
    function handleVisibility(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = getClosestSection(entry.target);
                if (sectionId !== currentSection) {
                    console.log(`Switching to section ${sectionId}, resetting auto-scroll`);
                    updateDescription(sectionId);
                    currentSection = sectionId; // Update current section
                }
            }
        });
    }

    // Intersection Observer to detect when a section comes into view
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = getClosestSection(entry.target);
                if (sectionId !== currentSection) {
                    console.log(`Switching to section ${sectionId}`);
                    updateDescription(sectionId);
                    currentSection = sectionId; // Update current section
                }
            }
        });
    }, {
        threshold: 0.2 // Adjust as needed
    });

    // Observe each section
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Set up the IntersectionObserver for auto-scrolling
    const autoScrollObserver = new IntersectionObserver(handleVisibility, {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.5 // Trigger when at least 50% of the section is in view
    });

    // Observe all relevant sections for auto-scrolling
    document.querySelectorAll('section').forEach(section => {
        autoScrollObserver.observe(section);
    });

    // Event listener to detect manual scroll
    document.querySelector('#draggableBox3 .scrollable-content').addEventListener('scroll', () => {
        isScrollingManually = true;
        clearInterval(autoScrollInterval); // Clear auto-scroll interval on manual scroll
    });

    // Reset auto-scroll status when a new section is entered
    function resetAutoScrollStatus() {
        isScrollingManually = false;
    }

    // Reset auto-scroll status when a new section is entered
    document.querySelectorAll('section').forEach(section => {
        section.addEventListener('scroll', resetAutoScrollStatus);
    });
});



// BALLOON SWIPER AUTO PLAY
document.addEventListener("DOMContentLoaded", function() {
    const swiperEl = document.querySelector('swiper-container');

    swiperEl.swiper.params.autoplay = {
        delay: 2000,
        disableOnInteraction: false
    };
    swiperEl.swiper.autoplay.start();
});