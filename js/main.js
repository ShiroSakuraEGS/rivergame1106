/**
 * 《瓦磘溝探索之旅》入口程式
 * 負責程式初始化與主畫面事件掛載
 */

let game = null;

document.addEventListener("DOMContentLoaded", () => {
    // 實例化遊戲引擎
    game = new GameEngine(STORY_DATA);
    game.init();

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
                        <h3>🎮 遊玩指南</h3>
                        <ul>
                            <li>遊戲時間約 20–25 分鐘，可由學生自學或教師於課堂引導帶讀。</li>
                            <li>互動採正向鼓勵機制，答錯會提供親切提示，不扣分、不中斷探索。</li>
                            <li>完成三章考驗後，可生成專屬姓名證書，並下載儲存。</li>
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
