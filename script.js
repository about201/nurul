// 1. DATA SLIDESHOW
const images = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069'
];
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

// 2. DATA FEED NURUL
const nurulFeedData = [
    {
        images: ['https://images.unsplash.com/photo-1520850832695-f3a141c28b0c?q=80&w=2070', 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2069'],
        caption: "Setiap langkah bersamamu adalah cerita indah yang tak ingin aku akhiri. ❤️"
    },
    {
        images: ['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069'],
        caption: "Senyumanmu adalah alasan terbaik untukku tetap bahagia hari ini."
    },
    {
        images: ['https://images.unsplash.com/photo-1516589174184-c6848463ec7d?q=80&w=1974'],
        caption: "Hanya ingin membagikan momen kecil yang penuh arti bagi kita."
    }
];

let activePostIdx = 0;
let activeSlideIdx = 0;

function renderNurulFeed() {
    const grid = document.getElementById('nurul-feed-grid');
    if (!grid) return;
    grid.innerHTML = nurulFeedData.map((post, i) => `
        <div class="feed-card" onclick="openPostModal(${i})">
            <img src="${post.images[0]}" alt="Post">
        </div>
    `).join('');
}

function openPostModal(index) {
    activePostIdx = index;
    activeSlideIdx = 0;
    const post = nurulFeedData[index];
    document.getElementById('post-caption-full').innerText = post.caption;
    document.getElementById('modal-post').classList.remove('hidden');
    updatePostSlider();
}

function closePostModal() { document.getElementById('modal-post').classList.add('hidden'); }

function updatePostSlider() {
    const post = nurulFeedData[activePostIdx];
    const slider = document.getElementById('post-slider');
    slider.innerHTML = `<img src="${post.images[activeSlideIdx]}" alt="Slide">`;
    const btns = document.querySelectorAll('.slide-ctrl');
    btns.forEach(b => b.style.display = post.images.length > 1 ? 'block' : 'none');
}

function changePostSlide(n) {
    const post = nurulFeedData[activePostIdx];
    activeSlideIdx = (activeSlideIdx + n + post.images.length) % post.images.length;
    updatePostSlider();
}

// 3. NAVIGASI UMUM
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }

function showPage(id) {
    const sections = document.querySelectorAll('section');
    sections.forEach(s => s.classList.add('hidden-page'));
    
    const target = document.getElementById('page-' + id);
    if(target) target.classList.remove('hidden-page');
    
    if(id === 'nurul') renderNurulFeed();
    if(document.getElementById('sidebar').classList.contains('open')) toggleSidebar();
    window.scrollTo(0,0);
}

function toggleSearch(show) {
    const drop = document.getElementById('search-drop');
    if(show) {
        drop.style.display = 'block';
    } else {
        setTimeout(() => drop.style.display = 'none', 200);
    }
}

// 4. SISTEM PESAN
function openModal() { document.getElementById('modal-box').classList.remove('hidden'); }
function closeModal() { document.getElementById('modal-box').classList.add('hidden'); }

function submitPesan() {
    const input = document.getElementById('msg-input');
    if(!input.value.trim()) return;
    let logs = JSON.parse(localStorage.getItem('wedding_logs') || '[]');
    logs.unshift(input.value.trim());
    localStorage.setItem('wedding_logs', JSON.stringify(logs));
    input.value = ""; 
    closeModal(); 
    loadMessages();
}

// Mengubah fungsi tampilkan pesan agar ada tombol hapusnya
function loadMessages() {
    const list = document.getElementById('message-list');
    if (!list) return;
    let logs = JSON.parse(localStorage.getItem('wedding_logs') || '[]');
    
    list.innerHTML = logs.map((m, i) => `
        <div class="card-pesan" onclick="openReadModal(${i})">
            <div class="btn-delete-msg" onclick="hapusPesan(event, ${i})">
                <i class="fa-solid fa-trash-can"></i>
            </div>
            
            <p class="wedding-font italic text-xs mb-2" style="color:var(--lilac)">Dear Nurul,</p>
            <p style="font-size: 0.9rem; line-height: 1.6;" class="line-clamp-3">${m}</p>
        </div>
    `).join('');
}

// Fungsi baru untuk menghapus pesan
function hapusPesan(event, index) {
    // Mencegah modal "baca pesan" terbuka saat klik tombol hapus
    event.stopPropagation();
    
    if (confirm("Apakah kamu yakin ingin menghapus pesan kenangan ini?")) {
        let logs = JSON.parse(localStorage.getItem('wedding_logs') || '[]');
        
        // Menghapus 1 data pada index yang dipilih
        logs.splice(index, 1);
        
        // Simpan kembali ke localStorage
        localStorage.setItem('wedding_logs', JSON.stringify(logs));
        
        // Segarkan tampilan
        loadMessages();
    }
}

function openReadModal(i) {
    let logs = JSON.parse(localStorage.getItem('wedding_logs') || '[]');
    document.getElementById('isi-pesan-lengkap').innerText = logs[i];
    document.getElementById('modal-baca').classList.remove('hidden');
}

function closeReadModal() { document.getElementById('modal-baca').classList.add('hidden'); }

// Init saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    loadMessages();
    // Secara default buka landing
    showPage('landing');
});

const albumPhotos = [
    'https://images.unsplash.com/photo-1516589174184-c6848463ec7d?q=80&w=1974',
    'https://images.unsplash.com/photo-1520850832695-f3a141c28b0c?q=80&w=2070',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069',
    'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070'
];

let albumIndex = 0;

// Jalankan ini satu kali saat halaman dimuat
function initAlbum() {
    const container = document.getElementById('carousel-container');
    if (!container) return;
    
    container.innerHTML = ''; // Kosongkan dulu
    albumPhotos.forEach((src, i) => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.id = `album-item-${i}`;
        item.innerHTML = `<img src="${src}" alt="Foto ${i}">`;
        container.appendChild(item);
    });
    updateAlbumPositions(); // Set posisi awal
}

// Fungsi ini hanya mengubah Class, sehingga animasi CSS akan berjalan
function updateAlbumPositions() {
    albumPhotos.forEach((_, i) => {
        const item = document.getElementById(`album-item-${i}`);
        if (!item) return;

        // Reset class
        item.classList.remove('active', 'prev-slide', 'next-slide', 'hidden');

        if (i === albumIndex) {
            item.classList.add('active');
        } else if (i === (albumIndex - 1 + albumPhotos.length) % albumPhotos.length) {
            item.classList.add('prev-slide');
        } else if (i === (albumIndex + 1) % albumPhotos.length) {
            item.classList.add('next-slide');
        } else {
            item.classList.add('hidden');
        }
    });
}

function moveCarousel(n) {
    albumIndex = (albumIndex + n + albumPhotos.length) % albumPhotos.length;
    updateAlbumPositions();
}

// Update fungsi navigasi showPage
const originalShowPage = showPage;
showPage = function(id) {
    originalShowPage(id);
    if(id === 'photo') {
        // Jika elemen belum ada, buat dulu. Jika sudah, cukup update posisi.
        if (document.querySelectorAll('.carousel-item').length === 0) {
            initAlbum();
        } else {
            updateAlbumPositions();
        }
    }
};

let currentSpotifyIdx = 0;

function moveSpotify(n) {
    const items = document.querySelectorAll('.spotify-item');
    const container = document.getElementById('spotify-container');
    
    // Matikan status active lama
    items[currentSpotifyIdx].classList.remove('active');
    
    // Update index
    currentSpotifyIdx = (currentSpotifyIdx + n + items.length) % items.length;
    
    // Geser container & nyalakan status active baru
    container.style.transform = `translateX(-${currentSpotifyIdx * 100}%)`;
    items[currentSpotifyIdx].classList.add('active');
}

let appleIdx = 0;

function moveApple(n) {
    const container = document.getElementById('apple-container');
    const items = document.querySelectorAll('.apple-item');
    const indicator = document.getElementById('apple-indicator');
    
    appleIdx = (appleIdx + n + items.length) % items.length;
    
    // Geser container
    container.style.transform = `translateX(-${appleIdx * 100}%)`;
    
    // Update angka (misal: 1 / 2)
    indicator.innerText = `${appleIdx + 1} / ${items.length}`;
}

let isPlaying = false;
let currentTrackIdx = -1;
const audioPlayer = document.getElementById('main-audio');

f// GANTI fungsi playMusic lama dengan yang ini
function playMusic(idx, songUrl) {
    const allPlayIcons = document.querySelectorAll('.play-icon');
    const allAlbumArts = document.querySelectorAll('.album-art');
    
    if (currentTrackIdx === idx) {
        if (isPlaying) {
            audioPlayer.pause();
            isPlaying = false;
            document.getElementById(`play-icon-${idx}`).innerHTML = '<i class="fa-solid fa-play"></i>';
            allAlbumArts[idx].classList.remove('pulse');
        } else {
            audioPlayer.play();
            isPlaying = true;
            document.getElementById(`play-icon-${idx}`).innerHTML = '<i class="fa-solid fa-pause"></i>';
            allAlbumArts[idx].classList.add('pulse');
        }
    } else {
        currentTrackIdx = idx;
        audioPlayer.src = songUrl;
        audioPlayer.play();
        isPlaying = true;
        
        // Reset semua
        allPlayIcons.forEach((icon, i) => {
            icon.innerHTML = '<i class="fa-solid fa-play"></i>';
            allAlbumArts[i].classList.remove('pulse');
        });
        
        // Aktifkan yang dipilih
        document.getElementById(`play-icon-${idx}`).innerHTML = '<i class="fa-solid fa-pause"></i>';
        allAlbumArts[idx].classList.add('pulse');
    }
}

// TAMBAHKAN fungsi pembuat partikel di akhir script.js
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.innerHTML = '🌸'; // Bisa ganti dengan ❤️ atau ✨
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDuration = Math.random() * 3 + 2 + 's';
    particle.style.opacity = Math.random();
    particle.style.fontSize = Math.random() * 10 + 10 + 'px';
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 5000);
}

// Jalankan partikel hanya jika musik sedang menyala
setInterval(() => {
    if (isPlaying) createParticle();
}, 300);

// Tambahan: Reset ikon jika lagu selesai
audioPlayer.onended = function() {
    isPlaying = false;
    const allPlayIcons = document.querySelectorAll('.play-icon i');
    const allAlbumArts = document.querySelectorAll('.album-art');
    allPlayIcons.forEach(icon => icon.className = 'fa-solid fa-play');
    allAlbumArts.forEach(art => art.classList.remove('pulse'));
};

