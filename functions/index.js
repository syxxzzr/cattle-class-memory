export async function onRequest(context) {
    const { env } = context;
    const page = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js"></script>
    <title>${env.projectName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            background-color: #f5f5f7;
            color: #1d1d1f;
            line-height: 1.5;
            min-width: 100vw;
            min-height: 100vh;
        }

        h1 {
            font-size: clamp(20px, 5vw, 24px);
            font-weight: 500;
            text-align: center;
        }

        .container {
            display: flex;
            min-width: 100vw;
            min-height: 100vh;
        }

        #auth {
            justify-content: center;
            align-items: center;
        }

        #archive {
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }

        .banner-container {
            overflow: hidden;
            min-width: 100vw;
            min-height: 100vh;
            position: absolute;
            z-index: 0;
            pointer-events: none;
        }

        .banner-container a {
            white-space: nowrap;
            position: absolute;
            left: 100%;
            font-size: clamp(20px, 5vw, 24px);
            font-weight: 500;
            color: rgba(134, 134, 139, 50%);
            animation: scroll-left 20s linear infinite;
        }

        footer {
            position: fixed;
            bottom: 3px;
        }

        footer img {
            margin: auto 2px;
        }

        .auth-container {
            width: 100%;
            max-width: 430px;
            padding: 40px 20px;
            margin: 0 auto;
            background-color: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            z-index: 1;
        }

        .auth-container h1 {
            margin-bottom: 30px;
        }

        .form-group {
            margin-bottom: 20px;
            position: relative;
        }

        input {
            width: 100%;
            padding: 12px 15px;
            font-size: 17px;
            border: 1px solid #d2d2d7;
            border-radius: 8px;
            outline: none;
            transition: border-color 0.2s ease;
            -webkit-appearance: none;
            appearance: none;
        }

        input:focus {
            border-color: #0071e3;
            box-shadow: 0 0 0 4px rgba(0, 125, 250, 0.1);
        }

        .error-message {
            display: none;
            color: #ff3b30;
            font-size: 14px;
            margin-top: 8px;
            padding-left: 2px;
        }

        button {
            display: block;
            width: 100%;
            padding: 12px 15px;
            background-color: #0071e3;
            color: white;
            font-size: 17px;
            font-weight: 400;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.2s ease;
            -webkit-appearance: none;
            appearance: none;
        }

        button:hover {
            background-color: #0077ed;
        }

        button:disabled {
            background-color: #76b9f7;
            cursor: not-allowed;
        }

        .divider {
            display: flex;
            align-items: center;
            margin: 20px 0;
            color: #86868b;
        }

        .divider::before,
        .divider::after {
            content: "";
            flex: 1;
            border-bottom: 1px solid #d2d2d7;
        }

        .divider span {
            padding: 0 10px;
            font-size: 14px;
        }

        .help-text {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #86868b;
        }

        .help-text a {
            color: #0071e3;
            text-decoration: none;
        }

        .help-text a:hover {
            text-decoration: underline;
        }

        /* Photo Wall Styles */
        .archive-library-header {
            width: 100%;
            max-width: 1200px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;
            padding: 0 20px;
        }

        .archive-library-intro {
            width: 100%;
            max-width: 1200px;
            text-align: center;
            margin-bottom: 30px;
            padding: 0 20px;
        }

        .archive-library-intro p {
            font-size: 16px;
            line-height: 1.6;
            color: #86868b;
        }

        .archive-library-title {
            font-size: 28px;
            font-weight: 600;
        }

        #archive-library {
            width: 100%;
            max-width: 1200px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            padding: 0 20px;
        }

        .archive-card {
            background-color: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            opacity: 0;
            transform: translateY(20px);
        }

        .archive-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .archive-img {
            width: 100%;
            aspect-ratio: 4/3;
            object-fit: cover;
            display: block;
        }

        .archive-info {
            padding: 16px;
        }

        .archive-title {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 8px;
        }

        .archive-description {
            font-size: 14px;
            color: #86868b;
            line-height: 1.4;
        }

        /* Loading Animation */
        .loading {
            width: 100%;
            display: flex;
            justify-content: center;
            padding: 40px 0;
            grid-column: 1 / -1;
        }

        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(0, 113, 227, 0.2);
            border-radius: 50%;
            border-top-color: #0071e3;
            animation: spin 1s ease-in-out infinite;
        }

        /* Lightbox Styles */
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }

        .lightbox.active {
            opacity: 1;
            pointer-events: auto;
        }

        .lightbox-img {
            max-width: 90%;
            max-height: 90vh;
            object-fit: contain;
            border-radius: 4px;
            box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }

        .lightbox.active .lightbox-img {
            transform: scale(1);
        }

        .lightbox-close {
            position: absolute;
            top: 20px;
            right: 20px;
            color: white;
            font-size: 30px;
            cursor: pointer;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
            transition: background-color 0.2s ease;
        }

        .lightbox-close:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }

        /* Animations */
        @keyframes gentle-shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-3px); }
            40% { transform: translateX(3px); }
            60% { transform: translateX(-2px); }
            80% { transform: translateX(2px); }
        }

        @keyframes scroll-left {
            0% { left: 100%; }
            100% { left: -100%; }
        }

        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slide-up {
            from { transform: translateY(20px); }
            to { transform: translateY(0); }
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Dark Mode */
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #1d1d1f;
                color: #f5f5f7;
            }

            .auth-container {
                background-color: rgba(44, 44, 46, 0.8);
            }

            input {
                background-color: #1d1d1f;
                border-color: #424245;
                color: #f5f5f7;
            }

            .divider::before,
            .divider::after {
                border-color: #424245;
            }

            .archive-card {
                background-color: #2c2c2e;
            }

            .archive-description {
                color: #98989d;
            }
        }

        /* Responsive Design */
        @media screen and (max-width: 480px) {
            .auth-container {
                width: 90%;
                min-width: 250px;
                padding: 30px 15px;
            }

            input, button {
                padding: 10px 12px;
                font-size: 16px;
            }

            .form-group {
                margin-bottom: 15px;
            }

            #archive-library {
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 15px;
            }
        }

        @media screen and (max-height: 600px) {
            .auth-container {
                padding-top: 20px;
                padding-bottom: 20px;
            }

            .auth-container h1 {
                margin-bottom: 20px;
            }
        }

    </style>
</head>
<body>

<div class="container" id="archive">
    <div class="archive-library-header">
        <h1 class="archive-library-title" style="margin-bottom: 0">${env.projectName}</h1>
    </div>
    <div class="archive-library-intro">
        <p>${env.projectDescription}</p>
    </div>
    <div id="archive-library"></div>
</div>
<div class="lightbox" id="lightbox">
    <img class="lightbox-img" id="lightboxImg" src="" alt="放大图片">
    <div class="lightbox-close" id="lightboxClose">×</div>
</div>

<div class="container" id="auth">
    <div class="banner-container"></div>
    <div class="auth-container">
        <h1>验证您的通行密钥</h1>
        <form id="authForm">
            <div class="form-group">
                <input id="accessKey" placeholder="通行密钥">
                <div class="error-message" id="errorMsg"></div>
            </div>
            <div class="form-group">
                <button type="submit" id="submit">验证</button>
            </div>
        </form>
        <div class="divider">
            <span>或</span>
        </div>
        <div class="help-text">
            <p>忘记通行密钥? <a href="mailto:syxxzzr@gmail.com">联系我们</a></p>
        </div>
    </div>
    <footer>
        <a href="https://github.com/syxxzzr" target="_blank">
            <img alt="" src="https://img.shields.io/badge/Author-syxxzzr-red">
        </a>
        <a href="https://github.com/syxxzzr" target="_blank">
            <img alt="" src="https://img.shields.io/badge/Github-cattle--class--memory-blue">
            <img alt="" src="https://img.shields.io/badge/License-MIT-green">
        </a>
    </footer>
</div>
<script>
    const BannerList = ${JSON.stringify(env.trashTalk.split(';') || [])};

    document.addEventListener('DOMContentLoaded', async () => {
        adjustHeight();  // suit different environment
        initializeBanners();
        initializeLightbox();
        const fileList = loadFileListFromLocalStorage();
        const authContainer = document.getElementById('auth');
        const archiveContainer = document.getElementById('archive');

        if (fileList) {
            authContainer.style.display = 'none';
            archiveContainer.style.display = '';
            await loadFiles(fileList);
        } else {
            authContainer.style.display = '';
            archiveContainer.style.display = 'none';
        }

        document.getElementById('authForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const accessKey = document.getElementById('accessKey');
            const errorMsg = document.getElementById('errorMsg');
            const submit = document.getElementById('submit');

            accessKey.style.borderColor = '';
            errorMsg.style.display = '';
            submit.innerText = '验证中...';
            submit.disabled = true;

            // empty access key
            if (/^\\s*$/.test(accessKey.value)) {
                showErrorHint('通行密钥不可为空');
                submit.disabled = false;
                submit.innerText = '验证';
                return;
            }

            try {
                var response = await fetch('./api/user/detail', {
                    method: 'POST',
                    headers: {'Access-Key': CryptoJS.MD5(accessKey.value)}
                });
                if (!response.ok)
                    throw Error;
            } catch (err) {
                showErrorHint('验证失败, 请重试');
                submit.disabled = false;
                submit.innerText = '验证';
                return;
            }

            try {
                // save file list
                const responseData = await response.json();
                let fileList = JSON.stringify(responseData.result);
                let cryptKey = CryptoJS.MD5(accessKey.value + new Date().getTime().toString()).toString();
                let fileData = CryptoJS.AES.encrypt(fileList, cryptKey).toString();
                localStorage.setItem('file_data', fileData);

                // save encrypt key
                const date = new Date();
                date.setTime(date.getTime() + 43200000);
                document.cookie = \`CryptKey=\${encodeURIComponent(cryptKey)}; expires=\${date.toUTCString()}; max-age=43200; path=/\`;
                authContainer.style.display = 'none';
                archiveContainer.style.display = '';

                // load archive library
                await loadFiles(JSON.parse(fileList));
            } catch (err) {
                console.error('处理响应数据时出错:', err);
                showErrorHint('数据处理失败，请重试');
                submit.disabled = false;
                submit.innerText = '验证';
            }
        });
    });

    window.addEventListener('resize', adjustHeight);
    window.addEventListener('orientationchange', adjustHeight);

    function getCookie(name) {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.trim().split('=');
            if (cookieName.trim() === encodeURIComponent(name))
                return cookieValue.trim() ? decodeURIComponent(cookieValue) : '';
        }
        return undefined;
    }

    function loadFileListFromLocalStorage() {
        let cryptKey = getCookie('CryptKey');
        let fileData = localStorage.getItem('file_data');

        if (!cryptKey || !fileData)
            return null;

        try {
            // load encrypted file list
            fileData = CryptoJS.AES.decrypt(fileData, cryptKey).toString(CryptoJS.enc.Utf8);
            return fileData ? JSON.parse(fileData) : null;
        } catch (error) {
            console.error('Failed to decrypt file data:', error);
            return null;
        }
    }

    function adjustHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', \`\${vh}px\`);
    }

    function showErrorHint(hint) {
        const accessKey = document.getElementById('accessKey');
        const errorMsg = document.getElementById('errorMsg');

        errorMsg.innerText = hint;
        errorMsg.style.display = 'block';
        accessKey.style.borderColor = '#ff3b30';

        // shake container
        const authContainer = document.querySelector('.auth-container');
        authContainer.style.animation = 'gentle-shake 0.3s';
        setTimeout(() => {
            authContainer.style.animation = '';
        }, 300);
    }

    async function loadFiles(fileList) {
        if (!fileList || fileList.length === 0)
            return;

        const archiveLibrary = document.getElementById('archive-library');
        archiveLibrary.innerHTML = '';

        // display when loading
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading';
        loadingElement.innerHTML = '<div class="loading-spinner"></div>';
        archiveLibrary.appendChild(loadingElement);

        try {
            for (const file of fileList) {
                const archiveCard = document.createElement('div');
                archiveCard.className = 'archive-card';
                archiveCard.style.animation = 'fade-in 0.5s ease forwards, slide-up 0.5s ease forwards';
                archiveCard.style.animationDelay = \`\${Math.random() * 0.5}s\`;

                // full image url
                let imgSrc = '';
                if (file.file_url)
                    imgSrc = file.file_url;
                else if (file.file_id)
                    imgSrc = \`./file/\${file.file_id}\`;

                archiveCard.innerHTML = \`
                <img class="archive-img" src="\${imgSrc}" alt="\${file.file_title || 'Photo'}" loading="lazy">
                <div class="archive-info">
                    <h3 class="archive-title">\${file.file_title || 'Untitled'}</h3>
                    <p class="archive-description">\${file.file_description || ''}</p>
                </div>
            \`;

                const imgElement = archiveCard.querySelector('.archive-img');
                // click to open lightbox
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
        lightboxImg.srcset = '';
        lightboxImg.src = imgSrc;
        lightboxImg.alt = imgAlt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

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
                // random animation style
                const banner = document.createElement('a');
                banner.textContent = text;
                banner.style.animationDelay = \`\${Math.random() * 5}s\`;
                banner.style.top = \`\${Math.floor(Math.random() * 50) + 10}%\`;
                const duration = 5 + Math.max(window.innerWidth, 320) / 80;
                banner.style.animationDuration = \`\${duration}s\`;
                bannerContainer.appendChild(banner);
            }
        });
    }
</script>
</body>
</html>
`
    return new Response(page, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}


