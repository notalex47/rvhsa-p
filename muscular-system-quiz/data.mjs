// Target coordinates use the 1000px-wide adaptations in images/.
// Point targets store [tipX, tipY, tailX, tailY]; region targets keep a bracket.
// Both ends are calibrated to the committed image rather than viewport pixels.
const q = (answer, [x, y, fromX, fromY], group, aliases, blurb, marker) => ({
  answer, point: [x, y], pointerFrom: fromX === undefined ? null : [fromX, fromY],
  group, category: group.toUpperCase(), aliases, blurb, marker
});

export const QUIZZES = {
  'muscle-organization': {
    title: 'Skeletal Muscle Organization', number: 1, width: 1000, height: 714,
    description: 'Trace muscle organization from the whole muscle to a myofibril.',
    alt: 'Sectioned skeletal muscle attached to bone, with a fascicle, muscle fiber, and myofibril pulled out in sequence.',
    questions: [
      q('Bone', [265, 272, 145, 247], 'Attachments', ['osseous tissue'], 'The rigid attachment that receives the force produced by skeletal muscle.'),
      q('Periosteum', [454, 88, 554, 72], 'Attachments', [], 'The connective tissue membrane covering the outer surface of bone; tendon fibers blend with it.'),
      q('Tendon', [363, 180, 510, 161], 'Attachments', [], 'Dense connective tissue that transmits muscle force to bone.'),
      q('Epimysium', [646, 400, 755, 375], 'Connective tissue', ['epimysium around muscle', 'epimysium around whole muscle'], 'The connective tissue sheath surrounding the entire skeletal muscle.'),
      q('Belly of skeletal muscle', [459, 331, 340, 302], 'Organization', ['muscle belly', 'belly', 'skeletal muscle', 'muscle', 'belly of muscle'], 'The fleshy, contractile part of a muscle, between its attachments.'),
      q('Perimysium', [529, 453, 400, 598], 'Connective tissue', ['perimysium around fascicle', 'perimysium around a fascicle'], 'Connective tissue that surrounds each fascicle, a bundle of muscle fibers.'),
      q('Fascicle', [590, 458, 760, 450], 'Organization', ['muscle fascicle', 'fasciculus', 'bundle of muscle fibers', 'muscle fiber bundle'], 'A bundle of muscle fibers wrapped in perimysium.'),
      q('Muscle fiber', [683, 571, 804, 557], 'Organization', ['muscle fibre', 'muscle cell', 'muscle fiber cell', 'skeletal muscle fiber', 'skeletal muscle cell'], 'One elongated muscle cell containing many myofibrils.'),
      q('Myofibril', [711, 643, 820, 660], 'Organization', ['myofibrils'], 'A contractile structure inside a muscle fiber, built from repeating sarcomeres.')
    ]
  },
  'fascicle-anatomy': {
    title: 'Fascicle Anatomy', number: 2, width: 1000, height: 637,
    description: 'Explore the coverings and cellular structures within a fascicle.',
    alt: 'Cross section of a fascicle with peeled coverings, individual muscle fibers, peripheral nuclei, a satellite cell, mitochondria, and myofibrils.',
    questions: [
      q('Perimysium', [450, 64, 566, 18], 'Coverings', ['perimysium around fascicle', 'perimysium around a fascicle'], 'The connective tissue sheath around the entire fascicle.'),
      q('Satellite cell', [350, 219, 182, 205], 'Cell structures', ['satellite cells', 'myosatellite cell'], 'A muscle stem cell beside the muscle fiber that contributes to repair and growth.'),
      q('Mitochondrion', [501, 353, 432, 369], 'Cell structures', ['mitochondria'], 'An organelle that produces much of the ATP used by the muscle cell.'),
      q('Endomysium', [588, 263, 745, 155], 'Coverings', ['endomysium around muscle fiber', 'endomysium around a muscle fiber'], 'A thin layer of connective tissue surrounding each individual muscle fiber.'),
      q('Myofibril', [549, 299, 552, 237], 'Cell structures', ['myofibrils'], 'One of the many contractile structures inside a muscle cell.'),
      q('Muscle fiber', [465, 372], 'Cell structures', ['muscle fibre', 'muscle cell', 'muscle fiber cell', 'skeletal muscle fiber'], 'An individual skeletal muscle cell; the outlined cross section contains many myofibrils.', 'M 360 463 L 563 288 M 351 454 L 369 472 M 554 279 L 572 297'),
      q('Sarcolemma', [725, 451, 842, 476], 'Coverings', ['muscle cell membrane', 'cell membrane', 'plasma membrane', 'muscle fiber membrane'], 'The plasma membrane of a muscle fiber, just inside the endomysium.'),
      q('Sarcoplasm', [698, 416, 830, 419], 'Cell structures', ['cytoplasm', 'muscle cytoplasm', 'muscle cell cytoplasm'], 'The cytoplasm surrounding the myofibrils and organelles inside a muscle fiber.'),
      q('Nucleus', [376, 336, 278, 318], 'Cell structures', ['nuclei', 'myonucleus'], 'Skeletal muscle fibers contain many nuclei located near the cell surface.')
    ]
  },
  'muscle-fiber': {
    title: 'Muscle Fiber Anatomy', number: 3, width: 1000, height: 631,
    description: 'Identify a muscle fiber, its nerve and blood supply, and its internal structures.',
    alt: 'Pulled-out muscle fiber with a branching yellow nerve, red capillary, nuclei, striations, and a myofibril extending into filaments.',
    questions: [
      q('Endomysium', [419, 182, 536, 202], 'Coverings', ['endomysium around muscle fiber', 'endomysium around a muscle fiber'], 'The delicate connective tissue covering an individual muscle fiber.'),
      q('Perimysium', [519, 148, 628, 120], 'Coverings', ['perimysium around fascicle'], 'The connective tissue around the bundle of muscle fibers shown in cross section.'),
      q('Somatic motor neuron', [370, 153, 466, 96], 'Nerve and blood supply', ['motor neuron', 'somatic motor nerve', 'motor nerve', 'somatic motor axon', 'motor neuron axon', 'motor axon'], 'The yellow nerve branches carry motor signals to skeletal muscle fibers.'),
      q('Blood capillary', [452, 210, 563, 246], 'Nerve and blood supply', ['capillary', 'blood capillaries', 'capillaries'], 'A small blood vessel that supplies oxygen and nutrients and carries away waste.'),
      q('Nucleus', [425, 256, 343, 285], 'Cell structures', ['nuclei', 'myonucleus'], 'One of the peripheral nuclei of this multinucleated skeletal muscle cell.'),
      q('Muscle fiber', [449, 340, 331, 357], 'Cell structures', ['muscle fibre', 'muscle cell', 'muscle fiber cell', 'skeletal muscle fiber'], 'The elongated muscle cell from which a smaller myofibril is pulled out.'),
      q('Striations', [480, 315], 'Contractile structures', ['striation', 'bands', 'cross striations', 'cross striation'], 'The repeating light and dark bands produced by the arrangement of filaments within sarcomeres.', 'M 459 313 L 485 302 M 465 334 L 491 323'),
      q('Sarcoplasm', [560, 450, 660, 480], 'Cell structures', ['cytoplasm', 'muscle cytoplasm'], 'The cytoplasm in the spaces between the myofibrils.'),
      q('Sarcolemma', [595, 430, 718, 406], 'Coverings', ['cell membrane', 'plasma membrane', 'muscle cell membrane', 'muscle fiber membrane'], 'The plasma membrane surrounding the muscle cell, shown as the thin blue boundary.'),
      q('Myofibril', [536, 537, 661, 548], 'Contractile structures', ['myofibrils'], 'A long contractile structure containing a chain of sarcomeres.'),
      q('Filament', [542, 604, 663, 609], 'Contractile structures', ['filaments', 'myofilament', 'myofilaments'], 'A protein strand within a myofibril; thick and thin filaments interact during contraction.')
    ]
  },
  'fiber-details': {
    title: 'Muscle Fiber Details', number: 4, width: 1000, height: 645,
    description: 'Look inside a muscle fiber to study its membranes, triad, and contractile units.',
    alt: 'Cutaway muscle fiber showing reticulum around myofibrils, transverse tubules, terminal cisterns, mitochondria, peripheral nuclei, and an extended myofibril.',
    questions: [
      q('Sarcoplasmic reticulum', [393, 218, 326, 184], 'Membranes and calcium', ['sr'], 'A membrane network around myofibrils that stores and releases calcium ions.'),
      q('Sarcolemma', [560, 112, 659, 49], 'Membranes and calcium', ['cell membrane', 'plasma membrane', 'muscle cell membrane', 'muscle fiber membrane'], 'The muscle cell membrane; its inward extensions form transverse tubules.'),
      q('Myofibril', [588, 187, 762, 130], 'Contractile structures', ['myofibrils'], 'A contractile structure inside the muscle cell, surrounded by sarcoplasmic reticulum.'),
      q('Sarcoplasm', [648, 205, 797, 225], 'Cell structures', ['cytoplasm', 'muscle cytoplasm'], 'The cytoplasm surrounding the myofibrils and organelles.'),
      q('Nucleus', [700, 301, 828, 315], 'Cell structures', ['nuclei', 'myonucleus'], 'One of the many nuclei positioned just beneath the sarcolemma.'),
      q('Transverse tubule', [433, 279, 375, 248], 'Membranes and calcium', ['t tubule', 't tubules', 'transverse tubules', 'transverse t tubule'], 'An inward extension of the sarcolemma that conducts electrical signals deep into the fiber.'),
      q('Terminal cisterns', [447, 287, 490, 226], 'Membranes and calcium', ['terminal cistern', 'terminal cisterna', 'terminal cisternae', 'cisternae', 'cisterns', 'terminal cisterns of sarcoplasmic reticulum'], 'Enlarged calcium-storing sacs of the sarcoplasmic reticulum on each side of a transverse tubule.'),
      q('Triad', [447, 287], 'Membranes and calcium', ['muscle triad'], 'One transverse tubule flanked by two terminal cisterns; it links excitation to calcium release.', 'M 425 275 L 468 300 M 421 281 L 429 269 M 464 306 L 472 294'),
      q('Mitochondrion', [459, 493, 353, 558], 'Cell structures', ['mitochondria'], 'Produces ATP to support muscle contraction and other cellular processes.'),
      q('Thick filament', [799, 417, 810, 345], 'Contractile structures', ['thick filaments', 'myosin', 'myosin filament', 'myosin filaments'], 'A myosin-containing filament whose heads interact with thin filaments during contraction.'),
      q('Thin filament', [831, 450, 762, 487], 'Contractile structures', ['thin filaments', 'actin', 'actin filament', 'actin filaments'], 'An actin-containing filament anchored to a Z disc.'),
      q('Sarcomere', [809, 537], 'Contractile structures', ['sarcomeres'], 'The repeating contractile unit from one Z disc to the next.', 'M 749 508 L 857 549 M 753 499 L 745 517 M 861 540 L 853 558'),
      q('Z disc', [879, 453, 952, 370], 'Contractile structures', ['z disk', 'z line', 'z discs', 'z disks', 'z lines'], 'The boundary of a sarcomere, where thin filaments are anchored.')
    ]
  },
  'sarcomere': {
    title: 'Sarcomere and Filaments', number: 5, width: 1000, height: 651,
    description: 'Learn sarcomere boundaries, bands, zones, and filament organization.',
    alt: 'Myofibril above a molecular sarcomere with two Z discs, a central M line, thick and thin filaments, and springlike titin.',
    questions: [
      q('I band', [221, 336], 'Bands and zones', ['i bands'], 'The region containing thin filaments and no thick filaments; a Z disc runs through its center.', 'M 171 322 V 336 H 271 V 322'),
      q('Z disc', [125, 422, 50, 354], 'Boundaries', ['z disk', 'z line', 'z discs', 'z disks', 'z lines'], 'Anchors thin filaments and marks the boundary between adjacent sarcomeres.'),
      q('H zone', [500, 568], 'Bands and zones', ['h band', 'h zones'], 'The central region of the A band containing thick filaments without thin filament overlap.', 'M 390 553 V 568 H 609 V 553'),
      q('M line', [499, 470, 548, 575], 'Boundaries', ['m band', 'm lines'], 'The midline of a sarcomere, where proteins help hold thick filaments in alignment.'),
      q('A band', [500, 593], 'Bands and zones', ['a bands'], 'Spans the full length of the thick filaments, including regions where thin filaments overlap them.', 'M 255 580 V 595 H 750 V 580'),
      q('Thick filament', [466, 442, 450, 350], 'Filaments', ['thick filaments', 'myosin', 'myosin filament', 'myosin filaments'], 'A filament composed mainly of myosin; its heads form cross-bridges with actin.'),
      q('Thin filament', [301, 411, 325, 349], 'Filaments', ['thin filaments', 'actin', 'actin filament', 'actin filaments'], 'An actin-containing filament extending inward from a Z disc.'),
      q('Titin filament', [807, 435, 805, 352], 'Filaments', ['titin', 'titin filaments', 'elastic filament', 'elastic filaments', 'connectin'], 'A springlike protein that connects thick filaments to Z discs and helps restore resting length.'),
      q('Sarcomere', [500, 368], 'Boundaries', ['sarcomeres'], 'One complete contractile unit between successive Z discs.', 'M 111 382 V 367 H 887 V 382'),
      q('Zone of overlap', [316, 534], 'Bands and zones', ['overlap', 'overlap zone', 'zone of filament overlap', 'zones of overlap'], 'The part of the A band where thick and thin filaments lie alongside one another.', 'M 255 520 V 537 H 390 V 520')
    ]
  }
};
