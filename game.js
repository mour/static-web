const storage = document.getElementById('carrot-storage');
const plate1 = document.getElementById('plate-1');
const plate2 = document.getElementById('plate-2');
const bunnyEl = document.getElementById('bunny-status');
const feedbackEl = document.getElementById("feedback");
const gathererEl = document.getElementById("bunny-gatherer");

let num1 = 0;
let num2 = 0;
let correctAnswer = 0;
let hasGuessedCorrect = false;

// --- HÀM ĐIỀU KHIỂN HÌNH ẢNH CHÚ THỎ CỦA BẠN ---
function drawBunny(mood) {
    const bunnyImg = document.getElementById("bunny-pic");
    if (!bunnyImg) return;
    
    // Mặc định gọi file ảnh bunny.png của bạn trong thư mục
    // (Mẹo: Nếu bạn có thêm ảnh thỏ khóc/cười, bạn có thể sửa tên file ở dưới này)
    if (mood === 'happy') {
        bunnyImg.src = "bunny.png"; 
    } else if (mood === 'sad') {
        bunnyImg.src = "bunny.png"; 
    } else {
        bunnyImg.src = "bunny.png"; 
    }
}

// --- KHỞI TẠO BÀN CHƠI MỚI ---
function initCarrots() {
    storage.innerHTML = "";
    plate1.innerHTML = "";
    plate2.innerHTML = "";
    hasGuessedCorrect = false;
    bunnyEl.className = ""; 
    feedbackEl.innerText = "";
    gathererEl.className = ""; 
    drawBunny('normal'); 
    
    for (let i = 1; i <= 10; i++) {
        const carrot = document.createElement('div');
        carrot.className = 'carrot';
        carrot.id = `carrot-${i}`;
        carrot.innerText = '🥕';
        carrot.draggable = true;

        carrot.addEventListener('dragstart', (e) => {
            if(hasGuessedCorrect) { e.preventDefault(); return; } 
            playSound('drag'); 
            e.dataTransfer.setData('text/plain', carrot.id);
        });

        setupTouchEvents(carrot);
        storage.appendChild(carrot);
    }
    updateMath();
}

// --- XỬ LÝ VUỐT KÉO TRÊN MÀN HÌNH CẢM ỨNG (MOBILE) ---
function setupTouchEvents(element) {
    let offsetX = 0, offsetY = 0;
    
    element.addEventListener('touchstart', (e) => {
        if(hasGuessedCorrect) return; 
        playSound('drag'); 
        const touch = e.touches[0];
        const rect = element.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;
        element.style.position = 'absolute';
        element.style.zIndex = '1000';
    });

    element.addEventListener('touchmove', (e) => {
        if(hasGuessedCorrect) return;
        e.preventDefault();
        const touch = e.touches[0];
        element.style.left = (touch.clientX - offsetX) + 'px';
        element.style.top = (touch.clientY - offsetY) + 'px';
    });

    element.addEventListener('touchend', (e) => {
        if(hasGuessedCorrect) return;
        element.style.position = 'static';
        element.style.zIndex = 'auto';

        const touch = e.changedTouches[0];
        const p1Rect = plate1.getBoundingClientRect();
        const p2Rect = plate2.getBoundingClientRect();

        if (touch.clientX >= p1Rect.left && touch.clientX <= p1Rect.right &&
            touch.clientY >= p1Rect.top && touch.clientY <= p1Rect.bottom) {
            plate1.appendChild(element);
            playSound('drop'); 
            let currentCount = plate1.querySelectorAll('.carrot').length;
            speakNumber(currentCount); 
        } else if (touch.clientX >= p2Rect.left && touch.clientX <= p2Rect.right &&
                   touch.clientY >= p2Rect.top && touch.clientY <= p2Rect.bottom) {
            plate2.appendChild(element);
            playSound('drop'); 
            let currentCount = plate2.querySelectorAll('.carrot').length;
            speakNumber(currentCount); 
        } else {
            storage.appendChild(element);
            playSound('drop'); 
        }
        updateMath();
    });
}

// --- CẤU HÌNH NHẬN THẢ CHO PC ---
[storage, plate1, plate2].forEach(zone => {
    zone.addEventListener('dragover', (e) => e.preventDefault());
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        if(hasGuessedCorrect) return;
        const id = e.dataTransfer.getData('text/plain');
        const carrot = document.getElementById(id);
        if(carrot) {
            zone.appendChild(carrot);
            playSound('drop'); 
            let currentCount = zone.querySelectorAll('.carrot').length;
            if (zone.id === 'plate-1' || zone.id === 'plate-2') {
                speakNumber(currentCount);
            }
        }
        updateMath();
    });
});

// --- CẬP NHẬT CON SỐ TRÊN PHÉP TOÁN REAL-TIME ---
function updateMath() {
    num1 = plate1.querySelectorAll('.carrot').length;
    num2 = plate2.querySelectorAll('.carrot').length;
    correctAnswer = num1 + num2;

    document.getElementById('num1-text').innerText = num1;
    document.getElementById('num2-text').innerText = num2;

    const buttons = document.querySelectorAll(".balloon-btn");

    if (num1 === 0 && num2 === 0) {
        buttons.forEach(btn => { btn.innerText = "?"; btn.disabled = true; btn.style.opacity = "0.5"; });
        feedbackEl.innerText = "";
        drawBunny('normal');
        return;
    }

    let answers = [correctAnswer];
    while (answers.length < 3) {
        let wrongAnswer = Math.floor(Math.random() * 11);
        if (!answers.includes(wrongAnswer)) {
            answers.push(wrongAnswer);
        }
    }
    answers.sort(() => Math.random() - 0.5);

    buttons.forEach((btn, index) => {
        btn.innerText = answers[index];
        btn.disabled = false;
        btn.style.opacity = "1";
    });
    
    if(!hasGuessedCorrect) {
        feedbackEl.innerText = "What is the total sum?";
        drawBunny('thinking'); 
    }
}

// --- HOẠT HỌA THỎ CHẠY QUA THU HOẠCH CÀ RỐT ---
function triggerBunnyGathering() {
    gathererEl.classList.add("run-across");

    setTimeout(() => {
        const carrotsInPlate1 = plate1.querySelectorAll('.carrot');
        if(carrotsInPlate1.length > 0) {
            playSound('pop');
            carrotsInPlate1.forEach(c => c.classList.add('picked'));
        }
    }, 1100);

    setTimeout(() => {
        const carrotsInPlate2 = plate2.querySelectorAll('.carrot');
        if(carrotsInPlate2.length > 0) {
            playSound('pop');
            carrotsInPlate2.forEach(c => c.classList.add('picked'));
        }
    }, 2200);
}

// --- KIỂM TRA ĐÁP ÁN BÉ CHỌN ---
function checkAnswer(selectedButton) {
    const userAnswer = parseInt(selectedButton.innerText);
    const buttons = document.querySelectorAll(".balloon-btn");

    if (userAnswer === correctAnswer) {
        hasGuessedCorrect = true;
        feedbackEl.innerHTML = "<span style='color: #6BCB77;'>Perfect! Excellent job! 🎉</span>";
        buttons.forEach(btn => btn.disabled = true);
        
        drawBunny('happy'); 
        playSound('correct'); 
        speakPhrase("Perfect! Excellent job!"); 

        if (typeof confetti === 'function') {
            confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        }

        triggerBunnyGathering();

        setTimeout(() => {
            initCarrots();
        }, 3700);

    } else {
        feedbackEl.innerHTML = "<span style='color: #FF6B6B;'>Not quite right! Try counting again! 💪</span>";
        buttons.forEach(btn => btn.disabled = true); 
        
        drawBunny('sad'); 
        bunnyEl.classList.add("sad-shake"); // Ảnh thỏ của bạn sẽ tự động rung lắc khi sai
        playSound('wrong'); 
        speakPhrase("Try again!"); 

        setTimeout(() => {
            bunnyEl.classList.remove("sad-shake");
            buttons.forEach(btn => {
                if (parseInt(btn.innerText) !== userAnswer) {
                    btn.disabled = false;
                }
            });
            drawBunny('thinking');
            feedbackEl.innerHTML = "What is the total sum?";
        }, 1200);
    }
}

function resetGame() {
    initCarrots();
}

initCarrots();
