/* ================================================================
   Akasha site — FR/EN i18n
   Priority: ?lang= → localStorage akasha.lang → navigator → en
   ================================================================ */

(function () {
  const STORAGE_KEY = 'akasha.lang';
  const SUPPORTED = ['en', 'fr'];

  const STRINGS = {
    en: {
      'meta.title.home': 'Akasha — Your Privacy-First Personal Assistant',
      'meta.title.docs': 'Documentation — Akasha',
      'meta.title.skills': 'Skills Library — Akasha',
      'meta.title.plugins': 'Plugins — Akasha',
      'meta.title.compare': 'Compare — Akasha vs OpenClaw, Claude Code, Cursor, Hermes, Mercury Agent',
      'meta.title.releases': 'Release Notes — Akasha',
      'meta.title.404': 'Page Not Found — Akasha',

      'nav.home': 'Home',
      'nav.skills': 'Skills',
      'nav.plugins': 'Plugins',
      'nav.docs': 'Docs',
      'nav.compare': 'Compare',
      'nav.releases': 'Releases',
      'nav.download': '⬇ Download',
      'nav.menu': 'Toggle menu',
      'nav.lang': 'Language',
      'nav.version': 'Current version',
      'nav.mobile.home': '🏠 Home',
      'nav.mobile.skills': '🧩 Skills',
      'nav.mobile.plugins': '🔌 Plugins',
      'nav.mobile.docs': '📖 Docs',
      'nav.mobile.compare': '⚖ Compare',
      'nav.mobile.releases': '📋 Releases',
      'nav.mobile.download': '⬇ Download',

      'footer.tagline': 'A privacy-first personal assistant with a powerful skill system. Prebuilt binaries; free to download.',
      'footer.product': 'Product',
      'footer.features': 'Features',
      'footer.compare': 'Compare',
      'footer.skills': 'Skills Library',
      'footer.plugins': 'Plugins',
      'footer.releases': 'Releases',
      'footer.download': 'Download',
      'footer.docs': 'Docs',
      'footer.getting_started': 'Getting Started',
      'footer.plugins_catalog': 'Plugins catalog',
      'footer.skills_api': 'Skills API',
      'footer.configuration': 'Configuration',
      'footer.contributing': 'Contributing',
      'footer.community': 'Community',
      'footer.github': 'GitHub',
      'footer.issue': 'Report Issue',
      'footer.discussions': 'Discussions',
      'footer.support': 'Support development',
      'footer.contribute': 'Contributions welcome via the <strong>AKAS</strong> token:',
      'footer.copy': 'Copy',
      'footer.copied': 'Copied!',
      'footer.copy_aria': 'Copy token address',
      'footer.legal': '© 2026 Akasha. Engine: Apache-2.0 on GitHub; official binaries on this site. Website content may use separate licences.',
      'footer.documentation': 'Documentation',
      'footer.changelog': 'Changelog',

      'home.eyebrow': '<span>✦</span> Local-first · Daemon 24/7',
      'home.title': 'Meet <span class="gradient-text">Akasha</span><br />Your AI<br />Assistant Stack',
      'home.desc': 'A <strong>daemon-backed</strong> assistant with TUI, desktop app, and optional chat channels. <strong>Embedded model</strong> works out of the box — add <strong>Ollama</strong> or <strong>cloud APIs</strong> when you want heavier models. Data stays on your machine; <strong>tools are deny-by-default</strong> until you allow paths in policy.',
      'home.cta.download': '⬇ Download Free',
      'home.cta.docs': '📖 Read Docs',
      'home.stat.tools': 'Tools +',
      'home.stat.tools_label': 'Skills installable',
      'home.stat.local_label': 'Local by default',
      'home.stat.daemon': '24/7',
      'home.stat.daemon_label': 'Daemon & auto-restart',
      'home.features.eyebrow': '✦ Core Features',
      'home.features.title': 'Everything you need, <span class="gradient-text">nothing you don\'t</span>',
      'home.shots.eyebrow': '✦ Interface',
      'home.shots.title': 'Desktop <span class="gradient-text">UI</span>',
      'home.shots.desc': 'Web UI (same bundle as the Tauri app): chat and in-app documentation when <code>akasha start</code> is running.',
      'home.shots.chat': 'Chat',
      'home.shots.docs': 'Documentation tab',
      'home.shots.hint': 'Click a screenshot to enlarge',
      'home.how.eyebrow': '⚙ How it works',
      'home.how.title': 'Get started in <span class="gradient-text">3 steps</span>',
      'home.how.desc': 'From download to fully configured in under 2 minutes.',
      'home.how.1.title': 'Download & extract',
      'home.how.2.title': 'Add skills (optional)',
      'home.how.3.title': 'Start chatting',
      'home.skills.eyebrow': '🧩 Skills Library',
      'home.skills.title': 'Extend with <span class="gradient-text">powerful skills</span>',
      'home.skills.cta': 'View all skills →',
      'home.cta.title': 'Ready to try <span class="gradient-text">Akasha</span>?',
      'home.cta.desc': 'Download for free, no account required. Your data stays yours.',
      'home.cta.download_latest': '⬇ Download Latest Release',
      'home.cta.star': '★ Star on GitHub',

      'docs.eyebrow': '📖 Documentation',
      'docs.title': 'Akasha <span class="gradient-text">Docs</span>',
      'docs.subtitle': 'Everything you need to install, configure and extend Akasha.',
      'docs.nav.getting_started': 'Getting Started',
      'docs.nav.introduction': 'Introduction',
      'docs.nav.whats_new': "What's new (v0.11.0)",
      'docs.nav.api': 'API & plugins',
      'docs.nav.installation': 'Installation',
      'docs.nav.first_run': 'First Run',
      'docs.nav.using': 'Using Akasha',
      'docs.nav.commands': 'Commands',
      'docs.nav.safety': 'Safety queue & reports',
      'docs.nav.steering': 'Steering & follow-up',
      'docs.nav.code_studio': 'Code Studio & swarm',
      'docs.nav.companion': 'Companion (ESP32)',
      'docs.nav.configuration': 'Configuration',
      'docs.nav.llm_router': 'LLM router (YAML)',
      'docs.nav.tools_policy': 'Tools policy (YAML)',
      'docs.nav.vault': 'Vault CLI',
      'docs.nav.env_examples': 'Env files (.env)',
      'docs.nav.docker': 'Docker services',
      'docs.nav.themes': 'Interfaces',
      'docs.nav.channels': 'Channels',
      'docs.nav.env_vars': 'Environment variables',
      'docs.nav.troubleshooting': 'Troubleshooting',
      'docs.nav.skills': 'Skills',
      'docs.nav.skills_usage': 'Using Skills',
      'docs.nav.skills_format': 'Creating your own skill',
      'docs.nav.skills_api': 'Slash commands',
      'docs.nav.operator': 'Operator parity',
      'docs.nav.hermes_overview': 'Overview & matrix',
      'docs.nav.hermes_mcp': 'MCP (validate & probe)',
      'docs.nav.hermes_terminal': 'Terminal & PTY',
      'docs.nav.hermes_webhooks': 'Webhooks & automation',
      'docs.nav.hermes_toolsets': 'Toolsets & tools policy',
      'docs.nav.hermes_migration': 'Migration & ecosystem',
      'docs.nav.hermes_closeout': 'Phase close-out proofs',
      'docs.nav.developers': 'Developers',
      'docs.nav.plugins_catalog': 'Plugins catalog (site)',
      'docs.nav.update_api': 'Update API',
      'docs.nav.contributing': 'Contributing',
      'docs.shots.title': 'Interface screenshots',
      'docs.shots.intro': 'Real captures from the web UI (same React bundle as the desktop app), produced by the Akasha Playwright suite. Click any image to enlarge (Esc or overlay to close).',
      'docs.shots.chat': 'Chat',
      'docs.shots.recipes': 'Cookbook — recipes',
      'docs.shots.compare': 'Compare models',
      'docs.shots.models': 'Cookbook — models',
      'docs.shots.research': 'Deep research',
      'docs.shots.mission': 'Autonomous mission',
      'docs.shots.notes': 'Notes',
      'docs.shots.docs': 'Documentation (multi-page)',
      'docs.fr_note': 'Site chrome is in French. Detailed technical articles below remain in English for now (aligned with the public docs policy).',

      'skills.eyebrow': '🧩 Skills Library',
      'skills.title': 'Extend Akasha with <span class="gradient-text">Skills</span>',
      'skills.subtitle': 'Browse available and upcoming skills. Ask the agent in chat to install from a URL or add files manually and reload.',
      'skills.filter_all': 'All',
      'skills.search_ph': 'Search skills…',

      'plugins.eyebrow': '🔌 Tool plugins',
      'plugins.title': 'Akasha <span class="gradient-text">Plugins</span>',
      'plugins.subtitle': 'High-level WASM tool plugins (maps, charts, simulation, …). The list loads from the Akasha_plugins repository on every visit.',

      'compare.eyebrow': '⚖ Product comparison',
      'compare.title': 'Akasha <span class="gradient-text">vs</span> similar tools',
      'compare.subtitle': 'Indicative comparison on a few axes. Products evolve quickly — check each vendor’s site before you decide.',

      'releases.eyebrow': '📋 Release Notes',
      'releases.title': 'What\'s <span class="gradient-text">New</span>',
      'releases.subtitle': 'Full changelog and release history for every version of Akasha.',
      'releases.versions': 'Versions',

      '404.title': 'Page not found',
      '404.desc': 'The page you\'re looking for doesn\'t exist or has been moved.',
      '404.home': '← Back to Home',
      '404.docs': '📖 Documentation',

      'lightbox.close': 'Close',
      'lightbox.label': 'Enlarged screenshot',
      'toast.copied': 'Token address copied to clipboard',
      'toast.copy_fail': 'Copy failed',
    },
    fr: {
      'meta.title.home': 'Akasha — Votre assistant personnel axé vie privée',
      'meta.title.docs': 'Documentation — Akasha',
      'meta.title.skills': 'Bibliothèque de skills — Akasha',
      'meta.title.plugins': 'Plugins — Akasha',
      'meta.title.compare': 'Comparer — Akasha vs OpenClaw, Claude Code, Cursor, Hermes, Mercury Agent',
      'meta.title.releases': 'Notes de version — Akasha',
      'meta.title.404': 'Page introuvable — Akasha',

      'nav.home': 'Accueil',
      'nav.skills': 'Skills',
      'nav.plugins': 'Plugins',
      'nav.docs': 'Docs',
      'nav.compare': 'Comparer',
      'nav.releases': 'Versions',
      'nav.download': '⬇ Télécharger',
      'nav.menu': 'Ouvrir le menu',
      'nav.lang': 'Langue',
      'nav.version': 'Version actuelle',
      'nav.mobile.home': '🏠 Accueil',
      'nav.mobile.skills': '🧩 Skills',
      'nav.mobile.plugins': '🔌 Plugins',
      'nav.mobile.docs': '📖 Docs',
      'nav.mobile.compare': '⚖ Comparer',
      'nav.mobile.releases': '📋 Versions',
      'nav.mobile.download': '⬇ Télécharger',

      'footer.tagline': 'Un assistant personnel axé vie privée, avec un système de skills puissant. Binaires précompilés ; téléchargement gratuit.',
      'footer.product': 'Produit',
      'footer.features': 'Fonctionnalités',
      'footer.compare': 'Comparer',
      'footer.skills': 'Bibliothèque de skills',
      'footer.plugins': 'Plugins',
      'footer.releases': 'Versions',
      'footer.download': 'Télécharger',
      'footer.docs': 'Docs',
      'footer.getting_started': 'Premiers pas',
      'footer.plugins_catalog': 'Catalogue de plugins',
      'footer.skills_api': 'API Skills',
      'footer.configuration': 'Configuration',
      'footer.contributing': 'Contribuer',
      'footer.community': 'Communauté',
      'footer.github': 'GitHub',
      'footer.issue': 'Signaler un problème',
      'footer.discussions': 'Discussions',
      'footer.support': 'Soutenir le développement',
      'footer.contribute': 'Les contributions sont bienvenues via le jeton <strong>AKAS</strong> :',
      'footer.copy': 'Copier',
      'footer.copied': 'Copié !',
      'footer.copy_aria': 'Copier l’adresse du jeton',
      'footer.legal': '© 2026 Akasha. Moteur : Apache-2.0 sur GitHub ; binaires officiels sur ce site. Le contenu du site peut avoir d’autres licences.',
      'footer.documentation': 'Documentation',
      'footer.changelog': 'Journal des versions',

      'home.eyebrow': '<span>✦</span> Local-first · Daemon 24/7',
      'home.title': 'Voici <span class="gradient-text">Akasha</span><br />Votre pile<br />d’assistant IA',
      'home.desc': 'Un assistant <strong>piloté par un daemon</strong>, avec TUI, appli bureau et canaux de chat optionnels. Le <strong>modèle embarqué</strong> fonctionne dès l’installation — ajoutez <strong>Ollama</strong> ou des <strong>API cloud</strong> pour des modèles plus lourds. Les données restent sur votre machine ; les <strong>outils sont refusés par défaut</strong> jusqu’à autorisation dans la politique.',
      'home.cta.download': '⬇ Télécharger gratuitement',
      'home.cta.docs': '📖 Lire la doc',
      'home.stat.tools': 'Outils +',
      'home.stat.tools_label': 'Skills installables',
      'home.stat.local_label': 'Local par défaut',
      'home.stat.daemon': '24/7',
      'home.stat.daemon_label': 'Daemon & redémarrage auto',
      'home.features.eyebrow': '✦ Fonctionnalités clés',
      'home.features.title': 'Tout ce qu’il faut, <span class="gradient-text">rien de superflu</span>',
      'home.shots.eyebrow': '✦ Interface',
      'home.shots.title': 'UI <span class="gradient-text">bureau</span>',
      'home.shots.desc': 'UI web (même bundle que l’app Tauri) : chat et documentation intégrée quand <code>akasha start</code> tourne.',
      'home.shots.chat': 'Chat',
      'home.shots.docs': 'Onglet Documentation',
      'home.shots.hint': 'Cliquez une capture pour l’agrandir',
      'home.how.eyebrow': '⚙ Comment ça marche',
      'home.how.title': 'Démarrez en <span class="gradient-text">3 étapes</span>',
      'home.how.desc': 'Du téléchargement à une config prête en moins de 2 minutes.',
      'home.how.1.title': 'Télécharger & extraire',
      'home.how.2.title': 'Ajouter des skills (optionnel)',
      'home.how.3.title': 'Commencer à discuter',
      'home.skills.eyebrow': '🧩 Bibliothèque de skills',
      'home.skills.title': 'Étendez avec des <span class="gradient-text">skills puissants</span>',
      'home.skills.cta': 'Voir tous les skills →',
      'home.cta.title': 'Prêt à essayer <span class="gradient-text">Akasha</span> ?',
      'home.cta.desc': 'Téléchargement gratuit, sans compte. Vos données restent les vôtres.',
      'home.cta.download_latest': '⬇ Télécharger la dernière version',
      'home.cta.star': '★ Étoile sur GitHub',

      'docs.eyebrow': '📖 Documentation',
      'docs.title': 'Docs <span class="gradient-text">Akasha</span>',
      'docs.subtitle': 'Tout pour installer, configurer et étendre Akasha.',
      'docs.nav.getting_started': 'Premiers pas',
      'docs.nav.introduction': 'Introduction',
      'docs.nav.whats_new': 'Nouveautés (v0.11.0)',
      'docs.nav.api': 'API & plugins',
      'docs.nav.installation': 'Installation',
      'docs.nav.first_run': 'Premier lancement',
      'docs.nav.using': 'Utiliser Akasha',
      'docs.nav.commands': 'Commandes',
      'docs.nav.safety': 'File de sécurité & rapports',
      'docs.nav.steering': 'Steering & follow-up',
      'docs.nav.code_studio': 'Code Studio & swarm',
      'docs.nav.companion': 'Companion (ESP32)',
      'docs.nav.configuration': 'Configuration',
      'docs.nav.llm_router': 'Routeur LLM (YAML)',
      'docs.nav.tools_policy': 'Politique d’outils (YAML)',
      'docs.nav.vault': 'CLI Vault',
      'docs.nav.env_examples': 'Fichiers env (.env)',
      'docs.nav.docker': 'Services Docker',
      'docs.nav.themes': 'Interfaces',
      'docs.nav.channels': 'Canaux',
      'docs.nav.env_vars': 'Variables d’environnement',
      'docs.nav.troubleshooting': 'Dépannage',
      'docs.nav.skills': 'Skills',
      'docs.nav.skills_usage': 'Utiliser les skills',
      'docs.nav.skills_format': 'Créer son skill',
      'docs.nav.skills_api': 'Commandes slash',
      'docs.nav.operator': 'Parité opérateur',
      'docs.nav.hermes_overview': 'Vue d’ensemble & matrice',
      'docs.nav.hermes_mcp': 'MCP (validate & probe)',
      'docs.nav.hermes_terminal': 'Terminal & PTY',
      'docs.nav.hermes_webhooks': 'Webhooks & automation',
      'docs.nav.hermes_toolsets': 'Toolsets & politique d’outils',
      'docs.nav.hermes_migration': 'Migration & écosystème',
      'docs.nav.hermes_closeout': 'Preuves de clôture de phase',
      'docs.nav.developers': 'Développeurs',
      'docs.nav.plugins_catalog': 'Catalogue plugins (site)',
      'docs.nav.update_api': 'API de mise à jour',
      'docs.nav.contributing': 'Contribuer',
      'docs.shots.title': 'Captures d’interface',
      'docs.shots.intro': 'Captures réelles de l’UI web (même bundle React que l’app bureau), produites par la suite Playwright Akasha. Cliquez une image pour l’agrandir (Échap ou overlay pour fermer).',
      'docs.shots.chat': 'Chat',
      'docs.shots.recipes': 'Cookbook — recettes',
      'docs.shots.compare': 'Comparer les modèles',
      'docs.shots.models': 'Cookbook — modèles',
      'docs.shots.research': 'Recherche approfondie',
      'docs.shots.mission': 'Mission autonome',
      'docs.shots.notes': 'Notes',
      'docs.shots.docs': 'Documentation (multi-pages)',
      'docs.fr_note': 'L’interface du site est en français. Les articles techniques détaillés ci-dessous restent en anglais pour l’instant (politique docs publiques).',

      'skills.eyebrow': '🧩 Bibliothèque de skills',
      'skills.title': 'Étendez Akasha avec des <span class="gradient-text">Skills</span>',
      'skills.subtitle': 'Parcourez les skills disponibles et à venir. Demandez à l’agent en chat d’installer depuis une URL, ou ajoutez les fichiers manuellement puis rechargez.',
      'skills.filter_all': 'Tous',
      'skills.search_ph': 'Rechercher des skills…',

      'plugins.eyebrow': '🔌 Plugins d’outils',
      'plugins.title': 'Plugins <span class="gradient-text">Akasha</span>',
      'plugins.subtitle': 'Plugins d’outils WASM de haut niveau (cartes, graphiques, simulation…). La liste est chargée depuis le dépôt Akasha_plugins à chaque visite.',

      'compare.eyebrow': '⚖ Comparaison produit',
      'compare.title': 'Akasha <span class="gradient-text">vs</span> outils similaires',
      'compare.subtitle': 'Comparaison indicative sur quelques axes. Les produits évoluent vite — vérifiez chaque site avant de décider.',

      'releases.eyebrow': '📋 Notes de version',
      'releases.title': 'Quoi de <span class="gradient-text">neuf</span>',
      'releases.subtitle': 'Journal complet et historique des versions d’Akasha.',
      'releases.versions': 'Versions',

      '404.title': 'Page introuvable',
      '404.desc': 'La page demandée n’existe pas ou a été déplacée.',
      '404.home': '← Retour à l’accueil',
      '404.docs': '📖 Documentation',

      'lightbox.close': 'Fermer',
      'lightbox.label': 'Capture agrandie',
      'toast.copied': 'Adresse du jeton copiée',
      'toast.copy_fail': 'Échec de la copie',
    },
  };

  function detectLang() {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = (params.get('lang') || '').toLowerCase();
      if (SUPPORTED.includes(q)) return q;
    } catch (_) { /* ignore */ }
    try {
      const stored = (localStorage.getItem(STORAGE_KEY) || '').toLowerCase();
      if (SUPPORTED.includes(stored)) return stored;
    } catch (_) { /* ignore */ }
    const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    if (nav.startsWith('fr')) return 'fr';
    return 'en';
  }

  function t(key, lang) {
    const L = lang || AkashaI18n.lang;
    return (STRINGS[L] && STRINGS[L][key]) || (STRINGS.en && STRINGS.en[key]) || key;
  }

  function apply(lang) {
    if (!SUPPORTED.includes(lang)) lang = 'en';
    AkashaI18n.lang = lang;
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) { /* ignore */ }

    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.getAttribute('data-i18n');
      if (!key) return;
      const val = t(key, lang);
      if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
        node.setAttribute('placeholder', val);
      } else {
        node.textContent = val;
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach((node) => {
      const key = node.getAttribute('data-i18n-html');
      if (!key) return;
      node.innerHTML = t(key, lang);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((node) => {
      const key = node.getAttribute('data-i18n-aria');
      if (!key) return;
      node.setAttribute('aria-label', t(key, lang));
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
      const key = node.getAttribute('data-i18n-placeholder');
      if (!key) return;
      node.setAttribute('placeholder', t(key, lang));
    });

    document.querySelectorAll('[data-i18n-title]').forEach((node) => {
      const key = node.getAttribute('data-i18n-title');
      if (!key) return;
      document.title = t(key, lang);
    });

    const note = document.getElementById('docs-lang-note');
    if (note) note.hidden = lang !== 'fr';

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      const code = btn.getAttribute('data-set-lang');
      const active = code === lang;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.classList.toggle('active', active);
    });

    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get('lang') !== lang) {
        url.searchParams.set('lang', lang);
        history.replaceState(null, '', url.pathname + url.search + url.hash);
      }
    } catch (_) { /* ignore */ }

    document.dispatchEvent(new CustomEvent('akasha:langchange', { detail: { lang } }));
  }

  function setLang(lang) {
    apply(lang);
  }

  function initSwitcher() {
    document.querySelectorAll('[data-set-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const code = btn.getAttribute('data-set-lang');
        if (SUPPORTED.includes(code)) setLang(code);
      });
    });
  }

  const AkashaI18n = {
    lang: 'en',
    t,
    setLang,
    apply,
    initSwitcher,
    STRINGS,
    SUPPORTED,
  };

  window.AkashaI18n = AkashaI18n;

  const initial = detectLang();
  // Apply as early as possible once DOM is ready for marked nodes;
  // also run immediately for <html lang> + title hooks after parse.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initSwitcher();
      apply(initial);
    });
  } else {
    initSwitcher();
    apply(initial);
  }
})();
