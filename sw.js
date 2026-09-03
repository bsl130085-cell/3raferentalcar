const CACHE='3rafe-v2';
const CORE=['/','/index.html','/manifest.webmanifest','/icon-192.png','/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).catch(()=>{}));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const request=e.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin||request.destination==='video'||request.headers.has('range'))return;
  if(request.mode==='navigate'){
    e.respondWith(fetch(request).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put('/index.html',response.clone())).catch(()=>{});return response}).catch(()=>caches.match('/index.html')));
    return;
  }
  e.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok&&['image','style','script','font','manifest'].includes(request.destination))caches.open(CACHE).then(cache=>cache.put(request,response.clone())).catch(()=>{});return response})));
});
