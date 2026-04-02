# Synchronisation de la documentation (site public)

Le fichier [docs.html](../docs.html) est une **page HTML statique** (anglais) sur GitHub Pages. Elle complète les guides markdown du dépôt **Akasha** (`docs/user_guide_final.md` → livré en zip sous `docs/user_guide.md`, et `spec/user_guide.md` pour les développeurs).

## Politique de contenu

- **Akasha (dépôt moteur)** : guides utilisateur en **français** par défaut pour l’in-app Doc et la plupart des specs ; audit technique dans `spec/51_doc_vs_code_audit.md`.
- **Akasha_app (ce dépôt)** : pages marketing et **docs.html** en **anglais** pour le site public. Les faits techniques (CLI, ports, onglets TUI) doivent rester alignés sur le code et sur `user_guide_final.md`, pas l’inverse.

## Checklist lors d’une release produit (ou mise à jour majeure de docs.html)

À cocher après comparaison avec [Akasha/docs/user_guide_final.md](https://github.com/azerothl/Akasha/blob/main/docs/user_guide_final.md) (ou la branche/tag correspondante) :

1. **Version** : pastille de version dans `docs.html` (et `index.html` si affichée) = tag de release cible (ex. v0.7.0).
2. **Port daemon** : `3876` et variable `AKASHA_PORT` — cohérents avec le guide.
3. **Onglets TUI** : sept onglets — Chat, Scheduled / planned replies, Router, Doc, Tasks, Calendar, Memory (libellés EN sur le site ; vérifier l’équivalent fonctionnel).
4. **Onglets UI web** : inclure **Scheduled** (Retours planifiés) + Paramètres comme dans le guide.
5. **Commandes CLI** : blocs d’exemples (`akasha start`, `init`, `doctor`, `vault`, `config`, `router`, `plugin`, `services`, `update`) — alignés sur `akasha --help` et le guide.
6. **Liens** : URL des releases (`releases.html`, GitHub Releases Akasha_app), scripts d’installation (`get-akasha.ps1` / `.sh`).
7. **Nouveautés** : section « What's new » mise à jour ou marquée comme résumé haut niveau si le détail est dans les notes de release.
8. **Plugins** : page [plugins.html](../plugins.html) — le catalogue est chargé côté client depuis `https://cdn.jsdelivr.net/gh/azerothl/Akasha_plugins@main/plugins.json` (dépôt [Akasha_plugins](https://github.com/azerothl/Akasha_plugins), branche `main`). Aucun commit dans Akasha_app n’est nécessaire quand un plugin est ajouté ou modifié ; vérifier après une release majeure que la section Plugins / API dans `docs.html` reste alignée avec le daemon.

## Génération automatique (optionnel)

Il n’y a pas de pipeline qui compile `docs.html` depuis le markdown aujourd’hui. Si vous en ajoutez un plus tard, la source de vérité recommandée reste **`docs/user_guide_final.md` dans Akasha** pour les faits utilisateur ; ce dépôt ne ferait qu’exporter ou reformater pour le web.

## Référence rapide

- Audit code vs doc : `Akasha/spec/51_doc_vs_code_audit.md`
- Index des specs : `Akasha/spec/README.md`
