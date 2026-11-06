/**
 * 《瓦磘溝探索之旅》入口程式
 * 負責程式初始化、全域事件、RWD 適配與 PWA Service Worker 註冊
 */

let game = null;

document.addEventListener("DOMContentLoaded", () => {
    // 實例化遊戲引擎
    game = new GameEngine(STORY_DATA);
    game.init();

    // 註冊 PWA Service Worker (支援離線快取與安裝)
    if ("serviceWorker" in navigator && (window.location.protocol === "https:" || window.location.hostname === "localhost")) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("./sw.js")
                .then(reg => console.log("瓦磘溝探索之旅 Service Worker 註冊成功", reg.scope))
                .catch(err => console.warn("Service Worker 註冊失敗：", err));
        });
    }

    // 行動裝置音訊解鎖保險：使用者於頁面任意處首次觸碰/點擊時喚醒 AudioContext
    const unlockAudio = () => {
        if (typeof audioMgr !== "undefined" && audioMgr) {
            audioMgr.initContext();
        }
        window.removeEventListener("touchstart", unlockAudio);
        window.removeEventListener("pointerdown", unlockAudio);
    };
    window.addEventListener("touchstart", unlockAudio, { passive: true });
    window.addEventListener("pointerdown", unlockAudio, { passive: true });

    // 綁定封面開始探索按鈕
    const btnStart = document.getElementById("btn-start-game");
    if (btnStart) {
        btnStart.addEventListener("click", () => {
            game.startGame();
        });
    }

    // 封面章節選擇按鈕
    const btnStartChapters = document.getElementById("btn-start-chapters");
    if (btnStartChapters) {
        btnStartChapters.addEventListener("click", () => {
            game.showChapterSelectModal();
        });
    }

    // 故事背景與師長導讀手冊按鈕
    const btnGuide = document.getElementById("btn-guide");
    if (btnGuide) {
        btnGuide.addEventListener("click", () => {
            audioMgr.playWaterDrop();
            game.showModal(`
                <div class="guide-modal-content">
                    <h2>📖 《瓦磘溝探索之旅》教學與故事背景導讀</h2>
                    <p class="guide-intro">本遊戲專為國小三至六年級學童設計，將雙和地區母親河——瓦磘溝的歷史記憶、動植物生態與污染防制，轉譯為沉浸式冒險腳本。</p>
                    
                    <div class="guide-section">
                        <h3>🌟 核心教育精神</h3>
                        <ul>
                            <li><strong>地方記憶：</strong>瓦磘溝曾是早期中和、永和的重要貨運與灌溉水路，串聯在地居民的生活與情感。</li>
                            <li><strong>生態觀察：</strong>河岸孕育了小白鷺、夜鷺、翠鳥與榕樹等豐富物種，認識並學會尊重棲地。</li>
                            <li><strong>醜泥怪的秘密：</strong>醜泥怪並非天生惡魔，而是人類不當丟棄垃圾與排放生活污水的縮影。守護河川的關鍵在於人類日常行為的轉變。</li>
                        </ul>
                    </div>

                    <div class="guide-section">
                        <h3>📱 多載具與行動裝置支援 (RWD)</h3>
                        <ul>
                            <li><strong>手機與平板自適應：</strong>無論是直向、橫向或全螢幕觸控，介面均會彈性調整最佳字級與觸控熱區。</li>
                            <li><strong>離線支援：</strong>支援 PWA 離線快取，戶外河岸走讀時無網路亦可順暢遊玩。</li>
                            <li><strong>免除挫敗：</strong>答錯提供親切引導與線索提示，不扣分、不中斷探索。</li>
                        </ul>
                    </div>

                    <div class="cert-actions">
                        <button id="btn-close-guide" class="btn-primary">返回遊戲</button>
                    </div>
                </div>
            `, () => {
                const btnClose = document.getElementById("btn-close-guide");
                if (btnClose) {
                    btnClose.addEventListener("click", () => game.closeModal());
                }
            });
        });
    }

    // 彈跳視窗關閉鈕（點擊遮罩或右上叉叉）
    const modalOverlay = document.getElementById("modal-overlay");
    const modalCloseBtn = document.getElementById("modal-close-btn");

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", () => {
            audioMgr.playWaterDrop();
            game.closeModal();
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) {
                game.closeModal();
            }
        });
    }

    // 按下 ESC 鍵關閉視窗
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
            game.closeModal();
        }
    });
});
