# Mettre à jour le site — procédure

> Pour lancer une mise à jour, dire simplement à Claude : **« mets à jour le site FCR »**.
> Claude suit ce document de bout en bout. Ce fichier sert aussi de check-list pour le faire à la main.

Le site est public (GitHub Pages). **Ne jamais mettre ici ni dans le dépôt** d'identifiant, de mot de passe ou de clé privée.

---

## Résumé en une minute

| # | Étape | Qui | Durée |
|---|---|---|---|
| 1 | Récupérer `main` et vérifier que tout est propre | Claude | 1 min |
| 2 | Veille : nouveautés FCR (lois, décrets, douane, presse) | Claude | 5 min |
| 3 | Rapport des changements proposés → **validation** | Claude → toi | — |
| 4 | Modifier le contenu (FR + AR + EN) et les dates | Claude | 5-15 min |
| 5 | Idées SEO : nouvelles FAQ, mots-clés | Claude | 5 min |
| 6 | `sh build.sh` (contrôles automatiques) + test navigateur | Claude | 3 min |
| 7 | Commit | Claude | 1 min |
| 8 | `git push` | **toi** | 10 s |
| 9 | Vérifier la mise en ligne + IndexNow, puis Search Console | Claude + toi | 5 min |

---

## 1. Préparer

```bash
cd ~/fcr-tunisie
git status -sb          # doit être propre (seul .DS_Store peut être modifié, ne pas le commiter)
git fetch origin && git log --oneline HEAD..origin/main   # rien à récupérer ? sinon : git pull --ff-only
```

## 2. Veille actualité

Chercher ce qui a changé **depuis la date « Mise à jour » du site** (`const UPDATED` dans `index.src.html`).

**Recherches à lancer (en parallèle)** :
- `FCR Tunisie <année> nouveautés loi de finances`
- `projet loi de finances <année+1> Tunisie TRE voiture`
- `décret FCR Tunisiens résidant à l'étranger <année>`
- `douane tunisienne retour définitif véhicule <année>`
- `نظام FCR <année> التونسيين بالخارج سيارة` (presse arabophone)
- Le dispositif « une voiture par famille » (article 55 LF 2026) : décret d'application publié ? conditions confirmées ?

**Sources, par ordre de fiabilité** :
1. Officiel : douane.gov.tn (page « Retour définitif »), JORT, finances.gov.tn, Assemblée (ARP).
2. Presse : businessnews.com.tn, lapresse.tn, kapitalis.com, managers.tn, webdo.tn, africanmanager.com, automobile.tn.
3. Blogs, transitaires, guides commerciaux : seulement des **pistes**, jamais une source suffisante.

**Faits du site à confronter** (tous dans `index.src.html`) :
- Âge du véhicule (≤ 5 ans), résidence à l'étranger (≥ 2 ans), présence en Tunisie (≤ 183 j/an), fréquence (1×/10 ans), taux (0 % / 25 % / 30 %), devises, plaque « ن ت ».
- Dispositif voiture par famille (8 ans, 1× dans la vie, incessible 5 ans, non cumulable).
- Frais indicatifs (FAQ « Quels sont les frais à prévoir »).

**Règle** : on change un fait **seulement** avec une source officielle, ou au moins deux articles de presse concordants. Sinon, on ajoute « à vérifier auprès de la Douane » au lieu de modifier.

## 3. Rapport avant modification

Avant de toucher au code, présenter un tableau :

| Fait | Site actuel | Nouveau | Source(s) | Confiance |
|---|---|---|---|---|

Confiance = **PROUVÉ** (texte officiel) / **PROBABLE** (≥ 2 articles) / **À VÉRIFIER**.
S'il n'y a **rien de nouveau**, le dire et passer directement à l'étape 5 (SEO).
Attendre le « go » avant de modifier le contenu.

## 4. Modifier le contenu

**Une seule source : `index.src.html`.** Ne jamais éditer `index.html`, `ar/index.html`, `en/index.html` ni `sitemap.xml` : ils sont générés.

| Quoi | Où dans `index.src.html` | Langues |
|---|---|---|
| Checklist (phases, étapes) | `const DATA` | FR + AR + EN |
| Conditions | `const CONDS` | FR + AR + EN |
| FAQ | `const FAQS` | FR + AR + EN |
| Article « En savoir plus » | `const CONTENT` | FR + AR + EN |
| FAQ dans le JSON-LD **français** | bloc `"@type": "FAQPage"` dans le `<head>` | FR (même nombre de questions que `FAQS`) |
| Texte sans JavaScript **français** | `<noscript>` | FR (AR/EN sont générés automatiquement) |

**Dates** (à mettre à la date du jour à chaque changement de contenu) :
- `const UPDATED = "17 octobre 2026";` (format exact : jour, mois en toutes lettres, année)
- `"dateModified"` (2 fois, format `AAAA-MM-JJ`) dans le JSON-LD
- `Mise à jour : …` dans le `<noscript>` français
- `Dernière mise à jour : ….` dans `llms.txt`

→ Le build **refuse de tourner** si ces dates ne concordent pas, si une traduction de FAQ manque, ou si le JSON-LD français n'a pas le même nombre de questions que `FAQS`.

Mettre aussi à jour `llms.txt` (résumé pour les IA) si un fait du résumé a changé.

## 5. SEO à chaque mise à jour

- **Nouvelle FAQ** pour chaque nouveauté que les gens vont chercher (ex. « Le PLF 2027 change-t-il le FCR ? »), en FR/AR/EN, avec « à vérifier auprès de la Douane » si non officiel.
- **Requêtes Search Console** : si tu fournis une capture de *Performances → Requêtes*, transformer les questions qui reviennent sans réponse en FAQ.
- **Titre / description** : garder le titre ≤ 65 caractères utiles et la description vers 150-160 caractères pour éviter qu'elle soit coupée. Les textes AR/EN sont dans `META` de `build.mjs`.
- Pas de bourrage de mots-clés, pas de contenu dupliqué, pas de faux avis : risque de pénalité Google.

## 6. Build et vérification

```bash
sh build.sh
```

Le build :
- vérifie la cohérence de la source (dates, FAQ, traductions) ;
- génère `index.html` (FR), `ar/index.html`, `en/index.html` avec title, meta, canonical, `hreflang`, JSON-LD et `<noscript>` dans chaque langue ;
- vérifie chaque page générée (langue, canonical, `hreflang`, JSON-LD valide) ;
- régénère `sitemap.xml` (la date `lastmod` ne change que pour les pages modifiées).

Puis tester en local, sur un port libre (le 8765 est souvent pris par un autre projet) :

```bash
python3 -m http.server 8792   # http://localhost:8792/ , /ar/ , /en/
```

À vérifier dans le navigateur : les 3 langues s'affichent, l'arabe est de droite à gauche, les boutons de langue changent de page, la nouvelle FAQ apparaît, aucune erreur dans la console.

Si `build.mjs` ou le JavaScript de la page a changé : passer une revue de code (`code-reviewer`) avant de commiter.

## 7. Commit

Commiter la source **et** les fichiers générés, jamais `.DS_Store` ni `NOTES.local.md` :

```bash
git add index.src.html index.html ar/index.html en/index.html sitemap.xml llms.txt
git commit -m "content: …"     # préfixes : content, seo, fix, feat
```

## 8. Mise en ligne (toi)

```bash
git -C ~/fcr-tunisie push origin main
```

## 9. Après la mise en ligne

Automatique : GitHub Pages publie en 1 à 2 minutes, puis le workflow **IndexNow** prévient Bing/Yandex (et donc ChatGPT Search / Copilot).

Contrôles (Claude) :

```bash
for u in / /ar/ /en/ /sitemap.xml; do curl -s -o /dev/null -w "$u %{http_code}\n" https://fcr-tunisie.com$u; done
gh run list -R abdelaziz-tleti/fcr-tunisie -L 3      # IndexNow doit être « ok », réponse HTTP 200 ou 202
```

Search Console (toi, avec le compte Google qui gère la propriété) :
- **Inspection de l'URL** → demander l'indexation des pages modifiées (`/`, `/ar/`, `/en/`).
- **Sitemaps** : à renvoyer seulement si de nouvelles URL ont été ajoutées.

## Une fois par mois

- Search Console → **Performances** : clics, impressions, position moyenne, nouvelles requêtes (idées de FAQ).
- Search Console → **Pages** : pages non indexées et leur raison.
- Mettre à jour `AUDIT.md` (statuts) et avancer dans `BACKLINKS.md` (le levier n°1 pour le classement).
