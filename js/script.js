// 創建浮動粒子效果
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // 隨機位置和動畫延遲
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';

        particlesContainer.appendChild(particle);
    }
}

// 滾動動畫觀察器
function setupScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// 動態載入圖片功能
function loadDynamicImages() {
    document.querySelectorAll('[data-src]').forEach(container => {
        const img = document.createElement('img');
        img.className = 'responsive-image';
        img.alt = container.dataset.title || '圖片';

        // 圖片載入完成事件
        img.onload = function () {
            container.innerHTML = '';
            container.appendChild(img);

            // 添加覆蓋層
            if (container.dataset.title) {
                const overlay = document.createElement('div');
                overlay.className = 'image-overlay';
                overlay.textContent = container.dataset.title;
                container.appendChild(overlay);
            }
        };

        // 圖片載入失敗事件
        img.onerror = function () {
            container.innerHTML = `
                        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#999;">
                            <div style="font-size:2rem;margin-bottom:0.5rem;">⚠️</div>
                            <div style="font-size:0.8rem;text-align:center;">
                                圖片載入失敗<br>
                                <small>請檢查圖片路徑</small>
                            </div>
                        </div>
                    `;
        };

        img.src = container.dataset.src;
    });
}

// 圖片預覽功能（支援所有大小的圖片）
function setupImagePreview() {
    document.querySelectorAll('.image-container').forEach(container => {
        if (container.dataset.previewInit) return;
        container.dataset.previewInit = '1';

        container.addEventListener('click', function (e) {
            // 如果目前畫面上已有圖片預覽，就不再建立新的
            if (document.querySelector('div[style*="position: fixed"][style*="z-index: 10000"]')) {
                e.stopPropagation();
                return;
            }

            const img = this.querySelector('.responsive-image');
            if (img) {
                console.log('createImagePreview called');
                createImagePreview(img.src, img.alt);
            }
        });
    });
}


// 創建全屏圖片預覽
function createImagePreview(src, alt) {

    const overlay = document.createElement('div');
    overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;

    const img = document.createElement('img');
    img.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 10px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                transform: scale(0.8);
                transition: transform 0.3s ease;
            `;
    img.src = src;
    img.alt = alt;

    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
                position: absolute;
                top: 20px;
                right: 30px;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                background: rgba(0, 0, 0, 0.5);
                width: 40px;
                height: 40px;
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s ease;
            `;

    closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    closeBtn.onmouseout = () => closeBtn.style.background = 'rgba(0, 0, 0, 0.5)';

    overlay.appendChild(img);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    // 顯示動畫
    setTimeout(() => {
        overlay.style.opacity = '1';
        img.style.transform = 'scale(1)';
    }, 10);

    // 關閉功能
    const closePreview = () => {
        overlay.style.opacity = '0';
        img.style.transform = 'scale(0.8)';
        setTimeout(() => document.body.removeChild(overlay), 300);
    };

    overlay.addEventListener('click', closePreview);
    closeBtn.addEventListener('click',  (e) =>{
        e.stopPropagation();
        closePreview();
    } );

    // ESC 鍵關閉
    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            closePreview();
            document.removeEventListener('keydown', handleKeydown);
        }
    };
    document.addEventListener('keydown', handleKeydown);
}

// 專案按鈕點擊事件
function setupProjectButtons() {
    document.querySelectorAll('.project-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // 如果是頁面內跳轉（以 # 開頭）
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // 平滑滾動到目標位置
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // 添加高亮效果
                    targetElement.style.transform = 'scale(1.02)';
                    targetElement.style.boxShadow = '0 25px 50px rgba(102, 126, 234, 0.3)';

                    setTimeout(() => {
                        targetElement.style.transform = '';
                        targetElement.style.boxShadow = '';
                    }, 1000);
                }
            } else if (href === '#') {
                // 專案作品集按鈕的處理
                e.preventDefault();
                console.log('跳轉到：專案作品集');
                // 在這裡添加跳轉到專案頁面的邏輯
                // 例如：window.open('你的專案URL', '_blank');
            }
        });
    });
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function () {
    createParticles();
    setupScrollAnimation();
    loadDynamicImages(); // 載入動態圖片
    setupImagePreview();
    setupProjectButtons();
});

// 頁面載入動畫完成後顯示內容
setTimeout(() => {
    document.querySelectorAll('.fade-in').forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, index * 100);
    });
}, 2000);


// --- 回到頂部按鈕功能 ---
function setupBackToTopButton() {
    const backToTopBtn = document.getElementById('backToTopBtn');

    if (!backToTopBtn) {
        return; // 如果找不到按鈕元素，就直接結束
    }

    // 監聽頁面滾動事件
    window.addEventListener('scroll', () => {
        // 如果滾動超過 300px，就顯示按鈕，否則隱藏
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // 監聽按鈕點擊事件
    backToTopBtn.addEventListener('click', () => {
        // 平滑滾動到頁面頂部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 在頁面載入完成後，除了執行原有功能，也要啟動回到頂部按鈕的功能
document.addEventListener('DOMContentLoaded', function () {
    createParticles();
    setupScrollAnimation();
    loadDynamicImages();
    setupImagePreview();
    setupProjectButtons();
    setupBackToTopButton(); // <-- 新增這一行來呼叫新功能
});
