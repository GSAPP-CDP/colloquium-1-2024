document.addEventListener('DOMContentLoaded', function() {
    // 이미지 전환 관련 변수와 함수
    const images = ['m2.png', 'mn.png'];
    let index = 0;
    let count = 0;
    const totalSwitches = 10; // 총 전환 횟수 (각 이미지 당 4번)
    const switchTime = 500; // 이미지 전환 간격 (밀리초 단위)
    let imageInterval; // 이미지 전환 인터벌 변수

    function changeImage() {
        if (count < totalSwitches * 6) { // 총 전환 횟수 계산
            document.getElementById('display-image').src = images[index];
            index = (index + 1) % images.length; // 이미지 인덱스를 배열 길이로 나누어 교체
            count++; // 전환 횟수 증가
        } else {
            document.getElementById('display-image').src = images[0]; // 마지막에 원래 이미지로 설정
            clearInterval(imageInterval); // 인터벌 중지
        }
    }

    function startImageTransition() {
        imageInterval = setInterval(changeImage, switchTime); // 설정된 시간 간격으로 이미지 교체
    }

    // 커서 변경 관련
    const specialArea = document.getElementById('special-area');
    specialArea.addEventListener('mouseenter', function() {
        specialArea.style.cursor = `url('scissors.png') 32 32, auto`; // 커서 변경
    });

    specialArea.addEventListener('mouseleave', function() {
        specialArea.style.cursor = 'auto'; // 커서를 기본으로 복귀
    });

    // 타이핑 효과 관련
    const typingText = document.querySelectorAll('.typing-text');
    let currentPart = 0;
    let currentChar = 0;
    const typingSpeed = 50; // 타이핑 속도 (ms)

    function typeEffect() {
        const text = typingText[currentPart].getAttribute('data-text'); // data-text 속성에서 텍스트 가져오기
        const currentText = text.substring(0, currentChar + 1);
        typingText[currentPart].innerText = currentText;
        currentChar++;

        if (currentChar < text.length) {
            setTimeout(typeEffect, typingSpeed);
        } else {
            if (currentPart < typingText.length - 1) {
                currentPart++;
                currentChar = 0;
                setTimeout(() => {
                    typingText[currentPart].style.opacity = 1;
                    typeEffect();
                }, 500); // 다음 부분 시작 전 지연 시간
            } else {
                // 모든 타이핑 효과가 끝난 후 #description을 보이게 설정
                document.getElementById('description').style.opacity = 1;
                // description이 나타난 후 이미지 전환 시작
                setTimeout(startImageTransition, 500); // 500ms 후에 이미지 전환 시작
            }
        }
    }

    // data-text 속성을 사용하여 초기 텍스트 설정
    typingText.forEach(el => el.setAttribute('data-text', el.innerText));
    typingText.forEach(el => el.innerText = ''); // 초기에는 텍스트를 비웁니다.
    
    typingText[currentPart].style.opacity = 1;
    typeEffect();
});

document.getElementById('special-area').addEventListener('click', function() {
    window.location.href = 'Map.html';
});
