document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.main-container');
    const sections = document.querySelectorAll('.about, .coverpage, .intropage, .section, .property, .risk, .financial, .financial2, .conclusion');
    const navItems = document.querySelectorAll('nav li');
    const draggableElements = document.querySelectorAll(".dialogue-box");
    let hideTimeout;
    let currentSection = 0;

    const images = document.querySelectorAll('.gallery-image');
    let currentIndex = 0;

    function showNextImage() {
        images[currentIndex].classList.remove('show');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('show');
    }

    setInterval(showNextImage, 2000); // Change image every x millisecond

    // Navigate between sections and trigger animations when landing on a section
    function navigate(toNext) {
        if (toNext && currentSection < sections.length - 1) {
            currentSection++;
        } else if (!toNext && currentSection > 0) {
            currentSection--;
        }
        scrollToPage(currentSection);
        updateActiveSection(currentSection);
    }

    // Scroll to the specified section and trigger animations
    function scrollToPage(index) {
        const targetLeft = sections[index].offsetLeft;
        container.scrollTo({ left: targetLeft, behavior: 'smooth' });
        triggerAnimations(sections[index]);
    }

    // Trigger animations for all .fade elements within the given section
    function triggerAnimations(section) {
        const fadeElements = section.querySelectorAll('.fade');
        fadeElements.forEach(el => {
            el.classList.add('visible');
        });
    }

    const navContainer = document.querySelector('.nav-container');

    // Show the nav-container when the mouse enters
    navContainer.addEventListener('mouseenter', function() {
        navContainer.classList.add('visible');

        // Clear the timeout if the mouse re-enters before the nav-container hides
        clearTimeout(hideTimeout);
    });

    // Hide the nav-container 3 seconds after the mouse leaves
    navContainer.addEventListener('mouseleave', function() {
        hideTimeout = setTimeout(function() {
            navContainer.classList.remove('visible');
        }, 2000); // 2000 milliseconds = 2 seconds
    });

    // Update the active state of the nav items based on the current section
    function updateActiveSection(index) {
        navItems.forEach(item => {
            const navId = item.querySelector('a').getAttribute('data-nav-id');
            if (parseInt(navId, 10) === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Initial call to set active section
    updateActiveSection(currentSection);

    let isDragging = false; // Flag to track if dragging is occurring

    // Event listeners for navigation
    container.addEventListener('click', function(e) {
        if (isDragging) {
            isDragging = false; // Reset flag after drag
            return; // Prevent navigation
        }

        const thirdWidth = this.offsetWidth / 3;
        const clickX = e.clientX;

        if (clickX > 2 * thirdWidth) {
            navigate(true);
        } else if (clickX < thirdWidth) {
            navigate(false);
        }
    });

    container.addEventListener('contextmenu', function(e) {
        e.preventDefault();  // Prevent the default context menu
        navigate(true);  // Navigate forward on right-click
    });

    let st = ScrollTrigger.create({
        trigger: ".description",
        pin: true,
        pinSpacing: true,
    });

    // Navigation menu circle hover effect
    navItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            const rect = item.getBoundingClientRect();
            const navRect = item.closest('nav').getBoundingClientRect();
            
            const circle = item.querySelector('::before');
            if (circle) {
                circle.style.opacity = '1';
                circle.style.top = `${rect.top - navRect.top + rect.height / 2 - 5}px`;
                circle.style.left = '-15px'; // Adjust this value as needed
            }
        });

        item.addEventListener('mouseleave', () => {
            updateActiveSection(currentSection); // Reset circle to active section
        });
    });

    // Mouse-following circle that is semi-transparent by default
    const mouseCircle = document.createElement("div");
    mouseCircle.style.position = "absolute";
    mouseCircle.style.width = "20px"; // Adjust size as needed
    mouseCircle.style.height = "20px"; // Adjust size as needed
    mouseCircle.style.borderRadius = "50%";
    mouseCircle.style.backgroundColor = "black";
    mouseCircle.style.opacity = "0.5"; // Set to semi-transparent by default
    mouseCircle.style.pointerEvents = "none"; // Allows elements below to be clickable
    mouseCircle.style.transition = "background-color 0.3s ease, opacity 0.3s ease, transform 0.1s ease";
    document.body.appendChild(mouseCircle);

    // Track mouse movement to move the circle
    document.addEventListener("mousemove", function (e) {
        mouseCircle.style.left = e.pageX - 10 + "px"; // Adjust positioning to center the circle
        mouseCircle.style.top = e.pageY - 10 + "px"; // Adjust positioning to center the circle
    });

    // Change color when hovering over clickable elements
    document.querySelectorAll("a, button, .clickable").forEach(function (element) {
        element.addEventListener("mouseover", function () {
            mouseCircle.style.backgroundColor = "red"; // Change to desired hover color for clickable items
            mouseCircle.style.transform = "scale(1.5)"; // Optional: enlarge the circle on hover
            mouseCircle.style.opacity = "0.5"; // Maintain semi-transparent opacity
        });

        element.addEventListener("mouseout", function () {
            mouseCircle.style.backgroundColor = "black"; // Revert to original color
            mouseCircle.style.transform = "scale(1)"; // Revert to original size
            mouseCircle.style.opacity = "0.5"; // Maintain semi-transparent opacity
        });
    });

    draggableElements.forEach(dialogueBox => {
        dialogueBox.onmousedown = function(event) {
            event.preventDefault();
            isDragging = false; // Reset the flag in case

            let shiftX = event.clientX - dialogueBox.getBoundingClientRect().left;
            let shiftY = event.clientY - dialogueBox.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                dialogueBox.style.left = pageX - shiftX + 'px';
                dialogueBox.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(event) {
                isDragging = true; // Set the flag to true during dragging
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            document.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                document.onmouseup = null;
            };
        };

        dialogueBox.ondragstart = function() {
            return false; // Prevent default drag behavior
        };
    });

});

document.addEventListener("DOMContentLoaded", function() {
    const staticText = ""; // Text that remains visible
    const typingText = "Why do people buy in flood risk areas?"; // Text to be typed
    const typingHeading = document.getElementById("typing");
    let index = 0;
    let typingSpeed = 70; // Speed of typing (milliseconds)
    let delayBetweenLoops = 1000; // Delay before restarting (milliseconds)

    // Initialize the element with static text
    typingHeading.innerHTML = staticText;

    function typeWriter() {
        // Add the typing text
        if (index < typingText.length) {
            typingHeading.innerHTML = staticText + typingText.substring(0, index + 1);
            index++;
            setTimeout(typeWriter, typingSpeed);
        } else {
            setTimeout(() => {
                index = 0; // Reset index
                typingHeading.innerHTML = staticText; // Preserve static content
                setTimeout(typeWriter, delayBetweenLoops); // Restart typing
            }, delayBetweenLoops);
        }
    }

    typeWriter();
});
