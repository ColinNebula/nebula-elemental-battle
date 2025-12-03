/* eslint-disable no-restricted-globals */

// Elemental Battle - Enhanced PWA Service Worker
// Version 2.1.0

const CACHE_VERSION = 'v2.1.0';
const STATIC_CACHE = `elemental-battle-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `elemental-battle-dynamic-${CACHE_VERSION}`;
const AUDIO_CACHE = `elemental-battle-audio-${CACHE_VERSION}`;
const IMAGE_CACHE = `elemental-battle-images-${CACHE_VERSION}`;

// Static assets to cache on install (app shell)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/offline.html'
];

// Audio files to cache (lazy loaded)
const AUDIO_PATTERNS = [
  /\.mp3$/,
  /\.wav$/,
  /\.ogg$/,
  /\/audio\//
];

// Image patterns for caching
const IMAGE_PATTERNS = [
  /\.png$/,
  /\.jpg$/,
  /\.jpeg$/,
  /\.gif$/,
  /\.webp$/,
  /\.svg$/
];

// API endpoints that should use network-first strategy
const API_PATTERNS = [
  /\/api\//,
  /github\.io/
];

// ============================================================================
// INSTALL EVENT - Cache static assets
// ============================================================================
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => {
          return new Request(url, { cache: 'reload' });
        })).catch(err => {
          console.warn('Some assets failed to cache:', err);
          // Continue installation even if some assets fail
          return Promise.resolve();
        });
      })
      .then(() => {
        console.log('✅ Service Worker: Installed');
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
  );
});

// ============================================================================
// ACTIVATE EVENT - Clean up old caches
// ============================================================================
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, AUDIO_CACHE, IMAGE_CACHE];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activated');
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// ============================================================================
// FETCH EVENT - Smart caching strategies
// ============================================================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) return;
  
  // Skip cross-origin requests except for CDNs we trust
  const trustedOrigins = [
    self.location.origin,
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  
  if (!trustedOrigins.some(origin => url.href.startsWith(origin))) {
    return;
  }

  // Determine caching strategy based on request type
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isAudioAsset(url)) {
    event.respondWith(cacheFirst(request, AUDIO_CACHE));
  } else if (isImageAsset(url)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
  } else if (isAPIRequest(url)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  } else {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
  }
});

// ============================================================================
// CACHING STRATEGIES
// ============================================================================

// Cache First - For static assets that rarely change
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    throw error;
  }
}

// Network First - For API calls and dynamic content
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale While Revalidate - Best for most content
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// ============================================================================
// URL PATTERN MATCHERS
// ============================================================================

function isStaticAsset(url) {
  const staticExtensions = ['.js', '.css', '.woff', '.woff2', '.ttf'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext)) ||
         url.pathname === '/' ||
         url.pathname.endsWith('.html');
}

function isAudioAsset(url) {
  return AUDIO_PATTERNS.some(pattern => pattern.test(url.pathname));
}

function isImageAsset(url) {
  return IMAGE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

function isAPIRequest(url) {
  return API_PATTERNS.some(pattern => pattern.test(url.href));
}

// ============================================================================
// BACKGROUND SYNC - Queue failed requests for retry
// ============================================================================
self.addEventListener('sync', (event) => {
  console.log('🔄 Background Sync:', event.tag);
  
  if (event.tag === 'sync-game-data') {
    event.waitUntil(syncGameData());
  }
});

async function syncGameData() {
  try {
    // Get pending data from IndexedDB
    const pendingData = await getPendingGameData();
    
    for (const data of pendingData) {
      try {
        // Attempt to sync each piece of data
        console.log('📤 Syncing:', data.type);
        await syncDataItem(data);
        await removePendingData(data.id);
      } catch (error) {
        console.warn('Failed to sync item:', data.id, error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Placeholder functions for IndexedDB operations
async function getPendingGameData() {
  // Would retrieve pending sync items from IndexedDB
  return [];
}

async function syncDataItem(data) {
  // Would sync data to server
  return Promise.resolve();
}

async function removePendingData(id) {
  // Would remove synced item from pending queue
  return Promise.resolve();
}

// ============================================================================
// PUSH NOTIFICATIONS
// ============================================================================
self.addEventListener('push', (event) => {
  console.log('📨 Push received:', event);
  
  let data = {
    title: 'Elemental Battle',
    body: 'You have a new notification!',
    icon: '/logo192.png',
    badge: '/logo96.png',
    tag: 'elemental-battle-notification'
  };
  
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      tag: data.tag,
      vibrate: [100, 50, 100],
      data: data.data || {},
      actions: data.actions || [
        { action: 'play', title: '⚔️ Play Now' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ Notification clicked:', event.action);
  event.notification.close();
  
  if (event.action === 'play' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Focus existing window if available
          for (const client of clientList) {
            if (client.url.includes('nebula-elemental-battle') && 'focus' in client) {
              return client.focus();
            }
          }
          // Open new window if no existing window found
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  }
});

// ============================================================================
// MESSAGE HANDLING - Communication with app
// ============================================================================
self.addEventListener('message', (event) => {
  console.log('📩 Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => cache.addAll(event.data.urls))
    );
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((names) => {
        return Promise.all(names.map((name) => caches.delete(name)));
      })
    );
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});

// ============================================================================
// PERIODIC BACKGROUND SYNC (for browsers that support it)
// ============================================================================
self.addEventListener('periodicsync', (event) => {
  console.log('⏰ Periodic sync:', event.tag);
  
  if (event.tag === 'daily-quest-check') {
    event.waitUntil(checkDailyQuests());
  }
});

async function checkDailyQuests() {
  try {
    // Check if daily quests have reset
    const lastCheck = await getLastQuestCheck();
    const now = new Date();
    
    if (isNewDay(lastCheck, now)) {
      // Notify user about new daily quests
      await self.registration.showNotification('🎯 Daily Quests Reset!', {
        body: 'New challenges await! Complete them for rewards.',
        icon: '/logo192.png',
        badge: '/logo96.png',
        tag: 'daily-quests',
        actions: [
          { action: 'view', title: 'View Quests' }
        ]
      });
    }
  } catch (error) {
    console.error('Daily quest check failed:', error);
  }
}

async function getLastQuestCheck() {
  // Would retrieve from IndexedDB
  return null;
}

function isNewDay(last, current) {
  if (!last) return true;
  const lastDate = new Date(last);
  return lastDate.toDateString() !== current.toDateString();
}

console.log('🎮 Elemental Battle Service Worker loaded');
