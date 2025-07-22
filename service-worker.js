
const staticCacheName = 'mezhov-zoomag-v1';
const subst = 'TestZooWebsite/'

const relativeAssetUrls = [
  'index.html',
  '/',
  'css/style.css',
  'img/home.png',
  'img/paw.png',
  'img/question.png',
  'img/cat1.jpeg',
  'img/cat2.jpg',
  'img/cat3.jpg',
  'img/dog1.jpg',
  'img/dog2.jpg',
  'img/dog3.jpg',
  'img/call.png',
  'img/form.png',
  'form.html',
  'aboutpage.html',
  'dogs.html',
  'cats.html'
];

const BASE_PATH = self.location.pathname.replace(/\/[^\/]*$/, '/');
const assetUrls = relativeAssetUrls.map(path => BASE_PATH + path);


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
