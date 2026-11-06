/**
 * 《瓦磘溝探索之旅》音效管理器
 * 使用 Web Audio API 即時合成音效與背景自然流水聲，無需依賴外部音檔，跨瀏覽器相容性極佳。
 */

class AudioManager {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.ambientNode = null;
        this.ambientGain = null;
        this.isAmbientPlaying = false;

        // 從本機儲存讀取靜音偏好
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

    // 切換靜音狀態
    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem("river_game_muted", this.isMuted);

        if (this.isMuted) {
            if (this.ambientGain) {
                this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
            }
        } else {
            this.initContext();
            if (this.ambientGain) {
                this.ambientGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            }
        }
        return this.isMuted;
    }

    // 播放小水滴點擊音
    playWaterDrop() {
        if (this.isMuted) return;
        this.initContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const now = this.ctx.currentTime;
        osc.type = "sine";
        // 音調快速向上滑動模擬水滴啵啵聲
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.16);
    }

    // 播放答對/成功提示音（溫柔明亮的 C-E-G 和弦）
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

    // 啟動環境流水氛圍音（以低通濾波白噪音模擬舒緩河水流淌）
    startAmbient() {
        if (this.isAmbientPlaying) return;
        this.initContext();
        if (!this.ctx) return;

        try {
            // 建立 2 秒的白噪音緩衝區
            const bufferSize = this.ctx.sampleRate * 2;
            const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }

            const whiteNoise = this.ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;

            // 雙層低通濾波器模擬潺潺水聲
            const filter = this.ctx.createBiquadFilter();
            filter.type = "bandpass";
            filter.frequency.value = 450;
            filter.Q.value = 1.2;

            this.ambientGain = this.ctx.createGain();
            this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx.currentTime);

            whiteNoise.connect(filter);
            filter.connect(this.ambientGain);
            this.ambientGain.connect(this.ctx.destination);

            whiteNoise.start();
            this.ambientNode = whiteNoise;
            this.isAmbientPlaying = true;
        } catch (e) {
            console.warn("無法啟動環境音效：", e);
        }
    }
}

// 實例化全域音效控制器
const audioMgr = new AudioManager();

