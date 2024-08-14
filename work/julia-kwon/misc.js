document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for links
    document.querySelectorAll('.scroll-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Add YouTube embed to the top box
    const youtubeBoxTop = document.createElement('div');
    youtubeBoxTop.style.width = '100%';
    youtubeBoxTop.style.height = '100%';
    youtubeBoxTop.style.position = 'relative';
    youtubeBoxTop.innerHTML = '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/Dr4IfNH6Ngk?si=pwK0RDdVZj4SjObh" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    const topBox = document.createElement('div');
    topBox.style.width = '540px'; // 10% smaller width
    topBox.style.height = '303px'; // 10% smaller height, maintaining 16:9 aspect ratio
    topBox.style.position = 'absolute';
    topBox.style.left = '50%';
    topBox.style.top = '10%';
    topBox.style.transform = 'translateX(-50%)'; // Center horizontally
    topBox.style.backgroundColor = '#fff';
    topBox.style.border = '0px solid #000';
    topBox.style.padding = '0px';
    topBox.style.overflow = 'hidden';
    topBox.style.borderRadius = '10px';

    topBox.appendChild(youtubeBoxTop);
    document.body.appendChild(topBox);

    // Add title text box below the top video box
    const titleBoxTop = document.createElement('div');
    titleBoxTop.style.width = '486px'; // 10% smaller width
    titleBoxTop.style.height = '45px'; // 10% smaller height
    titleBoxTop.style.position = 'absolute';
    titleBoxTop.style.left = '50%';
    titleBoxTop.style.top = 'calc(10% + 303px + 10px)'; // Position below the top video box with some margin
    titleBoxTop.style.transform = 'translateX(-50%)';
    titleBoxTop.style.backgroundColor = '#fff';
    titleBoxTop.style.border = '0px solid #000';
    titleBoxTop.style.padding = '10px';
    titleBoxTop.style.overflow = 'hidden';
    titleBoxTop.style.borderRadius = '10px';
    titleBoxTop.innerHTML = '<input type="text" value="Rube Goldberg Machine" style="width: 100%; height: 100%; border: none; outline: none; font-size: 115%;">';

    document.body.appendChild(titleBoxTop);

    // Add YouTube embed to the middle box
    const youtubeBoxMiddle = document.createElement('div');
    youtubeBoxMiddle.style.width = '100%';
    youtubeBoxMiddle.style.height = '100%';
    youtubeBoxMiddle.style.position = 'relative';
    youtubeBoxMiddle.innerHTML = '<iframe width="560" height="315" src="https://www.youtube.com/embed/ZhHwTqa2q_U?si=8wmfPhNQYJcxFaFd" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    const middleBox = document.createElement('div');
    middleBox.style.width = '540px'; // 10% smaller width
    middleBox.style.height = '303px'; // 10% smaller height, maintaining 16:9 aspect ratio
    middleBox.style.position = 'absolute';
    middleBox.style.left = '50%';
    middleBox.style.top = 'calc(10% + 303px + 50px + 50px)'; // Position below the top title box with some margin
    middleBox.style.transform = 'translateX(-50%)'; // Center horizontally
    middleBox.style.backgroundColor = '#fff';
    middleBox.style.border = '0px solid #000';
    middleBox.style.padding = '0px';
    middleBox.style.overflow = 'hidden';
    middleBox.style.borderRadius = '10px';

    middleBox.appendChild(youtubeBoxMiddle);
    document.body.appendChild(middleBox);

    // Add title text box below the middle video box
    const titleBoxMiddle = document.createElement('div');
    titleBoxMiddle.style.width = '486px'; // 10% smaller width
    titleBoxMiddle.style.height = '45px'; // 10% smaller height
    titleBoxMiddle.style.position = 'absolute';
    titleBoxMiddle.style.left = '50%';
    titleBoxMiddle.style.top = 'calc(10% + 303px + 50px + 50px + 303px + 10px)'; // Position below the middle video box with some margin
    titleBoxMiddle.style.transform = 'translateX(-50%)';
    titleBoxMiddle.style.backgroundColor = '#fff';
    titleBoxMiddle.style.border = '0px solid #000';
    titleBoxMiddle.style.padding = '10px';
    titleBoxMiddle.style.overflow = 'hidden';
    titleBoxMiddle.style.borderRadius = '10px';
    titleBoxMiddle.innerHTML = '<input type="text" value="Generative Zine" style="width: 100%; height: 100%; border: none; outline: none; font-size: 115%;">';

    document.body.appendChild(titleBoxMiddle);

    // Add YouTube embed to the bottom box
    const youtubeBoxBottom = document.createElement('div');
    youtubeBoxBottom.style.width = '100%';
    youtubeBoxBottom.style.height = '100%';
    youtubeBoxBottom.style.position = 'relative';
    youtubeBoxBottom.innerHTML = '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/KnuiGaW3kr0?si=xCGllnRKPVZ5GSxe" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    const bottomBox = document.createElement('div');
    bottomBox.style.width = '540px'; // 10% smaller width
    bottomBox.style.height = '303px'; // 10% smaller height, maintaining 16:9 aspect ratio
    bottomBox.style.position = 'absolute';
    bottomBox.style.left = '50%';
    bottomBox.style.top = 'calc(10% + 303px + 50px + 50px + 303px + 50px + 50px)'; // Position below the middle title box with some margin
    bottomBox.style.transform = 'translateX(-50%)'; // Center horizontally
    bottomBox.style.backgroundColor = '#fff';
    bottomBox.style.border = '0px solid #000';
    bottomBox.style.padding = '0px';
    bottomBox.style.overflow = 'hidden';
    bottomBox.style.borderRadius = '10px';

    bottomBox.appendChild(youtubeBoxBottom);
    document.body.appendChild(bottomBox);

    // Add title text box below the bottom video box
    const titleBoxBottom = document.createElement('div');
    titleBoxBottom.style.width = '486px'; // 10% smaller width
    titleBoxBottom.style.height = '45px'; // 10% smaller height
    titleBoxBottom.style.position = 'absolute';
    titleBoxBottom.style.left = '50%';
    titleBoxBottom.style.top = 'calc(10% + 303px + 50px + 50px + 303px + 50px + 50px + 303px + 10px)'; // Position below the bottom video box with some margin
    titleBoxBottom.style.transform = 'translateX(-50%)';
    titleBoxBottom.style.backgroundColor = '#fff';
    titleBoxBottom.style.border = '0px solid #000';
    titleBoxBottom.style.padding = '10px';
    titleBoxBottom.style.overflow = 'hidden';
    titleBoxBottom.style.borderRadius = '10px';
    titleBoxBottom.innerHTML = '<input type="text" value="Design Fiction" style="width: 100%; height: 100%; border: none; outline: none; font-size: 115%;">';

    document.body.appendChild(titleBoxBottom);
});

// Smooth horizontal scrolling on wheel
document.addEventListener('wheel', (event) => {
    if (event.deltaY !== 0) {
        window.scrollBy({
            left: event.deltaY * 2,
            behavior: 'smooth'
        });
        event.preventDefault();
    }
});
