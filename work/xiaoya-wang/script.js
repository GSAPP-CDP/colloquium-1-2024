function wrapLetters(elementId) {
    const element = document.getElementById(elementId);
    const text = element.innerText;
    element.innerHTML = ''; // Clear the existing text

    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.innerText = text[i];
        span.style.opacity = 0; // Start with hidden letters
        span.style.display = 'inline-block'; // Necessary to animate the letters individually
        element.appendChild(span);
    }
}

function animateLetters(elementId, delay = 100, callback) {
    const element = document.getElementById(elementId);
    const spans = element.querySelectorAll('span');

    spans.forEach((span, index) => {
        setTimeout(() => {
            span.style.opacity = 1;
            span.style.transform = 'translateY(0)';
            span.style.transition = 'opacity 0.1s ease, transform 0.1s ease';
        }, index * delay);
    });

    // Call the callback (e.g., to animate the next element) after the full animation cycle
    setTimeout(() => {
        if (callback) {
            callback();
        }
    }, spans.length * delay + 2000); // Add extra time for a pause before the callback
}

function resetLetters(elementId) {
    const element = document.getElementById(elementId);
    const spans = element.querySelectorAll('span');
    spans.forEach(span => {
        span.style.opacity = 0;
        span.style.transform = 'translateY(20px)';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    wrapLetters('title');
    wrapLetters('subtitle');

    function startAnimationCycle() {
        animateLetters('title', 100, () => {
            animateLetters('subtitle', 100, () => {
                setTimeout(() => {
                    resetLetters('title');
                    resetLetters('subtitle');
                    startAnimationCycle();
                }, 1000); // Pause before restarting the cycle
            });
        });
    }

    startAnimationCycle();
});




document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.draggable');

    elements.forEach(draggable => {
        let isDragging = false;
        let startX, startY, initialMouseX, initialMouseY;

        draggable.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Only handle left mouse button
                isDragging = true;
                startX = draggable.offsetLeft;
                startY = draggable.offsetTop;
                initialMouseX = e.clientX;
                initialMouseY = e.clientY;

                // Start listening to mousemove and mouseup events
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            }
        });

        function onMouseMove(e) {
            if (isDragging) {
                const dx = e.clientX - initialMouseX;
                const dy = e.clientY - initialMouseY;

                draggable.style.left = `${startX + dx}px`;
                draggable.style.top = `${startY + dy}px`;
            }
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    });
});

function initializeFirstAndSecondPages() {
    // Your JavaScript code for the first and second pages
}

document.addEventListener('DOMContentLoaded', () => {
    function wrapLetters(elementId) {
        const element = document.getElementById(elementId);
        const text = element.textContent;
        element.innerHTML = ''; // Clear the existing text

        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animation = `fadeIn 0.5s forwards`;
            span.style.animationDelay = `${index * 0.05}s`; // Adjust delay for each letter
            element.appendChild(span);
        });
    }

    function resetAndAnimate(elementId) {
        const element = document.getElementById(elementId);
        // Apply animation for infinite looping
        element.style.animation = `resetAnimation 3s ease-in-out infinite`;
    }

    wrapLetters('animated-text');
    resetAndAnimate('animated-text');
});

document.querySelector('.slider').addEventListener('input', function(e) {
    var value = e.target.value;
    var container = document.querySelector('.container');

    // 根据滑块值更新 --position CSS 变量
    container.style.setProperty('--position', `${value}%`);
});
