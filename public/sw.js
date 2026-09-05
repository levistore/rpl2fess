// RPLTwoFess — Progressive Web App Service Worker
// "Satu Kelas. Banyak Cerita."

// Install event — immediately take over
self.addEventListener('install', () => {
  self.skipWaiting();
});

// Activate event — claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload = {
    title: 'Pesan Baru',
    body: 'Ada pesan anonim baru di RPLTwoFess.',
    url: '/dashboard/inbox',
  };

  try {
    payload = { ...payload, ...event.data.json() };
  } catch {
    const text = event.data.text();
    if (text) {
      payload.body = text;
    }
  }

  const notificationOptions = {
    body: payload.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: {
      url: payload.url || '/dashboard/inbox',
      timestamp: Date.now(),
    },
    tag: 'rpltwofess-inbox-message',
    renotify: true,
    vibrate: [100, 50, 100],
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, notificationOptions)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl =
    (event.notification.data && event.notification.data.url) ||
    '/dashboard/inbox';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If there's an existing open client on the dashboard or app, focus and navigate it
        for (const client of clientList) {
          if ('focus' in client) {
            if (client.url.includes('/dashboard')) {
              client.navigate(targetUrl);
              return client.focus();
            }
          }
        }
        // Otherwise open a new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
