/**
 * 《瓦磘溝探索之旅》Service Worker
 * 提供靜態資產離線快取，確保戶外走讀教學無網路時仍可暢玩
 */

const CACHE_NAME = "waoyao-river-cache-v1";

// 離線快取核心檔案清單
const ASSETS_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",
    "./css/style.css",
    "./css/animations.css",
    "./js/storyData.js",
    "./js/audioManager.js",
    "./js/gameEngine.js",
    "./js/main.js",
    "./assets/images/cover.png",
    "./assets/images/player.png"
];

// 安裝事件：預先下載並快取靜態資源
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

// 啟動事件：清除舊版快取
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 攔截網路請求：快取優先策略 (Cache-First)
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        }).catch(() => {
            // 離線時 fallback 到主頁
            return caches.match("./index.html");
        })
    );
});
