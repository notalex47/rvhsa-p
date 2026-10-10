// Coordinates use the adapted long-bone diagram's 1256 × 1792 reference grid.
export const IMAGE_WIDTH = 1256;
export const IMAGE_HEIGHT = 1792;
export const QUESTIONS = [
  {
    "answer": "Articular cartilage",
    "point": [
      245,
      63
    ],
    "group": "coverings",
    "category": "COVERINGS & BLOOD SUPPLY",
    "aliases": [
      "hyaline cartilage",
      "articular hyaline cartilage"
    ],
    "blurb": "Covers the joint surfaces at the ends of the bone, reducing friction and absorbing shock."
  },
  {
    "answer": "Red bone marrow",
    "point": [
      395,
      258
    ],
    "group": "marrow",
    "category": "MARROW & CAVITY",
    "aliases": [
      "red marrow"
    ],
    "blurb": "Produces blood cells. In this diagram it occupies spaces within the spongy bone near the upper end."
  },
  {
    "answer": "Epiphyseal line",
    "point": [
      442,
      247
    ],
    "group": "regions",
    "category": "LONG BONE REGIONS",
    "aliases": [
      "epiphysial line",
      "epiphyseal scar",
      "growth plate remnant"
    ],
    "blurb": "The bony remnant of an epiphyseal growth plate after growth in length has stopped. It lies between the epiphysis and shaft."
  },
  {
    "answer": "Marrow cavity",
    "point": [
      775,
      470
    ],
    "group": "marrow",
    "category": "MARROW & CAVITY",
    "aliases": [
      "medullary cavity",
      "bone marrow cavity",
      "medullary canal"
    ],
    "blurb": "The hollow space inside the diaphysis. It contains marrow; the empty right-hand section makes the cavity easy to see."
  },
  {
    "answer": "Yellow bone marrow",
    "point": [
      449,
      594
    ],
    "group": "marrow",
    "category": "MARROW & CAVITY",
    "aliases": [
      "yellow marrow"
    ],
    "blurb": "Contains many fat cells and stores energy. It fills much of the medullary cavity of an adult long bone."
  },
  {
    "answer": "Periosteum",
    "point": [
      500,
      845
    ],
    "group": "coverings",
    "category": "COVERINGS & BLOOD SUPPLY",
    "aliases": [],
    "blurb": "The membrane covering the outer bone surface except at the articular cartilage. It carries vessels and nerves and helps bone grow in thickness and repair."
  },
  {
    "answer": "Nutrient foramen",
    "point": [
      464,
      1075
    ],
    "group": "coverings",
    "category": "COVERINGS & BLOOD SUPPLY",
    "aliases": [
      "nutrient foramina",
      "nutrient opening"
    ],
    "blurb": "An opening in compact bone through which blood vessels enter to supply the bone and marrow."
  },
  {
    "answer": "Endosteum",
    "point": [
      474,
      1235
    ],
    "group": "coverings",
    "category": "COVERINGS & BLOOD SUPPLY",
    "aliases": [
      "site of endosteum",
      "endosteal lining"
    ],
    "blurb": "A thin membrane lining internal bone surfaces, including the medullary cavity. Its cells participate in bone remodeling."
  },
  {
    "answer": "Compact bone",
    "point": [
      397,
      1325
    ],
    "group": "tissue",
    "category": "BONE TISSUE",
    "aliases": [
      "cortical bone",
      "dense bone"
    ],
    "blurb": "Dense bone forming the strong outer wall, especially thick around the shaft. It provides support and resists bending."
  },
  {
    "answer": "Spongy bone",
    "point": [
      407,
      1518
    ],
    "group": "tissue",
    "category": "BONE TISSUE",
    "aliases": [
      "cancellous bone",
      "trabecular bone"
    ],
    "blurb": "A network of thin bony struts called trabeculae, prominent in the ends of a long bone. Marrow fills the spaces between them."
  },
  {
    "answer": "Epiphysis",
    "point": [
      1014,
      144
    ],
    "group": "regions",
    "category": "LONG BONE REGIONS",
    "aliases": [
      "epiphyses",
      "proximal epiphysis",
      "distal epiphysis"
    ],
    "blurb": "An expanded end of a long bone. It contains spongy bone and has articular cartilage on its joint surface.",
    "region": [
      1004,
      55,
      1055,
      234
    ]
  },
  {
    "answer": "Diaphysis",
    "point": [
      932,
      903
    ],
    "group": "regions",
    "category": "LONG BONE REGIONS",
    "aliases": [
      "shaft",
      "bone shaft",
      "shaft of the bone"
    ],
    "blurb": "The long central shaft of a long bone. Its thick compact-bone wall surrounds the medullary cavity.",
    "region": [
      875,
      234,
      920,
      1565
    ]
  }
];

export function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function normalizeAnswer(text) {
  return text.toLowerCase().trim().replace(/\bthe\b/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}

export function acceptsAnswer(question, text) {
  return [question.answer, ...question.aliases].some(answer => normalizeAnswer(answer) === normalizeAnswer(text));
}

export function choicesFor(question) {
  const related = QUESTIONS.filter(item => item.group === question.group && item.answer !== question.answer);
  let distractors = shuffle(related).slice(0, 3);
  const used = new Set([question.answer, ...distractors.map(item => item.answer)]);
  distractors = [...distractors, ...shuffle(QUESTIONS.filter(item => !used.has(item.answer))).slice(0, 3 - distractors.length)];
  return shuffle([question.answer, ...distractors.map(item => item.answer)]);
}
