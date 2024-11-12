const CACHE_NAME = 'SAW-Cache-v0';
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    'icons/icon-192x192.png',
    'icons/icon-256x256.png',
    'icons/icon-384x384.png',
    'icons/icon-512x512.png',
    '/WADE_icon.png',
    '/WADE_logo.gif',
    'src/main.ts',
    'src/app.css',
    'src/firebaseConf.ts',
    'src/Post.svelte',
    'src/store.ts',
    'src/App.svelte',
    'src/AddForm.svelte',
    'src/LoginForm.svelte',
    'src/loginStore.ts',
    'src/Toolbar.svelte',
    'src/Profile.svelte',
    'src/NewProfile.svelte',
    'src/vite-env.d.ts',
    '/offline.html',
    '/manifest.webmanifest',
    '/service-worker.js',
    '/vite.config.ts',
    '/svelte.config.js',
    'tsconfig.json',
    'tsconfig.node.json',
    'logo.svg',

    'dist/logo.svg',
    'dist/offline.html',
    'dist/WADE_icon.png',
    'dist/WADE_logo.gif',
    'dist/manifest.webmanifest',
    'dist/registerSW.js',
    'dist/service-worker.js',
    'dist/icons/icon-192x192.png',
    'dist/icons/icon-256x256.png',
    'dist/icons/icon-384x384.png',
    'dist/icons/icon-512x512.png',
    '/@vite/client',  
    '/src/App.svelte?svelte&type=style&lang.css',
    '/node_modules/vite/dist/client/env.mjs',
    '/src/Post.svelte?svelte&type=style&lang.css',
    '/src/AddForm.svelte?svelte&type=style&lang.css',
    'src/Toolbar.svelte?svelte&type=style&lang.css',
    'src/LoginForm.svelte?svelte&type=style&lang.css',
    'src/Profile.svelte?svelte&type=style&lang.css',
    'src/NewProfile.svelte?svelte&type=style&lang.css',
];

self.addEventListener('install', event => {
    console.log('Service Worker installing.');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_CACHE_URLS))
    );
});

self.addEventListener('fetch', event => {
    console.log('fetching', event.request.url, 'mode:', event.request.mode);
    if (event.request.url.includes('/api/v0/posts')) {
        event.respondWith(
            caches.match(event.request)
                .then(cachedResponse => {
                    console.log('Serving from cache (includes api v0):', event.request.url);
                    return cachedResponse || fetch(event.request).catch(() => {
                        return new Response('{"error": "Offline mode, unable to fetch posts."}', {
                            headers: { 'Content-Type': 'application/json' }
                        });
                    });
                })
        );
        event.waitUntil(updateCache(event.request).then(notifyClients));
    } else {
        event.respondWith(
            caches.match(event.request)
                .then(cachedResponse => {
                    return cachedResponse || fetch(event.request);
                })
                .catch(() => {
                    console.log('Fetch failed for:', event.request.url);
                    if (event.request.mode === 'navigate') {
                        console.log('Offline: Serving fallback page.');
                        return caches.match('/offline.html');
                    }
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
            .then(() => {
                console.log('activated'); 
            })
    );
});

