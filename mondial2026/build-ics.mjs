// Génère les .ics d'abonnement (un par équipe + "tous") dans ./ics/
// Source : data.js (RAW/FIXED_UID/teamSlug/qualifiedTeams). Lancer : node build-ics.mjs
// Régénérer + pousser à chaque palier du tournoi (les UIDs stables → mise à jour, pas de doublon).

import { createRequire } from 'module';
import { mkdirSync, writeFileSync, rmSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const { RAW, FIXED_UID, teamSlug, qualifiedTeams } = require('./data.js');

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'ics');
const WATCH = 'https://auvio.rtbf.be/direct';
const TTL = 'PT12H'; // hint de rafraîchissement pour les abonnements

// --- helpers date : heure UK (BST +01:00) → UTC pour l'ICS ---
const pad = n => String(n).padStart(2, '0');
function icsUTC(d) {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}
const esc = s => String(s).replace(/[\\,;]/g, m => '\\' + m);

const matches = RAW.map(r => {
  const [n, md, hm, home, away, cat, label, loc] = r;
  const dt = new Date(`2026-${md}T${hm}:00+01:00`);
  return { n, dt, home, away, cat, label, loc };
}).sort((a, b) => a.dt - b.dt);

const STAMP = icsUTC(new Date());

function vevent(m) {
  const end = new Date(m.dt.getTime() + 2*3600*1000);
  const uid = FIXED_UID[m.n] || `cdm2026-m${m.n}@mondial.da.van.ac`;
  const sum = `⚽ ${m.home} – ${m.away}`;
  const desc = `Coupe du Monde 2026 — ${m.label}\\n\\n📺 Regarder en direct sur RTBF Auvio (gratuit · La Une / Tipik) :\\n${WATCH}`;
  return [
    'BEGIN:VEVENT',
    'UID:' + uid,
    'DTSTAMP:' + STAMP,
    'DTSTART:' + icsUTC(m.dt),
    'DTEND:' + icsUTC(end),
    'SUMMARY:' + esc(sum),
    'LOCATION:' + esc(m.loc),
    'URL:' + WATCH,
    'DESCRIPTION:' + desc,
    'BEGIN:VALARM', 'TRIGGER:-PT15M', 'ACTION:DISPLAY',
    'DESCRIPTION:' + esc(sum) + ' dans 15 min', 'END:VALARM',
    'END:VEVENT',
  ];
}

function calendar(calName, evs) {
  const L = [
    'BEGIN:VCALENDAR', 'VERSION:2.0',
    'PRODID:-//Damien Van Achter//CDM 2026//FR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'X-WR-CALNAME:' + esc(calName), 'X-WR-TIMEZONE:Europe/Brussels',
    'REFRESH-INTERVAL;VALUE=DURATION:' + TTL, 'X-PUBLISHED-TTL:' + TTL,
  ];
  evs.sort((a, b) => a.dt - b.dt).forEach(m => L.push(...vevent(m)));
  L.push('END:VCALENDAR');
  return L.join('\r\n') + '\r\n';
}

// --- (re)génération propre du dossier ics/ ---
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const written = [];
// un fichier par équipe qualifiée (matchs où l'équipe apparaît — poule + KO résolus)
for (const team of qualifiedTeams()) {
  const evs = matches.filter(m => m.home === team || m.away === team);
  const file = teamSlug(team) + '.ics';
  writeFileSync(join(OUT, file), calendar(`CDM 2026 — ${team}`, evs), 'utf-8');
  written.push({ file, n: evs.length });
}
// preset : tous les matchs
writeFileSync(join(OUT, 'tous-les-matchs.ics'), calendar('Coupe du Monde 2026 — Tous les matchs', matches.slice()), 'utf-8');
written.push({ file: 'tous-les-matchs.ics', n: matches.length });

console.log(`${written.length} fichiers .ics générés dans ics/`);
console.log('exemple belgique.ics :', written.find(w => w.file === 'belgique.ics'));
console.log('total fichiers sur disque :', readdirSync(OUT).length);
