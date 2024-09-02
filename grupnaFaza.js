const grupe = require("./groups.json");
const utakmice = require("./exibitions.json");

const izracunajFormu = (timISO) => {
  const prijateljskiMecevi = utakmice[timISO];

  if (!prijateljskiMecevi) return 0; // Ako nema prethodno odigranih utakmica, forma je 0

  let forma = 0;
  prijateljskiMecevi.forEach((mec) => {
    // Deli string Result na poene jednog i drugog tima, a map prolazi kroz svaki
    // od tih stringova rezultata i sa Number ih konvertuje u brojeve
    // Ovde se rezultat split f-je dodeljuje domacinPoeni, protivnikPoeni varijablama
    const [domacinPoeni, protivnikPoeni] = mec.Result.split("-").map(Number);
    forma += domacinPoeni - protivnikPoeni; // Na formu utice razlika u poenima
  });

  return forma / prijateljskiMecevi.length; // Prosečna forma na osnovu odigranih prethodnih utakmica
};

const azurirajTabelu = (pozicije, tim, pobeda, poeni, protivnikPoeni) => {
  // Proverava da li u objektu pozicije postoji unos za tim 'tim.ime'
  if (!pozicije[tim.ime]) {
    // Kreira se novi objekat sa navedenim svojstvima
    // Sadrzi informacije o svim timovima, a tim.ime omogućava pristup pojedinom timu
    pozicije[tim.ime] = {
      ime: tim.ime,
      pobede: 0,
      porazi: 0,
      poeni: 0,
      postignuto: 0,
      primljeno: 0,
    };
  }
  // Na ukupan broj poena koje tim ima do sada, dodaje se rezultat poslednje odigrane utakmice
  pozicije[tim.ime].postignuto += poeni;
  // ...kao i primljene poene
  pozicije[tim.ime].primljeno += protivnikPoeni;
  // ternarni operator za if-else (zavisi od parametra pobeda: 2 ako je true, 1 ako je false)
  pozicije[tim.ime].poeni += pobeda ? 2 : 1;
  // Azurira ukupan broj pobeda (ili poraza) za tim
  if (pobeda) pozicije[tim.ime].pobede += 1;
  else pozicije[tim.ime].porazi += 1;
};

const simulirajUtakmicu = (tim1, tim2) => {
  const sansaZaPobedu1 = tim1.FIBARanking / (tim1.FIBARanking + tim2.FIBARanking); // Verovatnoća pobede prvog tima
  /* broj poena prvog tima, generise se kao random broj izmedju 70 i 120, osnova je 70, a dodatak random broj izmedju 0 i 50 */
  /* deo (1 - sansaZaPobedu1) * 10 se zasniva na verovatnoci pobede protivnika. Sto je veca verovatnoca pobede protivnika, tim ce postici manje poena */

  const forma1 = izracunajFormu(tim1.ISOCode);
  const forma2 = izracunajFormu(tim2.ISOCode);

  const rezultat1 = Math.floor(Math.random() * 50) + 70 + Math.floor((1 - sansaZaPobedu1 + forma1 * 0.05) * 10);
  const rezultat2 = Math.floor(Math.random() * 50) + 70 + Math.floor((sansaZaPobedu1 + forma2 * 0.05) * 10);

  // Vraca objekat koji sadrzi info. o oba tima nakon odigrane utakmice
  return {
    tim1: {
      ime: tim1.Team,
      rezultat: rezultat1,
      pobeda: rezultat1 > rezultat2,
    },
    tim2: {
      ime: tim2.Team,
      rezultat: rezultat2,
      pobeda: rezultat2 > rezultat1, // Ako je rezultat2 > pobeda je true
    },
  };
};

// Sortira timove na osnovu broja bodova, kos razlike i broja postignutih koševa
const rangirajTimove = (timovi) => {
  /* Ako sort vrati negativan br. a je ispred b */
  /* Ako vrati pozitivan, b je ispred a, a ako vrati 0 pozicija im je ista */
  return timovi.sort((a, b) => {
    // Prvi kriterijum za poređenje - broj bodova koje je tim ostvario
    if (a.poeni !== b.poeni)
      // Ako b ima više poena od a (b je pozitivan) pa će ići ispred a u sortiranju
      return b.poeni - a.poeni;

    // Ako su timovi isti po broju bodova, porede se po koš razlici
    const kosRazlikaA = a.postignuto - a.primljeno;
    const kosRazlikaB = b.postignuto - b.primljeno;
    if (kosRazlikaA !== kosRazlikaB) return kosRazlikaB - kosRazlikaA;

    return b.postignuto - a.postignuto;
  });
};

const simulirajGrupnuFazu = () => {
  // Objekat u kome se beleže rezultati i statistika timova
  const tabele = {};
  /* Prolazi kroz sve grupe */
  /* Object.keys() vraća niz svih ključeva datog objekta (grupe objekat u ovom slučaju) */
  /* Konkretno, vraća A, B i C grupe */
  /* forEach kasnije prolazi kroz svaki element niza koji je vratio Object.keys() */
  Object.keys(grupe).forEach((grupa) => {
    console.log(`Grupna faza - I kolo:\n    Grupa ${grupa}:`);
    tabele[grupa] = {};
    // Predstavlja niz svih timova u trenutnoj grupi
    const timovi = grupe[grupa];

    // Prva petlja prolazi kroz svaki tim u grupi
    for (let i = 0; i < timovi.length; i++) {
      // Prolazi kroz sve ostale timove u grupi koji nisu igrali međusobno sa timom sa indeksom i
      for (let j = i + 1; j < timovi.length; j++) {
        // Vraca objekat koji sadrzi info. o rezultatu utakmice odigranih timova
        const rezultatIgra = simulirajUtakmicu(timovi[i], timovi[j]);
        console.log(`        ${rezultatIgra.tim1.ime} - ${rezultatIgra.tim2.ime} (${rezultatIgra.tim1.rezultat} : ${rezultatIgra.tim2.rezultat})`);
        azurirajTabelu(tabele[grupa], rezultatIgra.tim1, rezultatIgra.tim1.pobeda, rezultatIgra.tim1.rezultat, rezultatIgra.tim2.rezultat);
        azurirajTabelu(tabele[grupa], rezultatIgra.tim2, rezultatIgra.tim2.pobeda, rezultatIgra.tim2.rezultat, rezultatIgra.tim1.rezultat);
      }
    }
  });

  // Štampa konačan plasman tabela u grupama
  console.log("\nKonačan plasman u grupama: ");
  // Niz u koji se smeštaju timovi koji su među prva 3 u svojim grupama
  const sviTimovi = [];
  Object.keys(grupe).forEach((grupa) => {
    // Čuva sve timove u određenoj grupi, zatim ih sortira
    const timovi = Object.values(tabele[grupa]);
    const sortiraniTimovi = rangirajTimove(timovi);

    console.log(`   Grupa ${grupa} (Tim - pobede / porazi / bodovi / postignuto koševa / primljeno koševa / koš razlika): `);
    sortiraniTimovi.forEach((tim, index) => {
      const kosRazlika = tim.postignuto - tim.primljeno;
      console.log(
        `       ${index + 1}. ${tim.ime}: ${tim.pobede} / ${tim.porazi} / ${tim.poeni} / ${tim.postignuto} / ${tim.primljeno} / ${
          kosRazlika > 0 ? "+" : ""
        }${kosRazlika}`
      );
      // Prva 3 tima iz svake grupe se dodaju u niz sviTim ovi, koji se koristi za simulaciju druge faze takmičenja
      if (index < 3) sviTimovi.push(tim);
    });
  });

  return sviTimovi;
};

module.exports = { simulirajGrupnuFazu };
