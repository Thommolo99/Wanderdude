const CACHE_NAME = 'SAW-Cache-v1';
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    'icons/icon-192x192.png',
    'icons/icon-256x256.png',
    'icons/icon-384x384.png',
    'icons/icon-512x512.png',
    'dist/WADE_icon.png',
    'vite.svg',
    'src/main.ts',
    'src/app.css',
    'src/firebaseConf.ts',
    'src/Post.svelte',
    'src/store.ts',
    'src/App.svelte',
    'src/LoginForm.svelte',
    'src/AddForm.svelte',
    'src/loginStore.ts',
    '/offline.html',
    '/manifest.webmanifest',
    '/service-worker.js',
    '/vite.config.ts',
    '/svelte.config.js'
];

self.addEventListener('install', event => {
    console.log('Service Worker installing.');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_CACHE_URLS))
    );
});

self.addEventListener('fetch', event => {
    console.log('fetching', event.request.url);
    if (event.request.url.includes('/api/v1/posts')) {
        event.respondWith(caches.match(event.request));
        event.waitUntil(updateCache(event.request).then(notifyClients));
    } else {

        event.respondWith(
            caches.match(event.request).then(cached => {
                return cached || fetch(event.request).catch(() => {
                    if (event.request.mode === 'navigate') {
                        return caches.match('/offline.html');
                    }
                });
            })
        );
    }
});

function updateCache(request) {
    if (request.method !== 'GET') {
        console.log('Non si può mettere in cache la richiesta con metodo:', request.method);
        return Promise.resolve();
    }else{
        if (!response || response.status !== 200 || response.type !== 'basic') {
            console.log('Response not valid for caching:', response);
            return response;
        }
        console.log('updating cache')
        return fetch(request.url).then(
           response =>
           caches.open(CACHE_NAME)
                 .then(cache => cache.put(request, response.clone()))
                 .then(() => response)
        );

    }
    
}

function refresh(response) {
    return response
        .json()
        .then(resp => {
            self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage(
                        JSON.stringify({
                            type: response.url,
                            data: resp.data
                        })
                    );
                });
            });
            return resp.data;
        });
}

self.addEventListener('activate', event => {
    console.log('Service Worker activating.');
    event.waitUntil(
        caches
            .keys()
            .then(keys => keys.filter(key => key !== CACHE_NAME))
            .then(keys => Promise.all(keys.map(key => caches.delete(key))))
    );
});
