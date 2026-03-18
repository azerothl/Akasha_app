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

/** Single "v" prefix for UI (JSON often already has v0.6.0). Used by terminal + releases + skills. */
function displayVersion(ver) {
  if (ver == null || ver === '') return '';
  const core = String(ver).trim().replace(/^v+/i, '');
  return core ? 'v' + core : '';
}

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
async function initTerminal() {
  const body = $('.terminal-body');
  if (!body) return;

  let ver = 'v0.6.0';
  try {
    const res = await fetch('api/latest.json');
    if (res.ok) {
      const d = await res.json();
      ver = displayVersion(d.version) || ver;
    }
  } catch (_) { /* use fallback */ }

  const lines = [
    { delay: 300,  html: '<span class="t-prompt">❯</span> <span class="t-cmd">akasha --version</span>' },
    { delay: 900,  html: `<span class="t-success">✓</span> <span class="t-out">Akasha ${ver}</span>` },
    { delay: 1300, html: '' },
    { delay: 1500, html: '<span class="t-prompt">❯</span> <span class="t-cmd">akasha init --defaults</span>' },
    { delay: 2400, html: '<span class="t-out">Embedded model · vault · data directory ready</span>' },
    { delay: 2800, html: '' },
    { delay: 3000, html: '<span class="t-prompt">❯</span> <span class="t-cmd">akasha start</span>' },
    { delay: 3800, html: '<span class="t-success">✓</span> <span class="t-out">Daemon listening on 127.0.0.1:3876</span>' },
    { delay: 4200, html: '' },
    { delay: 4400, html: '<span class="t-prompt">❯</span> <span class="t-cmd">akasha tui</span>' },
    { delay: 5200, html: '<span class="t-info">→</span> <span class="t-out">Chat · Router · Tasks · Calendar · Memory</span>' },
    { delay: 5600, html: '' },
    { delay: 5800, html: '<span class="t-prompt">❯</span> <span class="t-cursor"></span>' },
  ];

  body.innerHTML = '';
  lines.forEach(({ delay, html }) => {
    setTimeout(() => {
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

  const agentPrompt = (url) => `Download the skill at this url ${url} and follow the SKILL.md instructions.`;
  grid.innerHTML = skills.map(s => {
    const tags = (s.tags || []).slice(0, 4).map(t => `<span class="skill-tag">#${t}</span>`).join('');
    const versionBadge = s.version ? `<span class="badge badge-purple">${displayVersion(s.version)}</span>` : '';
    const installBlock = s.coming_soon
      ? '<div class="skill-install-block"><span class="skill-install-muted">Coming soon</span></div>'
      : (s.install_url
        ? `<div class="skill-install-block">
            <p class="skill-install-prompt">${agentPrompt('[url]')}</p>
            <div class="skill-install-actions">
              <button type="button" class="btn btn-outline btn-sm skill-copy-prompt" data-prompt="${(agentPrompt(s.install_url)).replace(/"/g, '&quot;')}" title="Copy prompt for agent">📋 Copy prompt</button>
              <a href="${s.install_url}" target="_blank" rel="noopener" class="btn btn-primary btn-sm skill-download-btn">⬇ Download skill</a>
            </div>
          </div>`
        : `<div class="install-code"><code>${(s.install_command || '').replace(/</g, '&lt;')}</code><button class="copy-btn" title="Copy" data-cmd="${(s.install_command || '').replace(/"/g, '&quot;')}" aria-label="Copy">📋</button></div>`);
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
      ${installBlock}
      ${footer}
    </div>
  `;
  }).join('');

  // Copy buttons (install_command)
  $$('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard?.writeText(btn.dataset.cmd).then(() => {
        btn.textContent = '✅';
        toast('Command copied!', 'success');
        setTimeout(() => btn.textContent = '📋', 2000);
      });
    });
  });

  // Copy prompt for agent (install_url skills)
  $$('.skill-copy-prompt').forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.dataset.prompt || '';
      navigator.clipboard?.writeText(prompt).then(() => {
        const label = btn.textContent;
        btn.textContent = '✅ Copied!';
        toast('Prompt copied! Paste in chat for the agent.', 'success');
        setTimeout(() => { btn.textContent = label; }, 2000);
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
const RELEASE_ASSETS = [
  { name: 'akasha-full-windows-x86_64.zip', label: 'Windows (full)', os: 'windows' },
  { name: 'akasha-full-linux-x86_64.zip', label: 'Linux (full)', os: 'linux' },
  { name: 'akasha-full-macos-x86_64.zip', label: 'macOS Intel (full)', os: 'macos' },
  { name: 'akasha-full-macos-aarch64.zip', label: 'macOS Apple Silicon (full)', os: 'macos' },
  { name: 'akasha-windows-x86_64.zip', label: 'Windows (CLI only)', os: 'windows' },
  { name: 'akasha-linux-x86_64.zip', label: 'Linux (CLI only)', os: 'linux' },
  { name: 'akasha-macos-x86_64.zip', label: 'macOS Intel (CLI only)', os: 'macos' },
  { name: 'akasha-macos-aarch64.zip', label: 'macOS Apple Silicon (CLI only)', os: 'macos' },
  { name: 'akasha-ui-windows.zip', label: 'Windows (Desktop)', os: 'windows' },
  { name: 'akasha-ui-linux.zip', label: 'Linux (Desktop)', os: 'linux' },
  { name: 'akasha-ui-macos.zip', label: 'macOS (Desktop)', os: 'macos' },
];
const GITHUB_RELEASE_BASE = 'https://github.com/azerothl/Akasha_app/releases/download';

function releaseTag(version) {
  return String(version).startsWith('v') ? version : 'v' + version;
}

function assetDownloadUrl(tag, assetName) {
  return `${GITHUB_RELEASE_BASE}/${tag}/${assetName}`;
}

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

  container.innerHTML = releases.map((r, i) => {
    const tag = releaseTag(r.version);
    const isLatest = i === 0;
    const assetLinks = RELEASE_ASSETS.map(a =>
      `<a href="${assetDownloadUrl(tag, a.name)}" class="btn btn-outline btn-sm release-asset-btn" target="_blank" rel="noopener">${a.label}</a>`
    ).join('');
    const oneLinerWin = 'powershell -ExecutionPolicy Bypass -c "irm https://raw.githubusercontent.com/azerothl/Akasha_app/main/scripts/get-akasha.ps1 | iex"';
    const oneLinerUnix = 'curl -sSL https://raw.githubusercontent.com/azerothl/Akasha_app/main/scripts/get-akasha.sh | bash';
    const downloadBlock = isLatest
      ? `<div class="release-downloads reveal" id="downloads"><p class="release-downloads-note"><strong>One-line install:</strong> paste in your terminal — Windows: <code style="font-size:.85em">${oneLinerWin.replace(/"/g, '&quot;')}</code> · Linux/macOS: <code style="font-size:.85em">${oneLinerUnix}</code></p><p class="release-downloads-note">Or download the archive for your OS below. Full zip: Windows users double-click <code>INSTALL.cmd</code> after extracting; Linux/macOS run <code>chmod +x scripts/setup.sh &amp;&amp; ./scripts/setup.sh</code>. Do not use the &quot;Source code (zip)&quot; links on GitHub.</p><div class="release-asset-list">${assetLinks}</div></div>`
      : (r.download_url ? `<a href="${r.download_url}" class="btn btn-outline btn-sm mt-md" target="_blank" rel="noopener">View release on GitHub</a>` : '');
    return `
    <div class="release-item reveal" id="release-${r.version.replace(/\./g, '-')}">
      <div class="release-header">
        <span class="release-version gradient-text">${displayVersion(r.version)}</span>
        <span class="badge ${typeBadge[r.type] || 'badge-gray'}">${r.type}</span>
        ${isLatest ? '<span class="badge badge-green">Latest</span>' : ''}
        <span class="release-date">📅 ${formatDate(r.date)}</span>
      </div>
      <div class="release-description">${markdownToSafeHtml(r.description)}</div>
      ${downloadBlock}
      <div class="release-changes">
        ${r.changes.map(c => `
          <div class="change-item">
            <span class="change-type ${changeClass[c.type] || 'change-imp'}">${changeLabel[c.type] || c.type}</span>
            <span>${c.text}</span>
          </div>
        `).join('')}
      </div>
      ${!isLatest && r.download_url ? `<a href="${r.download_url}" class="btn btn-outline btn-sm mt-md" target="_blank" rel="noopener">View release on GitHub</a>` : ''}
    </div>
  `}).join('');

  // Sidebar version list
  if (sidebar) {
    sidebar.innerHTML = releases.map((r, i) => `
      <a href="#release-${r.version.replace(/\./g, '-')}" class="docs-nav-link ${i === 0 ? 'active' : ''}">
        ${displayVersion(r.version)}
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
    badge.textContent = displayVersion(data.version);
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

/** Escape HTML for fallback when markdown libs are unavailable */
function escapeHtmlText(s) {
  const d = document.createElement('div');
  d.textContent = s == null ? '' : String(s);
  return d.innerHTML;
}

let _markdownPurifyHooked = false;

/**
 * Release notes from GitHub are Markdown; render safely for innerHTML.
 * Uses marked + DOMPurify when loaded (releases.html); otherwise plain text with line breaks.
 */
function markdownToSafeHtml(md) {
  /* GitHub often prefixes release bodies with an HTML comment */
  const raw = String(md || '')
    .replace(/^\s*<!--[\s\S]*?-->\s*/g, '')
    .trim();
  if (!raw) return '';
  if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
    try {
      if (!_markdownPurifyHooked) {
        _markdownPurifyHooked = true;
        DOMPurify.addHook('afterSanitizeAttributes', (node) => {
          if (node.tagName === 'A' && node.hasAttribute('href')) {
            const href = node.getAttribute('href') || '';
            if (/^https?:\/\//i.test(href)) {
              node.setAttribute('target', '_blank');
              node.setAttribute('rel', 'noopener noreferrer');
            }
          }
        });
      }
      const html = marked.parse(raw, { mangle: false, headerIds: false });
      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'ul', 'ol', 'li',
          'a', 'strong', 'em', 'code', 'pre', 'blockquote', 'hr',
          'table', 'thead', 'tbody', 'tr', 'th', 'td',
        ],
        ALLOWED_ATTR: ['href', 'title', 'colspan', 'rowspan'],
        ALLOW_DATA_ATTR: false,
      });
    } catch (e) {
      console.warn('markdownToSafeHtml:', e);
    }
  }
  return '<p>' + escapeHtmlText(raw).replace(/\n/g, '<br>') + '</p>';
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
