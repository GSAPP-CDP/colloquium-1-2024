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