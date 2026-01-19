// 1. DATA SLIDESHOW
const images = ['landing_page/landing_page.jpeg', 'landing_page/landing_page2.jpeg'];
let currentImg = 0;

function changeSlide() {
    const bg = document.getElementById('bg-slideshow');
    if (!bg) return;
    bg.style.opacity = '0.1';
    setTimeout(() => {
        bg.style.backgroundImage = `url('${images[currentImg]}')`;
        bg.style.opacity = '1';
        currentImg = (currentImg + 1) % images.length;
    }, 1000);
}
setInterval(changeSlide, 6000);
changeSlide();

// 2. NAVIGASI
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }

function showPage(id) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden-page'));
    const target = document.getElementById('page-' + id);
    if(target) target.classList.remove('hidden-page');
    
    if(id === 'photo') initAlbum();
    if(document.getElementById('sidebar').classList.contains('open')) toggleSidebar();
    window.scrollTo(0,0);
}

function toggleSearch(show) {
    const drop = document.getElementById('search-drop');
    if(show) drop.style.display = 'block';
    else setTimeout(() => drop.style.display = 'none', 200);
}

// 3. PESAN SISTEM
function openModal() { document.getElementById('modal-box').classList.remove('hidden'); }
function closeModal() { document.getElementById('modal-box').classList.add('hidden'); }

function submitPesan() {
    const input = document.getElementById('msg-input');
    if(!input.value.trim()) return;
    let logs = JSON.parse(localStorage.getItem('wedding_logs') || '[]');
    logs.unshift(input.value.trim());
    localStorage.setItem('wedding_logs', JSON.stringify(logs));
    input.value = ""; closeModal(); loadMessages();
}

function loadMessages() {
    const list = document.getElementById('message-list');
    if (!list) return;
    let logs = JSON.parse(localStorage.getItem('wedding_logs') || '[]');
    list.innerHTML = logs.map((m, i) => `
        <div class="card-pesan" onclick="openReadModal(${i})">
            <div class="btn-delete-msg" onclick="hapusPesan(event, ${i})"><i class="fa-solid fa-trash-can"></i></div>
            <p class="wedding-font italic text-xs mb-2" style="color:var(--lilac)">Dear Us,</p>
            <p style="font-size: 0.9rem; line-height: 1.6;" class="line-clamp-3">${m}</p>
        </div>
    `).join('');
}

function hapusPesan(event, index) {
    event.stopPropagation();
    if (confirm("Hapus pesan ini?")) {
        let logs = JSON.parse(localStorage.getItem('wedding_logs') || '[]');
        logs.splice(index, 1);
        localStorage.setItem('wedding_logs', JSON.stringify(logs));
        loadMessages();
    }
}

function openReadModal(i) {
    let logs = JSON.parse(localStorage.getItem('wedding_logs') || '[]');
    document.getElementById('isi-pesan-lengkap').innerText = logs[i];
    document.getElementById('modal-baca').classList.remove('hidden');
}
function closeReadModal() { document.getElementById('modal-baca').classList.add('hidden'); }

// 4. ALBUM FOTO
const albumPhotos = [
    'album_foto/foto1.jpeg', 'album_foto/foto2.jpeg', 'album_foto/foto3.jpeg',
    'album_foto/foto4.jpeg', 'album_foto/foto5.jpeg', 'album_foto/foto6.jpeg',
    'album_foto/foto7.jpeg', 'album_foto/foto8.jpeg'
];
let albumIndex = 0;

function initAlbum() {
    const container = document.getElementById('carousel-container');
    if (!container || container.children.length > 0) return;
    albumPhotos.forEach((src, i) => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.id = `album-item-${i}`;
        item.innerHTML = `<img src="${src}">`;
        container.appendChild(item);
    });
    updateAlbumPositions();
}

function updateAlbumPositions() {
    albumPhotos.forEach((_, i) => {
        const item = document.getElementById(`album-item-${i}`);
        if (!item) return;
        item.classList.remove('active', 'prev-slide', 'next-slide', 'hidden');
        if (i === albumIndex) item.classList.add('active');
        else if (i === (albumIndex - 1 + albumPhotos.length) % albumPhotos.length) item.classList.add('prev-slide');
        else if (i === (albumIndex + 1) % albumPhotos.length) item.classList.add('next-slide');
        else item.classList.add('hidden');
    });
}

function moveCarousel(n) { albumIndex = (albumIndex + n + albumPhotos.length) % albumPhotos.length; updateAlbumPositions(); }

// 5. APPLE MUSIC WIDGET
let appleIdx = 0;
function moveApple(n) {
    const items = document.querySelectorAll('.apple-item');
    appleIdx = (appleIdx + n + items.length) % items.length;
    document.getElementById('apple-container').style.transform = `translateX(-${appleIdx * 100}%)`;
    document.getElementById('apple-indicator').innerText = `${appleIdx + 1} / ${items.length}`;
}

let isPlaying = false;
const audioPlayer = document.getElementById('main-audio');

function playMusic(idx, songUrl) {
    const icons = document.querySelectorAll('.play-icon');
    const arts = document.querySelectorAll('.album-art');
    if (audioPlayer.src.includes(songUrl)) {
        if (isPlaying) { audioPlayer.pause(); isPlaying = false; }
        else { audioPlayer.play(); isPlaying = true; }
    } else {
        audioPlayer.src = songUrl; audioPlayer.play(); isPlaying = true;
    }
    icons.forEach((icon, i) => {
        const isThis = songUrl.includes(itemsSrc(i)); // Helper logic simplifikasi
        icon.innerHTML = (isPlaying && i === idx) ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
        if (isPlaying && i === idx) arts[i].classList.add('pulse'); else arts[i].classList.remove('pulse');
    });
}

function itemsSrc(i) { return i === 0 ? 'Ah.mp3' : 'NIKI.mp3'; }

// 6. PARTICLE
setInterval(() => {
    if (isPlaying) {
        const p = document.createElement('div');
        p.className = 'particle'; p.innerHTML = '🌸';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = (Math.random() * 3 + 2) + 's';
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 5000);
    }
}, 300);

document.addEventListener('DOMContentLoaded', () => { loadMessages(); showPage('landing'); });

// FITUR CEK ULANG TAHUN (HANYA 20 JANUARI)
function checkBirthday() {
    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth() + 1; // Januari adalah 0, jadi +1

    // Cek jika Tanggal 20 dan Bulan 1 (Januari)
    if (date === 20 && month === 1) {
        const bdayModal = document.getElementById('birthday-modal');
        if (bdayModal) {
            // Munculkan modal setelah 2 detik halaman terbuka agar ada efek kejutan
            setTimeout(() => {
                bdayModal.classList.remove('hidden');
                triggerConfetti(); // Opsional: memicu partikel bunga
            }, 2000);
        }
    }
}

function closeBirthday() {
    document.getElementById('birthday-modal').classList.add('hidden');
}

function triggerPartyPopper() {
    const container = document.getElementById('confetti-container');
    const colors = ['#ff69b4', '#ff1493', '#ffd700', '#00ced1', '#adff2f', '#ffffff'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Posisi acak dan warna acak
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Variabel custom untuk arah lemparan di CSS
        confetti.style.setProperty('--x', Math.random());
        
        // Ukuran dan durasi acak
        const size = Math.random() * 10 + 5 + 'px';
        confetti.style.width = size;
        confetti.style.height = size;
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.animationDelay = (Math.random() * 0.5) + 's';
        
        container.appendChild(confetti);
        
        // Hapus elemen setelah animasi selesai agar tidak berat
        setTimeout(() => confetti.remove(), 4000);
    }
}

// Update fungsi checkBirthday untuk memicu ledakan
function checkBirthday() {
    const today = new Date();
    if (today.getDate() === 20 && (today.getMonth() + 1) === 1) {
        setTimeout(() => {
            document.getElementById('birthday-modal').classList.remove('hidden');
            triggerPartyPopper(); // Pemicu ledakan party popper
        }, 1500);
    }
}

// Pastikan fungsi dipanggil saat load
document.addEventListener('DOMContentLoaded', () => {
    // Fungsi loadMessages & showPage yang lama tetap ada di sini
    checkBirthday(); 
});
