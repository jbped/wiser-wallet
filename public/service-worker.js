const APP_PREFIX = "Wiser_Wallet-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION
// const DATA_CACHE_NAME = "Data-" + APP_PREFIX + VERSION

const FILES_TO_CACHE = [
  "/",
  "./index.html",
  "./manifest.json",
  "./js/idb.js",
  "./js/index.js",
  "./css/styles.css",
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png'
];

// // // Respond with cached resources
// // self.addEventListener('fetch', function (e) {
// //     e.respondWith(
// //         caches.match(e.request).then(function (request) {
// //             if (request) { // if cache is available, respond with cache
// //                 console.log('responding with cache : ' + e.request.url)
// //                 return request
// //             } else {       // if there are no cache, try fetching request
// //                 console.log('file is not cached, fetching : ' + e.request.url)
// //                 return fetch(e.request)
// //             }
// //         })
// //     )
// // })

// // Install Service Worker
// self.addEventListener("install", function (e) {
//     e.waitUntil(
//         caches.open(CACHE_NAME).then(function (cache) {
//             console.log(`Installing cache: ${CACHE_NAME}`)
//             return cache.addAll(FILES_TO_CACHE)
//         })
//     )
//     self.skipWaiting();
// });

// // Activate Service Worker
// self.addEventListener("activate", function (e) {
//     e.waitUntil(
//         caches.keys().then(function (keyList) {
//             let cacheKeepList = keyList.filter(function (key) {
//                 return key.indexOf(APP_PREFIX)
//             })
//             cacheKeepList.push(CACHE_NAME)

//             return Promise.all(keyList.map(function (key, i) {
//                 if (cacheKeepList.indexOf(key) === -1) {
//                     console.log(`Deleting cache: ${keyList[i]}`);
//                     return caches.delete(keyList[i])
//                 }
//             }))
//         })
//     )
// });

// // Fetch Interrupt With Service Worker
// self.addEventListener("fetch", function (e) {
//     // if requested url includes /api (api fetch request)
//     if (e.request.url.includes("/api")) {
//         // console.log(caches)
//         // Intercept and respond with
//         e.respondWith(
//             caches
//                 // open the api cache
//                 .open(CACHE_NAME)
//                 .then(cache => {
//                     // console.log(cache)
//                     return fetch(e.request)
//                         .then(response => {
//                             // Good Fetch response, clone response and put it in the cache object, the key is the url
//                             if (response.status === 200) {
//                                 cache.put(e.request.url, response.clone())
//                             }
//                             return response;
//                         })
//                         .catch(err => {
//                             return cache.match(e.request);
//                         });
//                 })
//                 .catch(err => console.log(err))
//         );
//         return;
//     }
//     e.respondWith(
//         fetch(e.request).catch(function () {
//             return caches.match(e.request).then(function (response) {
//                 if (response) {
//                     return response;
//                 } else if (e.request.headers.get("accept").includes("text/html")) {
//                     return caches.match("/");
//                 }
//             });
//         })
//     );
// })



// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(FILES_TO_CACHE)
    })
  )
})

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      let cacheKeepList = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      cacheKeepList.push(CACHE_NAME)

      return Promise.all(keyList.map(function (key, i) {
        if (cacheKeepList.indexOf(key) === -1) {
          // console.log(`Deleting cache: ${keyList[i]}`);
          return caches.delete(keyList[i])
        }
      }))
    })
  )
});

self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        // console.log(`Responding with cache: ${e.request.url}`)
        return request;
      } else {
        // console.log(`File is not cached, fetching: ${e.request.url}`);
        return fetch(e.request)
      }

    })
  )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create keeplist
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      })
      // add current cache name to keeplist
      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(keyList.map(function (key, i) {
        if (cacheKeeplist.indexOf(key) === -1) {
          // console.log('deleting cache : ' + keyList[i]);
          return caches.delete(keyList[i]);
        }
      }));
    })
  );
});