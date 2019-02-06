
const { revision } = self.__precacheManifest.find(({ url }) => /index\.html/.test(url));
workbox.precaching.precacheAndRoute(self.__precacheManifest.concat([{ revision, url: '/'}]));
workbox.routing.registerRoute(
    new RegExp('.*\.mp3'),
    workbox.strategies.cacheFirst(),
);
workbox.routing.registerRoute(
    new RegExp('/api/'),
    workbox.strategies.networkFirst(),
);