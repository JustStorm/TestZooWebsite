/*


const CACHE_NAME = 'pwa-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/form.html',
  '/aboutpage.html',
  '/cats.html',
  '/dogs.html',
  '/css/style.css',
  '/img/home.png',
  '/img/cat1.jpeg',
  '/img/cat2.jpg',
  '/img/cat3.jpg',
  '/img/call.png'
];

// Установка и кеширование ресурсов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(URLS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Активация и удаление устаревших кешей
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Обработка fetch с приоритетом кеша
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Если есть в кэше, возвращаем оттуда
      if (cachedResponse) {
        return cachedResponse;
      }
      // Если нет — делаем запрос в сеть
      return fetch(event.request).then((networkResponse) => {
        // Сохраняем полученный ответ в кэш на будущее
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // В случае ошибки — можно вернуть offline-страницу, если добавить её в cache
      });
    })
  );
});

// Удаление service worker (вручную через консоль)
self.addEventListener('message', (event) => {
  if (event.data === 'unregister') {
    self.registration.unregister().then(() => {
      return self.clients.matchAll();
    }).then((clients) => {
      clients.forEach(client => client.navigate(client.url));
    });
  }
});
*/


/*
const staticCacheName = 'mezhov-zoomag-praktika'

const assetUrls = [
	'/',
	'index.html',
	'service-worker.js',
	'css/style.css'
]

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(staticCacheName).then(cache => cache.addAll(assetUrls)
	));
	console.log('service-worker installing!');
})

self.addEventListener('activate', event => {
	console.log('service-worker activating!');
})

self.addEventListener('fetch', event => {
	console.log('Fetching!,event.request');
	event.respondWith(cacheFirst(event.request));
})

async function cacheFirst(request) {
	const cached = await caches.match(request)
	return cached ?? await fetch(request)
}
*/




const staticCacheName = 'mezhov-zoomag-v1';

const assetUrls = [
  'index.html',
  '/',
  'service-worker.js',
  'css/style.css',
  'img/home.png',
  'img/cat1.jpeg',
  'img/cat2.jpg',
  'img/cat3.jpg',
  'img/call.png',
  'img/form.png',
  'form.html',
  'aboutpage.html'
];

self.addEventListener('install', event => {
  console.log('Trying to install!')
  event.waitUntil(
    caches.open(staticCacheName).then(cache =>
      Promise.all(assetUrls.map(url =>
        fetch(url)
          .then(response => {
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            return cache.put(url, response.clone());
          })
          .catch(err => console.warn(`Не удалось закэшировать ${url}: ${err.message}`))
      ))
    )
  );
  console.log('[SW] Установлен');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== staticCacheName)
            .map(key => caches.delete(key))
      )
    )
  );
  console.log('[SW] Активирован');
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(cacheFirst(event.request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached ?? fetch(request);
}
