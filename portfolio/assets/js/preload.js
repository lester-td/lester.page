(() => {
  const BASE = "/portfolio";
  const GALLERIES = ["featured","portraits","automotive","streets","events","film","other"];
  const EAGER_COUNT = Infinity;
  const conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
  const shouldThrottle = (conn && (conn.saveData || /^(2g|slow-2g)$/i.test(conn.effectiveType || "")));

  function fetchJSON(url) {
    return fetch(url, { cache: "no-cache" }).then(r => (r.ok ? r.json() : []));
  }

  function preloadImage(src) {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.src = src;
  }

  function preloadGallery(name, files) {
    const urls = files.map(f => `${BASE}/assets/images/${name.replace(/-/g,"/")}/${f}`);
    if (shouldThrottle) {
      urls.slice(0, 8).forEach(preloadImage);
      const lazy = () => urls.slice(8).forEach(preloadImage);
      (window.requestIdleCallback || setTimeout)(lazy, 1000);
      return;
    }
    urls.slice(0, EAGER_COUNT).forEach(preloadImage);
    if (isFinite(EAGER_COUNT)) {
      const lazy = () => urls.slice(EAGER_COUNT).forEach(preloadImage);
      (window.requestIdleCallback || setTimeout)(lazy, 500);
    }
  }

  async function preloadAll() {
    try {
      const manifests = await Promise.all(
        GALLERIES.map(g => fetchJSON(`${BASE}/assets/data/${g}.json`).then(list => [g, list]))
      );
      manifests.forEach(([g, list]) => Array.isArray(list) && preloadGallery(g, list));
      try {
        const posts = await fetchJSON(`${BASE}/assets/data/posts.json`);
        if (Array.isArray(posts)) {
          posts.forEach(p => {
            fetch(`${BASE}/assets/posts/${p.file}`, { cache: "no-cache" }).catch(() => {});
          });
        }
      } catch {}
    } catch (e) {
      console.warn("Preload failed (non-fatal):", e);
    }
  }

  window.addEventListener("load", preloadAll);
})();
