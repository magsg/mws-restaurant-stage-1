let cacheName = 'restaurant-v2';

self.addEventListener('install', function(event) {
  console.log("[ServiceWorker] installed");
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log("[ServiceWorker] caching files");
      return cache.addAll([
        '/',
        '/js/main.js',
        '/js/restaurant_info.js',
        '/js/dbhelper.js',
        '/restaurant.html',
        '/index.html',
        '/css/styles.css',
        '/data/restaurants.json',
        '/img/1.jpg',
        '/img/2.jpg',
        '/img/3.jpg',
        '/img/4.jpg',
        '/img/5.jpg',
        '/img/6.jpg',
        '/img/7.jpg',
        '/img/8.jpg',
        '/img/9.jpg',
        '/img/10.jpg'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log("[ServiceWorker] active");
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(thisCache) {
          return thisCache.startsWith('restaurant-') &&
                 thisCache != cacheName;
        }).map(function(thisCache) {
          return caches.delete(thisCache);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  // console.log('Handling fetch event for', event.request.url);


  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request).then(function(getResponse) {
        return caches.open(cacheName).then(function(cache) {
          cache.put(event.request, getResponse.clone());
          return getResponse;
        });
      })

      }).catch(function(error) {

        // Handles exceptions that arise from match() or fetch().
        console.error('Error in fetch handler:', error);

        return new Response ("No connection");
      })
    );
  });
