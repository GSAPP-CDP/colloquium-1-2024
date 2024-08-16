document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.horizontal-list.tabs li a');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function (event) {
            event.preventDefault();

            // Remove 'active' class from all tabs and contents
            tabs.forEach(function (item) {
                item.classList.remove('active');
            });
            tabContents.forEach(function (content) {
                content.classList.remove('active');
            });

            // Add 'active' class to clicked tab and corresponding content
            tab.classList.add('active');
            const targetId = tab.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Activate the first tab by default
    if (tabs.length > 0 && tabContents.length > 0) {
        tabs[0].classList.add('active');
        tabContents[0].classList.add('active');
    }
});
