const storage = document.getElementById('carrot-storage');
const plate1 = document.getElementById('plate-1');
const plate2 = document.getElementById('plate-2');
const bunnyEl = document.getElementById('bunny-status');
const feedbackEl = document.getElementById("feedback");

let num1 = 0;
let num2 = 0;
let correctAnswer = 0;
let hasGuessedCorrect = false;

// --- KHỞI TẠO 10 CỦ CÀ RỐT BAN ĐẦU ---
function initCarrots() {
    storage.innerHTML = "";
    plate1.innerHTML = "";
    plate2.innerHTML = "";
    hasGuessedCorrect = false;
    bunnyEl.className = ""; // Xóa các hiệu ứng hoạt họa cũ
    
    for (let i = 1; i <= 10; i++) {
        const carrot = document.createElement('div');
        carrot.className = 'carrot';
        carrot.id = `carrot-${i}`;
        carrot.innerText = '🥕';
        carrot.draggable = true;

        carrot.addEventListener('dragstart', (e) => {
            if(hasGuessedCorrect) { e.preventDefault(); return; } 
            e.dataTransfer.setData('text/plain', carrot.id);
        });

        setupTouchEvents(carrot);
        storage.appendChild(carrot);
    }
    updateMath();
}

// --- HÀM XỬ LÝ VUỐT KÉO TRÊN MÀN HÌNH CẢM ỨNG ---
function setupTouchEvents(element) {
    let offsetX = 0, offsetY = 0;
    
    element.addEventListener('touchstart', (e) => {
        if(hasGuessedCorrect) return; 
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
        } else if (touch.clientX >= p2Rect.left && touch.clientX <= p2Rect.right &&
                   touch.clientY >= p2Rect.top && touch.clientY <= p2Rect.bottom) {
            plate2.appendChild(element);
        } else {
            storage.appendChild(element);
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
        if(carrot) zone.appendChild(carrot);
        updateMath();
    });
});

// --- CẬP NHẬT TRẠNG THÁI TOÁN VÀ SINH BONG BÓNG ĐÁP ÁN ---
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
        bunnyEl.innerText = "🐰";
        bunnyEl.style.fontSize = "45px";
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
        feedbackEl.innerText = "";
        bunnyEl.innerText = "🤔 Đố bé tổng bằng bao nhiêu nhỉ?";
        bunnyEl.style.fontSize = "26px";
    }
}

// --- HÀM KIỂM TRA ĐÁP ÁN KÈM HIỆU ỨNG THÔNG MINH ---
function checkAnswer(selectedButton) {
    const userAnswer = parseInt(selectedButton.innerText);
    const buttons = document.querySelectorAll(".balloon-btn");

    if (userAnswer === correctAnswer) {
        hasGuessedCorrect = true;
        feedbackEl.innerHTML = "<span style='color: #6BCB77;'>Hoàn hảo! Bé tính chuẩn xác rồi! 🎉</span>";
        bunnyEl.innerText = "🥳 Thỏ cảm ơn bé nhiều nhé!";
        bunnyEl.style.fontSize = "26px";
        buttons.forEach(btn => btn.disabled = true);

        // KÍCH HOẠT HIỆU ỨNG TÙNG HOA (CONFETTI PLUG-IN)
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 120, // Số lượng hạt pháo hoa
                spread: 70,         // Độ mở rộng góc bắn
                origin: { y: 0.6 }  // Vị trí bắn pháo (ở giữa màn hình hất lên)
            });
        }
    } else {
        // KÍCH HOẠT HIỆU ỨNG MẶT BUỒN VÀ LẮC ĐẦU
        feedbackEl.innerHTML = "<span style='color: #FF6B6B;'>Chưa đúng rồi! Bé thử đếm lại nhé! 💪</span>";
        bunnyEl.innerText = "😭 Hu hu... đếm lại giúp Thỏ với!";
        bunnyEl.style.fontSize = "26px";
        
        // Thêm class tạo hiệu ứng lắc đầu buồn bã
        bunnyEl.classList.add("sad-shake");
        selectedButton.style.opacity = "0.2";
        selectedButton.disabled = true;

        // Tự động gỡ bỏ class hoạt họa sau khi kết thúc chuyển động để có thể lặp lại lần sau
        setTimeout(() => {
            bunnyEl.classList.remove("sad-shake");
        }, 500);
    }
}

function resetGame() {
    initCarrots();
}

initCarrots();
