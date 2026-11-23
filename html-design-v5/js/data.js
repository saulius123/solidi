/* =========================================================
   SOLIDI – objektų duomenys
   ---------------------------------------------------------
   Kiekvienas objektas automatiškai gauna savo puslapį:
     objektai/<id>/ (paleiskite node build-pages.cjs)
   Norėdami pridėti naują objektą – nukopijuokite bloką
   ir pakeiskite reikšmes. „id“ turi būti unikalus (be tarpų).

   deal:  "pardavimas" | "nuoma" | "projektas"
   type:  "namas" | "butas" | "kitas"
   agents: brokerių ID masyvas, pvz. ["lina", "giedre"].
   Brokeriai rodomi AGENTS tvarka (Lina pirma).
   images: pirmoji nuotrauka – viršelis. Galite naudoti
           ir savo failus, pvz. "assets/objektai/butas-1.jpg"
   ========================================================= */

const UNSPLASH = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

const AGENTS = {
  lina: { name: "Lina Matukienė", role: "NT brokerė", phone: "", email: "lina@solidi.lt", photo: "assets/brokers/lina-portrait.webp" },
  giedre: { name: "Giedrė Daugirdaitė", role: "NT brokerė", phone: "", email: "giedre@solidi.lt", photo: "assets/brokers/giedre.jpg" }
};

const PROPERTIES = [
  {
    id: "butas-naujininkai-panevezio",
    deal: "pardavimas",
    type: "butas",
    title: "Parduodamas 3 kambarių butas Panevėžio g., Naujininkuose",
    address: "Panevėžio g., Naujininkai, Vilnius",
    price: 249500,
    area: 50.77,
    rooms: 3,
    floor: 2,
    floors: 5,
    year: 2024,
    heating: "Centrinis kolektorinis",
    finish: "Įrengtas",
    energy: "A++",
    coords: [54.6620, 25.2960],
    agents: ["lina", "giedre"],
    images: [
      UNSPLASH("photo-1502672260266-1c1ef2d93688"),
      UNSPLASH("photo-1484154218962-a197022b5858"),
      UNSPLASH("photo-1505691938895-1758d7feb511"),
      UNSPLASH("photo-1493809842364-78817add7ffb"),
      UNSPLASH("photo-1560448204-e02f11c3d0e2"),
      UNSPLASH("photo-1522708323590-d24dbb6b0267"),
      UNSPLASH("photo-1600210492486-724fe5c67fb0"),
      UNSPLASH("photo-1600607687939-ce8a6c25118c"),
      UNSPLASH("photo-1600566753190-17f0baa2a6c3"),
      UNSPLASH("photo-1600047509807-ba8f99d2cdde")
    ],
    description: [
      "Šviesus, naujai įrengtas trijų kambarių butas ramioje Naujininkų dalyje. Erdvi svetainė sujungta su virtuve, atskiri miegamasis ir darbo kambarys, didelis balkonas į kiemo pusę.",
      "Namas pastatytas 2024 m., A++ energinė klasė, kolektorinis šildymas ir rekuperacija užtikrina mažas išlaikymo išlaidas. Šalia – darželiai, mokyklos, prekybos centrai ir patogus susisiekimas su miesto centru."
    ],
    features: ["Balkonas", "Rekuperacija", "Vieta automobiliui", "Sandėliukas", "Liftas", "Šarvuotos durys"]
  },
  {
    id: "namas-uzubaliai",
    deal: "pardavimas",
    type: "namas",
    title: "Parduodamas namas Užubalių g., Užubalių k.",
    address: "Užubalių g., Užubalių k., Vilniaus r.",
    price: 420000,
    area: 165.82,
    rooms: 4,
    floors: 2,
    plot: 8.5,
    year: 2023,
    heating: "Geoterminis, grindinis",
    finish: "Įrengtas",
    energy: "A++",
    coords: [54.7480, 25.1830],
    agents: ["lina"],
    images: [
      UNSPLASH("photo-1600596542815-ffad4c1539a9"),
      UNSPLASH("photo-1600585154340-be6161a56a0c"),
      UNSPLASH("photo-1600607687939-ce8a6c25118c"),
      UNSPLASH("photo-1600210492486-724fe5c67fb0"),
      UNSPLASH("photo-1600566753190-17f0baa2a6c3")
    ],
    description: [
      "Modernus dviejų aukštų namas su 8,5 a sklypu ramioje gyvenvietėje, vos 15 min. kelio iki Vilniaus centro. Dideli stiklo langai, aukštos lubos ir terasa į pietų pusę.",
      "Pirmame aukšte – erdvi svetainė su virtuve ir svečių kambarys, antrame – trys miegamieji ir dvi vonios. Geoterminis šildymas, rekuperacija, saulės elektrinė."
    ],
    features: ["Terasa", "Saulės elektrinė", "Rekuperacija", "Garažas", "Židinys", "Apželdintas sklypas"]
  },
  {
    id: "butas-senamiestis-vilniaus",
    deal: "pardavimas",
    type: "butas",
    title: "Parduodamas butas Vilniaus g., Senamiestyje",
    address: "Vilniaus g., Senamiestis, Vilnius",
    price: 235000,
    area: 37.55,
    rooms: 1,
    floor: 2,
    floors: 3,
    year: 1900,
    renovated: 2019,
    heating: "Dujinis",
    finish: "Įrengtas",
    energy: "C",
    coords: [54.6840, 25.2830],
    agents: ["lina"],
    images: [
      UNSPLASH("photo-1522708323590-d24dbb6b0267"),
      UNSPLASH("photo-1505691938895-1758d7feb511"),
      UNSPLASH("photo-1484154218962-a197022b5858")
    ],
    description: [
      "Jaukus butas istoriniame Senamiesčio name su balkonu į žalią vidinį kiemą. Aukštos lubos, originalios medinės grindys ir kokybiška renovacija 2019 m.",
      "Puikiai tinka gyventi arba investicijai – trumpalaikė nuoma Senamiestyje išlieka paklausi visus metus."
    ],
    features: ["Balkonas", "Aukštos lubos", "Istorinis pastatas", "Investicijai"]
  },
  {
    id: "namas-pavilnys",
    deal: "pardavimas",
    type: "namas",
    title: "Parduodamas kotedžas Pavilnyje su vaizdu į slėnį",
    address: "Pavilnio g., Pavilnys, Vilnius",
    price: 389000,
    area: 142,
    rooms: 5,
    floors: 2,
    plot: 4.2,
    year: 2021,
    heating: "Šilumos siurblys oras-vanduo",
    finish: "Įrengtas",
    energy: "A+",
    coords: [54.6850, 25.3500],
    agents: ["giedre"],
    images: [
      UNSPLASH("photo-1564013799919-ab600027ffc6"),
      UNSPLASH("photo-1600047509807-ba8f99d2cdde"),
      UNSPLASH("photo-1493809842364-78817add7ffb"),
      UNSPLASH("photo-1484154218962-a197022b5858")
    ],
    description: [
      "Sublokuotas namas žaliajame Pavilnyje, šalia regioninio parko. Atskiras įėjimas, nuosavas kiemas ir dvi parkavimo vietos.",
      "Namas pilnai įrengtas: virtuvė su buitine technika, įrengtos vonios, įmontuotos spintos. Iki centro – 10 min. automobiliu."
    ],
    features: ["Kiemas", "2 vietos automobiliams", "Šilumos siurblys", "Šalia parkas"]
  },
  {
    id: "komercinis-pastatas-riese",
    deal: "pardavimas",
    type: "kitas",
    title: "Parduodamas komercinės paskirties pastatas Riešėje",
    address: "Riešė, Vilniaus r.",
    price: 510000,
    area: 320,
    plot: 25,
    floors: 1,
    year: 2022,
    heating: "Šilumos siurblys",
    finish: "Įrengtas",
    energy: "A+",
    coords: [54.7720, 25.2950],
    agents: ["lina"],
    images: [
      "assets/hero.png",
      UNSPLASH("photo-1497366216548-37526070297c")
    ],
    description: [
      "Naujas komercinės paskirties pastatas su 25 a sklypu prie pagrindinio kelio. Tinka biurui, salonui, sandėliavimui ar lengvai gamybai.",
      "Didelės vitrinos, aukštos lubos, atskiri įėjimai. Sklype – erdvi aikštelė klientų ir krovininiams automobiliams."
    ],
    features: ["Vitrininiai langai", "Didelė aikštelė", "Prie pagrindinio kelio", "Atskiri įėjimai"]
  },
  {
    id: "biuras-snipiskes",
    deal: "pardavimas",
    type: "kitas",
    title: "Parduodamos biuro patalpos Šnipiškėse",
    address: "Konstitucijos pr., Šnipiškės, Vilnius",
    price: 298000,
    area: 96,
    rooms: 3,
    floor: 7,
    floors: 12,
    year: 2018,
    heating: "Centrinis",
    finish: "Įrengtas",
    energy: "A",
    coords: [54.6960, 25.2730],
    agents: ["lina"],
    images: [
      UNSPLASH("photo-1497366216548-37526070297c"),
      UNSPLASH("photo-1600607687939-ce8a6c25118c")
    ],
    description: [
      "Įrengtos A klasės biuro patalpos verslo centre su panoraminiu vaizdu į miestą. Atviros erdvės zona, du susitikimų kambariai, virtuvėlė.",
      "Pastate – 24/7 apsauga, požeminė automobilių stovėjimo aikštelė, restoranai pirmame aukšte."
    ],
    features: ["Panoraminis vaizdas", "Požeminis parkingas", "24/7 apsauga", "Kondicionavimas"]
  },
  {
    id: "nuoma-butas-zverynas",
    deal: "nuoma",
    type: "butas",
    title: "Nuomojamas 2 kambarių butas Žvėryne",
    address: "Vytauto g., Žvėrynas, Vilnius",
    price: 950,
    area: 54,
    rooms: 2,
    floor: 3,
    floors: 4,
    year: 2015,
    heating: "Centrinis",
    finish: "Įrengtas, su baldais",
    energy: "B",
    coords: [54.6920, 25.2530],
    agents: ["giedre"],
    images: [
      UNSPLASH("photo-1560448204-e02f11c3d0e2"),
      UNSPLASH("photo-1505691938895-1758d7feb511"),
      UNSPLASH("photo-1484154218962-a197022b5858")
    ],
    description: [
      "Nuomojamas pilnai įrengtas butas prestižiniame Žvėryne, šalia Neries krantinės. Su baldais ir buitine technika – galima iš karto įsikelti.",
      "Minimalus nuomos terminas – 12 mėn. Augintiniai – pagal susitarimą."
    ],
    features: ["Su baldais", "Buitinė technika", "Vieta automobiliui", "Šalia upė"]
  },
  {
    id: "nuoma-namas-zirmunai",
    deal: "nuoma",
    type: "namas",
    title: "Nuomojamas namas su kiemu Valakampiuose",
    address: "Valakampių g., Valakampiai, Vilnius",
    price: 2400,
    area: 180,
    rooms: 5,
    floors: 2,
    plot: 6,
    year: 2017,
    heating: "Dujinis, grindinis",
    finish: "Įrengtas, su baldais",
    energy: "A",
    coords: [54.7140, 25.3110],
    agents: ["lina"],
    images: [
      UNSPLASH("photo-1512917774080-9991f1c4c750"),
      UNSPLASH("photo-1600210492486-724fe5c67fb0"),
      UNSPLASH("photo-1600047509807-ba8f99d2cdde")
    ],
    description: [
      "Erdvus šeimos namas tarp pušų, vos keli žingsniai iki Valakampių paplūdimio. Didelis kiemas, terasa ir dvivietis garažas.",
      "Nuomojama ilgam laikotarpiui. Name – keturi miegamieji, darbo kambarys ir sauna."
    ],
    features: ["Sauna", "Terasa", "Dvivietis garažas", "Šalia paplūdimys"]
  },
  {
    id: "projektas-pusu-slenis",
    deal: "projektas",
    type: "namas",
    title: "Projektas „Pušų slėnis“ – kotedžai Bajoruose",
    address: "Bajorai, Vilnius",
    price: 289000,
    priceFrom: true,
    area: 128,
    rooms: 4,
    floors: 2,
    year: 2027,
    heating: "Šilumos siurblys oras-vanduo",
    finish: "Dalinė apdaila",
    energy: "A++",
    units: 12,
    coords: [54.7380, 25.2650],
    agents: ["lina"],
    images: [
      UNSPLASH("photo-1600566753190-17f0baa2a6c3"),
      UNSPLASH("photo-1600585154340-be6161a56a0c"),
      UNSPLASH("photo-1600607687939-ce8a6c25118c")
    ],
    description: [
      "Nauja 12 kotedžų gyvenvietė pušyno apsuptyje. Kiekvienas namas – su nuosavu kiemu, terasa ir dviem parkavimo vietomis.",
      "Statybų pabaiga – 2027 m. II ketv. Šiuo metu galima rezervuoti namus su išankstinio pirkimo kaina."
    ],
    features: ["12 namų", "Nuosavas kiemas", "Uždara teritorija", "Vaikų žaidimų aikštelė"]
  },
  {
    id: "projektas-upes-namai",
    deal: "projektas",
    type: "butas",
    title: "Projektas „Upės namai“ – butai prie Neries",
    address: "Žirmūnai, Vilnius",
    price: 168000,
    priceFrom: true,
    area: 42,
    rooms: 2,
    floors: 8,
    year: 2027,
    heating: "Centrinis kolektorinis",
    finish: "Pilna apdaila",
    energy: "A++",
    units: 64,
    coords: [54.7050, 25.2950],
    agents: ["giedre"],
    images: [
      UNSPLASH("photo-1613490493576-7fde63acd811"),
      UNSPLASH("photo-1502672260266-1c1ef2d93688"),
      UNSPLASH("photo-1560448204-e02f11c3d0e2")
    ],
    description: [
      "Daugiabutis su 64 butais pirmoje Neries krantinės linijoje. 1–4 kambarių butai su erdviais balkonais ir vaizdu į upę.",
      "Statybų pabaiga – 2027 m. IV ketv. Butai parduodami su pilna apdaila."
    ],
    features: ["64 butai", "Vaizdas į upę", "Požeminis parkingas", "Pilna apdaila"]
  }
];
