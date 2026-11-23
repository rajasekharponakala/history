/* =========================================================
   EARLY INDIANS — DATA LAYER
   Every number below is taken from Tony Joseph's "Early Indians"
   (Juggernaut, 2018). Where the book gives a range, the range is kept
   as a range. "ya" = years ago (BCE year + 2000, as an approximation).
   ========================================================= */
window.BOOK = {
  title: "Early Indians",
  subtitle: "The Story of Our Ancestors and Where We Came From",
  author: "Tony Joseph",
  publisher: "Juggernaut Books, 2018"
};

/* ---------- Chapters ---------- */
/* `from`/`to` are the chapter's span in years ago (0 = present); used by the chapter timeline. */
window.CHAPTERS = [
  { id: "intro", n: "00", short: "Intro", title: "How We, the Indians, Came to Be",
    tag: "Deep time, cousins and the 0.1% genome",
    blurb: "A tour of cosmic scale, our extinct Homo cousins and why DNA is rewriting prehistory.",
    from: 300000, to: 65000 },
  { id: "ch1", n: "01", short: "First Indians", title: "The First Indians",
    tag: "c. 65,000 years ago — Out of Africa to the subcontinent",
    blurb: "Genetics, climate and fossils converge on a single successful exodus that reached India about 65,000 years ago.",
    from: 65000, to: 9000 },
  { id: "ch2", n: "02", short: "First Farmers", title: "The First Farmers",
    tag: "c. 7000 BCE — Mehrgarh and the Zagros migrants",
    blurb: "Agriculture arrives; Iranian farmers mix with First Indians and a new 'sauce' layer is added to the Indian pizza.",
    from: 9000, to: 4600 },
  { id: "ch3", n: "03", short: "Harappans", title: "The First Urbanites: The Harappans",
    tag: "2600–1900 BCE — the largest civilization of its time",
    blurb: "A civilization of planned cities, uniform weights and no palaces, and a script nobody has yet deciphered.",
    from: 4600, to: 3900 },
  { id: "ch4", n: "04", short: "'Aryans'", title: "The Last Migrants: The ‘Aryans’",
    tag: "2000–1000 BCE — Steppe pastoralists enter South Asia",
    blurb: "Ancient DNA, linguistics and the Rigveda point to Steppe migration, strongly male-driven, in the second millennium BCE.",
    from: 4000, to: 2000 },
  { id: "epi", n: "05", short: "Epilogue", title: "Seeing History the Right Side Up",
    tag: "Caste, the Indian pizza and what the story means",
    blurb: "From mixing to endogamy: genetics suggests the caste system closed around 100 CE.",
    from: 2000, to: 0 }
];

/* ---------- Image manifest (all pictures embedded in the book) ---------- */
window.IMAGES = [
  { id:"cover", f:"cover.jpg", ch:"intro", kind:"Cover", title:"Cover of Early Indians", cap:"The cover shows the Harappan ‘dancing girl’ bronze, which the Epilogue calls the most recognizable image of the civilization.", tags:["cover","dancing girl"] },
  { id:"map-asia", f:"map-asia.jpg", ch:"intro", kind:"Map", title:"A contemporary map of Asia", cap:"Reference map of Asia used for orientation in the Introduction.", tags:["map","asia"] },
  { id:"homo-erectus", f:"homo-erectus.jpg", ch:"intro", kind:"Reconstruction", title:"Homo erectus", cap:"Lived approximately 1.89 million to 143,000 years ago in parts of Africa and Asia. Reconstruction: Smithsonian National Museum of Natural History / Wikimedia Commons.", tags:["homo","erectus","reconstruction"] },
  { id:"homo-heidelbergensis", f:"homo-heidelbergensis.jpg", ch:"intro", kind:"Reconstruction", title:"Homo heidelbergensis", cap:"Lived approximately 700,000 to 200,000 years ago in parts of Africa, Asia and Europe. Reconstruction: Smithsonian NMNH / Wikimedia Commons.", tags:["homo","heidelbergensis"] },
  { id:"homo-neanderthalensis", f:"homo-neanderthalensis.jpg", ch:"intro", kind:"Reconstruction", title:"Homo neanderthalensis", cap:"Lived approximately 400,000 to 40,000 years ago in Europe and south-western and central Asia. Reconstruction: Smithsonian NMNH / Wikimedia Commons.", tags:["homo","neanderthal"] },

  { id:"bhimbetka-shelter", f:"bhimbetka-shelter.jpg", ch:"ch1", kind:"Site photo", title:"A rock shelter in Bhimbetka", cap:"Bhimbetka, in Madhya Pradesh’s Raisen district, has been occupied for some 100,000 years. Photo: Tony Joseph.", tags:["bhimbetka","rock shelter"] },
  { id:"bhimbetka-cupules", f:"bhimbetka-cupules.jpg", ch:"ch1", kind:"Site photo", title:"Cup-like depressions at Bhimbetka", cap:"Perfect cup-like depressions on a shelter wall — perhaps the earliest evidence of art by members of the Homo species anywhere in the world. Photo: Tony Joseph.", tags:["bhimbetka","art"] },
  { id:"bhimbetka-paintings", f:"bhimbetka-paintings.jpg", ch:"ch1", kind:"Site photo", title:"Paintings at Bhimbetka", cap:"Paintings on the wall of a rock shelter, perhaps a few thousand years old. Photo: Tony Joseph.", tags:["bhimbetka","paintings"] },
  { id:"dna-cell", f:"dna-cell.jpg", ch:"ch1", kind:"Diagram", title:"The cell", cap:"Genetics primer, step 1: the cell, with its nucleus and mitochondria. Source: National Human Genome Research Institute.", tags:["genetics","cell"] },
  { id:"dna-chromosome", f:"dna-chromosome.jpg", ch:"ch1", kind:"Diagram", title:"Chromosome and DNA", cap:"Genetics primer, step 2: DNA coils into chromosomes inside the nucleus. Source: National Human Genome Research Institute.", tags:["genetics","chromosome","dna"] },
  { id:"dna-mito", f:"dna-mito.jpg", ch:"ch1", kind:"Diagram", title:"Mitochondrial DNA", cap:"Genetics primer, step 3: mtDNA, inherited only from the mother. Source: National Human Genome Research Institute.", tags:["genetics","mtdna"] },
  { id:"map-four-paths", f:"map-four-paths.jpg", ch:"ch1", kind:"Map", title:"The four possible paths out of Africa", cap:"The four possible paths for ancient modern humans out of Africa. The book concludes the Southern Route across Bab el Mandeb was the one the successful migrants took.", tags:["map","out of africa","southern route"] },
  { id:"map-peopling-world", f:"map-peopling-world.jpg", ch:"ch1", kind:"Map", title:"The peopling of the world", cap:"Adapted from Stephen Oppenheimer, ‘Out-of-Africa, the Peopling of Continents and Islands’, Phil. Trans. R. Soc. B, 2012.", tags:["map","migration","peopling"] },
  { id:"onge", f:"onge.jpg", ch:"ch1", kind:"Photo", title:"A member of the Onge tribe", cap:"The Onge of Little Andaman Island descend from the original Out-of-Africa migrants. Photo: Vishwajit Pandya / MCT / Getty Images.", tags:["onge","andaman","tribe"] },
  { id:"bonda", f:"bonda.jpg", ch:"ch1", kind:"Photo", title:"A Bonda woman, Koraput, Odisha", cap:"The Bonda speak Remo, an Austroasiatic language.", tags:["bonda","austroasiatic","tribe"] },
  { id:"gond", f:"gond.jpg", ch:"ch1", kind:"Photo", title:"A Gond woman, Bastar, Chhattisgarh", cap:"The Gond speak Gondi, a Dravidian language. The book argues a tribal woman best embodies the deepest-rooted mtDNA lineage in India (M2).", tags:["gond","dravidian","tribe"] },

  { id:"map-fertile-crescent", f:"map-fertile-crescent.jpg", ch:"ch2", kind:"Map", title:"The Fertile Crescent and Mehrgarh", cap:"Where farming began in west Asia and where Mehrgarh sits at the foot of the Bolan Pass.", tags:["map","mehrgarh","fertile crescent"] },
  { id:"mehrgarh-vessel", f:"mehrgarh-vessel.jpg", ch:"ch2", kind:"Artefact", title:"A vessel in the Mehrgarh style, 3000–2500 BCE", cap:"Painted ceramic vessel. Photo: The Metropolitan Museum of Art, New York.", tags:["mehrgarh","pottery"] },
  { id:"mehrgarh-figurines", f:"mehrgarh-figurines.jpg", ch:"ch2", kind:"Artefact", title:"Terracotta figurines of women, Mehrgarh style, 3000–2500 BCE", cap:"Photo: The Metropolitan Museum of Art, New York.", tags:["mehrgarh","figurine"] },

  { id:"harappa-ruins", f:"harappa-ruins.jpg", ch:"ch3", kind:"Site photo", title:"Ruins of the city of Harappa", cap:"The Harappan Civilization was the largest civilization of its time. Photo: De Agostini / G. Nimatallah / Getty Images.", tags:["harappa","ruins"] },
  { id:"akkadian-seal-imprint", f:"akkadian-seal-imprint.jpg", ch:"ch3", kind:"Seal", title:"Akkadian cylinder-seal imprint (ca. 2350–2000 BCE)", cap:"A Mesopotamian seal for comparison with Harappan seals. Photo: The Louvre / Wikimedia Commons.", tags:["seal","mesopotamia"] },
  { id:"akkadian-seal", f:"akkadian-seal.jpg", ch:"ch3", kind:"Seal", title:"Akkadian cylinder seal and impression (ca. 2250–2150 BCE)", cap:"On the right: a bull-man fights a lion and a bearded nude hero subdues a water buffalo. Photo: The Metropolitan Museum of Art.", tags:["seal","mesopotamia"] },
  { id:"egypt-dagger", f:"egypt-dagger.jpg", ch:"ch3", kind:"Artefact", title:"Egyptian dagger handle (ca. 2750 BCE)", cap:"Perhaps showing Mesopotamian influence: a bearded priest-king subduing lions. Photo: The Louvre / Wikimedia Commons.", tags:["egypt","dagger","mesopotamia"] },
  { id:"harappan-seal-tigers", f:"harappan-seal-tigers.jpg", ch:"ch3", kind:"Seal", title:"Harappan seal: a man subduing tigers", cap:"A man subdues tigers on his right and left. A motif echoed in Mesopotamia and Egypt. Photo: Leemage / UIG / Getty Images.", tags:["seal","harappa","tiger"] },
  { id:"stele-vultures", f:"stele-vultures.jpg", ch:"ch3", kind:"Artefact", title:"Fragment of the ‘Stele of Vultures’, ca. 2450 BCE", cap:"Two men wear their hair in a double-bun style — a hairstyle also seen on Harappan sculptures. Photo: The Louvre / Wikimedia Commons.", tags:["mesopotamia","hairstyle"] },
  { id:"double-bun", f:"double-bun.jpg", ch:"ch3", kind:"Artefact", title:"Mohenjo-daro sculpture: a double-bun hairstyle", cap:"A sculpture from Mohenjo-daro of a man with plaited double bun. Photo: Mohenjodaro Museum.", tags:["mohenjo-daro","sculpture"] },
  { id:"priest-king", f:"priest-king.jpg", ch:"ch3", kind:"Artefact", title:"The ‘priest-king’ of Mohenjo-daro", cap:"Only 17.5 cm tall; trefoil-patterned robe, ribbon headband and an upper-arm ornament. Photo: National Museum of Pakistan, Karachi.", tags:["mohenjo-daro","priest-king"] },
  { id:"kalibangan-seal", f:"kalibangan-seal.jpg", ch:"ch3", kind:"Seal", title:"Kalibangan seal imprint", cap:"A woman stands between two men about to spear each other — the one Harappan scene of human-on-human violence the book describes. Photo: Archaeological Survey of India.", tags:["seal","kalibangan","violence"] },
  { id:"great-bath", f:"great-bath.jpg", ch:"ch3", kind:"Site photo", title:"The Great Bath of Mohenjo-daro", cap:"Together with some 700 wells, a monument to Harappan attention to water. Photo: De Agostini / G. Nimatallah / Getty Images.", tags:["mohenjo-daro","water"] },
  { id:"dholavira-reservoir", f:"dholavira-reservoir.jpg", ch:"ch3", kind:"Site photo", title:"A stepped reservoir at Dholavira", cap:"Dholavira’s eastern reservoir (74 m × 26 m × 7 m) was the largest of its kind in the ancient world. Photo: Tony Joseph.", tags:["dholavira","water"] },
  { id:"mohenjo-drain", f:"mohenjo-drain.jpg", ch:"ch3", kind:"Site photo", title:"The drainage system of Mohenjo-daro", cap:"Covered brick drains ran along the streets. Photo: Larry Burrows / The LIFE Picture Collection / Getty Images.", tags:["mohenjo-daro","drain"] },
  { id:"weights", f:"weights.jpg", ch:"ch3", kind:"Artefact", title:"Balance scale and weights", cap:"One standard of cubic chert weights across the whole civilization. Photo: National Museum of India, New Delhi.", tags:["weights","trade"] },
  { id:"bangle", f:"bangle.jpg", ch:"ch3", kind:"Artefact", title:"A Harappan bangle", cap:"Hundreds of thousands of bangles have been found in the Indus Valley. Photo: National Museum of Pakistan, Karachi.", tags:["bangle","ornament"] },
  { id:"map-harappan", f:"map-harappan.jpg", ch:"ch3", kind:"Map", title:"The Harappan Civilization (2600–1900 BCE)", cap:"Extent of the Mature Harappan Civilization across the Indus and Ghaggar–Hakra valleys and Gujarat.", tags:["map","harappa"] },
  { id:"unicorn-seal", f:"unicorn-seal.jpg", ch:"ch3", kind:"Seal", title:"The ‘unicorn’ seal", cap:"About 60 per cent of all Harappan seals ever recovered carry the unicorn image. Photo: George Historical Picture Archive / Alamy.", tags:["seal","unicorn"] },
  { id:"peepul-seal", f:"peepul-seal.jpg", ch:"ch3", kind:"Seal", title:"Deity in a peepul tree", cap:"A seal from Mohenjo-daro depicting a horned deity wearing bangles in a peepul tree. Photo: Karachi Museum.", tags:["seal","peepul","deity"] },
  { id:"tiger-seal", f:"tiger-seal.jpg", ch:"ch3", kind:"Seal", title:"Harappan seal with animal scene", cap:"Seals depict scenes of religion, myth and story whose meaning is still unknown. Photo: Aisha / Corbis / Getty Images.", tags:["seal","myth"] },
  { id:"buffalo-seal", f:"buffalo-seal.jpg", ch:"ch3", kind:"Seal", title:"Man spearing a water buffalo", cap:"A seated figure in a horned headdress looks on. Photo: Archaeological Museum, Harappa.", tags:["seal","buffalo"] },
  { id:"mother-goddess", f:"mother-goddess.jpg", ch:"ch3", kind:"Artefact", title:"Figurine of a woman", cap:"Some see it as a ‘Mother Goddess’. Photo: National Museum of India, New Delhi.", tags:["figurine","goddess"] },
  { id:"script-seal", f:"script-seal.jpg", ch:"ch3", kind:"Seal", title:"Harappan seal with script", cap:"Archaeological Survey of India. The script is still undeciphered; a Dravidian reading is argued by Iravatham Mahadevan and Asko Parpola.", tags:["seal","script"] },
  { id:"map-languages-sasia", f:"map-languages-sasia.jpg", ch:"ch3", kind:"Map", title:"South Asian language families", cap:"Indo-Aryan, Iranian, Nuristani, Dravidian, Austroasiatic, Tibeto-Burman and isolates across the subcontinent.", tags:["map","languages"] },

  { id:"map-steppe-europe", f:"map-steppe-europe.jpg", ch:"ch4", kind:"Map", title:"Migration of Central Asian pastoralists to Europe around 3000 BCE", cap:"Yamnaya expansion and the Corded Ware and Bell Beaker cultures.", tags:["map","yamnaya","steppe"] },
  { id:"map-west-eurasian", f:"map-west-eurasian.jpg", ch:"ch4", kind:"Map", title:"A summary of west Eurasian migrations into India", cap:"Adapted from ‘The Genomic Formation of South and Central Asia’, bioRxiv, 2018.", tags:["map","migration","genomic"] },
  { id:"map-indo-european", f:"map-indo-european.jpg", ch:"ch4", kind:"Map", title:"Distribution of Indo-European languages in Eurasia", cap:"From Europe through Iran and Central Asia to South Asia.", tags:["map","indo-european","languages"] },
  { id:"dholavira-columns", f:"dholavira-columns.jpg", ch:"ch4", kind:"Site photo", title:"Free-standing phallic columns, Dholavira", cap:"Cited alongside the Rigveda’s disdain for ‘shishna-deva’ (phallus worshippers). Photo: Archaeological Survey of India.", tags:["dholavira","rigveda"] },
  { id:"dholavira-statue", f:"dholavira-statue.jpg", ch:"ch4", kind:"Site photo", title:"Dholavira statue, as found", cap:"Found upside down as a building block of a Late Harappan wall. Photo: Archaeological Survey of India.", tags:["dholavira","statue"] },
  { id:"dholavira-statue2", f:"dholavira-statue2.jpg", ch:"ch4", kind:"Artefact", title:"Dholavira seated figure, damaged", cap:"The head was intentionally chopped and the genitals rubbed off. Photo: Archaeological Survey of India.", tags:["dholavira","statue"] },
  { id:"map-indo-aryan", f:"map-indo-aryan.jpg", ch:"ch4", kind:"Map", title:"The spread of Indo-Aryan languages, 2000–500 BCE", cap:"Adapted from Franklin Southworth: shared route, ‘inner’ group and ‘outer’ group.", tags:["map","indo-aryan","southworth"] }
];

/* ---------- Master timeline ----------
   ya = years ago (start), end = years ago (end, optional)             */
window.EVENTS = [
  // Intro / Deep time
  { ch:"intro", ya:300000, t:"Earliest Homo sapiens remains", d:"A cave at Jebel Irhoud, near Safi in Morocco, yields the oldest modern-human remains ever found (~300,000 years).", s:"Chronology" },
  { ch:"intro", ya:250000, t:"Hathnora cranium, Narmada valley", d:"A partially complete archaic cranium found at Hathnora in 1982 dates to about 250,000 years ago.", s:"Ch. 1–2" },
  { ch:"ch1",  ya:385000, t:"Early tools at Attirampakkam (Middle Palaeolithic)", d:"Tools at Attirampakkam, Tamil Nadu, show archaic humans at the cutting edge of technology; earliest Palaeolithic tools there are ~1.5 million years old.", s:"Ch. 1" },
  { ch:"ch1",  ya:180000, t:"Misliya, Israel", d:"Earliest modern human fossil found outside Africa.", s:"Chronology" },
  { ch:"ch1",  ya:120000, end:80000, t:"Skhul–Qafzeh humans, Israel", d:"Modern human skeletons in the Levant, a likely dead end rather than the ancestors of today’s non-Africans.", s:"Ch. 1" },
  { ch:"ch1",  ya:88000, t:"Al Wusta, Arabia", d:"A modern-human finger fossil in what was then a lake-rich Arabia.", s:"Ch. 1" },
  { ch:"ch1",  ya:77000, t:"Jwalapuram tools under Toba ash", d:"Middle Palaeolithic tools beneath the ash layer in Kurnool, Andhra Pradesh. Makers debated: modern humans or archaic hominins.", s:"Ch. 1" },
  { ch:"ch1",  ya:74000, t:"Toba supervolcano erupts", d:"The most violent eruption in two million years, in Sumatra; ash blankets South and South-east Asia.", s:"Ch. 1" },
  { ch:"ch1",  ya:70000, t:"Successful Out of Africa", d:"Geneticists place the exodus of the ancestors of all non-Africans around now, probably by the Southern Route through Bab el Mandeb.", s:"Chronology" },
  { ch:"ch1",  ya:65000, t:"OoA migrants reach India and Australia", d:"They meet a robust population of archaic humans in the subcontinent and spread on to south-east Asia, east Asia and Australia.", s:"Chronology" },
  { ch:"ch1",  ya:45000, end:20000, t:"Microlithic technology; First Indians multiply", d:"The First Indians’ population rises dramatically in central and eastern India; South Asia becomes where ‘most of humanity’ lives.", s:"Chronology" },
  { ch:"intro",ya:45000, t:"Modern humans reach Europe", d:"Europe is settled about 25,000 years after Australia.", s:"Ch. 1" },
  { ch:"intro",ya:40000, t:"Neanderthals go extinct", d:"The Iberian peninsula is their last refuge and stand.", s:"Chronology" },
  { ch:"ch1",  ya:35000, t:"Archaic Homo likely vanish in India", d:"Modern humans become, for the first time, masters of all they surveyed in the subcontinent.", s:"Ch. 2" },
  { ch:"ch1",  ya:16000, t:"Modern humans reach the Americas", d:"The last major continent, reached across Beringia.", s:"Chronology" },
  { ch:"ch2",  ya:13000, t:"Wild wheat and rye harvested on the Euphrates", d:"Around 11,000 BCE residents were harvesting wild cereals.", s:"Ch. 2" },
  { ch:"ch2",  ya:11700, t:"The Holocene begins", d:"Climate warms rapidly; the human population starts to explode as agriculture spreads.", s:"Ch. 2" },
  { ch:"ch2",  ya:10500, end:10200, t:"Domesticated emmer and einkorn", d:"Earliest domesticated wheat varieties appear in west Asia (8500–8200 BCE).", s:"Ch. 2" },
  { ch:"ch2",  ya:9000, t:"Mehrgarh founded; rice at Lahuradewa", d:"An agricultural settlement begins at the foot of the Bolan Pass, ~200 hectares at its largest. Rice harvesting is evidenced at Lahuradewa, UP.", s:"Chronology" },
  { ch:"ch2",  ya:9000, end:5000, t:"Zagros farmers mix with First Indians", d:"Iranian agriculturists migrate to South Asia (7000–3000 BCE); mixing happened at least by 4700–3000 BCE.", s:"Chronology" },
  { ch:"ch2",  ya:8000, t:"Pottery arrives at Mehrgarh", d:"The ceramic period begins around 6000 BCE, long after farming started.", s:"Ch. 2" },
  { ch:"ch2",  ya:7500, end:4600, t:"Early Harappan era", d:"Early villages grow into towns such as Kalibangan, Rakhigarhi, Banawali and Rahman Dheri (5500–2600 BCE).", s:"Chronology" },
  { ch:"ch2",  ya:5700, end:3500, t:"Farming spreads across India", d:"Early agriculture appears in eastern Rajasthan, southern India, the Vindhya region, eastern India and Swat (3700–1500 BCE).", s:"Chronology" },
  { ch:"ch3",  ya:5300, t:"First script-like marks at Harappa", d:"Markings on post-fired pottery appear around 3300 BCE — the same time early writing begins in Mesopotamia, Egypt and China.", s:"Ch. 3" },
  { ch:"ch4",  ya:5000, t:"Yamnaya burst upon Europe", d:"Around 3000 BCE; Corded Ware culture follows from about 2900 BCE.", s:"Ch. 4" },
  { ch:"ch3",  ya:4600, end:3900, t:"Mature Harappan period", d:"The civilization’s peak: common script, seals, motifs and weights; ~700 years without evidence of any city being attacked or burnt.", s:"Chronology" },
  { ch:"ch4",  ya:4300, end:3700, t:"BMAC", d:"The Bactria–Margiana Archaeological Complex, with close trade and cultural ties to the Harappans.", s:"Chronology" },
  { ch:"ch4",  ya:4100, t:"Steppe pastoralists move south", d:"A southward migration from the Kazakh Steppe towards Turan around 2100 BCE.", s:"Chronology" },
  { ch:"ch4",  ya:4000, end:3000, t:"Waves of Steppe migrants enter South Asia", d:"Multiple waves (2000–1000 BCE) bring Indo-European languages and new religious and cultural practices.", s:"Chronology" },
  { ch:"ch2",  ya:4000, t:"Austroasiatic wave from China/SE Asia", d:"After 2000 BCE a wave brings Austroasiatic languages, new plants and a new variety of rice.", s:"Chronology" },
  { ch:"ch3",  ya:3900, end:3300, t:"Late Harappan: decline", d:"Primarily due to a long drought that affected civilizations in west Asia, Egypt and China as well (1900–1300 BCE).", s:"Chronology" },
  { ch:"epi",  ya:4200, end:2100, t:"Era of extensive mixing", d:"Between 2200 BCE and 100 CE the Indian groups mixed extensively; this ends around 100 CE.", s:"Epilogue" },
  { ch:"ch4",  ya:3200, end:2800, t:"Swat valley samples", d:"Forty-one individuals (≈1200–800 BCE) carry ~22% Steppe ancestry on top of Iranian-farmer and First Indian ancestry.", s:"Ch. 2/4" },
  { ch:"ch4",  ya:3400, end:3000, t:"Rigveda composed (one scholarly dating)", d:"The book cites a dating of the Rigveda to 1400–1000 BCE.", s:"Ch. 4" },
  { ch:"epi",  ya:2500, t:"Ganga-plain urbanization begins", d:"The second urbanization, around 500 BCE, begins in Magadha — outside the narrowly defined Aryavarta.", s:"Epilogue" },
  { ch:"epi",  ya:2322, end:2180, t:"The Mauryan empire", d:"The first Indian empire (322–180 BCE) arose outside Aryavarta.", s:"Epilogue" },
  { ch:"epi",  ya:2150, t:"Patanjali’s Mahabhasya", d:"Around 150 BCE the grammarian defines the land of the Aryas.", s:"Epilogue" },
  { ch:"epi",  ya:1900, t:"Endogamy sets in: the caste ‘closing’", d:"Around 100 CE a new ideology closed the mixing; groups became endogamous.", s:"Epilogue" }
];

/* ---------- Research / author timeline (real dates, CE) ---------- */
window.RESEARCH = [
  { y:1976, t:"Mehrgarh discovered as a historical site", d:"French archaeologists begin the work that reveals South Asia’s earliest farming settlement." },
  { y:1982, t:"Hathnora cranium found", d:"Narmada valley, Madhya Pradesh — first classified as an early human, later reassessed." },
  { y:2009, t:"‘Reconstructing Indian Population History’", d:"Reich, Thangaraj, Singh, Patterson et al. propose the ANI–ASI model; ANI related to west Eurasians." },
  { y:2013, t:"‘Genetic Evidence for Recent Population Mixture in India’", d:"Mixing between 2200 BCE and 100 CE, ending with a shift to endogamy." },
  { y:2017, t:"‘A Genetic Chronology for the Indian Subcontinent…’", d:"Heavily sex-biased dispersals; published 23 March 2017." },
  { y:2017.5, t:"The Hindu article, 17 June 2017", d:"‘How Genetics Is Settling the Aryan Migration Debate’ — the seed of this book." },
  { y:2018, t:"‘The Genomic Formation of South and Central Asia’", d:"Ninety-two scientists, ancient DNA from BMAC, Shahr-i-Sokhta and Swat. Book published the same year." }
];

/* ---------- Colour roles for entities (fixed order, never cycled) ---------- */
window.ENTITY = {
  first:   { name:"First Indians (OoA descendants)", slot:1 },
  iran:    { name:"Iranian / Zagros agriculturists", slot:2 },
  anat:    { name:"Anatolian farmers",               slot:3 },
  wsib:    { name:"West-Siberian-related",           slot:4 },
  steppe:  { name:"Steppe pastoralists (Yamnaya-related)", slot:5 },
  seasia:  { name:"South-east Asian (Austroasiatic)",slot:6 },
  tibeto:  { name:"Tibeto-Burman / east Asian",      slot:7 },
  other:   { name:"Other / remainder",               slot:0 }
};

/* ---------- Chart datasets ---------- */
window.DATA = {
  // Intro — hominin lifespans (years ago, log axis)
  hominins: [
    { label:"Homo sapiens", short:"≈300k yrs → today",            start:300000,  end:0,      slot:1, note:"≈300,000 years; the only surviving Homo" },
    { label:"Homo neanderthalensis", short:"400k → 40k yrs ago",   start:400000,  end:40000,  slot:2, note:"Europe, SW and central Asia" },
    { label:"Homo heidelbergensis", short:"700k → 200k yrs ago",    start:700000,  end:200000, slot:3, note:"Africa, Asia, Europe" },
    { label:"Homo erectus", short:"1.89M → 143k yrs ago",            start:1890000, end:143000, slot:4, note:"Africa and Asia" },
    { label:"Homo habilis", short:"2.4M yrs ago",            at:2400000, slot:5, note:"2.4 million years ago" },
    { label:"Kenyanthropus platyops", short:"3.5M yrs ago",  at:3500000, slot:6, note:"3.5 million years ago" },
    { label:"Ardipithecus ramidus", short:"4M yrs ago",    at:4000000, slot:7, note:"4 million years ago" },
    { label:"Sahelanthropus tchadensis", short:"7M yrs ago", at:7000000, slot:8, note:"7 million years ago" }
  ],
  // Intro — shared DNA
  dna: [
    { label:"Chimpanzee DNA shared with Homo sapiens", value:96, unit:"%" },
    { label:"Difference between two humans’ genomes", value:0.1, unit:"%", note:"≈3 million letter differences" },
    { label:"Neanderthal DNA in non-Africans", value:2, unit:"%" },
    { label:"Denisovan DNA (Melanesians, Papuans, Aboriginal Australians)", lo:3, hi:6, unit:"%" }
  ],
  // Intro — cosmic speed (km/h), log
  cosmic: [
    { label:"Milky Way through space", value:2100000, slot:1 },
    { label:"Sun around the Milky Way", value:792000, slot:2 },
    { label:"Earth orbiting the Sun", value:107000, slot:3 },
    { label:"Earth’s rotation at the equator", value:1600, slot:4 }
  ],
  // Ch1 — haplogroup ages (thousand years ago)
  haplo: [
    { label:"L3 (parent of all non-African mtDNA)", value:70, slot:1 },
    { label:"N", value:61, slot:2 },
    { label:"M", value:48, slot:3 }
  ],
  // Ch1 — evidence dots/ranges (years ago)
  evidence: [
    { label:"Jebel Irhoud, Morocco — earliest Homo sapiens", at:300000, slot:1 },
    { label:"Misliya, Israel", at:180000, slot:1 },
    { label:"Skhul–Qafzeh, Israel", start:120000, end:80000, slot:2 },
    { label:"Al Wusta, Arabia (finger fossil)", at:88000, slot:2 },
    { label:"Jwalapuram tools under Toba ash", at:77000, slot:3 },
    { label:"Toba eruption", at:74000, slot:4 },
    { label:"Lida Ajer teeth, Sumatra", start:73000, end:63000, slot:5 },
    { label:"Australia (modern humans)", start:70700, end:59300, slot:5 },
    { label:"Geneticists’ OoA estimate", start:70000, end:65000, slot:6 },
    { label:"Europe settled", at:45000, slot:7 },
    { label:"Fa Hien caves, Sri Lanka", at:35000, slot:7 },
    { label:"Americas", at:16000, slot:8 }
  ],
  // Ch1 — Marine Isotope Stages: older boundary (thousand years ago)
  mis: [14,29,57,71,130,191,243,300,337,374,424,478,528,563,621,676,712,761,790,814,866],
  // Ch1 — First-Indian share of ancestry
  firstShare: [
    { label:"Whole-genome ancestry", lo:50, hi:65, slot:1 },
    { label:"mtDNA lineages (maternal)", lo:70, hi:90, slot:1 },
    { label:"Y-chromosome lineages (paternal)", lo:10, hi:40, slot:1 }
  ],
  // Ch2 — Anatolian ancestry cline
  anatolian: [
    { label:"Anatolia", value:70 },
    { label:"Iran", value:33 },
    { label:"Far-eastern Turan", value:3 }
  ],
  // Ch2 — BMAC composition
  bmac: [
    { label:"Early-Iranian-agriculturist-related", value:60, ent:"iran" },
    { label:"Anatolian-agriculturist-related", value:21, ent:"anat" },
    { label:"West-Siberian-related", value:13, ent:"wsib" },
    { label:"Remainder (not itemised in book)", value:6, ent:"other" }
  ],
  // Ch2 — Indus periphery outliers
  outliers: [
    { label:"First-Indian-related ancestry", lo:14, hi:42, ent:"first" },
    { label:"Iranian-agriculturist-related ancestry", lo:58, hi:86, ent:"iran" }
  ],
  // Ch2 — later migrations in Indian lineages
  laterLineages: [
    { label:"mtDNA from First Indians", lo:70, hi:90, ent:"first" },
    { label:"mtDNA from later migrations", lo:10, hi:30, ent:"other" },
    { label:"Y-chromosome from First Indians", lo:10, hi:40, ent:"first" },
    { label:"Y-chromosome from later migrations", lo:60, hi:90, ent:"other", note:"“over 60 per cent”; upper bound implied" }
  ],
  // Ch2 — west Eurasian ancestry
  westEurasian: { lo:20, hi:80 },
  // Ch2 — settlement size (hectares)
  hectares: [
    { label:"Mehrgarh (at its largest)", value:200, slot:2 },
    { label:"Dholavira (fortified city)", value:100, slot:1 }
  ],
  // Ch2 — farming-evidence Gantt (years ago)
  farming: [
    { label:"Wild wheat & rye harvested (Euphrates)", start:13000, end:12500, slot:1 },
    { label:"Domesticated emmer & einkorn", start:10500, end:10200, slot:2 },
    { label:"Mehrgarh settlement", start:9000, end:4600, slot:3 },
    { label:"Mehrgarh ceramic period begins", start:8000, end:4600, slot:4 },
    { label:"Early Harappan", start:7500, end:4600, slot:5 },
    { label:"Farming spreads across India", start:5700, end:3500, slot:6 }
  ],
  // Ch3 — phases
  phases: [
    { label:"Early Harappan", start:7500, end:4600, slot:3, note:"5500–2600 BCE; villages to towns" },
    { label:"Mature Harappan", start:4600, end:3900, slot:2, note:"2600–1900 BCE; ~700 years" },
    { label:"Late Harappan", start:3900, end:3300, slot:4, note:"1900–1300 BCE; long drought" },
    { label:"BMAC (neighbour)", start:4300, end:3700, slot:7, note:"2300–1700 BCE" }
  ],
  // Ch3 — area (million sq km)
  area: [
    { label:"India today", value:3, slot:1 },
    { label:"Harappan Civilization (peak, “almost”)", value:1, slot:2 }
  ],
  // Ch3 — ziggurats
  ziggurats: [
    { label:"Mesopotamia — Iraq", value:28, slot:1 },
    { label:"Mesopotamia — Iran", value:4, slot:2 },
    { label:"Harappan civilization (identified temples)", value:0, slot:3 }
  ],
  // Ch3 — languages
  langIndia: [
    { label:"Indo-European", value:75, slot:5, note:"“over three-quarters” / about 75%" },
    { label:"Dravidian", value:20, slot:2, note:"“nearly 20%”; no relatives outside South Asia" },
    { label:"Austroasiatic", value:1.2, slot:6 },
    { label:"Tibeto-Burman", value:1, slot:7, note:"“less than 1%”" }
  ],
  // Ch4 — R1a
  r1a: [
    { label:"Europe (1,693 samples)", parts:[{label:"R1a-Z282",value:96,slot:1},{label:"Other",value:4,slot:0}] },
    { label:"Central & South Asia (490 samples)", parts:[{label:"R1a-Z93",value:98.4,slot:2},{label:"Other",value:1.6,slot:0}] }
  ],
  // Ch4 — steppe signatures
  steppe: [
    { label:"Swat valley individuals (≈1200–800 BCE): Steppe ancestry", value:22 },
    { label:"R1a-Z93 in Steppe Bronze Age (2000–1400 BCE)", value:68 },
    { label:"Corded Ware: Yamnaya-related ancestry", value:75 },
    { label:"Bronze Age Britain: Beaker-related ancestry", value:90 },
    { label:"Iberia: share of population replaced", value:30 },
    { label:"Iberia: Yamnaya-ancestry males with Steppe Y", value:90 }
  ],
  // Ch4 — language: India vs W. Europe
  langCompare: [
    { label:"Western Europe — Indo-European", value:94, slot:5 },
    { label:"India — Indo-European", value:75, slot:5 },
    { label:"India — Dravidian", value:20, slot:2 }
  ],
  steppeWaves: [
    { label:"Yamnaya into Europe", start:5000, end:4500, slot:1 },
    { label:"Steppe south from Kazakhstan", start:4100, end:3900, slot:2 },
    { label:"BMAC period", start:4300, end:3700, slot:3 },
    { label:"Steppe waves into South Asia", start:4000, end:3000, slot:5 },
    { label:"Swat valley samples", start:3200, end:2800, slot:4 },
    { label:"Rigveda (cited dating)", start:3400, end:3000, slot:7 }
  ],
  // Epilogue — lactase
  lactase: { hi:40, lo:1, overall:20, europeOrigin:7500 },
  // Epilogue — caste eras
  caste: [
    { label:"Extensive mixing among groups", start:4200, end:1900, slot:3, note:"2200 BCE – 100 CE" },
    { label:"Endogamy: jati groups close", start:1900, end:0, slot:2, note:"≈100 CE onward" },
    { label:"Mauryan empire", start:2322, end:2180, slot:7, note:"322–180 BCE" },
    { label:"Patanjali’s Mahabhasya", start:2155, end:2145, slot:4, note:"c. 150 BCE" }
  ],
  // Epilogue — adivasi share
  adivasi: 8,
  // Epilogue — pizza layers (ranges from the book)
  pizza: [
    { key:"first", title:"Base — First Indians", when:"~65,000 years ago", range:"50–65% of genome-wide ancestry", text:"Laid down by the Out-of-Africa migrants. No close relatives outside the subcontinent; present in every region, language group, caste and tribe." },
    { key:"iran",  title:"Sauce — Zagros farmers", when:"after 7000 BCE", range:"mixed with First Indians, then spread with the Harappan collapse", text:"Iranian agriculturists reach Balochistan, mix with First Indians and together build the Harappan Civilization." },
    { key:"steppe",title:"Cheese — Steppe pastoralists", when:"after 2000 BCE", range:"more in the north than the south", text:"Sprinkled over the whole pizza, but thicker in the north; strongly male-driven; strongest signals in traditionally priestly groups." },
    { key:"seasia",title:"Toppings — Austroasiatic & Tibeto-Burman", when:"from ~2000 BCE", range:"≈25% SE-Asian component in Munda speakers", text:"Arrive around the same time as the Steppe groups; small shares but regional flavour." },
    { key:"other", title:"Later garnish", when:"historic times", range:"small marks everywhere", text:"Greeks, Jews, Huns, Sakas, Parsis, Syrians, Mughals, Portuguese, British and Siddis have all left small marks." }
  ]
};

/* ---------- Searchable fact cards ---------- */
window.FACTS = [
  ["First Indians","50–65% of the whole-genome ancestry of Indian groups comes from the First Indians who arrived ~65,000 years ago.","ch1"],
  ["mtDNA","70–90% of Indian mtDNA lineages descend from First Indians; M lineages most common.","ch1"],
  ["Y-chromosome","Only 10–40% of Indian Y-chromosome lineages descend from First Indians: a signature of male-driven later migrations.","ch4"],
  ["Out of Africa","L3 emerged ~70,000 years ago; N 61,000; M 48,000. All non-Africans descend from L3 via M and N.","ch1"],
  ["Toba","The Toba eruption of 74,000 years ago was the most violent in two million years.","ch1"],
  ["Neanderthal","All non-African people carry ~2% Neanderthal DNA; Melanesians, Papuans and Aboriginal Australians also carry 3–6% Denisovan DNA.","intro"],
  ["Mehrgarh","Naked six-row barley made up more than 90% of recorded seeds at Mehrgarh.","ch2"],
  ["Anatolian cline","Anatolian farmer ancestry falls from 70% in Anatolia to 33% in Iran to 3% in far-eastern Turan.","ch2"],
  ["BMAC","BMAC individuals: ~60% Iranian-farmer, ~21% Anatolian, ~13% west-Siberian ancestry.","ch2"],
  ["Harappan size","At its height the civilization may have covered almost a million square kilometres, about a third of today’s India.","ch3"],
  ["Ziggurats","32 ziggurats are known in Mesopotamia (28 in Iraq, 4 in Iran); not a single Harappan temple has been clearly identified.","ch3"],
  ["Weights","One standard of cubic chert weights across the whole Harappan world; Mesopotamia had a medley.","ch3"],
  ["Unicorn seal","About 60% of all Harappan seals show the unicorn.","ch3"],
  ["Dholavira","The eastern reservoir at Dholavira was 74 × 26 × 7 metres — the largest of its kind in the ancient world.","ch3"],
  ["R1a","98.4% of Central and South Asian R1a lineages belong to R1a-Z93; 96% of European R1a to Z282.","ch4"],
  ["Swat","Swat valley individuals (≈1200–800 BCE) carry ~22% Steppe ancestry.","ch4"],
  ["Languages","About 75% of Indians speak an Indo-European language, ~20% Dravidian, ~1.2% Austroasiatic, <1% Tibeto-Burman.","ch3"],
  ["Western Europe","94% of western Europeans speak Indo-European languages; only the Basques stand apart.","ch4"],
  ["Caste","Genetic mixing across groups ended around 100 CE as endogamy set in.","epi"],
  ["Lactase","Lactase persistence ranges from over 40% in parts of western/northern India to under 1% in parts of the north-east.","epi"],
  ["Adivasi","Adivasis form about 8% of the population and carry First Indian ancestry like everyone else.","epi"]
];
