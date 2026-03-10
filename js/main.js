/* ================================================================
   Akasha – Main JavaScript
   ================================================================ */

/* ── Utility ────────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const el = (tag, cls = '', html = '') => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
};

/* ── Toast ──────────────────────────────────────────────────────── */
function toast(msg, type = 'default', duration = 3000) {
  let container = $('.toast-container');
  if (!container) {
    container = el('div', 'toast-container');
    document.body.appendChild(container);
  }
  const t = el('div', `toast ${type}`, `<span>${msg}</span>`);
  container.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(24px)'; t.style.transition = '.3s ease'; setTimeout(() => t.remove(), 350); }, duration);
}

/* ── Navbar scroll effect ───────────────────────────────────────── */
function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger menu
  const hamburger = $('.hamburger');
  const mobileMenu = $('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
    // Close on link click
    $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    }));
  }

  // Active link highlight
  const links = $$('.nav-links a, .mobile-menu a');
  const current = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) a.classList.add('active');
  });
}

/* ── Scroll reveal ──────────────────────────────────────────────── */
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  $$('.reveal').forEach(el => obs.observe(el));
}

/* ── Terminal animation (index.html) ────────────────────────────── */
function initTerminal() {
  const body = $('.terminal-body');
  if (!body) return;

  const lines = [
    { delay: 300,  html: '<span class="t-prompt">❯</span> <span class="t-cmd">akasha</span>' },
    { delay: 800,  html: '<span class="t-success">✓</span> <span class="t-out">Akasha v1.0.0 — your privacy-first assistant</span>' },
    { delay: 1200, html: '' },
    { delay: 1400, html: '<span class="t-prompt">❯</span> <span class="t-cmd">What is the weather in Paris?</span>' },
    { delay: 2000, html: '<span class="t-info">🌤  Paris, France — 18°C, Partly cloudy</span>' },
    { delay: 2200, html: '<span class="t-out">    Wind: 12 km/h NW · Humidity: 62%</span>' },
    { delay: 2500, html: '' },
    { delay: 2700, html: '<span class="t-prompt">❯</span> <span class="t-cmd">set a timer for 5 minutes</span>' },
    { delay: 3100, html: '<span class="t-success">✓</span> <span class="t-out">Timer set for 5 minutes</span>' },
    { delay: 3400, html: '' },
    { delay: 3600, html: '<span class="t-prompt">❯</span> <span class="t-cmd">akasha install weather</span>' },
    { delay: 4000, html: '<span class="t-info">↓</span> <span class="t-out">Downloading weather skill v1.2.0…</span>' },
    { delay: 4500, html: '<span class="t-success">✓</span> <span class="t-out">Skill installed successfully</span>' },
    { delay: 4800, html: '' },
    { delay: 5000, html: '<span class="t-prompt">❯</span> <span class="t-cursor"></span>' },
  ];

  body.innerHTML = '';
  lines.forEach(({ delay, html }) => {
    setTimeout(() => {
      // Remove any existing cursor line
      const cursor = body.querySelector('.t-cursor');
      if (cursor && cursor.parentElement) cursor.parentElement.remove();
      const line = el('div', '', html || '&nbsp;');
      body.appendChild(line);
      body.scrollTop = body.scrollHeight;
    }, delay);
  });
}

/* ── Counter animation ──────────────────────────────────────────── */
function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initCounters() {
  $$('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounter(el, target);
        obs.disconnect();
      }
    });
    obs.observe(el);
  });
}

/* ── Skills library ─────────────────────────────────────────────── */
let allSkills = [];
let activeFilter = 'all';

async function loadSkills() {
  const grid = $('#skills-grid');
  if (!grid) return;

  try {
    const res = await fetch('data/skills.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    allSkills = await res.json();
    renderSkills(allSkills);
    initSkillFilters();
    initSkillSearch();
  } catch (e) {
    grid.innerHTML = '<div class="no-results"><p>Could not load skills.</p></div>';
  }
}

function renderSkills(skills) {
  const grid = $('#skills-grid');
  if (!grid) return;

  if (!skills.length) {
    grid.innerHTML = '<div class="no-results"><p>No skills found.</p></div>';
    return;
  }

  grid.innerHTML = skills.map(s => {
    const tags = (s.tags || []).slice(0, 4).map(t => `<span class="skill-tag">#${t}</span>`).join('');
    const versionBadge = s.version ? `<span class="badge badge-purple">v${s.version}</span>` : '';
    const installCode = s.coming_soon
      ? '<span style="color:var(--text-muted)">Coming soon</span>'
      : (s.install_url
        ? `<a href="${s.install_url}" target="_blank" rel="noopener" class="install-link">${s.install_url}</a><button class="copy-btn" title="Copy URL" data-cmd="${(s.install_url || '').replace(/"/g, '&quot;')}" aria-label="Copy install URL">📋</button>`
        : `<code>${(s.install_command || '').replace(/</g, '&lt;')}</code><button class="copy-btn" title="Copy" data-cmd="${(s.install_command || '').replace(/"/g, '&quot;')}" aria-label="Copy">📋</button>`);
    const footer = s.author ? `<div class="skill-footer"><span style="font-size:.78rem;color:var(--text-muted)">by ${s.author}</span></div>` : '';
    return `
    <div class="skill-card reveal" data-category="${s.category}">
      <div class="skill-header">
        <div class="skill-icon">${iconFor(s.icon)}</div>
        <div>
          <div class="skill-name">${s.name}</div>
          <div class="skill-meta">
            ${versionBadge}
            ${s.featured ? '<span class="badge badge-cyan">Featured</span>' : ''}
            ${s.coming_soon ? '<span class="badge badge-gray">Coming soon</span>' : ''}
            <span class="badge badge-gray">${categoryLabel(s.category)}</span>
          </div>
        </div>
      </div>
      <p class="skill-desc">${s.description}</p>
      <div class="skill-tags">${tags}</div>
      <div class="install-code">${installCode}</div>
      ${footer}
    </div>
  `;
  }).join('');

  // Copy buttons
  $$('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard?.writeText(btn.dataset.cmd).then(() => {
        btn.textContent = '✅';
        toast('Command copied!', 'success');
        setTimeout(() => btn.textContent = '📋', 2000);
      });
    });
  });

  initReveal();
}

function filterSkills() {
  const query = ($('#skill-search')?.value || '').toLowerCase();
  const filtered = allSkills.filter(s => {
    const matchCat = activeFilter === 'all' || s.category === activeFilter;
    const matchQ = !query ||
      s.name.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.tags.some(t => t.includes(query));
    return matchCat && matchQ;
  });
  renderSkills(filtered);
}

function initSkillFilters() {
  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      filterSkills();
    });
  });
}

function initSkillSearch() {
  const search = $('#skill-search');
  if (!search) return;
  search.addEventListener('input', filterSkills);
}

/* ── Docs tabs ──────────────────────────────────────────────────── */
function initDocs() {
  const links = $$('.docs-nav-link');
  const articles = $$('.docs-article');
  if (!links.length) return;

  function showArticle(id) {
    articles.forEach(a => a.classList.toggle('active', a.id === id));
    links.forEach(l => l.classList.toggle('active', l.dataset.target === id));
    // push hash without scroll
    history.replaceState(null, '', `#${id}`);
  }

  links.forEach(l => l.addEventListener('click', (e) => {
    e.preventDefault();
    showArticle(l.dataset.target);
  }));

  // On load, check hash
  const hash = location.hash.slice(1);
  const firstId = links[0]?.dataset.target;
  showArticle((hash && $$('#' + hash + '.docs-article').length > 0) ? hash : firstId);
}

/* ── Releases ───────────────────────────────────────────────────── */
async function loadReleases() {
  const container = $('#releases-timeline');
  const sidebar = $('#releases-sidebar');
  if (!container) return;

  try {
    const res = await fetch('data/releases.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const releases = await res.json();
    renderReleases(releases, container, sidebar);
  } catch (e) {
    container.innerHTML = '<p style="color:var(--text-muted)">Could not load release notes.</p>';
  }
}

function renderReleases(releases, container, sidebar) {
  const typeBadge = { major: 'badge-purple', minor: 'badge-cyan', patch: 'badge-green' };
  const changeClass = { new: 'change-new', fix: 'change-fix', break: 'change-break', imp: 'change-imp' };
  const changeLabel = { new: 'New', fix: 'Fix', break: 'Breaking', imp: 'Improved' };

  container.innerHTML = releases.map((r, i) => `
    <div class="release-item reveal" id="release-${r.version.replace(/\./g, '-')}">
      <div class="release-header">
        <span class="release-version gradient-text">v${r.version}</span>
        <span class="badge ${typeBadge[r.type] || 'badge-gray'}">${r.type}</span>
        ${i === 0 ? '<span class="badge badge-green">Latest</span>' : ''}
        <span class="release-date">📅 ${formatDate(r.date)}</span>
      </div>
      <p style="font-size:.9rem;margin-bottom:16px;">${r.description}</p>
      <div class="release-changes">
        ${r.changes.map(c => `
          <div class="change-item">
            <span class="change-type ${changeClass[c.type] || 'change-imp'}">${changeLabel[c.type] || c.type}</span>
            <span>${c.text}</span>
          </div>
        `).join('')}
      </div>
      ${r.download_url ? `<a href="${r.download_url}" class="btn btn-outline btn-sm mt-md" target="_blank" rel="noopener">⬇ Download v${r.version}</a>` : ''}
    </div>
  `).join('');

  // Sidebar version list
  if (sidebar) {
    sidebar.innerHTML = releases.map((r, i) => `
      <a href="#release-${r.version.replace(/\./g, '-')}" class="docs-nav-link ${i === 0 ? 'active' : ''}">
        v${r.version}
        ${i === 0 ? '<span class="badge badge-green" style="margin-left:auto">Latest</span>' : ''}
      </a>
    `).join('');
  }

  initReveal();
}

/* ── Version check ──────────────────────────────────────────────── */
async function checkVersion() {
  const badge = $('.version-pill');
  if (!badge) return;
  try {
    const res = await fetch('api/latest.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    badge.textContent = `v${data.version}`;
  } catch { /* ignore */ }
}

/* ── Helpers ────────────────────────────────────────────────────── */
function iconFor(name) {
  const icons = {
    'cloud-sun': '🌤',
    'clock': '⏰',
    'calculator': '🔢',
    'file-text': '📄',
    'globe': '🌍',
    'newspaper': '📰',
    'folder': '📁',
    'music': '🎵',
    'activity': '📊',
    'code': '💻',
    'calendar': '📅',
    'trending-up': '📈',
  };
  return icons[name] || '🔧';
}

function categoryLabel(cat) {
  const labels = {
    information: 'Info', productivity: 'Productivity', utility: 'Utility',
    language: 'Language', media: 'Media', system: 'System',
    development: 'Dev', finance: 'Finance',
  };
  return labels[cat] || cat;
}

function starRating(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/* ── Copy AKAS token address ────────────────────────────────────── */
function initCopyToken() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-copy-token');
    if (!btn) return;
    const address = btn.getAttribute('data-address') || '';
    if (!address) return;
    navigator.clipboard.writeText(address).then(() => {
      btn.classList.add('copied');
      btn.textContent = 'Copied!';
      toast('Token address copied to clipboard', 'success', 2000);
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.textContent = 'Copy';
      }, 2000);
    }).catch(() => toast('Copy failed', 'error', 3000));
  });
}

/* ── Init ───────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initReveal();
  initTerminal();
  initCounters();
  loadSkills();
  initDocs();
  loadReleases();
  checkVersion();
  initCopyToken();
});
