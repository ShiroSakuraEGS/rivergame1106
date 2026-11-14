/**
 * 《瓦磘溝探索之旅》音效與背景音樂管理器 (AudioManager)
 * 整合真實 Suno AI 背景配樂循環播放、跨章節平滑淡入淡出，以及 Web Audio API 即時合成音效。
 */

class AudioManager {
    constructor() {
        this.ctx = null;
        this.isMuted = false;

        // 背景音樂播放器核心變數
        this.currentAudio = null;
        this.currentTrackKey = null;
        this.currentTrackSrc = null;
        this.fadeTimer = null;
        this.bgmVolume = 0.45; // 預設背景音樂音量（舒適柔和，不壓過語音與音效）

        // 背景音樂曲目對照表（對應 music/ 目錄下的素材）
        this.tracks = {
            cover: "music/開場畫面.mp3",
            ch0: "music/開場畫面.mp3",
            ch1: "music/【第一章：消失的時光之河】《悠悠水路百年行》（Chapter 1 River of Lost Time）.mp3",
            ch2: "music/【第二章：河川居民的求救信】《白鷺振翅與綠意鄰居》（Chapter 2 Nature's Sanctuary）.mp3",
            ch3: "music/【第三章：醜泥怪的秘密】《泥巴怪的藍調與救贖》（Chapter 3 Mud Monster's Blues & Tear）.mp3",
            ch4: "music/【終章與授勳】《彩虹甦醒的守護誓約》（Finale & Guardians of Waoyao）.mp3"
        };

        // 從本地儲存讀取音樂開關偏好
        const savedMute = localStorage.getItem("river_game_muted");
        if (savedMute !== null) {
            this.isMuted = savedMute === "true";
        }
    }

    // 初始化 AudioContext（配合瀏覽器使用者手勢策略）
    initContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    }

    // 播放指定章節或場景的背景音樂（單一播放實例，避免多重音訊重疊）
    playBGM(trackKey, fadeInDuration = 400) {
        if (!this.tracks[trackKey]) return;
        const targetSrc = this.tracks[trackKey];

        // 核心防護 1：若當前播放的音訊檔案來源與目標曲目一致且正在播放，保持流暢繼續播放，不重複加載
        if (this.currentTrackSrc === targetSrc && this.currentAudio && !this.currentAudio.paused) {
            this.currentTrackKey = trackKey;
            return;
        }

        this.currentTrackKey = trackKey;
        this.currentTrackSrc = targetSrc;

        // 若處於靜音模式，記錄曲目但不發聲
        if (this.isMuted) {
            if (this.currentAudio) {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
            }
            return;
        }

        // 核心防護 2：徹底撤回並停止前一首背景音樂，消除雙重音訊重疊
        if (this.fadeTimer) {
            clearInterval(this.fadeTimer);
            this.fadeTimer = null;
        }
        if (this.currentAudio) {
            try {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
                this.currentAudio.src = "";
            } catch (e) {
                console.warn("清理舊音訊實例失敗：", e);
            }
            this.currentAudio = null;
        }

        // 建立新音訊實例並播放
        try {
            const newAudio = new Audio(encodeURI(targetSrc));
            newAudio.loop = true; // 循環播放
            newAudio.volume = this.bgmVolume;
            this.currentAudio = newAudio;

            const playPromise = newAudio.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => {
                    console.log("瀏覽器自動播放策略等待使用者互動觸發：", err);
                });
            }
        } catch (e) {
            console.warn("BGM 載入失敗：", e);
        }
    }

    // 依章節 ID 播放對應背景音樂
    playBGMForChapter(chapterId) {
        const key = this.tracks[chapterId] ? chapterId : "cover";
        this.playBGM(key);
    }

    // 停止背景音樂（徹底撤回與重置）
    stopBGM() {
        if (this.fadeTimer) {
            clearInterval(this.fadeTimer);
            this.fadeTimer = null;
        }
        if (this.currentAudio) {
            try {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
                this.currentAudio.src = "";
            } catch (e) {}
            this.currentAudio = null;
        }
        this.currentTrackKey = null;
        this.currentTrackSrc = null;
    }

    // 切換音樂開關（可開或關音樂）
    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem("river_game_muted", this.isMuted);

        if (this.isMuted) {
            // 關閉音樂：暫停當前音樂播放
            if (this.currentAudio) {
                this.currentAudio.pause();
            }
        } else {
            // 開啟音樂：恢復播放對應曲目
            this.initContext();
            if (this.currentTrackKey) {
                this.playBGM(this.currentTrackKey);
            } else {
                this.playBGM("cover");
            }
        }
        return this.isMuted;
    }

    // ==========================================
    // 互動音效（Web Audio API 即時合成）
    // ==========================================

    // 播放小水滴點擊音
    playWaterDrop() {
        if (this.isMuted) return;
        this.initContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = "sine";
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.16);
    }

    // 播放答對/成功提示音（明亮溫馨和弦）
    playCorrect() {
        if (this.isMuted) return;
        this.initContext();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime + idx * 0.08;

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.3);
        });
    }

    // 播放提示音（溫和的重試音符，不帶挫敗感）
    playHint() {
        if (this.isMuted) return;
        this.initContext();
        if (!this.ctx) return;

        const notes = [440, 520];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime + idx * 0.12;

            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.25);
        });
    }

    // 播放記憶碎片解鎖水晶音（神聖亮麗的八音盒琶音）
    playFragmentUnlock() {
        if (this.isMuted) return;
        this.initContext();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime + idx * 0.1;

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.5);
        });
    }

    // 播放終章通關祝賀音
    playFanfare() {
        if (this.isMuted) return;
        this.initContext();
        if (!this.ctx) return;

        const melody = [
            { f: 523.25, d: 0.15 },
            { f: 659.25, d: 0.15 },
            { f: 783.99, d: 0.2 },
            { f: 1046.50, d: 0.45 }
        ];

        let cursor = this.ctx.currentTime;
        melody.forEach(item => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = "triangle";
            osc.frequency.setValueAtTime(item.f, cursor);

            gain.gain.setValueAtTime(0.22, cursor);
            gain.gain.exponentialRampToValueAtTime(0.001, cursor + item.d + 0.1);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(cursor);
            osc.stop(cursor + item.d + 0.15);

            cursor += item.d;
        });
    }
}

// 實例化全域音效與音樂控制器
const audioMgr = new AudioManager();
