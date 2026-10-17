# FCR Tunisie 🇹🇳

Checklist web simple et moderne pour importer un véhicule en Tunisie sous le régime **FCR (changement de résidence)**.

- **Une source** : `index.src.html` (lisible). `sh build.sh` génère les pages publiées :
  `index.html` (FR), `ar/index.html`, `en/index.html` (minifiées, avec `hreflang`, meta, JSON-LD et `<noscript>` propres à chaque langue) et `sitemap.xml` (`lastmod` = date du build). Commitez la source **et** les fichiers générés.
- **IndexNow** : `.github/workflows/indexnow.yml` notifie Bing/Yandex (et donc ChatGPT Search, Copilot) à chaque push sur `main` ; la clé publique est le fichier `<clé>.txt` à la racine.
- Progression cochée **sauvegardée localement** (localStorage) — aucune donnée envoyée.
- Recherche, filtre « à faire seulement », infos clés et FAQ.

## Mettre à jour le site

Suivre [MAJ-SITE.md](MAJ-SITE.md) (veille actualité, contenu FR/AR/EN, SEO, build, mise en ligne). Avec Claude Code : « mets à jour le site FCR ».

## Tester en local

Lancez un petit serveur local (les boutons de langue pointent vers `/`, `/ar/`, `/en/`, qui ne marchent pas en double-cliquant le fichier) :

```bash
cd ~/fcr-tunisie
python3 -m http.server 8080   # puis http://localhost:8080 (et /ar/, /en/)
```

## Mettre en ligne (gratuit, < 2 min)

- **Netlify Drop** : glissez le dossier sur https://app.netlify.com/drop
- **GitHub Pages** : poussez le repo → Settings → Pages → branche `main` / racine
- **Vercel** : `vercel` depuis le dossier
- **Cloudflare Pages** : connectez le repo, sortie = racine

> ⚠️ Outil d'aide non officiel. Vérifiez toujours auprès de la **Douane tunisienne**, de l'**ATTT** et du **Consulat** les exigences à jour.
