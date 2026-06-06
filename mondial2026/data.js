// Source de données UNIQUE — utilisée par index.html (navigateur, scope global)
// ET par build-ics.mjs (Node, via module.exports). Ne pas dupliquer ailleurs.
//
// RAW : [n, "MM-DD", "HH:MM"(heure UK 24h), domicile, exterieur, cat, label, lieu]
//   n   = numéro officiel FIFA (identifiant stable → UID)
//   cat = lettre de groupe "A".."L", sinon "R32"|"R16"|"QF"|"SF"|"BRONZE"|"FINAL"
// Conversion : heure belge = heure UK + 1 h (offset BST +01:00 à la construction).

const FLAGS={
 "Mexique":"🇲🇽","Afrique du Sud":"🇿🇦","Corée du Sud":"🇰🇷","Tchéquie":"🇨🇿","Canada":"🇨🇦",
 "Bosnie-Herzégovine":"🇧🇦","États-Unis":"🇺🇸","Paraguay":"🇵🇾","Qatar":"🇶🇦","Suisse":"🇨🇭",
 "Brésil":"🇧🇷","Maroc":"🇲🇦","Haïti":"🇭🇹","Écosse":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","Australie":"🇦🇺","Turquie":"🇹🇷",
 "Allemagne":"🇩🇪","Curaçao":"🇨🇼","Pays-Bas":"🇳🇱","Japon":"🇯🇵","Côte d'Ivoire":"🇨🇮",
 "Équateur":"🇪🇨","Suède":"🇸🇪","Tunisie":"🇹🇳","Espagne":"🇪🇸","Cap-Vert":"🇨🇻","Belgique":"🇧🇪",
 "Égypte":"🇪🇬","Arabie saoudite":"🇸🇦","Uruguay":"🇺🇾","Iran":"🇮🇷","Nouvelle-Zélande":"🇳🇿",
 "France":"🇫🇷","Sénégal":"🇸🇳","Irak":"🇮🇶","Norvège":"🇳🇴","Argentine":"🇦🇷","Algérie":"🇩🇿",
 "Autriche":"🇦🇹","Jordanie":"🇯🇴","Portugal":"🇵🇹","RD Congo":"🇨🇩","Angleterre":"🏴󠁧󠁢󠁥󠁮󠁧󠁿",
 "Croatie":"🇭🇷","Ghana":"🇬🇭","Panama":"🇵🇦","Colombie":"🇨🇴","Ouzbékistan":"🇺🇿"
};

const RAW=[
[1,"06-11","20:00","Mexique","Afrique du Sud","A","Groupe A","Mexico, Mexique"],
[2,"06-12","03:00","Corée du Sud","Tchéquie","A","Groupe A","Zapopan, Mexique"],
[3,"06-12","20:00","Canada","Bosnie-Herzégovine","B","Groupe B","Toronto, Canada"],
[4,"06-13","02:00","États-Unis","Paraguay","D","Groupe D","Los Angeles, USA"],
[5,"06-13","20:00","Qatar","Suisse","B","Groupe B","Santa Clara, USA"],
[6,"06-13","23:00","Brésil","Maroc","C","Groupe C","New Jersey, USA"],
[7,"06-14","02:00","Haïti","Écosse","C","Groupe C","Foxborough, USA"],
[8,"06-14","05:00","Australie","Turquie","D","Groupe D","Vancouver, Canada"],
[9,"06-14","18:00","Allemagne","Curaçao","E","Groupe E","Houston, USA"],
[10,"06-14","21:00","Pays-Bas","Japon","F","Groupe F","Arlington, USA"],
[11,"06-15","00:00","Côte d'Ivoire","Équateur","E","Groupe E","Philadelphie, USA"],
[12,"06-15","03:00","Suède","Tunisie","F","Groupe F","Guadalupe, Mexique"],
[13,"06-15","17:00","Espagne","Cap-Vert","H","Groupe H","Atlanta, USA"],
[14,"06-15","20:00","Belgique","Égypte","G","Groupe G","Seattle, USA"],
[15,"06-15","23:00","Arabie saoudite","Uruguay","H","Groupe H","Miami, USA"],
[16,"06-16","02:00","Iran","Nouvelle-Zélande","G","Groupe G","Los Angeles, USA"],
[17,"06-16","20:00","France","Sénégal","I","Groupe I","New Jersey, USA"],
[18,"06-16","23:00","Irak","Norvège","I","Groupe I","Foxborough, USA"],
[19,"06-17","02:00","Argentine","Algérie","J","Groupe J","Kansas City, USA"],
[20,"06-17","05:00","Autriche","Jordanie","J","Groupe J","Santa Clara, USA"],
[21,"06-17","18:00","Portugal","RD Congo","K","Groupe K","Houston, USA"],
[22,"06-17","21:00","Angleterre","Croatie","L","Groupe L","Arlington, USA"],
[23,"06-18","00:00","Ghana","Panama","L","Groupe L","Toronto, Canada"],
[24,"06-18","03:00","Ouzbékistan","Colombie","K","Groupe K","Mexico, Mexique"],
[25,"06-18","17:00","Tchéquie","Afrique du Sud","A","Groupe A","Atlanta, USA"],
[26,"06-18","20:00","Suisse","Bosnie-Herzégovine","B","Groupe B","Los Angeles, USA"],
[27,"06-18","23:00","Canada","Qatar","B","Groupe B","Vancouver, Canada"],
[28,"06-19","02:00","Mexique","Corée du Sud","A","Groupe A","Zapopan, Mexique"],
[29,"06-19","20:00","États-Unis","Australie","D","Groupe D","Seattle, USA"],
[30,"06-19","23:00","Écosse","Maroc","C","Groupe C","Foxborough, USA"],
[31,"06-20","01:30","Brésil","Haïti","C","Groupe C","Philadelphie, USA"],
[32,"06-20","04:00","Turquie","Paraguay","D","Groupe D","Santa Clara, USA"],
[33,"06-20","18:00","Pays-Bas","Suède","F","Groupe F","Houston, USA"],
[34,"06-20","21:00","Allemagne","Côte d'Ivoire","E","Groupe E","Toronto, Canada"],
[35,"06-21","01:00","Équateur","Curaçao","E","Groupe E","Kansas City, USA"],
[36,"06-21","05:00","Tunisie","Japon","F","Groupe F","Guadalupe, Mexique"],
[37,"06-21","17:00","Espagne","Arabie saoudite","H","Groupe H","Atlanta, USA"],
[38,"06-21","20:00","Belgique","Iran","G","Groupe G","Los Angeles, USA"],
[39,"06-21","23:00","Uruguay","Cap-Vert","H","Groupe H","Miami, USA"],
[40,"06-22","02:00","Nouvelle-Zélande","Égypte","G","Groupe G","Vancouver, Canada"],
[41,"06-22","18:00","Argentine","Autriche","J","Groupe J","Arlington, USA"],
[42,"06-22","22:00","France","Irak","I","Groupe I","Philadelphie, USA"],
[43,"06-23","01:00","Norvège","Sénégal","I","Groupe I","Toronto, Canada"],
[44,"06-23","04:00","Jordanie","Algérie","J","Groupe J","Santa Clara, USA"],
[45,"06-23","18:00","Portugal","Ouzbékistan","K","Groupe K","Houston, USA"],
[46,"06-23","21:00","Angleterre","Ghana","L","Groupe L","Foxborough, USA"],
[47,"06-24","00:00","Panama","Croatie","L","Groupe L","Foxborough, USA"],
[48,"06-24","03:00","Colombie","RD Congo","K","Groupe K","Zapopan, Mexique"],
[49,"06-24","20:00","Suisse","Canada","B","Groupe B","Vancouver, Canada"],
[50,"06-24","20:00","Bosnie-Herzégovine","Qatar","B","Groupe B","Seattle, USA"],
[51,"06-24","23:00","Maroc","Haïti","C","Groupe C","Atlanta, USA"],
[52,"06-24","23:00","Écosse","Brésil","C","Groupe C","Miami, USA"],
[53,"06-25","02:00","Afrique du Sud","Corée du Sud","A","Groupe A","Guadalupe, Mexique"],
[54,"06-25","02:00","Tchéquie","Mexique","A","Groupe A","Mexico, Mexique"],
[55,"06-25","21:00","Curaçao","Côte d'Ivoire","E","Groupe E","Philadelphie, USA"],
[56,"06-25","21:00","Équateur","Allemagne","E","Groupe E","New Jersey, USA"],
[57,"06-26","00:00","Tunisie","Pays-Bas","F","Groupe F","Kansas City, USA"],
[58,"06-26","00:00","Japon","Suède","F","Groupe F","Arlington, USA"],
[59,"06-26","03:00","Turquie","États-Unis","D","Groupe D","Los Angeles, USA"],
[60,"06-26","03:00","Paraguay","Australie","D","Groupe D","Santa Clara, USA"],
[61,"06-26","20:00","Norvège","France","I","Groupe I","Foxborough, USA"],
[62,"06-26","20:00","Sénégal","Irak","I","Groupe I","Toronto, Canada"],
[63,"06-27","01:00","Cap-Vert","Arabie saoudite","H","Groupe H","Houston, USA"],
[64,"06-27","01:00","Uruguay","Espagne","H","Groupe H","Zapopan, Mexique"],
[65,"06-27","04:00","Nouvelle-Zélande","Belgique","G","Groupe G","Vancouver, Canada"],
[66,"06-27","04:00","Égypte","Iran","G","Groupe G","Seattle, USA"],
[67,"06-27","22:00","Panama","Angleterre","L","Groupe L","New Jersey, USA"],
[68,"06-27","22:00","Croatie","Ghana","L","Groupe L","Philadelphie, USA"],
[69,"06-28","00:30","Colombie","Portugal","K","Groupe K","Miami, USA"],
[70,"06-28","00:30","RD Congo","Ouzbékistan","K","Groupe K","Atlanta, USA"],
[71,"06-28","03:00","Algérie","Autriche","J","Groupe J","Kansas City, USA"],
[72,"06-28","03:00","Jordanie","Argentine","J","Groupe J","Arlington, USA"],
[73,"06-28","20:00","2e Gr. A","2e Gr. B","R32","16e de finale","Los Angeles, USA"],
[76,"06-29","18:00","Vainq. Gr. C","2e Gr. F","R32","16e de finale","Houston, USA"],
[74,"06-29","21:30","Vainq. Gr. E","3e (A/B/C/D/F)","R32","16e de finale","Foxborough, USA"],
[75,"06-30","02:00","Vainq. Gr. F","2e Gr. C","R32","16e de finale","Guadalupe, Mexique"],
[78,"06-30","18:00","2e Gr. E","2e Gr. I","R32","16e de finale","Arlington, USA"],
[77,"06-30","22:00","Vainq. Gr. I","3e (C/D/F/G/H)","R32","16e de finale","New Jersey, USA"],
[79,"07-01","02:00","Vainq. Gr. A","3e (C/E/F/H/I)","R32","16e de finale","Mexico, Mexique"],
[80,"07-01","17:00","Vainq. Gr. L","3e (E/H/I/J/K)","R32","16e de finale","Atlanta, USA"],
[82,"07-01","21:00","Vainq. Gr. G","3e (A/E/H/I/J)","R32","16e de finale","Seattle, USA"],
[81,"07-02","01:00","Vainq. Gr. D","3e (B/E/F/I/J)","R32","16e de finale","Santa Clara, USA"],
[84,"07-02","20:00","Vainq. Gr. H","2e Gr. J","R32","16e de finale","Los Angeles, USA"],
[83,"07-03","00:00","2e Gr. K","2e Gr. L","R32","16e de finale","Toronto, Canada"],
[88,"07-03","19:00","2e Gr. D","2e Gr. G","R32","16e de finale","Arlington, USA"],
[85,"07-03","04:00","Vainq. Gr. B","3e (E/F/G/I/J)","R32","16e de finale","Vancouver, Canada"],
[86,"07-03","23:00","Vainq. Gr. J","2e Gr. H","R32","16e de finale","Miami, USA"],
[87,"07-04","02:30","Vainq. Gr. K","3e (D/E/I/J/L)","R32","16e de finale","Kansas City, USA"],
[90,"07-04","18:00","Vainq. M73","Vainq. M75","R16","8e de finale","Houston, USA"],
[89,"07-04","22:00","Vainq. M74","Vainq. M77","R16","8e de finale","Philadelphie, USA"],
[91,"07-05","21:00","Vainq. M76","Vainq. M78","R16","8e de finale","New Jersey, USA"],
[92,"07-06","01:00","Vainq. M79","Vainq. M80","R16","8e de finale","Mexico, Mexique"],
[93,"07-06","20:00","Vainq. M83","Vainq. M84","R16","8e de finale","Arlington, USA"],
[94,"07-07","01:00","Vainq. M81","Vainq. M82","R16","8e de finale","Seattle, USA"],
[95,"07-07","17:00","Vainq. M86","Vainq. M88","R16","8e de finale","Atlanta, USA"],
[96,"07-07","21:00","Vainq. M85","Vainq. M87","R16","8e de finale","Vancouver, Canada"],
[97,"07-09","21:00","Vainq. M89","Vainq. M90","QF","Quart de finale","Foxborough, USA"],
[98,"07-10","20:00","Vainq. M93","Vainq. M94","QF","Quart de finale","Los Angeles, USA"],
[99,"07-11","22:00","Vainq. M91","Vainq. M92","QF","Quart de finale","Miami, USA"],
[100,"07-12","02:00","Vainq. M95","Vainq. M96","QF","Quart de finale","Kansas City, USA"],
[101,"07-14","20:00","Vainq. M97","Vainq. M98","SF","Demi-finale","Arlington, USA"],
[102,"07-15","20:00","Vainq. M99","Vainq. M100","SF","Demi-finale","Atlanta, USA"],
[103,"07-18","22:00","Perdant M101","Perdant M102","BRONZE","Match 3e place","Miami, USA"],
[104,"07-19","20:00","Vainq. M101","Vainq. M102","FINAL","Finale","New Jersey, USA"]
];

// UIDs stables : réimporter / re-fetch met à jour au lieu de dupliquer
const FIXED_UID={1:"cdm2026-ouverture@mondial.da.van.ac",14:"cdm2026-bel-egy@mondial.da.van.ac",38:"cdm2026-bel-irn@mondial.da.van.ac",65:"cdm2026-nzl-bel@mondial.da.van.ac",104:"cdm2026-finale@mondial.da.van.ac"};

// slug ASCII stable pour les noms de fichiers .ics et les liens d'abonnement
function teamSlug(name){
  return name.normalize('NFD').replace(/[̀-ͯ]/g,'')
    .toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}

// Liste des 48 nations qualifiées (équipes de phase de groupes), ordre des groupes A→L
function qualifiedTeams(){
  const seen=new Set(),out=[];
  RAW.filter(r=>r[5].length===1).sort((a,b)=>a[5].localeCompare(b[5])).forEach(r=>{
    [r[3],r[4]].forEach(t=>{if(!seen.has(t)){seen.add(t);out.push(t);}});
  });
  return out;
}

// Hôte canonique des .ics d'abonnement (souveraineté : Codeberg). Ne pas changer
// sans casser les abonnements déjà en place.
const ICS_BASE = "https://davanac.codeberg.page/playground/mondial2026/ics";
const icsHttps  = slug => `${ICS_BASE}/${slug}.ics`;
const icsWebcal = slug => icsHttps(slug).replace(/^https?:/, 'webcal:');

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RAW, FLAGS, FIXED_UID, teamSlug, qualifiedTeams, ICS_BASE, icsHttps, icsWebcal };
}
