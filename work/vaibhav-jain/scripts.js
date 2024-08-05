document.querySelectorAll('.box').forEach(box => {
    box.addEventListener('click', function(event) {
        event.preventDefault(); 
        const pdfNumber = this.getAttribute('data-pdf');
        const pdfUrl = `pdfs/${pdfNumber}.pdf`;

        const viewer = document.getElementById('pdf-viewer');
        viewer.src = pdfUrl + "#page=1"; 
        viewer.setAttribute('data-current-page', 1);
        viewer.setAttribute('data-pdf-url', pdfUrl);

        document.getElementById('pdf-modal').style.display = 'flex';
    });
});

document.querySelector('.modal .close').addEventListener('click', function(event) {
    event.stopPropagation(); 
    document.getElementById('pdf-modal').style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('pdf-modal')) {
        document.getElementById('pdf-modal').style.display = 'none';
    }
});

// Page navigation
document.getElementById('prev-slide').addEventListener('click', function() {
    const viewer = document.getElementById('pdf-viewer');
    let currentPage = parseInt(viewer.getAttribute('data-current-page'));
    const pdfUrl = viewer.getAttribute('data-pdf-url');
    
    if (currentPage > 1) {
        currentPage--;
        viewer.src = `${pdfUrl}#page=${currentPage}`;
        viewer.setAttribute('data-current-page', currentPage);
    }
});

document.getElementById('next-slide').addEventListener('click', function() {
    const viewer = document.getElementById('pdf-viewer');
    let currentPage = parseInt(viewer.getAttribute('data-current-page'));
    const pdfUrl = viewer.getAttribute('data-pdf-url');
    
    currentPage++;
    viewer.src = `${pdfUrl}#page=${currentPage}`;
    viewer.setAttribute('data-current-page', currentPage);
});
