// --- BỘ ĐỔI SỐ THÀNH CHỮ TIẾNG ANH CHUẨN ---
const englishNumbers = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

// --- TÍNH NĂNG ĐỌC SỐ GIỌNG NÓI TIẾNG ANH ---
function speakNumber(number) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Tắt giọng đọc cũ
        
        let textToSpeak = englishNumbers[number] || number.toString();
        let utterance = new SpeechSynthesisUtterance(textToSpeak);
        
        utterance.lang = 'en-US'; // Chuyển sang giọng Tiếng Anh Mỹ chuẩn
        utterance.rate = 1.0;     
        utterance.pitch = 1.3;    // Giọng cao, trong trẻo như phim hoạt hình Disney
        
        window.speechSynthesis.speak(utterance);
    }
}

// --- TÍNH NĂNG ĐỌC CÂU KHEN NGỢI TIẾNG ANH ---
function speakPhrase(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        let utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1.2;
        window.speechSynthesis.speak(utterance);
    }
}

// --- HÀM TẠO ÂM THANH HIỆU ỨNG TỰ ĐỘNG BẰNG CODE ---
function playSound(type) {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === 'drag') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } 
        else if (type === 'drop') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        } 
        else if (type === 'correct') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now); 
            gain.gain.setValueAtTime(0.3, now);
            osc.frequency.setValueAtTime(659.25, now + 0.1); 
            osc.frequency.setValueAtTime(783.99, now + 0.2); 
            gain.gain.linearRampToValueAtTime(0, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
        } 
        else if (type === 'wrong') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, now); 
            osc.frequency.linearRampToValueAtTime(100, now + 0.3); 
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        }
        else if (type === 'pop') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(900, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        }
    } catch (e) {
        console.log("Audio Context Error:", e);
    }
}
