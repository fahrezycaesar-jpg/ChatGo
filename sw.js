// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAt3cwXZtgkeiD0B3yJy1DOXKtlte1oiIM",
  authDomain: "chatgo-f4a66.firebaseapp.com",
  projectId: "chatgo-f4a66",
  storageBucket: "chatgo-f4a66.firebasestorage.app",
  messagingSenderId: "539633388986",
  appId: "1:539633388986:web:7517fa6642057a05a92183"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Pesan background diterima: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || 'https://ui-avatars.com/api/?name=CG&background=0fa585&color=fff',
    data: { chatId: payload.data.chatId }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const chatId = event.notification.data.chatId;
  if (chatId) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(windowClients => {
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url.includes('index.html') && 'focus' in client) {
            client.postMessage({ action: 'openChat', chatId: chatId });
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/?openChat=' + chatId);
        }
      })
    );
  }
});
