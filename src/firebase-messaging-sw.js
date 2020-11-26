const firebaseConfig = {
  apiKey: "<apiKey>",
    authDomain: "<authDomain>",
    databaseURL: "<databaseURL>",
    projectId: "<projectId>",
    storageBucket: "<storageBucket>",
    messagingSenderId: "<messagingSenderId>",
    appId: "<appId>"
};
importScripts('https://www.gstatic.com/firebasejs/7.12.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.12.0/firebase-messaging.js');
  firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
  
messaging.setBackgroundMessageHandler(function (payload) {
  // const lang = localStorage.getItem('lang'); read saved lang
  // console.log('lang', lang);
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: './assets/icons/icon-512x512.png',
    badge: '/assets/icons/icon-128x128.png',
    image: './assets/icons/icon-512x512.png',
    //dir: 'rtl',
    sound: '/assets/sounds/notification.mp3',
    vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500],
    tag: 'renotify',
    renotify: true,
    requireInteraction: true
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});

self.addEventListener('notificationclick', event => {
  const rootUrl = new URL('/', location).href;
  event.notification.close();
  // Enumerate windows, and call window.focus(), or open a new one.
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(matchedClients => {
      for (let client of matchedClients) {
        if (client.url === rootUrl) {
          return client.focus();
        }
      }
      return clients.openWindow(rootUrl);
    })
  );
});