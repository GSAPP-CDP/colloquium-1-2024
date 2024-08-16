// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Get the IDs of all pages
    const pageIds = [
        'page0', 'page1', 'page2', 'page3', 'page4', 
        'page5', 'page6', 'page7', 'page8', 'page9', 
        'page10', 'page11'
    ]; 

    let currentPageIndex = 0;
    let isScrolling = false; // To handle debounce

    // Function to update currentPageIndex based on the page currently visible
    function updateCurrentPageIndex() {
        pageIds.forEach((id, index) => {
            const pageElement = document.getElementById(id);
            if (pageElement) {
                const rect = pageElement.getBoundingClientRect();
                const pageHeight = window.innerHeight;
                // Check if the page is near the center of the viewport
                if (rect.top <= pageHeight * 0.5 && rect.bottom >= pageHeight * 0.5) {
                    currentPageIndex = index;
                }
            }
        });
    }

    function scrollToPage(index) {
        if (index < 0) {
            index = 0;
        } else if (index >= pageIds.length) {
            index = pageIds.length - 1;
        }
        const pageId = `#${pageIds[index]}`;
        console.log(`Scrolling to: ${pageId}, Index: ${index}`);
        document.querySelector(pageId).scrollIntoView({ behavior: 'smooth' });
        currentPageIndex = index;
    }

    document.addEventListener('wheel', (event) => {
        if (isScrolling) return;

        isScrolling = true;
        setTimeout(() => { isScrolling = false; }, 500); // Adjust the delay as needed

        updateCurrentPageIndex(); // Update the index before changing it
        if (event.deltaY > 0) {
            // Scroll down
            if (currentPageIndex < pageIds.length - 1) {
                scrollToPage(currentPageIndex + 1);
            }
        } else {
            // Scroll up
            if (currentPageIndex > 0) {
                scrollToPage(currentPageIndex - 1);
            }
        }
    });

    // Optional: Handle direct navigation (e.g., via links or buttons)
    document.querySelectorAll('.page-link').forEach((link) => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('data-target');
            const index = pageIds.indexOf(targetId);
            if (index !== -1) {
                scrollToPage(index);
            }
        });
    });

    // Initialize the current page index on load
    updateCurrentPageIndex();
});

  
// sidebar
document.addEventListener("DOMContentLoaded", function() {
    const sidebar = document.getElementById('sidebar');
    const sidebar2 = document.getElementById('sidebar2');
    const pageContent = document.getElementById('pageContent');

    // first sidebar drag logic 
    let isDraggingSidebar1 = false;
    let offsetX1, offsetY1;

    sidebar.addEventListener('mousedown', function(e) {
        isDraggingSidebar1 = true;
        offsetX1 = e.clientX - sidebar.getBoundingClientRect().left;
        offsetY1 = e.clientY - sidebar.getBoundingClientRect().top;
        
        function moveAt(pageX, pageY) {
            sidebar.style.left = pageX - offsetX1 + 'px';
            sidebar.style.top = pageY - offsetY1 + 'px';
        }

        function onMouseMove(e) {
            if (isDraggingSidebar1) {
                moveAt(e.pageX, e.pageY);
            }
        }

        document.addEventListener('mousemove', onMouseMove);

        document.addEventListener('mouseup', function() {
            isDraggingSidebar1 = false;
            document.removeEventListener('mousemove', onMouseMove);
        }, { once: true });

        sidebar.ondragstart = function() {
            return false;
        };
    });

    // Second sidebar drag logic
    let isDraggingSidebar2 = false;
    let offsetX2, offsetY2;

    sidebar2.addEventListener('mousedown', function(e) {
        isDraggingSidebar2 = true;
        offsetX2 = e.clientX - sidebar2.getBoundingClientRect().left;
        offsetY2 = e.clientY - sidebar2.getBoundingClientRect().top;
        
        function moveAt(pageX, pageY) {
            sidebar2.style.left = pageX - offsetX2 + 'px';
            sidebar2.style.top = pageY - offsetY2 + 'px';
        }

        function onMouseMove(e) {
            if (isDraggingSidebar2) {
                moveAt(e.pageX, e.pageY);
            }
        }

        document.addEventListener('mousemove', onMouseMove);

        document.addEventListener('mouseup', function() {
            isDraggingSidebar2 = false;
            document.removeEventListener('mousemove', onMouseMove);
        }, { once: true });

        sidebar2.ondragstart = function() {
            return false;
        };
    });
});




// Function to navigate to a specific section, sidebar
function scrollToElement(elementId) {
    document.querySelector(elementId).scrollIntoView({ behavior: 'smooth' });
}

// Add event listeners to the sidebar links
document.querySelectorAll('.sidebar a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        scrollToElement(this.getAttribute('href'));
    });
});

// document.addEventListener('DOMContentLoaded', function() {
//     document.getElementById('fullscreen-image').addEventListener('click', function() {
//         scrollToElement('#page2');
//     });
// });






/* type text: page0 */
document.addEventListener("DOMContentLoaded", function () {
    const text = "As an architect, every time I enter an architectural space or walk on the street, I usually wonder which elements cause us to feel different between the spaces.";
    const typingTextElement = document.getElementById("typing-text");
    const cursor = document.getElementById("cursor");
    let index = 0;
  
    function typeWriter() {
      if (index < text.length) {
        typingTextElement.innerHTML += text.charAt(index);
        index++;
        setTimeout(typeWriter, 50); // Adjust the value here to change the typing speed
      } else {
        cursor.style.display = 'none'; 
        // Hide the cursor when you are done typing
      }
    }
  
    typeWriter();
});



/* type text: page1 to page11 */
document.addEventListener("DOMContentLoaded", function () {
    // Function to type text
    function typeWriter(element, text, callback) {
        let index = 0;
        function type() {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
                setTimeout(type, 50);
            } else if (callback) {
                callback();
            }
        }
        type();
    }

    // Function to initialize IntersectionObserver for each page
    function initializePageObserver(pageId, text) {
        const typingTextElement = document.getElementById(`typing-text-${pageId}`);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typingTextElement.classList.remove('hidden');  // Show the text
                    typeWriter(typingTextElement, text, () => observer.disconnect());  // Start typing
                }
            });
        }, { threshold: 0.1 });

        observer.observe(document.getElementById(pageId));
    }

    // Initialize observers for each page
    initializePageObserver("page1", "This study focuses on three aspects—colors, textures, and sounds—as observed in three distinct communities in New York City: Harlem, Midtown, and the East Village.");
    initializePageObserver("page2", "A survey was conducted in these three neighborhoods, each covering a 12-minute walk.");
    initializePageObserver("page3", "First, let's talk about colors. In urban spaces, colors emerge from various sources, including building facades, the sky, vehicles, trees, signage, etc. Photos have been taken in each of these three areas to capture these color variations.");
    initializePageObserver("page4", "RGB data is extracted from street photographs to identify the most prevalent colors along the streets.");
    initializePageObserver("page5", "The colors are blended into gradient bars, visually representing the color transitions observed along the streets.");
    initializePageObserver("page6", "Next, let's consider textures. In urban spaces, textures are defined by elements such as the edges of buildings, the outlines of pedestrians, and the arrangement of windows.");
    initializePageObserver("page7", "Through the application of Grasshopper, the key edges of scenes from video footage were extracted to generate degraded images that expose the underlying geometries of architectural spaces.");
    initializePageObserver("page8", "By tracing the vertex points along the edges of various elements within each scene and flowing them according to their outlines, this method provides a novel perspective for interpreting urban spaces.");
    initializePageObserver("page9", "During the survey, a range of street sounds was recorded, including wind, music, traffic, conversations, and various languages.");
    initializePageObserver("page10", "Using the aubio library, the pitches in these recordings were detected and categorized into eight traditional musical notes: Do, Re, Mi, Fa, Sol, La, Si, and Do. Each note is represented by a distinct shade of gray.");
    initializePageObserver("page11", "Over 50,000 notes are arranged in a linear bar that resembles piano keys along the street. This setup offers an auditory representation of the urban soundscape: by hovering the cursor over the bar, you can hear the corresponding notes.");
    // Repeat for other pages...
});




const iframes = document.querySelectorAll('.map-frame');

  function playSound(index) {
    iframes.forEach((iframe, i) => {
      const player = new Vimeo.Player(iframe);
      if (i === index) {
        player.setVolume(1); // Play Sound
      } else {
        player.setVolume(0); // Mut
      }
    });
  }

  function muteAll() {
    iframes.forEach((iframe) => {
      const player = new Vimeo.Player(iframe);
      player.setVolume(0); // Mute
    });
}


  
  
  



// JavaScript code for handling page-specific elements
document.addEventListener('DOMContentLoaded', function() {
    var languageSwitcher = document.getElementById('language-switcher');
    var currentPageId = document.body.querySelector('[id]').id; // 获取当前页面的 id

    // Show language switch button only on about page
    if (currentPageId === 'about') {
      languageSwitcher.style.display = 'block';
    } else {
      languageSwitcher.style.display = 'none';
    }
  });

  function changeLanguage(lang) {
    // Here you can implement the logic of switching languages
    console.log('Switching to language:', lang);
}

