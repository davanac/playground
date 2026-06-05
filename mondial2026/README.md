# ⚽ Mondial 2026 — Mon calendrier

Page web statique pour **composer son calendrier de la Coupe du Monde 2026** : on coche les matchs que l'on veut suivre, puis on les ajoute à **Google Agenda** (un lien par match) ou on télécharge un fichier **`.ics`** universel (Apple Calendar, Outlook, Proton, etc.).

Tous les horaires sont affichés en **heure belge**, avec un rappel 15 minutes avant chaque match et un lien vers la diffusion en direct (RTBF Auvio).

## Fonctionnalités

- Les **104 matchs**, regroupés par jour, avec stade et phase.
- Filtres : par équipe (recherche), par groupe (A→L), phase de groupes / phases finales, raccourcis « Diables Rouges » et « Matchs phares ».
- Export **Google Agenda** (direct) **ou `.ics`** (tout autre agenda).
- Aucun compte, aucun tracker, aucune donnée stockée. Tout se passe dans le navigateur.

## Utilisation

Ouvrir `index.html` dans un navigateur, ou consulter la version publiée.

## Stack

HTML + CSS + JavaScript vanilla, un seul fichier, sans build ni dépendance (hormis Google Fonts). Conversion des horaires gérée via `Intl` (UTC → `Europe/Brussels`).

## Données

Calendrier des rencontres d'après les horaires publiés (UK) convertis en heure belge (UK + 1 h). Les affiches des phases à élimination directe se précisent au fil du tournoi.

## Développement

Voir [`CLAUDE.md`](./CLAUDE.md) pour l'architecture, la charte graphique, la préparation de la version publique et le déploiement.

## Crédits

Réalisé par Damien Van Achter — [da.van.ac](https://da.van.ac). Diffusion des matchs : RTBF (La Une / Tipik / Auvio).
