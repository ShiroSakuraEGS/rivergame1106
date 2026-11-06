/**
 * 《瓦磘溝探索之旅》完整結構化劇情資料庫
 * 設計對象：國小三至六年級
 * 架構：序章 + 三大主線章節 + 終章
 */

const STORY_DATA = {
    // 遊戲整體設定
    meta: {
        title: "瓦磘溝探索之旅",
        subtitle: "消失的河川記憶",
        project: "志同道河 River Adventure Project",
        description: "一場關於河流、居民、動物與守護的冒險",
        coverImage: "assets/images/cover.png",
        playerImage: "assets/images/player.png"
    },

    // 角色設定資料庫
    characters: {
        water_drop: {
            id: "water_drop",
            name: "小水滴",
            title: "記憶之流的化身",
            role: "故事核心／記憶載體",
            catchphrase: "只要還有人願意記得，河流的故事就不會消失。",
            color: "#3498db",
            badgeColor: "#e1f5fe",
            avatarSvg: `
                <svg viewBox="0 0 100 100" class="avatar-svg">
                    <defs>
                        <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#81d4fa"/>
                            <stop offset="100%" stop-color="#0288d1"/>
                        </linearGradient>
                    </defs>
                    <path d="M50 10 C35 35 15 55 15 72 A35 35 0 0 0 85 72 C85 55 65 35 50 10 Z" fill="url(#dropGrad)" />
                    <!-- 眼睛 -->
                    <circle cx="40" cy="62" r="5" fill="#ffffff" />
                    <circle cx="40" cy="62" r="3" fill="#01579b" />
                    <circle cx="60" cy="62" r="5" fill="#ffffff" />
                    <circle cx="60" cy="62" r="3" fill="#01579b" />
                    <!-- 害羞腮紅 -->
                    <ellipse cx="32" cy="70" rx="4" ry="2" fill="#ff80ab" opacity="0.6"/>
                    <ellipse cx="68" cy="70" rx="4" ry="2" fill="#ff80ab" opacity="0.6"/>
                    <!-- 微笑嘴巴 -->
                    <path d="M44 72 Q50 78 56 72" stroke="#01579b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                    <!-- 光芒高光 -->
                    <ellipse cx="38" cy="45" rx="5" ry="12" fill="#ffffff" opacity="0.7" transform="rotate(-25 38 45)"/>
                </svg>
            `
        },
        river_grandpa: {
            id: "river_grandpa",
            name: "河爺爺",
            title: "瓦磘溝的河川守護靈",
            role: "引導者",
            catchphrase: "河流會記得每一件發生過的事情。",
            color: "#27ae60",
            badgeColor: "#e8f5e9",
            avatarSvg: `
                <svg viewBox="0 0 100 100" class="avatar-svg">
                    <!-- 綠水靈光背暈 -->
                    <circle cx="50" cy="50" r="45" fill="#e8f8f5"/>
                    <circle cx="50" cy="50" r="42" fill="#a3e4d7"/>
                    <!-- 長者臉龐 -->
                    <circle cx="50" cy="50" r="32" fill="#ffe0b2"/>
                    <!-- 慈祥眼睛 -->
                    <path d="M38 45 Q44 41 48 45" stroke="#5d4037" stroke-width="3" fill="none" stroke-linecap="round"/>
                    <path d="M52 45 Q56 41 62 45" stroke="#5d4037" stroke-width="3" fill="none" stroke-linecap="round"/>
                    <!-- 眉毛 -->
                    <path d="M36 38 Q43 33 49 38" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>
                    <path d="M51 38 Q57 33 64 38" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>
                    <!-- 水波鬍鬚 -->
                    <path d="M35 55 Q50 85 65 55 Q55 75 50 82 Q45 75 35 55 Z" fill="#ffffff"/>
                    <!-- 守護水草帽子/額飾 -->
                    <path d="M25 35 Q50 18 75 35 L70 28 Q50 15 30 28 Z" fill="#2e7d32"/>
                    <circle cx="50" cy="24" r="5" fill="#00e676"/>
                </svg>
            `
        },
        egret: {
            id: "egret",
            name: "小白鷺",
            title: "河川生態觀察員",
            role: "冒險夥伴",
            catchphrase: "咦？你有看到那個奇怪的東西嗎？",
            color: "#00acc1",
            badgeColor: "#e0f7fa",
            avatarSvg: `
                <svg viewBox="0 0 100 100" class="avatar-svg">
                    <circle cx="50" cy="50" r="45" fill="#e0f2f1"/>
                    <!-- 身體與長頸 -->
                    <path d="M45 85 Q35 60 52 40 Q58 30 65 30 Q70 30 68 38 Q65 55 58 85 Z" fill="#ffffff" stroke="#b0bec5" stroke-width="1.5"/>
                    <!-- 鳥喙（長長黃黃的嘴巴） -->
                    <polygon points="68,34 95,42 66,42" fill="#ffb300"/>
                    <!-- 眼睛 -->
                    <circle cx="62" cy="35" r="3.5" fill="#212121"/>
                    <circle cx="63" cy="34" r="1.2" fill="#ffffff"/>
                    <!-- 頭頂飾羽（繁殖羽/俏皮呆毛） -->
                    <path d="M55 28 Q45 15 30 20 Q42 22 53 29" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
                    <path d="M56 26 Q48 10 35 12 Q45 18 54 27" fill="none" stroke="#cfd8dc" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `
        },
        mud_monster: {
            id: "mud_monster",
            name: "醜泥怪",
            title: "污染與廢棄物的象徵",
            role: "主要衝突角色（最終轉變為河川提醒員）",
            catchphrase: "嘿嘿！你們丟下的東西，都是我的力量！",
            color: "#6d4c41",
            badgeColor: "#efebe9",
            avatarSvg: `
                <svg viewBox="0 0 100 100" class="avatar-svg monster-svg">
                    <!-- 泥團本體 -->
                    <path d="M20 75 Q15 45 40 35 Q50 20 65 35 Q85 40 80 75 Q75 90 50 88 Q25 90 20 75 Z" fill="#5d4037" />
                    <!-- 身上黏著的塑膠瓶與雜物 -->
                    <rect x="22" y="45" width="12" height="18" rx="3" fill="#80deea" opacity="0.8" transform="rotate(-20 28 54)"/>
                    <ellipse cx="70" cy="50" rx="8" ry="12" fill="#fff59d" opacity="0.7" transform="rotate(25 70 50)"/>
                    <!-- 大眼睛（愛搗蛋但有點呆萌） -->
                    <circle cx="42" cy="50" r="9" fill="#ffffff"/>
                    <circle cx="44" cy="51" r="5" fill="#3e2723"/>
                    <circle cx="62" cy="48" r="8" fill="#ffffff"/>
                    <circle cx="60" cy="49" r="4.5" fill="#3e2723"/>
                    <!-- 調皮咧嘴大笑 -->
                    <path d="M38 68 Q52 82 66 66" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round"/>
                    <!-- 冒出的污濁泡泡 -->
                    <circle cx="30" cy="25" r="5" fill="#8d6e63" opacity="0.7"/>
                    <circle cx="72" cy="22" r="7" fill="#795548" opacity="0.8"/>
                    <circle cx="82" cy="30" r="3" fill="#a1887f" opacity="0.6"/>
                </svg>
            `,
            cleanedSvg: `
                <svg viewBox="0 0 100 100" class="avatar-svg monster-cleaned-svg">
                    <circle cx="50" cy="50" r="45" fill="#f1f8e9"/>
                    <!-- 變乾淨的小泥巴怪 -->
                    <path d="M25 70 Q25 40 50 35 Q75 40 75 70 Q70 85 50 82 Q30 85 25 70 Z" fill="#8d6e63"/>
                    <!-- 可愛無害眼睛 -->
                    <circle cx="42" cy="52" r="6" fill="#ffffff"/>
                    <circle cx="43" cy="53" r="3.5" fill="#3e2723"/>
                    <circle cx="58" cy="52" r="6" fill="#ffffff"/>
                    <circle cx="57" cy="53" r="3.5" fill="#3e2723"/>
                    <!-- 溫暖害羞微笑 -->
                    <path d="M44 65 Q50 72 56 65" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                    <circle cx="34" cy="62" r="4" fill="#ffab91" opacity="0.7"/>
                    <circle cx="66" cy="62" r="4" fill="#ffab91" opacity="0.7"/>
                    <!-- 頭上長出綠意小幼苗 -->
                    <path d="M50 35 Q50 20 42 16 Q52 18 50 35" fill="#4caf50"/>
                    <path d="M50 35 Q52 22 60 18 Q54 23 50 35" fill="#81c784"/>
                </svg>
            `
        },
        narrator: {
            id: "narrator",
            name: "瓦磘溝旁白",
            title: "引言",
            role: "環境紀錄",
            color: "#607d8b",
            badgeColor: "#eceff1",
            avatarSvg: `
                <svg viewBox="0 0 100 100" class="avatar-svg">
                    <circle cx="50" cy="50" r="45" fill="#eceff1"/>
                    <path d="M30 40 L50 25 L70 40 L70 75 L30 75 Z" fill="#78909c"/>
                    <path d="M40 75 L40 55 L60 55 L60 75 Z" fill="#ffffff"/>
                </svg>
            `
        }
    },

    // 記憶碎片清單
    fragments: [
        {
            id: "history_stone",
            name: "歷史之石",
            chapter: 1,
            color: "#f39c12",
            icon: "🪨",
            description: "找回瓦磘溝的地方歷史記憶與昔日水路繁華生活。",
            titleReward: "時光探索家"
        },
        {
            id: "ecology_leaf",
            name: "生態之葉",
            chapter: 2,
            color: "#27ae60",
            icon: "🍃",
            description: "找回瓦磘溝的河川動植物夥伴，學會友善觀察生活棲地。",
            titleReward: "生態觀察員"
        },
        {
            id: "protection_water",
            name: "守護之水",
            chapter: 3,
            color: "#2980b9",
            icon: "💧",
            description: "解開污染的真相，了解日常好習慣才能讓河流真正恢復清澈健康。",
            titleReward: "河川守護者"
        }
    ],

    // 章節與場景詳細腳本
    chapters: [
        // ==========================================
        // 序章：神祕的河川呼喚
        // ==========================================
        {
            id: "ch0",
            number: "序章",
            title: "神祕的河川呼喚",
            duration: "約 2 分鐘",
            mission: "找到小水滴，了解瓦磘溝的地理位置與危機！",
            bgClass: "bg-ch0",
            scenes: [
                {
                    sceneId: "0-1",
                    name: "平凡的一天",
                    speaker: "narrator",
                    text: "午後，你來到新北市中和與永和一帶散步。遠處可以看見河岸、橋梁、綠樹，以及緩緩流動的河水。突然，你在河岸草叢邊發現了一顆正在發光的藍色小水滴……",
                    next: "0-1-drop"
                },
                {
                    sceneId: "0-1-drop",
                    speaker: "water_drop",
                    text: "喂……有人聽得到我說話嗎？請問……你可以幫幫我嗎？",
                    interaction: {
                        type: "choice",
                        prompt: "你打算怎麼回應這顆會說話的小水滴呢？",
                        options: [
                            {
                                text: "A. 你是誰？怎麼會說話？",
                                responseSpeaker: "water_drop",
                                responseText: "我是小水滴，是瓦磘溝『記憶之流』的一部分！每一條河流都有屬於自己的故事喔！"
                            },
                            {
                                text: "B. 你怎麼會在這裡發光？",
                                responseSpeaker: "water_drop",
                                responseText: "我一直都住在這條河裡，只是最近河水變得混濁，我的記憶力量也愈來愈弱了……"
                            },
                            {
                                text: "C. 你需要我幫忙嗎？",
                                responseSpeaker: "water_drop",
                                responseText: "真的嗎？太好了！我正在尋找願意聆聽河流聲音、守護瓦磘溝的人！"
                            }
                        ]
                    },
                    next: "0-2"
                },
                {
                    sceneId: "0-2",
                    name: "河爺爺登場",
                    speaker: "river_grandpa",
                    text: "哎呀！好久沒有看見願意跟河川聊天的小朋友了！我是河爺爺，已經在瓦磘溝生活很久很久了。孩子，你知道瓦磘溝在哪裡嗎？",
                    next: "0-2-quiz"
                },
                {
                    sceneId: "0-2-quiz",
                    speaker: "river_grandpa",
                    text: "考考你的地理常識：瓦磘溝與哪兩個地方的居民生活有著最密切的關係呢？",
                    interaction: {
                        type: "quiz",
                        question: "瓦磘溝主要流經並緊扣著哪兩個地區的生活呢？",
                        options: [
                            { text: "A. 中和 與 永和", correct: true },
                            { text: "B. 淡水 與 八里", correct: false },
                            { text: "C. 台北市大安區 與 基隆", correct: false }
                        ],
                        correctFeedback: "答對了！太厲害了！瓦磘溝就是橫跨新北市中和與永和的界河，與雙和居民的生活息息相關喔！",
                        hintFeedback: "再想一想吧！這條河就位在新北市中和與永和交界一帶，是許多雙和人的童年河川喔！"
                    },
                    next: "0-3"
                },
                {
                    sceneId: "0-3",
                    name: "危機出現",
                    speaker: "narrator",
                    text: "突然間，平靜的河面冒出濃濃的黑色臭泡泡！一團混濁的巨大泥巴怪伴隨著怪笑，從水底緩緩浮現！",
                    next: "0-3-monster"
                },
                {
                    sceneId: "0-3-monster",
                    speaker: "mud_monster",
                    text: "嘿嘿嘿！又有人丟下滿滿的垃圾和黑水了！太美味了！你們丟得越多，我就越強大！",
                    next: "0-3-grandpa"
                },
                {
                    sceneId: "0-3-grandpa",
                    speaker: "river_grandpa",
                    text: "不好了……牠是由生活污水與不當廢棄物聚集而成的『醜泥怪』。瓦磘溝的三枚『記憶碎片』也因此失落了！如果找不回來，大家就會漸漸忘記這條河的歷史、動植物與守護之道！",
                    next: "0-3-choice"
                },
                {
                    sceneId: "0-3-choice",
                    speaker: "river_grandpa",
                    text: "孩子，這是一張瓦磘溝的時光地圖。你願意和我們一起踏上冒險，找回三枚失落的河川記憶碎片嗎？",
                    interaction: {
                        type: "choice",
                        prompt: "你的選擇是？",
                        options: [
                            {
                                text: "當然願意！我們立刻出發！",
                                responseSpeaker: "water_drop",
                                responseText: "太棒了！有你的加入，瓦磘溝一定有機會找回昔日的清澈與記憶！"
                            },
                            {
                                text: "我想知道更多關於這條河的故事！",
                                responseSpeaker: "river_grandpa",
                                responseText: "很好，保持好奇心正是小小探險家最珍貴的特質！讓我們開啟時光之門吧！"
                            }
                        ]
                    },
                    nextChapter: "ch1"
                }
            ]
        },

        // ==========================================
        // 第一章：消失的時光之河
        // ==========================================
        {
            id: "ch1",
            number: "第一章",
            title: "消失的時光之河",
            duration: "約 4–5 分鐘",
            mission: "穿梭昔日時光，探索水路生活，找回【歷史之石】！",
            bgClass: "bg-ch1",
            rewardFragment: "history_stone",
            scenes: [
                {
                    sceneId: "1-1",
                    name: "時光之門",
                    speaker: "river_grandpa",
                    text: "在很久以前，瓦磘溝周邊和今天高樓林立的模樣很不一樣。以前的水路能運送紅磚與貨物，旁邊還有清澈的水圳灌溉農田呢！你想不想親眼看看以前的地方生活？",
                    next: "1-1-egret"
                },
                {
                    sceneId: "1-1-egret",
                    speaker: "egret",
                    text: "（拍打著潔白翅膀飛過來）等等我！等等我！我也要去！我最喜歡聽以前河水清澈、魚蝦成群的故事了！",
                    next: "1-2-explore"
                },
                {
                    sceneId: "1-2-explore",
                    name: "歷史水路尋寶",
                    speaker: "river_grandpa",
                    text: "我們穿過時光之門，來到了過去的瓦磘溝。請在下方的昔日水岸景象中，點擊探索四個歷史關鍵物件吧！",
                    interaction: {
                        type: "object_hunt",
                        instruction: "點擊畫面中的 4 個閃爍歷史線索，了解瓦磘溝以前的角色：",
                        items: [
                            {
                                id: "boat",
                                name: "運貨小木船",
                                icon: "🛶",
                                title: "昔日的水路交通",
                                desc: "以前陸運還不發達，瓦磘溝是中和、永和重要的水上運輸動脈，船隻載運著農產品與磚瓦呢！",
                                x: 28, y: 65
                            },
                            {
                                id: "farmland",
                                name: "翠綠稻田",
                                icon: "🌾",
                                title: "水圳農業灌溉",
                                desc: "河水透過密集的水圳系統引入農田，滋養稻米與蔬菜，是昔日農業聚落的命脈！",
                                x: 72, y: 45
                            },
                            {
                                id: "houses",
                                name: "紅瓦傳統聚落",
                                icon: "🏡",
                                title: "沿河而居的人文聚落",
                                desc: "有水的地方就有人居，瓦磘溝沿岸形成了熱鬧的聚落，居民在此洗衣、取水、交流情感。",
                                x: 50, y: 35
                            },
                            {
                                id: "canal",
                                name: "清澈水道",
                                icon: "🌊",
                                title: "水路網絡與都市排水",
                                desc: "水道既是運送通道，也承擔著自然的防洪與排水功能，守護著這片土地。",
                                x: 38, y: 78
                            }
                        ]
                    },
                    next: "1-3-match"
                },
                {
                    sceneId: "1-3-match",
                    name: "時光記憶大考驗",
                    speaker: "river_grandpa",
                    text: "找到物件只是第一步，河爺爺要出三道時光配對題考考你，確定你真正明白了以前的生活！",
                    interaction: {
                        type: "quiz_sequence",
                        quizzes: [
                            {
                                q: "【考驗一】以前行駛在瓦磘溝上的小船，最重要的用途是什麼？",
                                options: [
                                    { text: "運送貨物、磚瓦與農作物", correct: true },
                                    { text: "沿途製造垃圾丟進河裡", correct: false },
                                    { text: "捕捉天上的小白鷺", correct: false }
                                ],
                                feedbackCorrect: "沒錯！以前的水路承擔著重要的客貨運輸功能！",
                                feedbackHint: "小船可不是用來丟垃圾或抓鳥的喔，再想一想水路交通的用途！"
                            },
                            {
                                q: "【考驗二】過去河岸邊的農田，為什麼非常需要引流的水圳系統？",
                                options: [
                                    { text: "提供乾淨充足的農業灌溉用水", correct: true },
                                    { text: "讓垃圾順利漂進農田裡", correct: false },
                                    { text: "為了讓河水變成黑泥色", correct: false }
                                ],
                                feedbackCorrect: "答對了！水資源與農業生活密不可分，健康的水圳帶來豐碩收成！",
                                feedbackHint: "農作物生長需要喝水，水圳正是農田解渴的功臣！"
                            },
                            {
                                q: "【考驗三】綜觀歷史，一條健康的河流與地方居民有什麼關聯？",
                                options: [
                                    { text: "緊緊串連生活、交通、文化與自然生態", correct: true },
                                    { text: "完全沒有任何關係", correct: false },
                                    { text: "只是用來拍照打卡而已", correct: false }
                                ],
                                feedbackCorrect: "太棒了！河流是地方的母親，孕育了我們的聚落與歷史記憶！",
                                feedbackHint: "河水孕育了聚落、交通與農業，想想它對生活的全面影響！"
                            }
                        ]
                    },
                    next: "1-4"
                },
                {
                    sceneId: "1-4",
                    name: "歷史之石歸位",
                    speaker: "water_drop",
                    text: "我看見了！三個記憶光點化作一道金色光芒！第一枚記憶碎片『歷史之石』重新回到我們身邊了！",
                    next: "1-4-grandpa"
                },
                {
                    sceneId: "1-4-grandpa",
                    speaker: "river_grandpa",
                    text: "（手杖綻放微光）孩子，你做得很好。歷史不只是書本上的文字，今天的城市正是從昨天一步一步走來的。接下來，我們回到現在，看看目前生活在瓦磘溝的鄰居們！",
                    nextChapter: "ch2"
                }
            ]
        },

        // ==========================================
        // 第二章：河川居民的求救信
        // ==========================================
        {
            id: "ch2",
            number: "第二章",
            title: "河川居民的求救信",
            duration: "約 4–5 分鐘",
            mission: "認識河岸六位動植物夥伴，清理外來垃圾，找回【生態之葉】！",
            bgClass: "bg-ch2",
            rewardFragment: "ecology_leaf",
            scenes: [
                {
                    sceneId: "2-1",
                    name: "誰在河邊生活？",
                    speaker: "egret",
                    text: "歡迎回到現代的瓦磘溝！雖然現在岸邊多了很多柏油路和水泥護岸，但在水草叢和樹蔭下，還是住著很多我的好朋友喔！快跟我一起找找看！",
                    next: "2-1-grandpa"
                },
                {
                    sceneId: "2-1-grandpa",
                    speaker: "river_grandpa",
                    text: "每一種生物都有自己適合的棲地環境。如果我們連鄰居是誰都不認識，就很容易不小心破壞了牠們的家。",
                    next: "2-2-creatures"
                },
                {
                    sceneId: "2-2-creatures",
                    name: "生態尋寶大搜查",
                    speaker: "egret",
                    text: "請在河岸生態場景中，找出藏在樹梢、石縫與水邊的 6 位動植物鄰居，並回答牠們的小問題！",
                    interaction: {
                        type: "creature_hunt",
                        instruction: "點擊畫面中的 6 種生物，完成對話並取得生態圖鑑紀錄：",
                        creatures: [
                            {
                                id: "creature_egret",
                                name: "小白鷺",
                                role: "涉禽鳥類",
                                icon: "🕊️",
                                question: "小白鷺最喜歡在哪種環境覓食活動呢？",
                                options: [
                                    { text: "河岸、淺水灘與濕地邊緣", correct: true },
                                    { text: "萬里無雲的高山終年積雪處", correct: false },
                                    { text: "乾旱沒有半滴水的沙漠深處", correct: false }
                                ],
                                feedback: "答對了！我們喜歡在淺灘漫步，找尋小魚小蝦喔！"
                            },
                            {
                                id: "creature_night_heron",
                                name: "夜鷺",
                                role: "夜行/黃昏性鳥類",
                                icon: "🦅",
                                question: "夜鷺常在黃昏或夜晚靜靜佇立水邊，牠們是什麼樣的生物？",
                                options: [
                                    { text: "瓦磘溝常見的河岸野生鳥類（常被誤認為企鵝呢！）", correct: true },
                                    { text: "家裡養的毛茸茸小寵物", correct: false },
                                    { text: "生活在深海的大型哺乳鯨魚", correct: false }
                                ],
                                feedback: "沒錯！我們常縮著脖子在水邊專注捕魚，是河岸很棒的飛行居民！"
                            },
                            {
                                id: "creature_kingfisher",
                                name: "翠鳥",
                                role: "捕魚高手（翡翠鳥）",
                                icon: "🐦",
                                question: "如果我們在河邊幸運看見羽毛閃爍著藍綠寶石光澤的翠鳥，最好的相處方式是？",
                                options: [
                                    { text: "保持距離、安靜用雙眼或望遠鏡欣賞，不驚擾牠", correct: true },
                                    { text: "衝上前去拔下牠美麗的藍色羽毛做紀念", correct: false },
                                    { text: "丟垃圾在牠巢穴旁邊裝飾牠的家", correct: false }
                                ],
                                feedback: "太棒了！只要用眼睛靜靜欣賞，就是對野生動物最大的愛護！"
                            },
                            {
                                id: "creature_shrike",
                                name: "紅尾伯勞",
                                role: "冬候鳥與過境鳥",
                                icon: "🪶",
                                question: "紅尾伯勞也是會造訪河岸的野生鳥類，對待野生鳥類我們應該？",
                                options: [
                                    { text: "保持適當距離，不餵食、不捕捉、不打擾", correct: true },
                                    { text: "拿麵包屑丟牠強迫牠過來", correct: false },
                                    { text: "拿大喇叭在牠身邊大吼大叫", correct: false }
                                ],
                                feedback: "答得好！野生動物懂得自己覓食，保持距離才能讓牠們安心生活！"
                            },
                            {
                                id: "creature_banyan",
                                name: "榕樹",
                                role: "河岸老樹夥伴",
                                icon: "🌳",
                                question: "高大的榕樹生長在河岸邊，能為環境帶來什麼正面好處？",
                                options: [
                                    { text: "固定水土、淨化空氣，並為鳥類與昆蟲提供棲息與遮蔭", correct: true },
                                    { text: "自動產生很多塑膠袋", correct: false },
                                    { text: "排出有毒的化學廢水", correct: false }
                                ],
                                feedback: "正確！樹木是河岸的綠色保護傘，幫大地抓緊土壤！"
                            },
                            {
                                id: "creature_fern",
                                name: "腎蕨",
                                role: "綠意蕨類植物",
                                icon: "🌿",
                                question: "在水岸石縫或土坡常見的腎蕨，葉片長得像羽毛，我們該如何看待河岸植物？",
                                options: [
                                    { text: "仔細觀察葉脈與生態美，不隨意踐踏或拔除", correct: true },
                                    { text: "把它們全部拔光丟進河裡", correct: false },
                                    { text: "拿打火機去燒它", correct: false }
                                ],
                                feedback: "非常好！每一株小草小蕨，都為水岸涵養水土與生態平衡！"
                            }
                        ]
                    },
                    next: "2-3-trash"
                },
                {
                    sceneId: "2-3-trash",
                    name: "清理河岸外來垃圾",
                    speaker: "egret",
                    text: "哎呀！你看河岸草叢裡！有人隨手扔了好多怪東西，把我的好朋友們弄得好難受！請幫幫忙把它們撿起來！",
                    interaction: {
                        type: "trash_cleanup",
                        instruction: "點擊畫面中的 4 件外來廢棄物，將它們清除並進行正確認識：",
                        trashes: [
                            { id: "t1", name: "隨手丟棄的塑膠袋", icon: "🛍️", danger: "容易被風吹入水中，可能纏住水鳥腳爪或被生物誤食！" },
                            { id: "t2", name: "喝完的手搖飲料杯", icon: "🥤", danger: "杯蓋與吸管分解需要數百年，積水還會滋生蚊蟲！" },
                            { id: "t3", name: "丟棄在草叢的寶特瓶", icon: "🍾", danger: "阻礙植物生長，烈日曝曬還會碎裂成微塑膠微粒！" },
                            { id: "t4", name: "油膩的食物包裝紙盒", icon: "📦", danger: "引來害蟲，油污隨雨水沖刷入河會讓水質缺氧發臭！" }
                        ]
                    },
                    next: "2-4"
                },
                {
                    sceneId: "2-4",
                    name: "生態之葉歸位",
                    speaker: "water_drop",
                    text: "太棒了！第二枚記憶碎片『生態之葉』散發著清新的綠意，重新歸位了！",
                    next: "2-4-monster"
                },
                {
                    sceneId: "2-4-monster",
                    speaker: "mud_monster",
                    text: "（遠方水面再次劇烈翻騰）嘿嘿嘿！你們以為撿撿垃圾我就會消失嗎？瓦磘溝底下還有你們人類幾十年來偷偷排進來的陳年黑泥！只要大家繼續不注意生活排污，我隨時會變得像小山一樣大！",
                    nextChapter: "ch3"
                }
            ]
        },

        // ==========================================
        // 第三章：醜泥怪的秘密
        // ==========================================
        {
            id: "ch3",
            number: "第三章",
            title: "醜泥怪的秘密",
            duration: "約 7–9 分鐘",
            mission: "直面四種污染來源，在生活中做出守護選擇，找回【守護之水】！",
            bgClass: "bg-ch3",
            rewardFragment: "protection_water",
            scenes: [
                {
                    sceneId: "3-1",
                    name: "醜泥怪完全現身",
                    speaker: "mud_monster",
                    text: "嘿嘿嘿！看看我的全身！塑膠杯、廢油泥、臭水溝黑水全都是我的盔甲！這可是你們人類每天『送』給我的禮物呢！",
                    next: "3-1-grandpa"
                },
                {
                    sceneId: "3-1-grandpa",
                    speaker: "river_grandpa",
                    text: "孩子，醜泥怪並不是天生的壞蛋。牠身上的髒東西，其實全都是人類日常生活中不經意製造出來的污染。要解開這個死結，我們必須先看清污染的四大來源！",
                    next: "3-2-cards"
                },
                {
                    sceneId: "3-2-cards",
                    name: "醜泥怪的垃圾倉庫：認識四大污染",
                    speaker: "mud_monster",
                    text: "來呀！打開我的四個秘密寶盒，看看你認不認識供養我的這些『黑能量』！",
                    interaction: {
                        type: "knowledge_cards",
                        instruction: "點擊翻開 4 張污染知識卡，了解生活污染的類型與影響：",
                        cards: [
                            {
                                id: "card1",
                                title: "一、固體廢棄物（塑膠與雜物）",
                                icon: "🛍️",
                                badge: "看得見的垃圾",
                                source: "未妥善丟棄的塑膠袋、保麗龍、飲料杯瓶、廢棄輪胎與家具。",
                                impact: "阻塞河川排水防汛斷面，容易在暴雨時引發淹水；鳥類與水生動物誤食可能死亡。"
                            },
                            {
                                id: "card2",
                                title: "二、有機廢水（生活污水）",
                                icon: "🚿",
                                badge: "家庭排污主力",
                                source: "未經污水下水道處理的洗澡水、洗衣水、廚房洗碗水、馬桶水。",
                                impact: "富含有機物，在河裡被細菌分解時會劇烈消耗水中的溶氧，導致魚蝦窒息、河水黑臭！"
                            },
                            {
                                id: "card3",
                                title: "三、工業與化學廢液",
                                icon: "🧪",
                                badge: "致命毒素隱患",
                                source: "工廠偷偷偷排的酸鹼廢水、重金屬廢水，或過量使用的農藥殺蟲劑。",
                                impact: "毒害水生動植物，破壞食物鏈，重金屬還可能沉積在底泥中長達數十年之久。"
                            },
                            {
                                id: "card4",
                                title: "四、優養化（營養物質過量）",
                                icon: "🫧",
                                badge: "河川隱形窒息",
                                source: "含有高量磷酸鹽的清潔劑、洗碗精，以及過度施用的肥料隨雨水流失。",
                                impact: "水中的氮與磷超標，刺激藻類瘋狂暴增。當藻類死亡腐爛時，會抽乾河川氧氣，水質發臭。"
                            }
                        ]
                    },
                    next: "3-3-crisis"
                },
                {
                    sceneId: "3-3-crisis",
                    name: "河川危機行動挑戰",
                    speaker: "river_grandpa",
                    text: "知道污染還不夠，守護者必須在生活中做出正確的決定！面對以下四種日常危機，你會怎麼做？",
                    interaction: {
                        type: "crisis_scenarios",
                        scenarios: [
                            {
                                id: "crisis1",
                                title: "情境一：河堤上被風吹動的塑膠袋",
                                imageIcon: "💨🛍️",
                                situation: "你在瓦磘溝步道散步時，看見一個塑膠袋快要被強風吹落河道中，此時你應該？",
                                options: [
                                    { text: "在確認自身安全的前提下，快步撿起並投入分類垃圾桶", correct: true },
                                    { text: "不管它，反正那又不是我丟的", correct: false },
                                    { text: "使出無影腳，直接把它踢進河裡加速它漂走", correct: false }
                                ],
                                explainCorrect: "守護環境需要大家主動多走一步！安全第一，及時阻止垃圾落水！",
                                explainHint: "千萬別讓它掉進河裡！想想如果每個人都說『不是我丟的』，河川會變成什麼樣子？"
                            },
                            {
                                id: "crisis2",
                                title: "情境二：廚房炸完食物的剩餘廢食用油",
                                imageIcon: "🍳🛢️",
                                situation: "家裡炸完雞塊剩下半鍋廢食用油，最恰當的處理方式是？",
                                options: [
                                    { text: "用廢紙或舊衣物吸附，或裝瓶交給清潔隊回收，絕不倒水槽", correct: true },
                                    { text: "直接往廚房水槽倒，反正開熱水沖一下就不見了", correct: false },
                                    { text: "偷偷拿到陽台倒進排水孔直接排入雨水溝", correct: false }
                                ],
                                explainCorrect: "答對了！油污會附著在水管凝結成油脂塊造成堵塞，排入河川更會覆蓋水面窒息生物！",
                                explainHint: "油絕對不能直接倒進水槽或排水溝喔！油水不相容，會凝固堵塞並污染河流！"
                            },
                            {
                                id: "crisis3",
                                title: "情境三：家庭生活清洗與排污",
                                imageIcon: "🧼🏠",
                                situation: "想減少家裡廢水對瓦磘溝的負擔，家人可以怎麼做？",
                                options: [
                                    { text: "配合政府接管『污水下水道』，並優先選用環保無磷洗劑", correct: true },
                                    { text: "把洗地水整桶潑到馬路雨水側溝去", correct: false },
                                    { text: "洗碗時清潔劑加越濃越好，洗完直接灌進河裡", correct: false }
                                ],
                                explainCorrect: "非常棒！污水下水道能將髒水送到處理廠淨化，使用環保洗劑更能減少優養化！",
                                explainHint: "雨水溝會直接流進河川，所以生活污水必須由污水專用管線送去淨化！"
                            },
                            {
                                id: "crisis4",
                                title: "情境四：河岸草叢發現不明彩色刺鼻液體",
                                imageIcon: "⚠️🧪",
                                situation: "你在水岸隱蔽處看到有人排放冒泡發臭的不明彩色化學液體，你應該？",
                                options: [
                                    { text: "不要碰觸也不要靠近聞，記下位置請家長或老師協助撥打 1999 通報環保局", correct: true },
                                    { text: "拿手去摸摸看溫熱不溫熱，甚至嚐嚐看味道", correct: false },
                                    { text: "拿隨身水壺裝滿帶回家當實驗水", correct: false }
                                ],
                                explainCorrect: "沒錯！保護環境的第一原則就是確保自身安全，透過公權力通報是最好的方法！",
                                explainHint: "不明化學物質可能具有腐蝕性或毒性，千萬不能自己觸碰，應立即通報大人！"
                            }
                        ]
                    },
                    next: "3-4-monster-heart"
                },
                {
                    sceneId: "3-4-monster-heart",
                    name: "醜泥怪的心聲",
                    speaker: "mud_monster",
                    text: "（突然停下了動作，身上的垃圾一片一片掉落，露出委屈的眼神）等等……為什麼你們要把我身上的東西拿走？如果沒有這些垃圾……我就什麼都沒有了啊……那我到底為什麼會在這裡？",
                    next: "3-4-grandpa-teach"
                },
                {
                    sceneId: "3-4-grandpa-teach",
                    speaker: "river_grandpa",
                    text: "醜泥怪，你並不是天生就存在的怪獸。你是因為幾十年來，人們圖方便、隨意倒油、隨手扔塑膠、排放未經處理的黑水，一點一滴累積出來的痕跡。你不是罪人，你是河川生病時發出的警訊啊。",
                    next: "3-4-egret-comfort"
                },
                {
                    sceneId: "3-4-egret-comfort",
                    speaker: "egret",
                    text: "對啊！如果大家都不再亂丟垃圾、把污水好好處理，你就可以卸下身上沉重臭氣熏天的包袱，和我們一起在河邊快樂吹微風了！",
                    next: "3-5-water"
                },
                {
                    sceneId: "3-5-water",
                    name: "守護之水誕生",
                    speaker: "narrator",
                    text: "醜泥怪感動得流下了一滴藍色淚滴。淚滴化作一顆晶瑩透亮的藍色寶石——第三枚碎片『守護之水』終於誕生了！",
                    next: "3-5-last-question"
                },
                {
                    sceneId: "3-5-last-question",
                    speaker: "river_grandpa",
                    text: "在取得守護之水前，河爺爺想問你最後一個關鍵問題：如果明天在學校或河邊，你看到同學不小心把飲料杯掉在地上，你會怎麼做？",
                    interaction: {
                        type: "choice",
                        prompt: "你的行動是：",
                        options: [
                            {
                                text: "我會友善提醒他，並和他一起把杯子撿起來投入回收桶！",
                                responseSpeaker: "river_grandpa",
                                responseText: "太令人欣慰了！這就是守護河川最真實、最有感染力的力量！"
                            },
                            {
                                text: "我自己絕對不亂丟，並用行動默默把它撿起來！",
                                responseSpeaker: "water_drop",
                                responseText: "以身作則的小小舉動，正是在瓦磘溝泛起的一圈圈善意漣漪！"
                            }
                        ]
                    },
                    nextChapter: "ch4"
                }
            ]
        },

        // ==========================================
        // 終章：河流重新說話了
        // ==========================================
        {
            id: "ch4",
            number: "終章",
            title: "河流重新說話了",
            duration: "約 2–3 分鐘",
            mission: "三枚碎片合一，承諾守護瓦磘溝，領取小小守護者榮譽勳章！",
            bgClass: "bg-ch4",
            scenes: [
                {
                    sceneId: "4-1",
                    name: "三枚記憶碎片合一",
                    speaker: "narrator",
                    text: "你將【歷史之石】、【生態之葉】與【守護之水】三枚記憶碎片輕輕放置在河爺爺的水草手杖上。剎那間，一道宛如彩虹般的溫暖光瀑沖天而起，籠罩整條瓦磘溝！",
                    next: "4-1-grandpa"
                },
                {
                    sceneId: "4-1-grandpa",
                    speaker: "river_grandpa",
                    text: "你看！河水在陽光下泛起鑽石般的光澤！記憶之流重新甦醒了！我們找回了瓦磘溝的水路歷史，看見了多樣動植物夥伴，更學會了如何在日常中杜絕污染！",
                    next: "4-2-clean-monster"
                },
                {
                    sceneId: "4-2-clean-monster",
                    name: "醜泥怪的新使命",
                    speaker: "mud_monster",
                    text: "（身上的黑泥與垃圾完全褪去，變成一隻乾淨圓滾滾、頭頂長出嫩綠小草芽的可愛泥土精靈）哇！我變乾淨了！身體變得好輕盈！我以後不想再吃垃圾了，我可以當瓦磘溝的『河川巡邏提醒員』嗎？",
                    next: "4-2-egret"
                },
                {
                    sceneId: "4-2-egret",
                    speaker: "egret",
                    text: "太歡迎你了！以後如果有人不小心忘了拿走水壺或垃圾，你就要跳出來提醒大家喔！",
                    next: "4-3-pledge"
                },
                {
                    sceneId: "4-3-pledge",
                    name: "瓦磘溝守護承諾卡",
                    speaker: "water_drop",
                    text: "河流會記得每一件發生過的事情。每一位生活在這裡的人，都能成為守護河川的力量。孩子，你願意簽署這份守護承諾，成為瓦磘溝正式的小小守護者嗎？",
                    interaction: {
                        type: "pledge_certificate",
                        prompt: "請輸入你的守護者姓名，並勾選你在生活中願意實踐的承諾：",
                        defaultPromises: [
                            "我絕不在河岸隨意丟棄垃圾，看到垃圾在安全情況下主動撿起",
                            "我不把廚餘廢油直接倒進水槽或排水溝，妥善回收處理",
                            "在河岸用雙眼欣賞小白鷺、翠鳥與花草，不追逐打擾野生動物",
                            "主動跟家人朋友分享瓦磘溝的故事，一起關心家鄉的水環境"
                        ]
                    },
                    next: "4-end"
                },
                {
                    sceneId: "4-end",
                    name: "榮譽受獎",
                    speaker: "narrator",
                    text: "恭喜你！你已經正式成為《瓦磘溝小小守護者》！三枚記憶碎片已深植於你的心中，帶著這份承諾，讓我們一起守護台灣每一條美麗的河川！",
                    isGameCompleted: true
                }
            ]
        }
    ]
};
