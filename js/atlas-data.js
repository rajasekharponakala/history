/* =========================================================
   EARLY INDIANS — ATLAS DATA
   Places, migration routes, rivers and the guided "story" stops
   for the geographic History Atlas. Coordinates are approximate
   site locations ([lon, lat]); routes are schematic paths that
   follow the book's narrative, not exact tracks.
   from / to are in years ago (ya); BCE ≈ ya − 2000.
   ========================================================= */

/* kind → marker style. ch → chapter colour. img → picture in the book. */
window.SITES = [
  // ---- Deep time: Africa, Levant, Arabia ----
  { id: "jebel-irhoud", n: "Jebel Irhoud", where: "Morocco", ll: [-8.87, 31.85], from: 300000, to: 290000, kind: "fossil", ch: "intro",
    d: "A cave near Safi that yielded the oldest modern-human remains ever found, about 300,000 years old." },
  { id: "misliya", n: "Misliya", where: "Israel", ll: [34.97, 32.73], from: 180000, to: 175000, kind: "fossil", ch: "ch1",
    d: "The earliest modern-human fossil found outside Africa (~180,000 years) — an early foray that left no detectable lineage." },
  { id: "skhul", n: "Skhul–Qafzeh", where: "Israel", ll: [35.32, 32.69], from: 120000, to: 80000, kind: "fossil", ch: "ch1",
    d: "Modern-human skeletons in the Levant, 120,000–80,000 years ago — most likely a dead end, not the ancestors of today’s non-Africans." },
  { id: "al-wusta", n: "Al Wusta", where: "Nefud, Saudi Arabia", ll: [39.9, 28.0], from: 88000, to: 86000, kind: "fossil", ch: "ch1",
    d: "A modern-human finger bone from a time when Arabia was green and dotted with lakes (~88,000 years ago)." },
  { id: "bab", n: "Bab el Mandeb", where: "Red Sea strait", ll: [43.4, 12.6], from: 72000, to: 64000, kind: "crossing", ch: "ch1",
    d: "The ‘Gate of Grief’. The book concludes the successful exodus most likely took this Southern Route around 70,000 years ago." },

  // ---- Deep time: South Asia ----
  { id: "attirampakkam", n: "Attirampakkam", where: "Tamil Nadu", ll: [79.88, 13.23], from: 385000, to: 172000, kind: "tools", ch: "ch1",
    d: "Middle Palaeolithic tools from ~385,000 years ago show archaic humans in India at the cutting edge of technology. Older tools here go back ~1.5 million years." },
  { id: "hathnora", n: "Hathnora", where: "Narmada valley, MP", ll: [77.85, 22.87], from: 250000, to: 240000, kind: "fossil", ch: "intro",
    d: "A partially complete archaic cranium found in 1982 — about 250,000 years old." },
  { id: "jwalapuram", n: "Jwalapuram", where: "Kurnool, Andhra Pradesh", ll: [78.13, 15.32], from: 77000, to: 74000, kind: "tools", ch: "ch1",
    d: "Middle Palaeolithic tools lie both beneath and above the Toba ash. Who made them — modern or archaic humans — is debated." },
  { id: "bhimbetka", n: "Bhimbetka", where: "Raisen, Madhya Pradesh", ll: [77.61, 22.94], from: 100000, to: 2000, kind: "art", ch: "ch1", img: "bhimbetka-shelter",
    d: "Rock shelters occupied for some 100,000 years. Its cup-like depressions may be the earliest art by any Homo species." },
  { id: "fa-hien", n: "Fa Hien cave", where: "Sri Lanka", ll: [80.21, 6.63], from: 35000, to: 30000, kind: "fossil", ch: "ch1",
    d: "Modern-human remains around 35,000 years old." },
  { id: "central-india", n: "Central & eastern India", where: "microlithic heartland", ll: [82.5, 23.4], from: 45000, to: 20000, kind: "region", ch: "ch1",
    d: "With microlithic tools the First Indians’ population rose sharply here; for a time South Asia held ‘most of humanity’." },
  { id: "andaman", n: "Andaman Islands", where: "home of the Onge", ll: [92.6, 11.6], from: 65000, to: 0, kind: "people", ch: "ch1", img: "onge",
    d: "The Onge of Little Andaman descend from the original Out-of-Africa migrants." },

  // ---- South-east Asia & Australia ----
  { id: "toba", n: "Toba", where: "Sumatra", ll: [98.83, 2.6], from: 74000, to: 73500, kind: "volcano", ch: "ch1",
    d: "The most violent eruption in two million years (~74,000 years ago). Its ash blankets South and South-east Asia." },
  { id: "lida-ajer", n: "Lida Ajer", where: "Sumatra", ll: [100.4, -0.3], from: 73000, to: 63000, kind: "fossil", ch: "ch1",
    d: "Modern-human teeth dated to 63,000–73,000 years ago — the walk from Yemen must have been fast." },
  { id: "australia", n: "Northern Australia", where: "Arnhem Land", ll: [132.9, -12.5], from: 70700, to: 59300, kind: "fossil", ch: "ch1",
    d: "Modern humans were in Australia by ~65,000 years ago (59,300–70,700)." },

  // ---- Farming in west Asia ----
  { id: "euphrates", n: "Euphrates villages", where: "northern Syria", ll: [38.4, 35.87], from: 13000, to: 10000, kind: "farm", ch: "ch2",
    d: "Around 11,000 BCE people here were harvesting wild wheat and rye." },
  { id: "anatolia", n: "Anatolian farmers", where: "central Anatolia", ll: [32.83, 37.67], from: 10500, to: 7000, kind: "farm", ch: "ch2",
    d: "Domesticated emmer and einkorn appear in west Asia 8500–8200 BCE. Anatolian farmer ancestry fades eastward: 70% → 33% in Iran → 3% in far-eastern Turan." },
  { id: "zagros", n: "Zagros mountains", where: "western Iran", ll: [47.47, 34.4], from: 10000, to: 8000, kind: "farm", ch: "ch2",
    d: "Zagros herders of 8000–7000 BCE lacked Anatolian ancestry — they were a distinct population, the ‘sauce’ of the Indian pizza." },
  { id: "uruk", n: "Uruk", where: "Mesopotamia", ll: [45.64, 31.32], from: 5200, to: 4000, kind: "city", ch: "ch3",
    d: "By Gordon Childe’s criteria, the first ‘city’ (≈3200 BCE). Mesopotamia also has 32 known ziggurats." },

  // ---- Mehrgarh & first farmers in South Asia ----
  { id: "mehrgarh", n: "Mehrgarh", where: "Bolan Pass, Balochistan", ll: [67.61, 29.39], from: 9000, to: 4600, kind: "farm", ch: "ch2", img: "mehrgarh-vessel",
    d: "South Asia’s earliest known farming village (from ~7000 BCE), ~200 ha at its largest. Over 90% of its seeds were naked six-row barley; pottery only from ~6000 BCE." },
  { id: "lahuradewa", n: "Lahuradewa", where: "Uttar Pradesh", ll: [82.95, 26.77], from: 9000, to: 4000, kind: "farm", ch: "ch2",
    d: "Evidence of rice harvesting from around 7000 BCE." },

  // ---- Harappan civilization ----
  { id: "harappa", n: "Harappa", where: "Punjab, Pakistan", ll: [72.86, 30.63], from: 5300, to: 3300, kind: "city", ch: "ch3", img: "harappa-ruins",
    d: "The type-site of the civilization. Script-like marks on pottery appear here about 3300 BCE." },
  { id: "mohenjo", n: "Mohenjo-daro", where: "Sindh, Pakistan", ll: [68.14, 27.33], from: 4600, to: 3900, kind: "city", ch: "ch3", img: "great-bath",
    d: "The Great Bath, ~700 wells, covered drains and the 17.5 cm ‘priest-king’." },
  { id: "dholavira", n: "Dholavira", where: "Kutch, Gujarat", ll: [70.21, 23.89], from: 4600, to: 3500, kind: "city", ch: "ch3", img: "dholavira-reservoir",
    d: "A ~100 ha fortified city with a sophisticated water system; its eastern reservoir (74 × 26 × 7 m) was the largest of its kind in the ancient world." },
  { id: "rakhigarhi", n: "Rakhigarhi", where: "Haryana", ll: [76.11, 29.29], from: 7500, to: 3900, kind: "city", ch: "ch3",
    d: "Grew from an Early Harappan town into one of the largest Mature Harappan cities." },
  { id: "kalibangan", n: "Kalibangan", where: "Rajasthan", ll: [74.13, 29.47], from: 7500, to: 3900, kind: "city", ch: "ch3", img: "kalibangan-seal",
    d: "An Early Harappan town on the Ghaggar. A seal from here shows the one scene of human-on-human violence the book describes." },
  { id: "banawali", n: "Banawali", where: "Haryana", ll: [75.39, 29.6], from: 7500, to: 3900, kind: "city", ch: "ch3",
    d: "An Early Harappan town that grew into the Mature phase." },
  { id: "rahman-dheri", n: "Rahman Dheri", where: "Khyber Pakhtunkhwa", ll: [70.85, 31.95], from: 7500, to: 4600, kind: "city", ch: "ch3",
    d: "One of the Early Harappan (5500–2600 BCE) towns." },
  { id: "lothal", n: "Lothal", where: "Gujarat", ll: [72.25, 22.52], from: 4400, to: 3900, kind: "city", ch: "ch3",
    d: "A Harappan port town on the Gulf of Khambhat." },
  { id: "sutkagen-dor", n: "Sutkagen Dor", where: "Makran coast", ll: [61.97, 25.5], from: 4600, to: 3900, kind: "city", ch: "ch3",
    d: "The westernmost Harappan settlement on the Makran coast." },

  // ---- Indus periphery, BMAC ----
  { id: "gonur", n: "Gonur", where: "Turkmenistan (BMAC)", ll: [62.04, 38.21], from: 5100, to: 3700, kind: "sample", ch: "ch2",
    d: "A BMAC site. Ancient DNA found three ‘outliers’ with 14–42% First-Indian ancestry — migrants from the Indus world." },
  { id: "shahr", n: "Shahr-i-Sokhta", where: "Sistan, Iran", ll: [61.33, 30.6], from: 5100, to: 4200, kind: "sample", ch: "ch2",
    d: "The ‘Burnt City’. Samples (3100–2200 BCE) show no Steppe ancestry; outliers here also carry Indus-related ancestry." },
  { id: "bmac", n: "BMAC", where: "Bactria–Margiana", ll: [66.0, 37.2], from: 4300, to: 3700, kind: "region", ch: "ch4",
    d: "The Bactria–Margiana Archaeological Complex (2300–1700 BCE): ~60% Iranian-farmer, ~21% Anatolian, ~13% West-Siberian-related ancestry." },

  // ---- Steppe ----
  { id: "yamnaya", n: "Yamnaya homeland", where: "Pontic–Caspian steppe", ll: [42.0, 47.8], from: 5300, to: 4500, kind: "region", ch: "ch4",
    d: "Steppe herders with wheels, wagons and horses who burst upon Europe around 3000 BCE." },
  { id: "corded", n: "Corded Ware", where: "central & northern Europe", ll: [16.0, 52.0], from: 4900, to: 4300, kind: "region", ch: "ch4",
    d: "From ~2900 BCE; about 75% Yamnaya-related ancestry." },
  { id: "britain", n: "Bronze Age Britain", where: "Bell Beaker", ll: [-1.8, 52.6], from: 4500, to: 3500, kind: "sample", ch: "ch4",
    d: "≥90% of Bronze Age ancestry came from Beaker-related people." },
  { id: "iberia", n: "Iberia", where: "Bell Beaker", ll: [-4.0, 40.0], from: 4500, to: 3500, kind: "sample", ch: "ch4",
    d: "About 30% of the population replaced — but ~90% of Y-chromosomes among Yamnaya-ancestry males were of Steppe origin." },
  { id: "sintashta", n: "Sintashta", where: "southern Urals", ll: [60.2, 52.47], from: 4100, to: 3800, kind: "region", ch: "ch4",
    d: "Burials with kurgans, roofed chambers and horse sacrifice — strikingly parallel to the Rigveda. R1a-Z93 reaches 68% in the Bronze Age Steppe." },
  { id: "kazakh", n: "Kazakh steppe", where: "Central Asia", ll: [68.0, 49.0], from: 4100, to: 3400, kind: "region", ch: "ch4",
    d: "Around 2100 BCE Steppe pastoralists began moving south towards Turan." },
  { id: "swat", n: "Swat valley", where: "Khyber Pakhtunkhwa", ll: [72.4, 35.2], from: 3200, to: 2800, kind: "sample", ch: "ch4",
    d: "Forty-one individuals (≈1200–800 BCE) carry ~22% Steppe ancestry — the first direct trace of Steppe ancestry in South Asia." },
  { id: "punjab-vedic", n: "Sapta Sindhu", where: "Punjab plains", ll: [74.5, 31.4], from: 3400, to: 3000, kind: "region", ch: "ch4",
    d: "The land of the Rigveda’s rivers. The book cites a dating of the Rigveda to 1400–1000 BCE." },

  // ---- East: toppings ----
  { id: "munda", n: "Munda heartland", where: "Jharkhand–Odisha", ll: [85.3, 22.3], from: 4000, to: 0, kind: "people", ch: "epi", img: "bonda",
    d: "Austroasiatic (Munda) speakers, with about a quarter south-east-Asian-related ancestry. The Bonda of Koraput speak Remo." },
  { id: "ne-india", n: "North-east India", where: "Tibeto-Burman speakers", ll: [93.9, 25.6], from: 4000, to: 0, kind: "people", ch: "epi",
    d: "Tibeto-Burman languages arrive from the east. Lactase persistence is below 1% in parts of the north-east." },

  // ---- Epilogue: second urbanization ----
  { id: "magadha", n: "Magadha (Pataliputra)", where: "Bihar", ll: [85.14, 25.6], from: 2500, to: 1800, kind: "city", ch: "epi",
    d: "The Ganga-plain urbanization of ~500 BCE and the Mauryan empire (322–180 BCE) arose here — outside the narrowly defined Aryavarta." },
  { id: "bastar", n: "Bastar", where: "Chhattisgarh", ll: [81.9, 19.1], from: 65000, to: 0, kind: "people", ch: "ch1", img: "gond",
    d: "The Gond speak Gondi, a Dravidian language. The book’s ‘tribals are us’: adivasis (~8%) are the foundational population." }
];

/* Routes. pts are waypoints [lon, lat]; kind decides colour; from/to is the
   window of movement in years ago. */
window.ROUTES = [
  // Out of Africa
  { id: "foray-levant", n: "Early foray into the Levant", kind: "dead", from: 185000, to: 80000, pts: [[36, 8], [33.5, 22], [33.6, 29.5], [35.0, 32.6]] },
  { id: "foray-arabia", n: "Early foray into green Arabia", kind: "dead", from: 95000, to: 85000, pts: [[38.5, 9.5], [42.6, 13.0], [42, 20], [39.9, 27.8]] },
  { id: "ooa-exit", n: "The successful exodus (Southern Route)", kind: "ooa", from: 72000, to: 68000, pts: [[37, 6], [41.5, 11.0], [43.4, 12.6], [46, 13.6], [52, 16.5], [57.5, 21.0]] },
  { id: "ooa-india", n: "Along the coast to India", kind: "ooa", from: 68000, to: 65000, pts: [[57.5, 21.0], [61.5, 25.2], [66.5, 24.8], [70, 22.0], [73.0, 17.0], [76, 12]] },
  { id: "ooa-interior", n: "Spread across the subcontinent", kind: "ooa", from: 65000, to: 45000, pts: [[70.5, 22.5], [75, 22.8], [80, 23.4], [85.5, 24.0], [89.5, 24.0]] },
  { id: "ooa-sea", n: "On to south-east Asia", kind: "ooa", from: 65000, to: 63000, pts: [[89.5, 24.0], [93.5, 20.0], [97.5, 13.5], [99.8, 6.5], [101.0, 2.5], [104.0, -1.5]] },
  { id: "ooa-aus", n: "Into Sahul (Australia)", kind: "ooa", from: 65000, to: 60000, pts: [[104.0, -1.5], [113, -6.8], [122, -8.5], [127, -9.5], [132.9, -12.5]] },
  { id: "ooa-east", n: "North into east Asia", kind: "ooa", from: 60000, to: 40000, pts: [[101.0, 15.0], [106, 22], [110, 30], [116, 39.6]] },
  { id: "ooa-central", n: "Into central Asia", kind: "ooa", from: 55000, to: 45000, pts: [[72, 30], [68, 36], [64, 42], [62, 47]] },
  { id: "ooa-europe", n: "Into Europe", kind: "ooa", from: 50000, to: 45000, pts: [[62, 47], [50, 48], [38, 48], [26, 46], [12, 47.5]] },
  { id: "ooa-americas", n: "Towards Beringia and the Americas", kind: "ooa", from: 25000, to: 16000, pts: [[116, 39.6], [128, 48], [143, 56], [160, 63]] },

  // First farmers
  { id: "farm-zagros", n: "Zagros farmers move east", kind: "iran", from: 9000, to: 5000, pts: [[47.47, 34.4], [53.0, 32.5], [58.5, 30.5], [63.5, 29.8], [67.61, 29.39]] },
  { id: "farm-indus", n: "Mixing into the Indus plains", kind: "iran", from: 7500, to: 4600, pts: [[67.61, 29.39], [70.0, 29.8], [72.86, 30.63], [76.11, 29.29]] },
  { id: "anat-east", n: "Anatolian ancestry thins eastward", kind: "anat", from: 10000, to: 7000, pts: [[32.83, 37.67], [38.5, 37.2], [44, 36.0], [47.47, 34.4]] },

  // Harappans abroad
  { id: "indus-bmac", n: "Indus people travel to the BMAC", kind: "trade", from: 5000, to: 3700, pts: [[72.86, 30.63], [69.5, 33.5], [66.0, 37.2], [62.04, 38.21]] },
  { id: "indus-shahr", n: "…and to Shahr-i-Sokhta", kind: "trade", from: 5000, to: 4200, pts: [[67.61, 29.39], [64.5, 29.8], [61.33, 30.6]] },
  { id: "indus-gulf", n: "Sea trade to Mesopotamia", kind: "trade", from: 4600, to: 3900, pts: [[72.25, 22.52], [66.5, 23.6], [58.5, 24.2], [56.5, 26.3], [50.6, 26.1], [47.8, 30.0], [45.64, 31.32]] },

  // Steppe
  { id: "steppe-europe", n: "Yamnaya expansion into Europe", kind: "steppe", from: 5000, to: 4500, pts: [[42.0, 47.8], [34, 48.5], [26, 49.5], [16.0, 52.0]] },
  { id: "steppe-beaker", n: "Bell Beaker spread west", kind: "steppe", from: 4500, to: 4000, pts: [[16.0, 52.0], [8, 51.5], [2, 51.2], [-1.8, 52.6]] },
  { id: "steppe-iberia", n: "…and into Iberia", kind: "steppe", from: 4500, to: 4000, pts: [[8, 51.5], [3.5, 46], [0, 42.5], [-4.0, 40.0]] },
  { id: "steppe-east", n: "Steppe peoples move east", kind: "steppe", from: 4800, to: 4100, pts: [[42.0, 47.8], [50, 50.5], [60.2, 52.47], [68.0, 49.0]] },
  { id: "steppe-south", n: "South towards Turan (≈2100 BCE)", kind: "steppe", from: 4100, to: 3800, pts: [[68.0, 49.0], [66.5, 43.5], [65.5, 39.5], [66.0, 37.2]] },
  { id: "steppe-india", n: "Waves into South Asia (2000–1000 BCE)", kind: "steppe", from: 4000, to: 3000, pts: [[66.0, 37.2], [69.2, 35.6], [72.4, 35.2], [73.6, 32.5], [74.5, 31.4]] },
  { id: "steppe-ganga", n: "East into the Ganga plain", kind: "steppe", from: 3200, to: 2500, pts: [[74.5, 31.4], [77.2, 29.5], [80.3, 26.8], [83.0, 25.6], [85.14, 25.6]] },

  // Toppings
  { id: "aa-wave", n: "Austroasiatic wave", kind: "aa", from: 4000, to: 3000, pts: [[106.0, 21.5], [101.5, 22.5], [97.0, 23.0], [92.5, 23.2], [88.5, 22.8], [85.3, 22.3]] },
  { id: "tb-wave", n: "Tibeto-Burman wave", kind: "tb", from: 4000, to: 2500, pts: [[104.0, 33.5], [99.5, 30.0], [96.5, 27.8], [93.9, 25.6]] }
];

/* Route styles: map to the fixed entity colour slots used by the charts. */
window.ROUTE_KINDS = {
  ooa:    { n: "Out of Africa → First Indians", slot: 1 },
  dead:   { n: "Early forays (no surviving lineage)", slot: 0, dash: true },
  iran:   { n: "Zagros / Iranian farmers", slot: 2 },
  anat:   { n: "Anatolian farmers", slot: 3 },
  trade:  { n: "Harappan travel & trade", slot: 4, dash: true },
  steppe: { n: "Steppe pastoralists", slot: 5 },
  aa:     { n: "Austroasiatic", slot: 6 },
  tb:     { n: "Tibeto-Burman", slot: 7 }
};

/* Hand-traced major rivers (approximate, for orientation). */
window.RIVERS = [
  { n: "Indus", pts: [[81.3, 31.1], [79.0, 32.6], [77.6, 34.1], [75.6, 35.3], [74.5, 35.6], [73.3, 34.6], [72.7, 34.1], [72.2, 33.9], [71.5, 32.9], [70.9, 31.8], [70.4, 28.9], [68.9, 27.7], [68.14, 27.33], [68.4, 25.4], [67.4, 24.0]] },
  { n: "Ghaggar–Hakra", dry: true, pts: [[77.0, 30.8], [76.0, 29.9], [75.0, 29.55], [74.13, 29.47], [73.3, 29.0], [72.0, 28.5], [71.0, 28.3], [70.0, 27.7], [69.5, 26.6], [69.6, 25.0]] },
  { n: "Sutlej", pts: [[78.5, 31.6], [76.6, 31.4], [75.4, 31.1], [74.4, 30.7], [73.0, 29.9], [71.2, 29.2], [70.4, 28.9]] },
  { n: "Ganga", pts: [[79.0, 30.9], [78.16, 29.95], [78.6, 28.5], [80.33, 26.45], [81.9, 25.4], [83.0, 25.3], [85.1, 25.6], [87.3, 25.2], [87.9, 24.8], [88.4, 23.0], [88.5, 21.7]] },
  { n: "Yamuna", pts: [[78.4, 31.0], [77.3, 30.0], [77.2, 28.6], [78.0, 27.2], [79.5, 26.2], [81.9, 25.4]] },
  { n: "Narmada", pts: [[81.7, 22.7], [79.9, 23.1], [77.7, 22.75], [76.0, 22.2], [73.0, 21.7]] },
  { n: "Brahmaputra", pts: [[82.0, 30.4], [88.0, 29.3], [92.0, 29.2], [95.0, 29.4], [95.3, 28.0], [94.0, 26.8], [91.7, 26.2], [89.8, 25.8], [89.7, 24.0], [90.5, 23.0]] },
  { n: "Godavari", pts: [[73.5, 19.9], [76.0, 19.3], [79.0, 18.8], [80.3, 18.0], [81.8, 16.7]] },
  { n: "Krishna", pts: [[73.7, 17.9], [75.5, 16.6], [78.1, 16.1], [80.6, 16.4], [81.1, 15.8]] },
  { n: "Euphrates", pts: [[39.5, 39.0], [38.4, 36.3], [40.1, 35.3], [42.5, 34.4], [44.3, 32.6], [46.4, 31.0], [47.5, 30.4]] },
  { n: "Tigris", nolabel: true, pts: [[40.3, 38.2], [42.2, 37.0], [43.2, 36.3], [44.0, 34.4], [45.6, 32.5], [47.2, 31.0], [47.5, 30.4]] },
  { n: "Nile", pts: [[32.5, 15.6], [33.0, 19.0], [31.5, 22.0], [32.9, 24.1], [32.7, 26.2], [31.2, 29.9], [31.0, 31.4]] },
  { n: "Amu Darya", pts: [[73.5, 37.0], [69.5, 37.2], [66.5, 37.6], [64.2, 39.2], [61.5, 41.5], [59.6, 43.6]] }
];

/* Approximate extent of the Mature Harappan civilization (2600–1900 BCE). */
window.EXTENTS = [
  { id: "harappan", n: "Mature Harappan extent (approx.)", from: 4600, to: 3900, slot: 4,
    pts: [[61.6, 25.2], [64.0, 26.6], [66.6, 29.4], [68.8, 31.9], [70.6, 33.6], [72.5, 34.4], [74.4, 33.2], [76.6, 31.3], [78.1, 29.8], [77.9, 28.3], [76.0, 27.5], [73.6, 25.9], [73.2, 23.4], [73.0, 21.4], [72.0, 20.9], [70.0, 21.0], [68.6, 22.8], [67.2, 24.4], [64.0, 25.0]] }
];

/* Region / sea labels (static, faint). */
window.MAP_LABELS = [
  { t: "AFRICA", ll: [20, 8], z: 0 }, { t: "EUROPE", ll: [22, 54], z: 0 }, { t: "ARABIA", ll: [46, 22.5], z: 0 },
  { t: "ASIA", ll: [92, 44], z: 0 }, { t: "AUSTRALIA", ll: [133, -24], z: 0 }, { t: "INDIAN SUBCONTINENT", ll: [78.5, 18.5], z: 1 },
  { t: "Indian Ocean", ll: [80, -12], z: 0, sea: true }, { t: "Arabian Sea", ll: [64.5, 15], z: 1, sea: true },
  { t: "Bay of Bengal", ll: [88.5, 15], z: 1, sea: true }, { t: "Mediterranean", ll: [18, 34.5], z: 1, sea: true },
  { t: "Red Sea", ll: [38.2, 20.5], z: 2, sea: true }, { t: "Persian Gulf", ll: [51.5, 27.2], z: 2, sea: true },
  { t: "Caspian", ll: [51, 41.5], z: 2, sea: true }, { t: "IRANIAN PLATEAU", ll: [56, 32.8], z: 2 }, { t: "THAR", ll: [71.2, 26.6], z: 3 },
  { t: "STEPPE", ll: [58, 49.5], z: 1 }, { t: "DECCAN", ll: [77.2, 17.2], z: 3 }
];

/* Guided tour of the atlas. view = [west, south, east, north]. */
window.STORIES = [
  { id: "ooa", ch: "ch1", t: 65000, title: "Out of Africa", kicker: "c. 70,000–65,000 years ago",
    view: [-15, -35, 150, 55], routes: ["foray-levant", "foray-arabia", "ooa-exit", "ooa-india", "ooa-sea", "ooa-aus"], sites: ["jebel-irhoud", "misliya", "al-wusta", "bab", "lida-ajer", "australia"],
    text: "Earlier modern humans reached the Levant (~180k) and a green Arabia (~88k) but left no lineage. The exodus that gave rise to all non-Africans crossed Bab el Mandeb around 70,000 years ago and moved fast along the coast — Sumatra by 63–73k, Australia by ~65k." },
  { id: "archaic", ch: "ch1", t: 74000, title: "India before us", kicker: "385,000–35,000 years ago",
    view: [66, 5, 93, 31], routes: [], sites: ["attirampakkam", "hathnora", "jwalapuram", "bhimbetka", "toba"],
    text: "The subcontinent was already home to archaic humans — tools at Attirampakkam (~385k), the Hathnora cranium (~250k), and Middle Palaeolithic tools beneath the Toba ash at Jwalapuram (~77k). Toba erupted ~74,000 years ago." },
  { id: "first", ch: "ch1", t: 40000, title: "The First Indians", kicker: "65,000–20,000 years ago",
    view: [62, 3, 102, 34], routes: ["ooa-india", "ooa-interior", "ooa-sea"], sites: ["central-india", "bhimbetka", "fa-hien", "andaman", "bastar"],
    text: "The migrants met the archaic locals; by ~35,000 years ago archaic Homo had likely vanished. With microlithic tools the First Indians multiplied — their descendants still provide 50–65% of Indian ancestry, and 70–90% of maternal lineages." },
  { id: "world", ch: "intro", t: 16000, title: "Peopling the world", kicker: "60,000–16,000 years ago",
    view: [-15, -35, 168, 66], routes: ["ooa-exit", "ooa-india", "ooa-sea", "ooa-aus", "ooa-east", "ooa-central", "ooa-europe", "ooa-americas"], sites: ["australia"],
    text: "From South Asia the descendants spread into east Asia, central Asia and — some 25,000 years after Australia — Europe (~45k), and finally across Beringia into the Americas (~16k)." },
  { id: "farming", ch: "ch2", t: 10300, title: "Farming begins", kicker: "11,000–8000 BCE",
    view: [25, 24, 72, 43], routes: ["anat-east"], sites: ["euphrates", "anatolia", "zagros", "mehrgarh"],
    text: "As the Holocene began (~11,700 years ago), people on the Euphrates harvested wild wheat and rye; emmer and einkorn were domesticated by 8500–8200 BCE. The Zagros herders were genetically distinct from Anatolia’s farmers." },
  { id: "zagros", ch: "ch2", t: 7000, title: "Zagros farmers move east", kicker: "7000–3000 BCE",
    view: [42, 20, 86, 40], routes: ["farm-zagros", "farm-indus"], sites: ["zagros", "mehrgarh", "lahuradewa", "shahr"],
    text: "Mehrgarh began about 7000 BCE at the foot of the Bolan Pass. Iranian agriculturists migrated into South Asia and mixed with First Indians — the ‘sauce’ — at least by 4700–3000 BCE." },
  { id: "harappa", ch: "ch3", t: 4300, title: "The Harappan Civilization", kicker: "2600–1900 BCE",
    view: [60, 19.5, 80.5, 36], routes: [], sites: ["harappa", "mohenjo", "dholavira", "rakhigarhi", "kalibangan", "banawali", "lothal", "sutkagen-dor", "rahman-dheri"],
    text: "Nearly a million km² along the Indus and the Ghaggar–Hakra: planned cities, one system of weights, bricks in a 1:2:4 ratio — and ~700 years without evidence of any city attacked or burnt." },
  { id: "abroad", ch: "ch3", t: 4200, title: "Harappans abroad", kicker: "3100–1900 BCE",
    view: [40, 19, 80, 42], routes: ["indus-bmac", "indus-shahr", "indus-gulf"], sites: ["gonur", "shahr", "bmac", "uruk", "lothal", "harappa"],
    text: "Ancient DNA from Gonur and Shahr-i-Sokhta found individuals carrying First-Indian ancestry — people from the Indus world living far from home. The BMAC had close trade and cultural ties with the Harappans." },
  { id: "yamnaya", ch: "ch4", t: 4700, title: "The Yamnaya burst into Europe", kicker: "c. 3000–2000 BCE",
    view: [-12, 35, 72, 60], routes: ["steppe-europe", "steppe-beaker", "steppe-iberia", "steppe-east"], sites: ["yamnaya", "corded", "britain", "iberia", "sintashta"],
    text: "Herders from the Pontic–Caspian steppe transformed Europe’s population: Corded Ware ~75% Yamnaya-related, Bronze Age Britain ≥90% Beaker-related. In Iberia ~90% of Steppe-ancestry men carried Steppe Y-chromosomes — a male-driven expansion." },
  { id: "steppe", ch: "ch4", t: 3300, title: "The last migrants: into South Asia", kicker: "2100–1000 BCE",
    view: [48, 22, 90, 56], routes: ["steppe-east", "steppe-south", "steppe-india"], sites: ["sintashta", "kazakh", "bmac", "swat", "punjab-vedic"],
    text: "Around 2100 BCE pastoralists moved south from the Kazakh steppe. BMAC and Shahr-i-Sokhta samples (3100–2200 BCE) have no Steppe ancestry; Swat samples (≈1200–800 BCE) have ~22%. Waves entered South Asia between 2000 and 1000 BCE." },
  { id: "toppings", ch: "epi", t: 3000, title: "The toppings arrive", kicker: "after 2000 BCE",
    view: [62, 6, 112, 40], routes: ["steppe-india", "steppe-ganga", "aa-wave", "tb-wave"], sites: ["munda", "ne-india", "swat", "bastar"],
    text: "Around the same time, Austroasiatic speakers arrived from south-east Asia with a new variety of rice, and Tibeto-Burman speakers from the east. The Steppe ‘cheese’ is thicker in the north than the south." },
  { id: "magadha", ch: "epi", t: 2300, title: "Aryavarta and beyond", kicker: "500 BCE – 100 CE",
    view: [64, 6, 96, 36], routes: ["steppe-ganga"], sites: ["magadha", "punjab-vedic", "munda", "bastar"],
    text: "The second urbanization began in Magadha (~500 BCE) and the first empire, the Mauryas (322–180 BCE), arose there — outside Patanjali’s narrowly defined Aryavarta. Between 2200 BCE and 100 CE Indian groups mixed extensively; then endogamy set in." }
];
