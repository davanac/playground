# CLAUDE.md — Mondial 2026 · Sélecteur de matchs → agenda

Fichier de pilotage pour Claude Code. Lis-le entièrement avant toute modification.

## 1. Le projet en une phrase

Une **page web statique unique** (`index.html`) qui liste les **104 matchs de la Coupe du Monde 2026** ; l'utilisateur coche ceux qu'il veut suivre, puis les ajoute à **Google Agenda** (un lien par match) ou télécharge un **`.ics`** universel (Apple Calendar, Outlook, etc.). Tous les horaires sont en **heure belge**. Destinée à être **publiée publiquement** (GitHub Pages).

## 2. Contraintes techniques (à respecter absolument)

- **Vanilla only** : `index.html` (HTML + CSS + JS inline) + dossier `fonts/` (woff2 auto-hébergés). **Zéro dépendance, zéro build, zéro framework, zéro backend.** **Aucune ressource tierce au chargement** : les polices Anton + DM Sans sont auto-hébergées (`@font-face` → `fonts/*.woff2`, sous-ensembles latin + latin-ext), conformément au pilier **Souveraineté** de la charte FLTR. Ne PAS réintroduire de `<link>` Google Fonts. Liens externes (RTBF Auvio, Google Agenda, GitHub) uniquement sur clic utilisateur.
- **Aucun stockage navigateur** (`localStorage`/`sessionStorage` interdits). L'état de sélection vit en mémoire (`Set` JS) le temps de la session.
- **Aucune donnée personnelle ni tracker.** Pas d'analytics par défaut (cohérent avec la ligne « souveraineté numérique »).
- La page doit rester **100 % fonctionnelle en ouvrant le fichier en local** (double-clic) comme servie en HTTPS.

## 3. Architecture du fichier `index.html`

- `RAW` : tableau des 104 matchs. Chaque entrée = `[n, "MM-DD", "HH:MM", domicile, exterieur, cat, label, lieu]`.
  - `n` = numéro officiel FIFA du match (1→104). Sert d'identifiant stable.
  - `"HH:MM"` = **heure britannique (UK / BST, UTC+1)**. ⚠️ Ce n'est PAS l'heure belge.
  - `cat` = lettre de groupe `"A"…"L"` pour la phase de groupes, sinon code de phase `"R32" | "R16" | "QF" | "SF" | "BRONZE" | "FINAL"`.
- **Conversion horaire** : chaque match est construit avec `new Date('2026-MM-DDTHH:MM:00+01:00')` (offset BST). L'affichage et le regroupement par jour se font via `Intl.DateTimeFormat(..., {timeZone:'Europe/Brussels'})`. Le `.ics` et les liens Google exportent en **UTC** (`...Z`). Ne jamais coder l'heure belge en dur : tout passe par la conversion.
- `FLAGS` : map nom FR → emoji drapeau.
- `FIXED_UID` : UIDs d'événements stables pour quelques matchs (voir §5, à neutraliser pour le public).
- Fonctions clés : `render()` (liste + filtres), `buildICS()` + `download()` (`.ics` universel — voie **principale et recommandée**, tous agendas, sans compte), `openAdd()` + modale multi-fournisseurs.
- **Ajout en ligne multi-agendas** (Mobilité / Souveraineté — aucun fournisseur privilégié) : tableau `PROVIDERS` = Google (`gcalURL`), Outlook.com + Outlook 365 (`outlookURL(m,host)`, deeplink ISO), Yahoo (`yahooURL`, `st`+`dur`). Onglets `#provtabs` (`gProvider`, `buildProvTabs()`), liste régénérée par `buildGList()`. Apple/Proton/Thunderbird → passent par le `.ics`. Helpers communs : `EVT_TITLE`/`EVT_DESC`/`evtEnd`.

### Source des données
Calendrier UK : Sky Sports (« World Cup 2026 fixture schedule and UK kick-off times »). Horaires belges vérifiés sur les matchs des Diables (RTBF / FotMob). **Règle de conversion : heure belge = heure UK + 1 h.**

## 4. Charte graphique dvnc — APPLIQUÉE

**Source de vérité de la charte** : `~/GitHub/FLTR/design-system/` (README.txt + `/logo` + `/dots`). C'est le kit identité officiel « dvnc ». Toujours s'y référer avant de toucher au design.

Palette de marque appliquée dans les `:root{--...}` (juin 2026) :
- `--navy:#0E3556` — couleur de marque (wordmark & 5e point / Solidarité), sert de base au thème sombre.
- `--blue:#179FCD` — cyan / Souveraineté
- `--green:#4FB68D` — vert / Imprévisibilité
- `--yellow:#F1C26F` — jaune-pêche / Mobilité
- `--pink:#DC3E55` — rouge corail / Factualité

Dérivés de surface : `--bg:#0a2a44` (fond), `--panel:#0E3556` (cartes = navy canonique), `--panel2:#0c304e`, `--line:#1c4a6c`, `--txt:#eef4fa`, `--muted:#8ea8c0`, `--ink:#082033` (encre sombre sur aplats vifs).

Typo : **Anton** (titres) + **DM Sans** (texte) — aucune police de marque imposée par le kit, on conserve.

Identité visuelle en place :
- **Favicon** = `favicon.png` (logo dvnc officiel, `dvnc-square-512.png`).
- **Footer** : crédit texte seul (lien « davanac » → `da.van.ac`). Pas de bannière/logo image dans le footer (essai bannière retiré — rendu peu satisfaisant). L'identité visuelle passe par le favicon + les tokens de charte.
- **Header** : tous les **48 drapeaux des nations qualifiées** sont rendus dynamiquement dans `.flagrow#flagrow` via `renderFlags()` (équipes de phase de groupes, ordre A→L, depuis la map `FLAGS`).
- **Emblème FIFA dans le header** : `fifa-wc2026-logo.svg`, à droite du titre (`.herorow` flex, hauteur `clamp(120px,23vw,210px)`). Asset officiel fourni par Damien (URL digitalhub.fifa.com), **auto-hébergé** et **optimisé** : SVG original 3,6 Mo → 427 Ko (le raster PNG encodé a été downscalé 827×2031 → 260×638 RGBA, paths vectoriels intacts, viewBox 0 0 32 48). Zéro requête tierce conservée.
- ⚠️ **Droits FIFA** : l'emblème est une marque déposée FIFA, intégré sur décision explicite de Damien (informé du risque). La mention légale du footer (« projet indépendant, sans lien officiel avec la FIFA ; marques = propriété de leurs détenteurs ») **doit rester** — c'est ce qui rend l'usage défendable (pattern site de fan). Ne pas la retirer.
- **`og-image.png`** régénérée aux couleurs de marque (fond navy, accents, signature dots).
- `theme-color` = `#0E3556`.

⚠️ Refactorer toujours via les `:root{--...}` — ne pas disperser de valeurs en dur. Quelques rgba dérivés des accents existent dans le CSS (gradients du fond, `.match.sel`, `.tag.ko`) : les garder synchronisés si les hex de marque changent. Le `stroke` du SVG check (`#082033`) reproduit `--ink` (les attributs SVG n'acceptent pas `var()`).

## 5. Passage en version PUBLIQUE (FAIT)

Préparation publique appliquée (juin 2026). Domaine d'URL retenu : **`davanac.github.io/playground/mondial2026/`** ; domaine neutre des UIDs : **`mondial.da.van.ac`** (stable, indépendant de l'URL de publication, pour rester valable si le site migre vers un domaine perso).

1. ✅ **UIDs d'événements** : `@davanac` → `@mondial.da.van.ac` dans `FIXED_UID` et le fallback `buildICS()` (`cdm2026-m{n}@mondial.da.van.ac`). UIDs **stables par match** conservés.
2. ✅ **Bloc d'aide** : `<details class="help">` réécrit en texte générique, sans référence personnelle, avec instructions Google Agenda + Apple Calendar + Outlook/Proton.
3. ✅ **Pied de page** : `<footer class="credits">` ajouté — crédit `da.van.ac`, sources (Sky Sports / RTBF), mention « diffusion gratuite RTBF Auvio », avertissement « affiches des phases finales s'affineront », rappel « aucun tracker ».
4. ✅ **Métadonnées de partage** : `description`, Open Graph et Twitter Card ajoutés dans `<head>` ; image `og-image.png` (1200×630, charte) générée à la racine du dossier.
5. ✅ **Accessibilité** : `:focus-visible` global, `aria-label` sur boutons icône (fermeture modale, recherche), emoji décoratifs en `aria-hidden`. `lang="fr"` déjà présent.
6. (Optionnel, non fait) Bouton « Tout ouvrir » pour les liens Google : volontairement écarté (blocage multi-onglets) — l'import `.ics` reste la voie privilégiée.

⚠️ Si l'URL de publication change (déplacement hors du playground, domaine perso), mettre à jour les URLs absolues dans `<head>` (`og:url`, `og:image`, `twitter:image`, `canonical`). Les UIDs, eux, ne changent PAS (c'est voulu).

## 6. Déploiement — double hébergement (GitHub Pages + Codeberg Pages)

Le repo `playground` est poussé sur **deux forges** (souveraineté) :

**Remote `origin` = double-push** (configuré sur le laptop) :
- fetch : `https://github.com/davanac/playground.git`
- push  : GitHub (HTTPS) **+** `git@codeberg.org:davanac/playground.git` (SSH)
- → `git push origin main` envoie le code sur **GitHub ET Codeberg** en une commande.

**GitHub Pages** : workflow `.github/workflows/pages.yml` déploie tout le repo au push sur `main`.
URL : `https://davanac.github.io/playground/mondial2026/`.

**Codeberg Pages** : sert la branche **`pages`** du repo → URL `https://davanac.codeberg.page/playground/mondial2026/`.
⚠️ La branche `pages` **ne se met PAS à jour** avec le double-push (qui ne touche que `main`). Après chaque mise à jour de `main`, rafraîchir Codeberg Pages avec :
```
git push git@codeberg.org:davanac/playground.git main:pages
```
Clés SSH Codeberg : `davanac-laptop` (laptop) et `imac-codeberg` (iMac), compte `davanac`.

**Domaine perso** (optionnel) : `CNAME` à la racine (p. ex. `mondial.da.van.ac`) + DNS CNAME, forcer HTTPS. Côté Codeberg : fichier `.domains`.

NB partage : les balises `og:image`/`canonical` pointent vers l'URL **GitHub** (canonique). Le site Codeberg fonctionne à 100 %, seuls les aperçus sociaux référencent GitHub.

## 7. Maintenance des données pendant le tournoi

À mesure que les groupes se terminent, les libellés des phases finales (`"Vainq. Gr. G"`, `"3e (A/E/H/I/J)"`, `"Vainq. M89"`…) deviennent de vraies équipes. Mettre à jour les entrées correspondantes du tableau `RAW` (colonnes domicile/extérieur) **sans changer `n`** pour préserver les UIDs. Les dates/heures/stades des KO sont déjà fermes.

## 8. Conventions

- Commits courts et explicites (FR ou EN, au choix mais cohérent), p. ex. `feat: liens Google Agenda`, `fix: conversion horaire finale`, `chore: tokens charte`.
- Tester systématiquement les 3 matchs des Diables (n°14, 38, 65) et la finale (n°104) après toute modif touchant aux horaires.
- Ne pas réintroduire de match pré-coché : la sélection démarre **vide**.
