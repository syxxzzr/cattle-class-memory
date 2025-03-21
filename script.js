// Banner phrases that will scroll across the screen
const BannerList = [
    '这边这时候',
    'Nèi~ 个',
    '我看以后这边这时候',
    '六班记忆',
    '回忆时光',
    '青春岁月',
    '同窗情谊',
    '难忘时光'
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
    
    if (!cryptKey || !fileData) {
        return null;
    }
    
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
    if (!fileList || fileList.length === 0) {
        return;
    }
    
    const photoWall = document.getElementById('photoWall');
    photoWall.innerHTML = '';
    
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading';
    loadingElement.innerHTML = '<div class="loading-spinner"></div>';
    photoWall.appendChild(loadingElement);
    
    try {
        for (const file of fileList) {
            const photoCard = document.createElement('div');
            photoCard.className = 'photo-card';
            photoCard.style.animation = 'fade-in 0.5s ease forwards, slide-up 0.5s ease forwards';
            photoCard.style.animationDelay = `${Math.random() * 0.5}s`;
            
            let imgSrc = '';
            if (file.file_url) {
                imgSrc = file.file_url;
            } else if (file.file_id) {
                imgSrc = `./file/${file.file_id}`;
            }
            
            photoCard.innerHTML = `
                <img class="photo-img" src="${imgSrc}" alt="${file.file_title || 'Photo'}" loading="lazy">
                <div class="photo-info">
                    <h3 class="photo-title">${file.file_title || 'Untitled'}</h3>
                    <p class="photo-description">${file.file_description || ''}</p>
                </div>
            `;
            
            // 添加点击事件，点击图片时打开灯箱
            const imgElement = photoCard.querySelector('.photo-img');
            imgElement.addEventListener('click', () => {
                openLightbox(imgSrc, file.file_title || 'Photo', file.file_title, file.file_description);
            });
            
            photoWall.appendChild(photoCard);
        }
    } catch (error) {
        console.error('Error loading photos:', error);
    } finally {
        photoWall.removeChild(loadingElement);
    }
}

// 灯箱功能 - 打开灯箱
function openLightbox(imgSrc, imgAlt, imgTitle, imgDescription) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    
    lightboxImg.src = imgSrc;
    lightboxImg.alt = imgAlt;
    
    // 设置照片标题和描述
    lightboxTitle.textContent = imgTitle || 'Untitled';
    lightboxDescription.textContent = imgDescription || '';
    
    lightbox.classList.add('active');
    
    // 禁止背景滚动
    document.body.style.overflow = 'hidden';
}

// 灯箱功能 - 关闭灯箱
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    
    // 恢复背景滚动
    document.body.style.overflow = '';
}

// 初始化灯箱事件
function initializeLightbox() {
    const lightboxClose = document.getElementById('lightboxClose');
    const lightbox = document.getElementById('lightbox');
    
    // 点击关闭按钮关闭灯箱
    lightboxClose.addEventListener('click', closeLightbox);
    
    // 点击灯箱背景关闭灯箱
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // 按ESC键关闭灯箱
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// Initialize banner elements with more randomness
function initializeBanners() {
    const bannerContainer = document.querySelector('.banner-container');
    bannerContainer.innerHTML = '';
    
    BannerList.forEach((text, index) => {
        if (text) {
            const banner = document.createElement('a');
            banner.textContent = text;
            // 更随机的动画延迟
            banner.style.animationDelay = `${Math.random() * 5}s`;
            // 更随机的垂直位置
            banner.style.top = `${Math.floor(Math.random() * 80) + 5}%`;
            // 更随机的动画持续时间
            const duration = 15 + Math.random() * 10;
            banner.style.animationDuration = `${duration}s`;
            bannerContainer.appendChild(banner);
        }
    });
}