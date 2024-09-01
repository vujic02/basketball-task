// https://stackoverflow.com/a/12646864
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const simulirajCetvrtfinale = (ekipa1, ekipa2) => {
  // Faktori za uticaj razlicitih atributa na ishod utakmice
  const snagaEkipe1 = (ekipa1.pobede * 0.5 + ekipa1.poeni * 0.3 + ekipa1.postignuto * 0.1) / (ekipa1.pobede + ekipa1.porazi + 1);
  const snagaEkipe2 = (ekipa2.pobede * 0.5 + ekipa2.poeni * 0.3 + ekipa2.postignuto * 0.1) / (ekipa2.pobede + ekipa2.porazi + 1);
  const ukupnaSnaga = snagaEkipe1 + snagaEkipe2;

  // Verovatnoca da prva ekipa pobedi
  const verovatnocaPobede1 = snagaEkipe1 / ukupnaSnaga;

  // Rezultat se racuna kao ranije
  const rezultat1 = Math.floor(Math.random() * 50) + 70 + Math.floor((1 - verovatnocaPobede1) * 10);
  const rezultat2 = Math.floor(Math.random() * 50) + 70 + Math.floor(verovatnocaPobede1 * 10);

  // Formiranje rezultata utakmice
  return {
    ekipa1: {
      ime: ekipa1.ime,
      rezultat: rezultat1,
      pobeda: rezultat1 > rezultat2,
    },
    ekipa2: {
      ime: ekipa2.ime,
      rezultat: rezultat2,
      pobeda: rezultat2 > rezultat1,
    },
  };
};

const simulacijaPolufinalaFinala = (ekipa1, ekipa2) => {
  // Izračunaj ukupni faktor snage za oba tima
  const snagaEkipe1 = (ekipa1.pobede ? 1 : 0) * 0.5 + ekipa1.rezultat * 0.3;
  const snagaEkipe2 = (ekipa2.pobede ? 1 : 0) * 0.5 + ekipa2.rezultat * 0.3;

  // Normalizuj faktore snage
  const ukupnaSnaga = snagaEkipe1 + snagaEkipe2;
  const verovatnocaPobede1 = ukupnaSnaga === 0 ? 0.5 : snagaEkipe1 / ukupnaSnaga;

  // Odredi rezultat za oba tima
  const rezultat1 = Math.floor(Math.random() * 20) + 80 + Math.floor((1 - verovatnocaPobede1) * 10);
  const rezultat2 = Math.floor(Math.random() * 20) + 80 + Math.floor(verovatnocaPobede1 * 10);

  // Vrati rezultat utakmice
  return {
    ekipa1: {
      ime: ekipa1.ime,
      rezultat: rezultat1,
      pobeda: rezultat1 > rezultat2,
    },
    ekipa2: {
      ime: ekipa2.ime,
      rezultat: rezultat2,
      pobeda: rezultat2 > rezultat1,
    },
  };
};

const kreirajZreb = (rangiraneEkipe) => {
  // Rangirane ekipe svrstava u šešire
  const sesir1 = rangiraneEkipe.slice(0, 2);
  const sesir2 = rangiraneEkipe.slice(2, 4);
  const sesir3 = rangiraneEkipe.slice(4, 6);
  const sesir4 = rangiraneEkipe.slice(6, 8);

  console.log("\nŠeširi:");
  console.log("    Šešir 1");
  sesir1.forEach((ekipa) => console.log(`        ${ekipa.ime}`));
  console.log("    Šešir 2");
  sesir2.forEach((ekipa) => console.log(`        ${ekipa.ime}`));
  console.log("    Šešir 3");
  sesir3.forEach((ekipa) => console.log(`        ${ekipa.ime}`));
  console.log("    Šešir 4");
  sesir4.forEach((ekipa) => console.log(`        ${ekipa.ime}`));

  const paroviCetvrtfinala = [];

  const ukrstanjeEkipa = (timoviSesir1, timoviSesir2) => {
    let izmesanSesir2 = shuffleArray(timoviSesir2);

    timoviSesir1.forEach((ekipa1) => {
      // Pokušava da pronađe protivnika koji nije iz iste grupe
      let protivnik = izmesanSesir2.find((ekipa2) => ekipa1.grupa !== ekipa2.grupa);

      // Ako protivnik nije pronađen, uzima prvog slobodnog
      if (!protivnik) {
        protivnik = izmesanSesir2[0]; // Ovo pretpostavlja da izmesanSesir2 ima bar jedan element.
      }

      // Uparuje timove i uklanja protivnika iz grupe.
      paroviCetvrtfinala.push([ekipa1, protivnik]);
      izmesanSesir2.splice(izmesanSesir2.indexOf(protivnik), 1);
    });
  };

  // Ukrštanje ekipa
  ukrstanjeEkipa(sesir1, sesir4);
  ukrstanjeEkipa(sesir2, sesir3);

  console.log("\nEliminaciona faza:");

  console.log("\nParovi četvrtfinala:");

  const paroviPolufinala = [];
  const porazeniCetvrtfinala = [];

  paroviCetvrtfinala.forEach((par, index) => {
    const [ekipa1, ekipa2] = par;
    console.log(`   \nUtakmica ${index + 1}. Par: ${ekipa1.ime} - ${ekipa2.ime}`);
    const rezultat = simulirajCetvrtfinale(par[0], par[1]);
    const pobednik = rezultat.ekipa1.pobeda ? rezultat.ekipa1 : rezultat.ekipa2;
    const porazen = rezultat.ekipa1.pobeda ? rezultat.ekipa2 : rezultat.ekipa1;

    console.log(
      `   ${index + 1}. Par: ${rezultat.ekipa1.ime} - ${rezultat.ekipa2.ime} | Rezultat: ${rezultat.ekipa1.rezultat} - ${
        rezultat.ekipa2.rezultat
      } | Pobednik: ${pobednik.ime}`
    );

    if (index % 2 === 0) {
      // Prva dva para idu u jedan polufinalni par, sledeća dva u drugi
      paroviPolufinala.push([pobednik]);
    } else {
      paroviPolufinala[paroviPolufinala.length - 1].push(pobednik);
    }

    porazeniCetvrtfinala.push(porazen);
  });

  console.log("\nParovi polufinala:");
  const finalisti = [];
  const porazeniPolufinale = [];

  paroviPolufinala.forEach((parovi, index) => {
    const [prvaEkipa, drugaEkipa] = parovi;
    const rezultatPolufinala = simulacijaPolufinalaFinala(prvaEkipa, drugaEkipa);
    const pobednikPolufinala = rezultatPolufinala.ekipa1.pobeda ? rezultatPolufinala.ekipa1 : rezultatPolufinala.ekipa2;
    const porazenPolufinala = !rezultatPolufinala.ekipa1.pobeda ? rezultatPolufinala.ekipa1 : rezultatPolufinala.ekipa2;

    console.log(
      `   Pobednik meča: ${porazenPolufinala.ime} - ${pobednikPolufinala.ime} | Rezultat: ${porazenPolufinala.rezultat} - ${pobednikPolufinala.rezultat} | Pobednik: ${pobednikPolufinala.ime} je u Finalu.`
    );

    finalisti.push(pobednikPolufinala);
    porazeniPolufinale.push(porazenPolufinala);
  });

  // Utakmica za treće mesto
  console.log("\nUtakmica za treće mesto:");
  const rezultatZa3Mesto = simulacijaPolufinalaFinala(porazeniPolufinale[0], porazeniPolufinale[1]);
  const pobednikZa3Mesto = rezultatZa3Mesto.ekipa1.pobeda ? rezultatZa3Mesto.ekipa1 : rezultatZa3Mesto.ekipa2;

  console.log(
    `   Treće mesto: ${rezultatZa3Mesto.ekipa1.ime} - ${rezultatZa3Mesto.ekipa2.ime} | Rezultat: ${rezultatZa3Mesto.ekipa1.rezultat} - ${rezultatZa3Mesto.ekipa2.rezultat} | Pobednik: ${pobednikZa3Mesto.ime}`
  );

  // Finale
  console.log("\nFinale:");
  const rezultatFinala = simulacijaPolufinalaFinala(finalisti[0], finalisti[1]);
  const pobednikFinala = rezultatFinala.ekipa1.pobeda ? rezultatFinala.ekipa1 : rezultatFinala.ekipa2;
  const gubitnikFinala = !rezultatFinala.ekipa1.pobeda ? rezultatFinala.ekipa1 : rezultatFinala.ekipa2;

  console.log(
    `   Finale: ${rezultatFinala.ekipa1.ime} - ${rezultatFinala.ekipa2.ime} | Rezultat: ${rezultatFinala.ekipa1.rezultat} - ${rezultatFinala.ekipa2.rezultat} | Pobednik: ${pobednikFinala.ime}`
  );

  // Finalni poredak
  console.log("\nFinalni poredak:");
  console.log(`   1. Mesto: ${pobednikFinala.ime}`);
  console.log(`   2. Mesto: ${gubitnikFinala.ime}`);
  console.log(`   3. Mesto: ${pobednikZa3Mesto.ime}`);
};

module.exports = {
  kreirajZreb,
  shuffleArray,
};
