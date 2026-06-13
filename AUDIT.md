# FCR Tunisie — Plan d'audit PO / QA

> Site : https://fcr-tunisie.com — checklist FCR (importation véhicule, changement de résidence). Statique, trilingue FR/EN/AR, hébergé sur GitHub Pages.
> Dernière revue : 13 juin 2026.

## Légende statut
- ✅ Fait / conforme · ⚠️ À surveiller · ⬜ À faire (action humaine)

---

## 1. Exactitude de l'information (PO)

| # | Point à vérifier | Source de vérité | Statut |
|---|---|---|---|
| 1.1 | Âge véhicule ≤ 5 ans (tourisme + utilitaire léger < 3,5 t) | Douane TN | ✅ |
| 1.2 | Résidence ≥ 2 ans à l'étranger | Douane TN | ✅ |
| 1.3 | ≤ 183 jours/an en Tunisie (décret juin 2024) | Décret 2024 | ✅ |
| 1.4 | Privilège 1×/10 ans (LF 2024) | LF 2024 | ✅ |
| 1.5 | Exonération partielle 25 % (30 % grosses cylindrées) | Guides 2026 | ✅ |
| 1.6 | Plaque RS « ن ت » incessible vs plaque normale | Douane TN | ✅ |
| 1.7 | Condition importation de devises | LF 2024 | ✅ |
| 1.8 | Conduite RS : conjoint + en présence du bénéficiaire | Douane TN | ✅ |
| 1.9 | Liste documentaire (32 pages passeport, Annexe V, Modèle 6.3.41…) | À confirmer bureau de douane | ⚠️ |
| 1.10 | Mention « outil non officiel » + renvoi sources officielles | — | ✅ |

**Action PO** : revalider la liste documentaire (1.9) auprès d'un transitaire / bureau de douane réel, car elle peut varier. Re-vérifier 1.3–1.5 à chaque loi de finances (annuel).

---

## 2. Navigation & UX — Mobile first (QA)

| # | Cas de test | Attendu | Statut |
|---|---|---|---|
| 2.1 | Ouverture mobile (375 px) | Aucun débordement horizontal | ✅ |
| 2.2 | Barre de phases | Collante en haut, défilable au doigt | ✅ |
| 2.3 | Cibles tactiles | ≥ 44 px (items nav 58 px) | ✅ |
| 2.4 | Header mobile | Sous-titre masqué, langue compacte | ✅ |
| 2.5 | Sélecteur FR/EN/العربية | Bascule + RTL en arabe | ✅ |
| 2.6 | Sous-menus (desktop) | Scroll vers le groupe + flash | ✅ |
| 2.7 | Progression | Sauvegarde locale persistante | ✅ |
| 2.8 | Pastille « validé » | Animation tampon, lisible | ✅ |
| 2.9 | Tablette (768) / desktop (1280) | Mise en page 2 colonnes | ✅ |
| 2.10 | `prefers-reduced-motion` | Animations désactivées | ✅ |

**À tester manuellement** : iPhone Safari, Android Chrome (vrais appareils), rotation paysage, clavier (focus visible).

---

## 3. Accessibilité (a11y)

| # | Point | Statut |
|---|---|---|
| 3.1 | Contraste texte (couleurs assombries) | ✅ |
| 3.2 | Langue `<html lang>` + `dir` dynamiques | ✅ |
| 3.3 | Focus visible sur cases à cocher | ✅ |
| 3.4 | Icônes décoratives `aria-hidden` | ✅ |
| 3.5 | Navigation clavier complète | ⚠️ à tester |
| 3.6 | Lecteur d'écran (VoiceOver/TalkBack) | ⬜ à tester |

---

## 4. SEO technique

| # | Élément | Statut |
|---|---|---|
| 4.1 | Title + meta description optimisés | ✅ |
| 4.2 | Canonical | ✅ |
| 4.3 | Open Graph + Twitter Card + image | ✅ |
| 4.4 | JSON-LD : Organization, WebSite, WebPage, Article, HowTo, FAQPage (9 Q) | ✅ |
| 4.5 | robots.txt (+ bots IA autorisés) | ✅ |
| 4.6 | sitemap.xml soumis à Search Console | ✅ |
| 4.7 | llms.txt (référencement IA) | ✅ |
| 4.8 | Contenu texte visible riche (article trilingue) | ✅ |
| 4.9 | Fallback `<noscript>` pour bots sans JS | ✅ |
| 4.10 | Vitesse (statique, minifié) | ✅ |
| 4.11 | HTTPS + redirection www | ✅ / ⚠️ (cert www en cours) |

---

## 5. Référencement / hors-page (le vrai levier « être premier »)

> Le technique est saturé. Le classement dépend maintenant des **backlinks**, du **trafic** et du **temps**.

| # | Action | Priorité | Statut |
|---|---|---|---|
| 5.1 | Google Search Console : indexation + sitemap | Haute | ✅ |
| 5.2 | Bing Webmaster Tools (Bing + ChatGPT/Copilot) | Haute | ⬜ |
| 5.3 | Demander l'indexation de l'URL (Inspection d'URL) | Haute | ⬜ |
| 5.4 | Backlinks : groupes Facebook « Tunisiens de France/Europe », « FCR Tunisie » | Haute | ⬜ |
| 5.5 | Forums (tunisie.co, forum auto), Reddit r/Tunisia | Moyenne | ⬜ |
| 5.6 | Annuaires TN + Google Business Profile | Moyenne | ⬜ |
| 5.7 | Partage WhatsApp / TikTok / YouTube (démo) | Moyenne | ⬜ |
| 5.8 | Obtenir des liens depuis blogs auto TN (auto-prix, automobile.tn) | Haute | ⬜ |
| 5.9 | Contenu frais : 1 article/mois (calcul taxes, FCR par pays…) | Moyenne | ⬜ |

**Mots-clés cibles** : « FCR Tunisie », « importer voiture Tunisie FCR », « FCR 2026 », « changement de résidence Tunisie voiture », « conditions FCR », « plaque RS Tunisie », « FCR depuis la France ».

---

## 6. Régression / QA technique

- [ ] Le `build.sh` régénère bien `index.html` depuis `index.src.html`.
- [ ] JSON-LD valide (testeur : search.google.com/test/rich-results).
- [ ] Aucune erreur console navigateur.
- [ ] localStorage : coches conservées après refresh, reset fonctionne.
- [ ] Bascule de langue : tout le contenu traduit, pas de texte manquant.
- [ ] Liens externes en `target=_blank rel=noopener`.

---

## Cadence de revue
- **Mensuelle** : trafic Search Console, positions mots-clés, backlinks.
- **À chaque loi de finances (annuel)** : revalider les chiffres (§1).
- **Trimestrielle** : test mobile réel + accessibilité.
