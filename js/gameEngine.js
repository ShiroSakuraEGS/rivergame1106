/**
 * 《瓦磘溝探索之旅》遊戲核心引擎
 * 負責場景切換、角色對話打字機效果、各類互動關卡與證書生成
 */

class GameEngine {
    constructor(storyData) {
        this.story = storyData;
        this.currentChapterIndex = 0;
        this.currentSceneIndex = 0;
        this.collectedFragments = new Set();
        this.playerName = "雙和小探險家";
        this.selectedPromises = [];

        // 對話打字機狀態
        this.isTyping = false;
        this.typewriterTimer = null;
        this.currentFullText = "";

        // 任務狀態暫存
        this.huntProgress = {
            historyObjects: new Set(),
            creatures: new Set(),
            trashes: new Set(),
            knowledgeCards: new Set()
        };

        // DOM 元素引用快取
        this.dom = {};
    }

    // 初始化並掛載 DOM 節點
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.loadProgress();
        this.renderHUD();
    }

    // 快取主要 DOM 元素
    cacheDOM() {
        this.dom = {
            app: document.getElementById("game-app"),
            startScreen: document.getElementById("start-screen"),
            gameScreen: document.getElementById("game-screen"),
            stageBackground: document.getElementById("stage-background"),
            stageCharacters: document.getElementById("stage-characters"),
            interactionArea: document.getElementById("interaction-area"),
            dialogueBox: document.getElementById("dialogue-box"),
            speakerAvatar: document.getElementById("speaker-avatar"),
            speakerName: document.getElementById("speaker-name"),
            speakerTitle: document.getElementById("speaker-title"),
            speakerCatchphrase: document.getElementById("speaker-catchphrase"),
            dialogueText: document.getElementById("dialogue-text"),
            btnNextDialogue: document.getElementById("btn-next-dialogue"),
            // HUD
            chapterBadge: document.getElementById("hud-chapter-badge"),
            chapterTitle: document.getElementById("hud-chapter-title"),
            missionDesc: document.getElementById("hud-mission-desc"),
            fragmentSlots: {
                history_stone: document.getElementById("slot-history_stone"),
                ecology_leaf: document.getElementById("slot-ecology_leaf"),
                protection_water: document.getElementById("slot-protection_water")
            },
            btnMute: document.getElementById("btn-mute"),
            btnRestart: document.getElementById("btn-restart"),
            btnChapters: document.getElementById("btn-chapters"),
            // 彈跳視窗
            modalOverlay: document.getElementById("modal-overlay"),
            modalContent: document.getElementById("modal-content")
        };
    }

    // 綁定基礎事件
    bindEvents() {
        // 對話框點擊：若在打字中則立即完成，若已完成則觸發下一句
        if (this.dom.dialogueBox) {
            this.dom.dialogueBox.addEventListener("click", () => {
                if (this.isTyping) {
                    this.finishTypewriterImmediately();
                } else {
                    this.handleNextDialogue();
                }
            });
        }

        // 下一頁按鈕
        if (this.dom.btnNextDialogue) {
            this.dom.btnNextDialogue.addEventListener("click", (e) => {
                e.stopPropagation();
                if (this.isTyping) {
                    this.finishTypewriterImmediately();
                } else {
                    this.handleNextDialogue();
                }
            });
        }

        // 靜音按鈕
        if (this.dom.btnMute) {
            this.dom.btnMute.addEventListener("click", () => {
                const isMuted = audioMgr.toggleMute();
                this.updateMuteButton(isMuted);
            });
        }

        // 重新開始
        if (this.dom.btnRestart) {
            this.dom.btnRestart.addEventListener("click", () => {
                if (confirm("確定要重新開始瓦磘溝探索之旅嗎？這將會重設當前進度。")) {
                    this.resetGame();
                }
            });
        }

        // 章節選單
        if (this.dom.btnChapters) {
            this.dom.btnChapters.addEventListener("click", () => {
                this.showChapterSelectModal();
            });
        }

        // 鍵盤空白鍵推進對話
        window.addEventListener("keydown", (e) => {
            if (e.code === "Space" && this.dom.gameScreen && !this.dom.gameScreen.classList.contains("hidden")) {
                // 如果沒有彈出視窗且不在輸入框內
                if (!this.dom.modalOverlay.classList.contains("active") && document.activeElement.tagName !== "INPUT") {
                    e.preventDefault();
                    if (this.isTyping) {
                        this.finishTypewriterImmediately();
                    } else {
                        this.handleNextDialogue();
                    }
                }
            }
        });
    }

    // 讀取進度
    loadProgress() {
        try {
            const saved = localStorage.getItem("river_game_progress");
            if (saved) {
                const data = JSON.parse(saved);
                this.currentChapterIndex = data.chapterIndex || 0;
                this.currentSceneIndex = data.sceneIndex || 0;
                this.collectedFragments = new Set(data.fragments || []);
                this.playerName = data.playerName || "雙和小探險家";
            }
        } catch (e) {
            console.warn("進度讀取失敗：", e);
        }
        this.updateMuteButton(audioMgr.isMuted);
    }

    // 儲存進度
    saveProgress() {
        try {
            const data = {
                chapterIndex: this.currentChapterIndex,
                sceneIndex: this.currentSceneIndex,
                fragments: Array.from(this.collectedFragments),
                playerName: this.playerName
            };
            localStorage.setItem("river_game_progress", JSON.stringify(data));
        } catch (e) {
            console.warn("進度儲存失敗：", e);
        }
    }

    // 重設遊戲
    resetGame() {
        localStorage.removeItem("river_game_progress");
        this.currentChapterIndex = 0;
        this.currentSceneIndex = 0;
        this.collectedFragments.clear();
        this.huntProgress = {
            historyObjects: new Set(),
            creatures: new Set(),
            trashes: new Set(),
            knowledgeCards: new Set()
        };
        this.renderHUD();
        this.startChapter(0);
    }

    // 更新靜音按鈕外觀
    updateMuteButton(isMuted) {
        if (this.dom.btnMute) {
            this.dom.btnMute.innerHTML = isMuted ? "🔇 靜音" : "🔊 音效";
            this.dom.btnMute.classList.toggle("btn-muted", isMuted);
        }
    }

    // 開始遊戲（從封面點擊「開始探索」）
    startGame() {
        audioMgr.playWaterDrop();
        audioMgr.startAmbient();

        if (this.dom.startScreen) {
            this.dom.startScreen.classList.add("fade-out");
            setTimeout(() => {
                this.dom.startScreen.classList.add("hidden");
                this.dom.gameScreen.classList.remove("hidden");
                this.dom.gameScreen.classList.add("fade-in");
                this.startChapter(this.currentChapterIndex, this.currentSceneIndex);
            }, 600);
        }
    }

    // 開始指定章節與場景
    startChapter(chapIndex, sceneIndex = 0) {
        this.currentChapterIndex = Math.min(Math.max(0, chapIndex), this.story.chapters.length - 1);
        this.currentSceneIndex = sceneIndex;
        const chapter = this.story.chapters[this.currentChapterIndex];

        // 更新背景樣式
        if (this.dom.stageBackground) {
            this.dom.stageBackground.className = `stage-background ${chapter.bgClass}`;
        }

        this.renderHUD();
        this.saveProgress();
        this.renderCurrentScene();
    }

    // 更新頂部 HUD 狀態
    renderHUD() {
        const chapter = this.story.chapters[this.currentChapterIndex];
        if (this.dom.chapterBadge) this.dom.chapterBadge.textContent = chapter.number;
        if (this.dom.chapterTitle) this.dom.chapterTitle.textContent = chapter.title;
        if (this.dom.missionDesc) this.dom.missionDesc.textContent = chapter.mission;

        // 更新記憶碎片狀態
        this.story.fragments.forEach(frag => {
            const slot = this.dom.fragmentSlots[frag.id];
            if (slot) {
                const isCollected = this.collectedFragments.has(frag.id);
                slot.classList.toggle("collected", isCollected);
                slot.title = isCollected ? `已解鎖【${frag.name}】：${frag.description}` : `未解鎖【${frag.name}】（第${frag.chapter}章）`;
            }
        });
    }

    // 取得當前場景資料
    getCurrentScene() {
        const chapter = this.story.chapters[this.currentChapterIndex];
        return chapter.scenes[this.currentSceneIndex];
    }

    // 渲染當前場景
    renderCurrentScene() {
        const scene = this.getCurrentScene();
        if (!scene) return;

        // 清空互動區塊
        if (this.dom.interactionArea) {
            this.dom.interactionArea.innerHTML = "";
            this.dom.interactionArea.classList.add("hidden");
        }

        // 渲染立繪角色
        this.renderStageCharacters(scene.speaker);

        // 渲染對話框
        this.renderDialogue(scene);

        // 如果該場景包含特定互動任務，在打字結束後或立即掛載
        if (scene.interaction) {
            this.setupInteraction(scene.interaction);
        }
    }

    // 渲染舞台角色立繪
    renderStageCharacters(speakerId) {
        if (!this.dom.stageCharacters) return;
        this.dom.stageCharacters.innerHTML = "";

        // 取得當前可能登場的角色
        const chapter = this.story.chapters[this.currentChapterIndex];
        const isChapter4Clean = (chapter.id === "ch4" && this.currentSceneIndex >= 2);

        // 根據章節顯示常駐夥伴
        const cast = [];
        if (chapter.id === "ch0") {
            cast.push("water_drop", "river_grandpa");
            if (speakerId === "mud_monster") cast.push("mud_monster");
        } else if (chapter.id === "ch1") {
            cast.push("river_grandpa", "egret");
        } else if (chapter.id === "ch2") {
            cast.push("egret", "river_grandpa");
            if (speakerId === "mud_monster") cast.push("mud_monster");
        } else if (chapter.id === "ch3") {
            cast.push("mud_monster", "river_grandpa", "egret");
        } else if (chapter.id === "ch4") {
            cast.push("water_drop", "river_grandpa", "egret", "mud_monster");
        }

        // 去重並確保當前說話者在場上
        if (speakerId && speakerId !== "narrator" && !cast.includes(speakerId)) {
            cast.push(speakerId);
        }

        cast.forEach(charId => {
            const char = this.story.characters[charId];
            if (!char) return;

            const charEl = document.createElement("div");
            charEl.className = `stage-char char-${charId}`;
            if (charId === speakerId) {
                charEl.classList.add("speaking");
            }

            // 終章乾淨的醜泥怪特殊 SVG
            let svgContent = char.avatarSvg;
            if (charId === "mud_monster" && isChapter4Clean && char.cleanedSvg) {
                svgContent = char.cleanedSvg;
            }

            charEl.innerHTML = `
                <div class="char-sprite-wrap">
                    ${svgContent}
                </div>
                <div class="char-name-plate" style="border-bottom-color: ${char.color}">
                    ${(charId === "mud_monster" && isChapter4Clean) ? "泥土守護精靈" : char.name}
                </div>
            `;
            this.dom.stageCharacters.appendChild(charEl);
        });
    }

    // 渲染對話打字機效果
    renderDialogue(scene) {
        const speaker = this.story.characters[scene.speaker] || this.story.characters.narrator;
        const chapter = this.story.chapters[this.currentChapterIndex];
        const isChapter4Clean = (chapter.id === "ch4" && this.currentSceneIndex >= 2);

        // 設定角色資訊
        if (this.dom.speakerName) {
            this.dom.speakerName.textContent = (scene.speaker === "mud_monster" && isChapter4Clean) ? "泥土守護精靈" : speaker.name;
            this.dom.speakerName.style.color = speaker.color;
        }
        if (this.dom.speakerTitle) {
            this.dom.speakerTitle.textContent = (scene.speaker === "mud_monster" && isChapter4Clean) ? "瓦磘溝巡邏提醒員" : speaker.title;
        }
        if (this.dom.speakerCatchphrase) {
            this.dom.speakerCatchphrase.textContent = speaker.catchphrase ? `「${speaker.catchphrase}」` : "";
        }
        if (this.dom.speakerAvatar) {
            const svgContent = (scene.speaker === "mud_monster" && isChapter4Clean && speaker.cleanedSvg) ? speaker.cleanedSvg : speaker.avatarSvg;
            this.dom.speakerAvatar.innerHTML = svgContent;
        }

        // 開始打字機文字呈現
        this.currentFullText = scene.text || "";
        this.startTypewriter(this.currentFullText, () => {
            // 如果此場景有互動任務，在打字結束時展開互動面板
            if (scene.interaction && this.dom.interactionArea) {
                this.dom.interactionArea.classList.remove("hidden");
                this.dom.interactionArea.classList.add("fade-in");
            }
        });
    }

    // 打字機動畫
    startTypewriter(text, onComplete) {
        if (this.typewriterTimer) {
            clearInterval(this.typewriterTimer);
        }

        this.isTyping = true;
        let charIndex = 0;
        this.dom.dialogueText.textContent = "";
        if (this.dom.btnNextDialogue) {
            this.dom.btnNextDialogue.style.opacity = "0.3";
        }

        this.typewriterTimer = setInterval(() => {
            if (charIndex < text.length) {
                this.dom.dialogueText.textContent += text.charAt(charIndex);
                charIndex++;
                // 偶爾發出極低微水聲節奏
                if (charIndex % 12 === 0) {
                    audioMgr.playWaterDrop();
                }
            } else {
                this.finishTypewriterImmediately();
                if (onComplete) onComplete();
            }
        }, 32);
    }

    // 立即完成當前對話文字
    finishTypewriterImmediately() {
        if (this.typewriterTimer) {
            clearInterval(this.typewriterTimer);
            this.typewriterTimer = null;
        }
        this.isTyping = false;
        if (this.dom.dialogueText) {
            this.dom.dialogueText.textContent = this.currentFullText;
        }
        if (this.dom.btnNextDialogue) {
            this.dom.btnNextDialogue.style.opacity = "1";
        }

        const scene = this.getCurrentScene();
        if (scene && scene.interaction && this.dom.interactionArea) {
            this.dom.interactionArea.classList.remove("hidden");
            this.dom.interactionArea.classList.add("fade-in");
        }
    }

    // 處理下一句對話
    handleNextDialogue() {
        const scene = this.getCurrentScene();
        if (!scene) return;

        // 如果場景有未完成的互動任務，提示玩家完成該任務
        if (scene.interaction && !this.isInteractionFinished(scene.interaction)) {
            audioMgr.playHint();
            this.shakeElement(this.dom.interactionArea);
            return;
        }

        audioMgr.playWaterDrop();

        // 檢查是否通關大結局
        if (scene.isGameCompleted) {
            this.showCertificateModal();
            return;
        }

        // 檢查是否切換下一章
        if (scene.nextChapter) {
            this.advanceToNextChapter(scene.nextChapter);
            return;
        }

        // 前進下一個場景
        const chapter = this.story.chapters[this.currentChapterIndex];
        if (this.currentSceneIndex < chapter.scenes.length - 1) {
            this.currentSceneIndex++;
            this.saveProgress();
            this.renderCurrentScene();
        } else {
            // 章節結束，如果有對應的記憶碎片獎勵且尚未獲得，給予榮譽彈窗！
            if (chapter.rewardFragment && !this.collectedFragments.has(chapter.rewardFragment)) {
                this.unlockFragment(chapter.rewardFragment, () => {
                    this.advanceToNextChapter();
                });
            } else {
                this.advanceToNextChapter();
            }
        }
    }

    // 推進到下一個章節
    advanceToNextChapter(targetChapterId = null) {
        let nextIndex = this.currentChapterIndex + 1;
        if (targetChapterId) {
            const foundIdx = this.story.chapters.findIndex(c => c.id === targetChapterId);
            if (foundIdx !== -1) nextIndex = foundIdx;
        }

        if (nextIndex < this.story.chapters.length) {
            this.currentChapterIndex = nextIndex;
            this.currentSceneIndex = 0;
            this.startChapter(this.currentChapterIndex, 0);
        } else {
            this.showCertificateModal();
        }
    }

    // 檢查互動是否已完成
    isInteractionFinished(interaction) {
        if (!interaction) return true;
        return !!interaction._isCompleted;
    }

    // 解鎖記憶碎片並播放特效彈窗
    unlockFragment(fragmentId, onContinue) {
        const frag = this.story.fragments.find(f => f.id === fragmentId);
        if (!frag) {
            if (onContinue) onContinue();
            return;
        }

        this.collectedFragments.add(fragmentId);
        this.saveProgress();
        this.renderHUD();
        audioMgr.playFragmentUnlock();

        // 彈跳解鎖視窗
        this.showModal(`
            <div class="fragment-unlock-modal">
                <div class="fragment-burst-glow"></div>
                <div class="fragment-big-icon" style="color: ${frag.color}">${frag.icon}</div>
                <h2 class="fragment-title">尋獲記憶碎片！【${frag.name}】</h2>
                <div class="fragment-badge-title">榮獲成就：${frag.titleReward}</div>
                <p class="fragment-desc">${frag.description}</p>
                <button id="btn-fragment-continue" class="btn-primary btn-large">繼續冒險！</button>
            </div>
        `, () => {
            const btn = document.getElementById("btn-fragment-continue");
            if (btn) {
                btn.addEventListener("click", () => {
                    this.closeModal();
                    if (onContinue) onContinue();
                });
            }
        });
    }

    // ==========================================
    // 互動任務派發器
    // ==========================================
    setupInteraction(interaction) {
        if (!this.dom.interactionArea) return;
        this.dom.interactionArea.innerHTML = "";

        switch (interaction.type) {
            case "choice":
                this.renderChoiceInteraction(interaction);
                break;
            case "quiz":
                this.renderQuizInteraction(interaction);
                break;
            case "object_hunt":
                this.renderObjectHuntInteraction(interaction);
                break;
            case "quiz_sequence":
                this.renderQuizSequenceInteraction(interaction);
                break;
            case "creature_hunt":
                this.renderCreatureHuntInteraction(interaction);
                break;
            case "trash_cleanup":
                this.renderTrashCleanupInteraction(interaction);
                break;
            case "knowledge_cards":
                this.renderKnowledgeCardsInteraction(interaction);
                break;
            case "crisis_scenarios":
                this.renderCrisisScenariosInteraction(interaction);
                break;
            case "pledge_certificate":
                this.renderPledgeCertificateInteraction(interaction);
                break;
            default:
                break;
        }
    }

    // 1. 一般對話選項
    renderChoiceInteraction(interaction) {
        const container = document.createElement("div");
        container.className = "interaction-panel panel-choice";
        container.innerHTML = `<div class="interaction-prompt">${interaction.prompt}</div>`;

        const btnGroup = document.createElement("div");
        btnGroup.className = "choice-buttons";

        interaction.options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "btn-choice";
            btn.textContent = opt.text;
            btn.addEventListener("click", () => {
                audioMgr.playWaterDrop();
                interaction._isCompleted = true;
                // 若選項有即時回應文本，切換顯示
                if (opt.responseText) {
                    this.renderDialogue({
                        speaker: opt.responseSpeaker || "water_drop",
                        text: opt.responseText
                    });
                }
                btnGroup.querySelectorAll("button").forEach(b => b.disabled = true);
                btn.classList.add("selected");
                setTimeout(() => {
                    this.handleNextDialogue();
                }, 1400);
            });
            btnGroup.appendChild(btn);
        });

        container.appendChild(btnGroup);
        this.dom.interactionArea.appendChild(container);
    }

    // 2. 單一測驗題（例：瓦磘溝地理常識）
    renderQuizInteraction(interaction) {
        const container = document.createElement("div");
        container.className = "interaction-panel panel-quiz";
        container.innerHTML = `
            <div class="interaction-prompt">💡 ${interaction.question}</div>
            <div id="quiz-feedback" class="quiz-feedback hidden"></div>
        `;

        const btnGroup = document.createElement("div");
        btnGroup.className = "choice-buttons";

        interaction.options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "btn-choice";
            btn.textContent = opt.text;
            btn.addEventListener("click", () => {
                const feedbackEl = container.querySelector("#quiz-feedback");
                if (opt.correct) {
                    audioMgr.playCorrect();
                    interaction._isCompleted = true;
                    btn.classList.add("correct");
                    feedbackEl.className = "quiz-feedback correct-feedback fade-in";
                    feedbackEl.innerHTML = `🎉 ${interaction.correctFeedback}`;
                    btnGroup.querySelectorAll("button").forEach(b => b.disabled = true);
                    setTimeout(() => {
                        this.handleNextDialogue();
                    }, 1800);
                } else {
                    audioMgr.playHint();
                    btn.classList.add("hint");
                    feedbackEl.className = "quiz-feedback hint-feedback fade-in";
                    feedbackEl.innerHTML = `💭 ${interaction.hintFeedback}`;
                }
            });
            btnGroup.appendChild(btn);
        });

        container.appendChild(btnGroup);
        this.dom.interactionArea.appendChild(container);
    }

    // 3. 第一章：歷史物件尋寶
    renderObjectHuntInteraction(interaction) {
        const container = document.createElement("div");
        container.className = "interaction-panel panel-hunt";
        container.innerHTML = `
            <div class="hunt-header">
                <span class="hunt-instruction">${interaction.instruction}</span>
                <span id="hunt-counter" class="hunt-counter">已探索：0 / ${interaction.items.length}</span>
            </div>
            <div class="historical-canvas">
                ${interaction.items.map(item => `
                    <div class="hunt-hotspot" data-id="${item.id}" style="left: ${item.x}%; top: ${item.y}%;">
                        <div class="hotspot-pulse"></div>
                        <div class="hotspot-icon">${item.icon}</div>
                        <div class="hotspot-label">${item.name}</div>
                    </div>
                `).join("")}
            </div>
            <div id="hunt-detail-box" class="hunt-detail-box hidden"></div>
        `;

        const counterEl = container.querySelector("#hunt-counter");
        const detailBox = container.querySelector("#hunt-detail-box");
        const hotspots = container.querySelectorAll(".hunt-hotspot");

        hotspots.forEach(spot => {
            spot.addEventListener("click", () => {
                const itemId = spot.getAttribute("data-id");
                const item = interaction.items.find(i => i.id === itemId);
                if (!item) return;

                audioMgr.playWaterDrop();
                this.huntProgress.historyObjects.add(itemId);
                spot.classList.add("discovered");

                counterEl.textContent = `已探索：${this.huntProgress.historyObjects.size} / ${interaction.items.length}`;

                detailBox.className = "hunt-detail-box fade-in";
                detailBox.innerHTML = `
                    <div class="detail-icon">${item.icon}</div>
                    <div class="detail-content">
                        <strong>${item.title}</strong>
                        <p>${item.desc}</p>
                    </div>
                `;

                if (this.huntProgress.historyObjects.size === interaction.items.length) {
                    audioMgr.playCorrect();
                    interaction._isCompleted = true;
                    setTimeout(() => {
                        detailBox.innerHTML += `<div class="all-cleared-msg">✨ 太棒了！四個歷史線索全數解開！點擊下方對話繼續！</div>`;
                    }, 500);
                }
            });
        });

        this.dom.interactionArea.appendChild(container);
    }

    // 4. 第一章：時光記憶三道配對連題
    renderQuizSequenceInteraction(interaction) {
        let currentQuizIndex = 0;
        const container = document.createElement("div");
        container.className = "interaction-panel panel-quiz-seq";

        const renderSingleQuiz = () => {
            const quiz = interaction.quizzes[currentQuizIndex];
            container.innerHTML = `
                <div class="quiz-seq-progress">進度：第 ${currentQuizIndex + 1} 題 / 共 ${interaction.quizzes.length} 題</div>
                <div class="interaction-prompt">${quiz.q}</div>
                <div id="seq-feedback" class="quiz-feedback hidden"></div>
                <div class="choice-buttons" id="seq-options"></div>
            `;

            const optContainer = container.querySelector("#seq-options");
            const feedbackEl = container.querySelector("#seq-feedback");

            quiz.options.forEach(opt => {
                const btn = document.createElement("button");
                btn.className = "btn-choice";
                btn.textContent = opt.text;
                btn.addEventListener("click", () => {
                    if (opt.correct) {
                        audioMgr.playCorrect();
                        btn.classList.add("correct");
                        feedbackEl.className = "quiz-feedback correct-feedback fade-in";
                        feedbackEl.innerHTML = `🎉 ${quiz.feedbackCorrect}`;
                        optContainer.querySelectorAll("button").forEach(b => b.disabled = true);

                        setTimeout(() => {
                            if (currentQuizIndex < interaction.quizzes.length - 1) {
                                currentQuizIndex++;
                                renderSingleQuiz();
                            } else {
                                interaction._isCompleted = true;
                                this.handleNextDialogue();
                            }
                        }, 1500);
                    } else {
                        audioMgr.playHint();
                        btn.classList.add("hint");
                        feedbackEl.className = "quiz-feedback hint-feedback fade-in";
                        feedbackEl.innerHTML = `💭 ${quiz.feedbackHint}`;
                    }
                });
                optContainer.appendChild(btn);
            });
        };

        renderSingleQuiz();
        this.dom.interactionArea.appendChild(container);
    }

    // 5. 第二章：生態尋寶（六種生物圖鑑）
    renderCreatureHuntInteraction(interaction) {
        const container = document.createElement("div");
        container.className = "interaction-panel panel-creatures";
        container.innerHTML = `
            <div class="hunt-header">
                <span class="hunt-instruction">${interaction.instruction}</span>
                <span id="creature-counter" class="hunt-counter">發現動植物：0 / ${interaction.creatures.length}</span>
            </div>
            <div class="creature-grid">
                ${interaction.creatures.map(c => `
                    <div class="creature-card" data-id="${c.id}">
                        <div class="creature-card-icon">${c.icon}</div>
                        <div class="creature-card-name">${c.name}</div>
                        <div class="creature-card-role">${c.role}</div>
                        <div class="creature-check-badge">✓</div>
                    </div>
                `).join("")}
            </div>
            <div id="creature-interaction-modal" class="creature-modal hidden"></div>
        `;

        const counterEl = container.querySelector("#creature-counter");
        const cards = container.querySelectorAll(".creature-card");
        const modalArea = container.querySelector("#creature-interaction-modal");

        cards.forEach(card => {
            card.addEventListener("click", () => {
                const cId = card.getAttribute("data-id");
                const creature = interaction.creatures.find(c => c.id === cId);
                if (!creature) return;

                audioMgr.playWaterDrop();

                // 展開該生物的互動考驗
                modalArea.className = "creature-modal fade-in";
                modalArea.innerHTML = `
                    <div class="creature-popup-inner">
                        <div class="popup-icon">${creature.icon}</div>
                        <h3>【${creature.name}】的小提問</h3>
                        <p class="popup-role">${creature.role}</p>
                        <p class="popup-question">${creature.question}</p>
                        <div class="choice-buttons">
                            ${creature.options.map(opt => `
                                <button class="btn-choice opt-creature" data-correct="${opt.correct}">${opt.text}</button>
                            `).join("")}
                        </div>
                        <div class="creature-feedback hidden"></div>
                    </div>
                `;

                modalArea.querySelectorAll(".opt-creature").forEach(btn => {
                    btn.addEventListener("click", () => {
                        const isCorrect = btn.getAttribute("data-correct") === "true";
                        const feedback = modalArea.querySelector(".creature-feedback");

                        if (isCorrect) {
                            audioMgr.playCorrect();
                            btn.classList.add("correct");
                            feedback.className = "creature-feedback correct-feedback fade-in";
                            feedback.innerHTML = `💚 ${creature.feedback}`;

                            this.huntProgress.creatures.add(cId);
                            card.classList.add("collected");
                            counterEl.textContent = `發現動植物：${this.huntProgress.creatures.size} / ${interaction.creatures.length}`;

                            setTimeout(() => {
                                modalArea.className = "creature-modal hidden";
                                if (this.huntProgress.creatures.size === interaction.creatures.length) {
                                    audioMgr.playCorrect();
                                    interaction._isCompleted = true;
                                    setTimeout(() => {
                                        this.handleNextDialogue();
                                    }, 800);
                                }
                            }, 1400);
                        } else {
                            audioMgr.playHint();
                            btn.classList.add("hint");
                            feedback.className = "creature-feedback hint-feedback fade-in";
                            feedback.innerHTML = "💭 記得野生動植物需要我們靜靜尊重與愛護喔，再選一次看看！";
                        }
                    });
                });
            });
        });

        this.dom.interactionArea.appendChild(container);
    }

    // 6. 第二章：外來垃圾清理
    renderTrashCleanupInteraction(interaction) {
        const container = document.createElement("div");
        container.className = "interaction-panel panel-trash";
        container.innerHTML = `
            <div class="hunt-header">
                <span class="hunt-instruction">${interaction.instruction}</span>
                <span id="trash-counter" class="hunt-counter">已清理：0 / ${interaction.trashes.length}</span>
            </div>
            <div class="trash-scene-area">
                ${interaction.trashes.map((t, idx) => `
                    <div class="trash-item trash-pos-${idx + 1}" data-id="${t.id}">
                        <div class="trash-icon-wrap">${t.icon}</div>
                        <span class="trash-tag">${t.name}</span>
                    </div>
                `).join("")}
            </div>
            <div id="trash-info-box" class="trash-info-box hidden"></div>
        `;

        const counterEl = container.querySelector("#trash-counter");
        const infoBox = container.querySelector("#trash-info-box");
        const trashItems = container.querySelectorAll(".trash-item");

        trashItems.forEach(item => {
            item.addEventListener("click", () => {
                const tId = item.getAttribute("data-id");
                const trash = interaction.trashes.find(t => t.id === tId);
                if (!trash || item.classList.contains("cleaned")) return;

                audioMgr.playWaterDrop();
                item.classList.add("cleaned");
                this.huntProgress.trashes.add(tId);

                counterEl.textContent = `已清理：${this.huntProgress.trashes.size} / ${interaction.trashes.length}`;

                infoBox.className = "trash-info-box fade-in";
                infoBox.innerHTML = `
                    <div class="info-title">🧹 清理成功：${trash.name}</div>
                    <div class="info-danger">⚠️ 危害警訊：${trash.danger}</div>
                `;

                if (this.huntProgress.trashes.size === interaction.trashes.length) {
                    audioMgr.playCorrect();
                    interaction._isCompleted = true;
                    setTimeout(() => {
                        infoBox.innerHTML += `<div class="all-cleared-msg">🌿 河岸恢復清爽了！小動物們都很感謝你！點擊對話繼續！</div>`;
                    }, 600);
                }
            });
        });

        this.dom.interactionArea.appendChild(container);
    }

    // 7. 第三章：四大污染知識卡
    renderKnowledgeCardsInteraction(interaction) {
        const container = document.createElement("div");
        container.className = "interaction-panel panel-cards";
        container.innerHTML = `
            <div class="hunt-header">
                <span class="hunt-instruction">${interaction.instruction}</span>
                <span id="cards-counter" class="hunt-counter">已揭露真相：0 / ${interaction.cards.length}</span>
            </div>
            <div class="knowledge-cards-grid">
                ${interaction.cards.map(c => `
                    <div class="knowledge-card" data-id="${c.id}">
                        <div class="card-front">
                            <div class="card-icon">${c.icon}</div>
                            <div class="card-badge">${c.badge}</div>
                            <h4 class="card-title">${c.title}</h4>
                            <div class="card-flip-hint">點擊翻開了解 ➜</div>
                        </div>
                        <div class="card-back hidden">
                            <div class="card-section">
                                <strong>【污染來源】</strong>
                                <p>${c.source}</p>
                            </div>
                            <div class="card-section">
                                <strong>【環境衝擊】</strong>
                                <p>${c.impact}</p>
                            </div>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;

        const counterEl = container.querySelector("#cards-counter");
        const cards = container.querySelectorAll(".knowledge-card");

        cards.forEach(card => {
            card.addEventListener("click", () => {
                const cId = card.getAttribute("data-id");
                audioMgr.playWaterDrop();

                const back = card.querySelector(".card-back");
                const front = card.querySelector(".card-front");

                if (back.classList.contains("hidden")) {
                    back.classList.remove("hidden");
                    front.classList.add("hidden");
                    card.classList.add("revealed");
                    this.huntProgress.knowledgeCards.add(cId);
                } else {
                    back.classList.add("hidden");
                    front.classList.remove("hidden");
                }

                counterEl.textContent = `已揭露真相：${this.huntProgress.knowledgeCards.size} / ${interaction.cards.length}`;

                if (this.huntProgress.knowledgeCards.size === interaction.cards.length) {
                    audioMgr.playCorrect();
                    interaction._isCompleted = true;
                }
            });
        });

        this.dom.interactionArea.appendChild(container);
    }

    // 8. 第三章：四種污染危機行動挑戰
    renderCrisisScenariosInteraction(interaction) {
        let currentCrisisIndex = 0;
        const container = document.createElement("div");
        container.className = "interaction-panel panel-crisis";

        const renderCrisis = () => {
            const sc = interaction.scenarios[currentCrisisIndex];
            container.innerHTML = `
                <div class="quiz-seq-progress">危機行動抉擇：第 ${currentCrisisIndex + 1} 關 / 共 ${interaction.scenarios.length} 關</div>
                <div class="crisis-card">
                    <div class="crisis-icon">${sc.imageIcon}</div>
                    <h3 class="crisis-title">${sc.title}</h3>
                    <p class="crisis-desc">${sc.situation}</p>
                    <div id="crisis-feedback" class="quiz-feedback hidden"></div>
                    <div class="choice-buttons" id="crisis-buttons"></div>
                </div>
            `;

            const btnContainer = container.querySelector("#crisis-buttons");
            const feedbackEl = container.querySelector("#crisis-feedback");

            sc.options.forEach(opt => {
                const btn = document.createElement("button");
                btn.className = "btn-choice";
                btn.textContent = opt.text;
                btn.addEventListener("click", () => {
                    if (opt.correct) {
                        audioMgr.playCorrect();
                        btn.classList.add("correct");
                        feedbackEl.className = "quiz-feedback correct-feedback fade-in";
                        feedbackEl.innerHTML = `🌟 ${sc.explainCorrect}`;
                        btnContainer.querySelectorAll("button").forEach(b => b.disabled = true);

                        setTimeout(() => {
                            if (currentCrisisIndex < interaction.scenarios.length - 1) {
                                currentCrisisIndex++;
                                renderCrisis();
                            } else {
                                interaction._isCompleted = true;
                                this.handleNextDialogue();
                            }
                        }, 1800);
                    } else {
                        audioMgr.playHint();
                        btn.classList.add("hint");
                        feedbackEl.className = "quiz-feedback hint-feedback fade-in";
                        feedbackEl.innerHTML = `💡 ${sc.explainHint}`;
                    }
                });
                btnContainer.appendChild(btn);
            });
        };

        renderCrisis();
        this.dom.interactionArea.appendChild(container);
    }

    // 9. 終章：守護承諾卡與證書生成
    renderPledgeCertificateInteraction(interaction) {
        const container = document.createElement("div");
        container.className = "interaction-panel panel-pledge";
        container.innerHTML = `
            <div class="pledge-card">
                <div class="pledge-header">
                    <div class="pledge-symbol">📜</div>
                    <h3>《瓦磘溝守護誓約書》</h3>
                    <p>${interaction.prompt}</p>
                </div>
                <div class="pledge-input-group">
                    <label for="guardian-name">守護者姓名：</label>
                    <input type="text" id="guardian-name" class="input-name" value="${this.playerName}" maxlength="12" placeholder="請輸入姓名" />
                </div>
                <div class="pledge-promises">
                    ${interaction.defaultPromises.map((p, idx) => `
                        <label class="promise-item">
                            <input type="checkbox" class="promise-chk" checked data-text="${p}" />
                            <span class="promise-text">${p}</span>
                        </label>
                    `).join("")}
                </div>
                <button id="btn-submit-pledge" class="btn-primary btn-large">簽署承諾並領取守護者勳章！</button>
            </div>
        `;

        const nameInput = container.querySelector("#guardian-name");
        const btnSubmit = container.querySelector("#btn-submit-pledge");

        btnSubmit.addEventListener("click", () => {
            const enteredName = nameInput.value.trim();
            if (!enteredName) {
                alert("請填寫守護者姓名喔！");
                nameInput.focus();
                return;
            }

            this.playerName = enteredName;
            this.selectedPromises = [];
            container.querySelectorAll(".promise-chk:checked").forEach(chk => {
                this.selectedPromises.push(chk.getAttribute("data-text"));
            });

            audioMgr.playCorrect();
            interaction._isCompleted = true;
            this.saveProgress();
            this.handleNextDialogue();
        });

        this.dom.interactionArea.appendChild(container);
    }

    // 顯示小小守護者榮譽證書彈跳視窗（含 Canvas 繪製與一鍵下載）
    showCertificateModal() {
        audioMgr.playFanfare();
        const dateStr = new Date().toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" });

        this.showModal(`
            <div class="certificate-modal-wrapper">
                <div class="cert-congrats-header">
                    <h2>🏆 恭喜成為瓦磘溝小小守護者！</h2>
                    <p>感謝你為瓦磘溝找回失落的記憶，讓我們一同守護家鄉的美好河川！</p>
                </div>
                <div class="cert-canvas-container">
                    <canvas id="cert-canvas" width="800" height="560"></canvas>
                </div>
                <div class="cert-actions">
                    <button id="btn-download-cert" class="btn-primary">💾 下載榮譽證書圖片</button>
                    <button id="btn-print-cert" class="btn-secondary">🖨️ 列印證書</button>
                    <button id="btn-replay" class="btn-choice">🔄 再次探索</button>
                </div>
            </div>
        `, () => {
            // 繪製 Canvas 證書
            const canvas = document.getElementById("cert-canvas");
            if (canvas) {
                this.drawCertificate(canvas, this.playerName, dateStr);
            }

            // 下載證書
            const btnDownload = document.getElementById("btn-download-cert");
            if (btnDownload && canvas) {
                btnDownload.addEventListener("click", () => {
                    audioMgr.playWaterDrop();
                    const link = document.createElement("a");
                    link.download = `瓦磘溝小小守護者證書_${this.playerName}.png`;
                    link.href = canvas.toDataURL("image/png");
                    link.click();
                });
            }

            // 列印證書
            const btnPrint = document.getElementById("btn-print-cert");
            if (btnPrint && canvas) {
                btnPrint.addEventListener("click", () => {
                    const win = window.open("");
                    win.document.write(`<img src="${canvas.toDataURL("image/png")}" style="width:100%;max-width:800px;display:block;margin:auto;" onload="window.print();window.close();"/>`);
                });
            }

            // 再次探索
            const btnReplay = document.getElementById("btn-replay");
            if (btnReplay) {
                btnReplay.addEventListener("click", () => {
                    this.closeModal();
                    this.resetGame();
                });
            }
        });
    }

    // 繪製高解析度榮譽證書 Canvas
    drawCertificate(canvas, name, dateStr) {
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;

        // 背景漸層
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, "#f7fcfd");
        grad.addColorStop(1, "#e0f2f1");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // 典雅外邊框
        ctx.strokeStyle = "#00897b";
        ctx.lineWidth = 14;
        ctx.strokeRect(18, 18, w - 36, h - 36);

        ctx.strokeStyle = "#80cbc4";
        ctx.lineWidth = 3;
        ctx.strokeRect(28, 28, w - 56, h - 56);

        // 主標題
        ctx.textAlign = "center";
        ctx.fillStyle = "#00695c";
        ctx.font = "bold 32px 'Noto Sans TC', sans-serif";
        ctx.fillText("《瓦磘溝探索之旅》榮譽認證", w / 2, 85);

        ctx.fillStyle = "#004d40";
        ctx.font = "bold 20px 'Noto Sans TC', sans-serif";
        ctx.fillText("RIVER GUARDIAN CERTIFICATE", w / 2, 118);

        // 授予文字
        ctx.fillStyle = "#37474f";
        ctx.font = "20px 'Noto Sans TC', sans-serif";
        ctx.fillText("茲證明優秀學童", w / 2, 170);

        // 玩家姓名
        ctx.fillStyle = "#d84315";
        ctx.font = "bold 38px 'Noto Sans TC', sans-serif";
        ctx.fillText(name, w / 2, 220);

        // 底線裝飾
        ctx.strokeStyle = "#d84315";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w / 2 - 150, 235);
        ctx.lineTo(w / 2 + 150, 235);
        ctx.stroke();

        // 獎狀說明內文
        ctx.fillStyle = "#455a64";
        ctx.font = "17px 'Noto Sans TC', sans-serif";
        ctx.fillText("成功完成瓦磘溝全章節探索，找回失落的三枚河川記憶碎片：", w / 2, 275);
        ctx.fillText("【歷史之石】地方記憶  •  【生態之葉】動植物棲地  •  【守護之水】無污染行動", w / 2, 305);
        ctx.fillText("並許下守護河川的誠摯承諾，特此頒發本證書以資表揚！", w / 2, 335);

        // 三枚勳章標記
        ctx.font = "30px sans-serif";
        ctx.fillText("🪨     🍃     💧", w / 2, 390);

        // 頒發單位與印信
        ctx.textAlign = "left";
        ctx.font = "16px 'Noto Sans TC', sans-serif";
        ctx.fillStyle = "#546e7a";
        ctx.fillText(`認證日期：${dateStr}`, 60, 485);
        ctx.fillText("守護夥伴：河爺爺、小水滴、小白鷺、泥土守護精靈", 60, 510);

        ctx.textAlign = "right";
        ctx.fillStyle = "#00796b";
        ctx.font = "bold 18px 'Noto Sans TC', sans-serif";
        ctx.fillText("志同道河 River Adventure Project", w - 60, 485);
        ctx.font = "14px 'Noto Sans TC', sans-serif";
        ctx.fillText("瓦磘溝環境守護教育推廣小組 敬頒", w - 60, 510);
    }

    // 章節快速選單視窗
    showChapterSelectModal() {
        audioMgr.playWaterDrop();
        this.showModal(`
            <div class="chapters-modal">
                <h3>🗺️ 瓦磘溝章節導覽</h3>
                <div class="chapter-list">
                    ${this.story.chapters.map((chap, idx) => `
                        <div class="chapter-item ${idx === this.currentChapterIndex ? "current" : ""}" data-idx="${idx}">
                            <div class="chap-badge">${chap.number}</div>
                            <div class="chap-info">
                                <div class="chap-name">${chap.title}</div>
                                <div class="chap-time">⏱️ ${chap.duration}</div>
                            </div>
                            <button class="btn-choice btn-goto" data-idx="${idx}">
                                ${idx === this.currentChapterIndex ? "當前進度" : "前往"}
                            </button>
                        </div>
                    `).join("")}
                </div>
            </div>
        `, () => {
            document.querySelectorAll(".btn-goto").forEach(btn => {
                btn.addEventListener("click", () => {
                    const idx = parseInt(btn.getAttribute("data-idx"), 10);
                    this.closeModal();
                    this.startChapter(idx, 0);
                });
            });
        });
    }

    // 通用彈跳視窗展示
    showModal(contentHtml, onMounted) {
        if (!this.dom.modalOverlay || !this.dom.modalContent) return;
        this.dom.modalContent.innerHTML = contentHtml;
        this.dom.modalOverlay.classList.remove("hidden");
        this.dom.modalOverlay.classList.add("active");
        if (onMounted) onMounted();
    }

    // 關閉彈跳視窗
    closeModal() {
        if (!this.dom.modalOverlay) return;
        this.dom.modalOverlay.classList.remove("active");
        this.dom.modalOverlay.classList.add("hidden");
    }

    // 晃動元素（答錯提示）
    shakeElement(el) {
        if (!el) return;
        el.classList.add("shake-anim");
        setTimeout(() => {
            el.classList.remove("shake-anim");
        }, 500);
    }
}

