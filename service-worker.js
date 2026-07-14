// ==========================================
// GOLD GUARDIAN
// Service Worker
// Version 1.0.0
// ==========================================

const CACHE_NAME = "goldguardian-v1";

const FILES = [

    "./",

    "./index.html",

    "./variables.css",

    "./layout.css",

    "./dashboard.css",

    "./config.js",

    "./guardian.js",

    "./market.js",

    "./strategy.js",

    "./structure.js",

    "./tradeplan.js",

    "./journal.js",

    "./validator.js",

    "./news.js",

    "./notifications.js",

    "./app.js",

    "./manifest.json"

];

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache => cache.addAll(FILES))

    );

    self.skipWaiting();

});

self.addEventListener("activate", event => {

    event.waitUntil(

        self.clients.claim()

    );

});

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

        .then(response => {

            return response || fetch(event.request);

        })

    );

});