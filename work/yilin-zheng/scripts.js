//reference: https://docs.google.com/document/d/1qLuQIsmAmPtSL0i-C5rSPVQyBt5IhxoX-oq7fyIXsW4/edit ; https://pudding.cool/process/introducing-scrollama/

//table of contents visibility
// document.addEventListener('DOMContentLoaded', function () {
//     const tocLinks = document.querySelectorAll('.table_of_contents a');
//     const sections = document.querySelectorAll('.section');

//     tocLinks.forEach(link => {
//         link.addEventListener('click', function (e) {
//             e.preventDefault();

//             // Hide all sections
//             sections.forEach(section => {
//                 section.classList.remove('active');
//             });

//             // Show the clicked section
//             const targetSection = document.getElementById(this.getAttribute('data-section'));
//             targetSection.classList.add('active');
//         });
//     });

//     // Show the first section by default
//     if (sections.length > 0) {
//         sections[0].classList.add('active');
//     }
// });

//typing animation 1
document.addEventListener("DOMContentLoaded", function() {
    const staticText = "Is it recyclable? "; // Text that remains visible
    const typingText = "  Logic of Cradle to Grave of Industrial Wood"; // Text to be typed
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

//typing animation 2
document.addEventListener("DOMContentLoaded", function() {
    const staticText = "Adjective: "; // Text that remains visible
    const typingText = "  Whimsical"; // Text to be typed
    const typingHeading = document.getElementById("typing1_2");
    let index = 0;
    let typingSpeed = 300; // Speed of typing (milliseconds)
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