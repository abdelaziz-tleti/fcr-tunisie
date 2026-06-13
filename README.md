# FCR Tunisie 🇹🇳

Checklist web simple et moderne pour importer un véhicule en Tunisie sous le régime **FCR (changement de résidence)**.

- **Un seul fichier** : `index.html` (aucune dépendance, aucun build).
- Progression cochée **sauvegardée localement** (localStorage) — aucune donnée envoyée.
- Recherche, filtre « à faire seulement », infos clés et FAQ.

## Tester en local

Ouvrez simplement `index.html` dans un navigateur (double-clic), ou :

```bash
cd ~/fcr-tunisie
python3 -m http.server 8080   # puis http://localhost:8080
```

## Mettre en ligne (gratuit, < 2 min)

- **Netlify Drop** : glissez le dossier sur https://app.netlify.com/drop
- **GitHub Pages** : poussez le repo → Settings → Pages → branche `main` / racine
- **Vercel** : `vercel` depuis le dossier
- **Cloudflare Pages** : connectez le repo, sortie = racine

> ⚠️ Outil d'aide non officiel. Vérifiez toujours auprès de la **Douane tunisienne**, de l'**ATTT** et du **Consulat** les exigences à jour.
