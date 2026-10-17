# FCR Tunisie

Site statique public (GitHub Pages, domaine fcr-tunisie.com). Source unique : `index.src.html` ; `sh build.sh` génère les pages FR/AR/EN et le sitemap.

Quand l'utilisateur demande de « mettre à jour le site » (actualité, contenu ou SEO), suivre @MAJ-SITE.md étape par étape.

- Ne jamais éditer les fichiers générés (`index.html`, `ar/`, `en/`, `sitemap.xml`) à la main.
- Ne jamais pousser : l'utilisateur lance `git push` lui-même.
- Ne jamais commiter `.DS_Store` ni `NOTES.local.md`, ni aucun identifiant (dépôt public).
