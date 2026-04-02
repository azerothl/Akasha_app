/* Akasha — Plugins catalog (loads JSON from Akasha_plugins via jsDelivr) */
(function () {
  const PRIMARY =
    'https://cdn.jsdelivr.net/gh/azerothl/Akasha_plugins@main/plugins.json';
  const FALLBACK =
    'https://raw.githubusercontent.com/azerothl/Akasha_plugins/main/plugins.json';

  const metaEl = document.getElementById('plugins-meta');
  const statusEl = document.getElementById('plugins-status');
  const gridEl = document.getElementById('plugins-grid');

  function esc(s) {
    if (s == null) return '';
    const d = document.createElement('div');
    d.textContent = String(s);
    return d.innerHTML;
  }

  function setStatus(msg, isError) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = isError ? 'plugins-status plugins-status-error' : 'plugins-status';
  }

  async function loadJson(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  }

  async function loadCatalog() {
    try {
      return await loadJson(PRIMARY);
    } catch (e) {
      setStatus('Primary catalog URL failed, trying mirror…', false);
      return await loadJson(FALLBACK);
    }
  }

  function sourceLink(path) {
    if (!path) return '';
    const base = 'https://github.com/azerothl/Akasha_plugins/tree/main/';
    return `<a href="${esc(base + path)}" target="_blank" rel="noopener">Source on GitHub</a>`;
  }

  function render(data) {
    const plugins = data.plugins || [];
    const count = data.count != null ? data.count : plugins.length;
    if (metaEl) {
      metaEl.innerHTML = `${esc(count)} plugin(s) in catalog · generated <time datetime="${esc(data.generated_at || '')}">${esc(data.generated_at || '')}</time> · data from <a href="https://github.com/azerothl/Akasha_plugins" target="_blank" rel="noopener">Akasha_plugins</a> (<code>main</code>)`;
    }
    setStatus('', false);
    if (!gridEl) return;

    gridEl.innerHTML = '';
    plugins.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'card reveal';
      const tags = (p.tags || [])
        .map((t) => `<span class="plugin-tag">${esc(t)}</span>`)
        .join('');
      const perms = (p.permissions || []).length
        ? `<p class="plugin-line"><strong>Permissions:</strong> ${esc((p.permissions || []).join(', '))}</p>`
        : '';
      const tools = (p.entry_tools || []).join(', ') || '—';
      card.innerHTML = `
        <h3 class="plugin-title">${esc(p.name)} <span class="badge badge-purple">${esc(p.version || '')}</span></h3>
        <p class="plugin-desc">${esc(p.description || '')}</p>
        <p class="plugin-line muted"><code>${esc(p.id)}</code> · ${esc(p.category || 'n/a')}</p>
        <p class="plugin-line"><strong>Entry tools:</strong> ${esc(tools)}</p>
        ${perms}
        <div class="plugin-tags">${tags}</div>
        <p class="plugin-footer">${sourceLink(p.path)}</p>
      `;
      gridEl.appendChild(card);
    });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    gridEl.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
  }

  function showError(err) {
    setStatus('Could not load the plugin catalog. Check your connection or try again later. (' + (err && err.message ? err.message : 'error') + ')', true);
    if (metaEl) metaEl.textContent = '';
  }

  loadCatalog()
    .then(render)
    .catch(showError);
})();
