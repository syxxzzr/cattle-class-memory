// Banner phrases that will scroll across the screen
const BannerList = [
    '这边这时候',
    'Nèi~ 个',
    '我看以后这边这时候'
];

// Get cookie by name
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName.trim() === encodeURIComponent(name))
            return cookieValue.trim() ? decodeURIComponent(cookieValue) : '';
    }
    return undefined;
}

// Load file list from localStorage with decryption
function loadFileListFromLocalStorage() {
    let cryptKey = getCookie('CryptKey');
    let fileData = localStorage.getItem('file_data');

    if (!cryptKey || !fileData)
        return null;

    try {
        fileData = CryptoJS.AES.decrypt(fileData, cryptKey).toString(CryptoJS.enc.Utf8);
        return fileData ? JSON.parse(fileData) : null;
    } catch (error) {
        console.error('Failed to decrypt file data:', error);
        return null;
    }
}

// Adjust viewport height for mobile browsers
function adjustHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Show error message with animation
function showErrorHint(hint) {
    const accessKey = document.getElementById('accessKey');
    const errorMsg = document.getElementById('errorMsg');

    errorMsg.innerText = hint;
    errorMsg.style.display = 'block';
    accessKey.style.borderColor = '#ff3b30';

    const container = document.querySelector('.container');
    container.style.animation = 'gentle-shake 0.3s';
    setTimeout(() => {
        container.style.animation = '';
    }, 300);
}

// Load photos into the photo wall with click to enlarge functionality
async function loadFiles(fileList) {
    if (!fileList || fileList.length === 0)
        return;

    const archiveLibrary = document.getElementById('archive-library');
    archiveLibrary.innerHTML = '';

    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading';
    loadingElement.innerHTML = '<div class="loading-spinner"></div>';
    archiveLibrary.appendChild(loadingElement);

    try {
        for (const file of fileList) {
            const archiveCard = document.createElement('div');
            archiveCard.className = 'archive-card';
            archiveCard.style.animation = 'fade-in 0.5s ease forwards, slide-up 0.5s ease forwards';
            archiveCard.style.animationDelay = `${Math.random() * 0.5}s`;

            let imgSrc = '';
            if (file.file_url)
                imgSrc = file.file_url;
            else if (file.file_id)
                imgSrc = `./file/${file.file_id}`;

            archiveCard.innerHTML = `
                <img class="archive-img" src="${imgSrc}" alt="${file.file_title || 'Photo'}" loading="lazy">
                <div class="archive-info">
                    <h3 class="archive-title">${file.file_title || 'Untitled'}</h3>
                    <p class="archive-description">${file.file_description || ''}</p>
                </div>
            `;

            const imgElement = archiveCard.querySelector('.photo-img');
            imgElement.addEventListener('click', () => {
                openLightbox(imgSrc, file.file_title || 'Archive');
            });

            archiveLibrary.appendChild(archiveCard);
        }
    } catch (error) {
        console.error('Error loading photos:', error);
    } finally {
        archiveLibrary.removeChild(loadingElement);
    }
}

function openLightbox(imgSrc, imgAlt) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    lightboxImg.src = imgSrc;
    lightboxImg.alt = imgAlt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 灯箱功能 - 关闭灯箱
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// 初始化灯箱事件
function initializeLightbox() {
    const lightboxClose = document.getElementById('lightboxClose');
    const lightbox = document.getElementById('lightbox');
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox)
            closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active'))
            closeLightbox();
    });
}

function initializeBanners() {
    const bannerContainer = document.querySelector('.banner-container');
    bannerContainer.innerHTML = '';

    BannerList.forEach((text) => {
        if (text) {
            const banner = document.createElement('a');
            banner.textContent = text;
            banner.style.animationDelay = `${Math.random() * 5}s`;
            banner.style.top = `${Math.floor(Math.random() * 50) + 20}%`;
            const duration = 15 + Math.random() * 10;
            banner.style.animationDuration = `${duration}s`;
            bannerContainer.appendChild(banner);
        }
    });
}
