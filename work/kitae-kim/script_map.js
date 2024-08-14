document.addEventListener("DOMContentLoaded", function() {
    // 페이지 중앙으로 스크롤
    window.scrollTo({
        top: document.documentElement.scrollHeight / 2 - window.innerHeight / 2,
        behavior: 'smooth'
    });
});
