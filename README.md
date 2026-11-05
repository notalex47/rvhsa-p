# RVHS Anatomy & Physiology Study Tools

A browser-based study library for RVHS Anatomy & Physiology students. Practice identifying structures on unlabeled diagrams and interactive 3D models, check answers, and revisit topics that need more work. The site emphasizes active recall: multiple choice helps with recognition, while free response asks students to name a structure without answer choices.

The current library is **version 1.4.1**, with **12 quizzes across four units**. Start at [the quiz library](index.html); its [Patch Notes](index.html#patch-notes) give a shorter release overview.

## Quiz library

| Unit | Quiz | Questions / targets | What it covers |
| --- | --- | --- | --- |
| 1 · Foundations | [Anatomical Regions](anatomy-regions-quiz/) | 37 | Anterior and posterior body regions |
| 1 · Foundations | [Body Cavities](body-cavities-quiz/) | 12 | Major cavities and related structures in lateral and anterior views |
| 2 · Nervous system | [Brain Anatomy](brain-lateral-quiz/) | 13 | Cerebral lobes, cortical landmarks, brainstem, cerebellum, and spinal cord |
| 2 · Nervous system | [Limbic System](limbic-system-quiz/) | 6 | Structures involved in memory, emotion, and body regulation |
| 3 · Skeletal system | [Skeletal System 3D](skeletal-system-quiz/) | 42 | Bones, groups, cartilage, openings, and landmarks on a rotatable skeleton |
| 3 · Skeletal system | [Long Bone Anatomy](long-bone-quiz/) | 12 | Bone regions, coverings, tissue, marrow, and blood supply |
| 4 · Muscular system | [Skeletal Muscle Organization](muscular-system-quiz/muscle-organization/) | 9 | Whole muscle, attachments, and organization down to a myofibril |
| 4 · Muscular system | [Fascicle Anatomy](muscular-system-quiz/fascicle-anatomy/) | 9 | Fascicle coverings and muscle-cell structures |
| 4 · Muscular system | [Muscle Fiber Anatomy](muscular-system-quiz/muscle-fiber/) | 11 | Muscle fiber, nerve and blood supply, and internal structures |
| 4 · Muscular system | [Muscle Fiber Details](muscular-system-quiz/fiber-details/) | 13 | Membranes, triad, organelles, and contractile structures |
| 4 · Muscular system | [Sarcomere and Filaments](muscular-system-quiz/sarcomere/) | 10 | Sarcomere boundaries, bands, zones, and filaments |
| 4 · Muscular system | [Muscular System 3D](muscular-system-3d-quiz/) | 25 | Whole-muscle targets with bilateral highlighting and anatomical context |

Every quiz supports randomized multiple choice and free response, answer feedback, scoring, and keyboard controls. The brain, limbic, skeletal, long-bone, and muscular quizzes also explain structures after answers. The skeletal, long-bone, and muscular quizzes offer missed-structure practice. Both 3D viewers support exploration, targeted views, and optional saved sessions.

## Run locally

Serve the repository root with a static HTTP server, for example:

```sh
python3 -m http.server 8080
```

Open <http://localhost:8080/>. Use HTTP instead of opening HTML files directly: the 3D quizzes load ES modules, JSON manifests, and binary geometry. A modern browser with WebGL is needed for the 3D viewers.

There is no build step, package installation, account requirement, or backend API. Models, diagrams, Three.js, and OrbitControls are bundled locally; the quizzes have no runtime CDN dependencies. Optional 3D progress and preferences are stored in the browser.

Keep the quiz folders and `assets/` in their existing relative positions. The muscular 3D viewer also loads bone data from `skeletal-system-quiz/`, so copying its folder alone is insufficient.

## Implementation and content notes

- `index.html` contains the library and public patch notes. `assets/styles/` holds the shared site, homepage, and quiz-interaction styles.
- The foundational and nervous-system quizzes keep their logic in their own HTML pages. The long-bone, skeletal, and muscular quizzes separate application logic from question data and answer checking in `.mjs` files.
- The long-bone diagram is an AI-assisted unlabeled adaptation of the supplied reference. Targets use a 1256 × 1792 reference grid. Repeated epiphysis, epiphyseal-line, and articular-cartilage labels become one question per structure. The nutrient-foramen dot marks the vessel's entry into the shaft; epiphysis and diaphysis use region brackets.
- The five muscular diagram quizzes share one engine in `muscular-system-quiz/`. Their 52 questions are spread across five AI-assisted unlabeled adaptations of the supplied diagrams. Targets in `data.mjs` use each committed image's dimensions, at 1000 pixels wide. Brackets mark regions and thin structures; the triad, transverse tubule, and terminal cisterns are separate questions.
- Muscular diagram answer checking normalizes capitalization, punctuation, hyphens, spacing, and the article “the.” Explicit aliases accept names such as “perimysium,” “T tubule,” “mitochondria,” “Z line,” “actin,” and “myosin.” Matching requires a complete accepted name: fragments such as “mysium,” “band,” or “filament” do not pass for more specific structures.
- The muscular 3D quiz treats all modeled heads and portions on both sides as one target. “Surtorius” is accepted as an alias for Sartorius. Pars peripheralis refers specifically to the peripheral portion of orbicularis oris; the whole-muscle name alone is not accepted. Six targets use documented teaching approximations rather than scanned anatomy: temporalis, orbicularis oculi, pars peripheralis, occipitofrontalis, rectus abdominis, and latissimus dorsi. See the quiz's About section and its [model attribution](muscular-system-3d-quiz/LICENSE-model.txt).

## Checks

Run the existing diagram and skeletal-model checks from the repository root with Node.js:

```sh
node --test long-bone-quiz/core.test.mjs muscular-system-quiz/core.test.mjs skeletal-system-quiz/model.test.mjs
```

Run the muscular 3D model, answer, scoring, and session checks separately:

```sh
node muscular-system-3d-quiz/quiz.test.mjs
```

These checks cover question sets, diagram targets, answer aliases, randomized choices, model attachments and highlights, and muscular 3D session handling.

## Changelog

This history expands the existing [homepage patch notes](index.html#patch-notes) and repository documentation. Context below describes the study or usability problem addressed by the documented changes; it does not attribute unverified requests to past conversations. Codex chat history and message timestamps were unavailable for verification, so published dates are preserved. Versions 1.1.0, 1.1.1, and 1.2.0 have no recorded release date in the patch notes and remain undated.

### 1.4.1 · November 4, 2026 · Muscular System 3D Quiz

**Context:** Extend Unit 4 from microscopic muscle organization to the location and function of whole muscles, using the interaction pattern of the skeletal 3D quiz. Give the repository one place to explain the site's purpose, operation, and release history as the study library grows.


- Add a sixth Unit 4 quiz with 25 muscle targets, bringing the library to 12 quizzes across four units.
- Highlight complete bilateral targets, including all modeled heads and portions, rather than presenting individual components as separate questions.
- Add a study selector, front/back/left/right views, automatic target focus, whole-body views, rotation, zoom, and see-through context for deep or overlapping structures.
- Support multiple choice, free response, regional practice, optional saved-session resume, answer explanations, scores, and missed-structure review.
- Accept common anatomical aliases, including “Surtorius” for Sartorius, while requiring the specific pars peripheralis name for that portion of orbicularis oris.
- Bundle muscle geometry and rendering assets locally, reuse the skeletal model for bone context, and identify the six targets represented by teaching approximations in the model documentation.
- Consolidate the three quiz-specific READMEs into this root README, retaining setup instructions, diagram and answer-matching notes, model limitations, attribution links, and test commands.
- Document all 15 numbered releases, including the retired neurotransmitter quiz, with context for the progression from foundational diagrams to 3D skeletal and muscular practice.

### 1.4.0 · November 4, 2026 · Muscular System Unit

**Context:** Add a structured path through skeletal muscle organization, from the whole muscle and fascicles to fibers, sarcomeres, and filaments.

- Introduce Unit 4 with a pinkish-red homepage accent and five standalone diagram quizzes using the shared blue quiz theme.
- Cover 52 structures across Skeletal Muscle Organization (9), Fascicle Anatomy (9), Muscle Fiber Anatomy (11), Muscle Fiber Details (13), and Sarcomere and Filaments (10).
- Adapt the supplied diagrams into unlabeled WebP images, combine repeated labels within each diagram, and calibrate targets to the committed images. Use brackets for regional or thin targets, including bands and the triad.
- Offer randomized multiple choice and free response, explanations after answers, scoring, replay, and missed-item practice through one shared engine.
- Accept concise names and explicit variants such as perimysium, T tubule, mitochondria, and Z line, while rejecting incomplete fragments that would confuse related structures.
- Keep small targets usable on narrow screens with a horizontally scrollable, focusable diagram panel.

### 1.3.7 · October 30, 2026 · Quiz Library Update

**Context:** Keep the homepage layout, unit descriptions, and quiz counts consistent after removing a quiz from the library. The historical notes do not record the reason for removing the topic.

- Remove the Neurotransmitter Functions Quiz and its homepage card. Its earlier introduction remains recorded under version 1.2.2.
- Arrange Brain Anatomy and Limbic System as two equal-width Unit 2 cards, switching to one column on mobile.
- Update the Unit 2 description and library totals to six quizzes across three units at that release. Later Unit 4 releases expand those totals.

### 1.3.6 · October 10, 2026 · Long Bone Anatomy & Study Library Refresh

**Context:** Complement whole-skeleton practice with the internal anatomy of a long bone, and make the growing quiz library easier to navigate.

- Add Long Bone Anatomy to Unit 3, covering all 12 unique structures in the supplied reference: articular cartilage, red marrow, epiphyseal line, marrow cavity, yellow marrow, periosteum, nutrient foramen, endosteum, compact bone, spongy bone, epiphysis, and diaphysis.
- Use an unlabeled adapted diagram with red target dots and regional brackets. Combine repeated reference labels into one question per structure.
- Add randomized multiple choice and free response, anatomical aliases, scoring, explanations after every answer, and missed-item practice.
- Refresh the homepage with a featured quiz, quick unit navigation, clearer cards, and teal, indigo, and amber unit accents within the existing blue palette.
- List both skeletal quizzes under Unit 3, keep the latest patch visible, and collapse older patch notes so the library stays easy to scan.

### 1.3.5 · October 4, 2026 · Skeletal System: Bundled False Rib Repair

**Context:** Make the false-rib correction part of the delivered model data so the connections are present in the asset itself as well as in quiz highlights.

- Bundle six lower costal-cartilage sections into `skeleton.json` and `skeleton.bin`, connecting rib pairs 8–10 on both sides. Retain the 244 original BodyParts3D components, for 250 bundled components including the supplements.
- Keep the attachments visible during exploration and false-rib questions. Floating rib pairs 11–12 retain their free anterior ends.
- Update model-data URLs and quiz modules together so the repaired assets load as one version.
- Add regression checks for bundled geometry, physical attachment overlap, and visibility through highlight changes.
- Preserve the existing tailbone repair, answer aliases, saved progress, multiple-choice randomization, and refreshed site design.

### 1.3.4 · October 4, 2026 · Accessible Quiz Interaction & Results

**Context:** Make quiz controls, feedback, progress, and results easier to interpret across input methods and accessibility preferences.

- Standardize default, hover, pressed, selected, correct, incorrect, disabled, and keyboard-focus states across the quizzes.
- Pair answer feedback with icons and text, unify progress displays for question count, total, and mode, and make success animation respect reduced-motion preferences.
- Add compact score rings, score-based encouragement, and prominent actions to practice missed items, retry, or return to the library.
- Restore the skeletal model's cartilage attachments for false ribs 8–10 while leaving floating ribs 11–12 unattached. Version 1.3.5 subsequently bundles the repair into the model data itself.

### 1.3.3 · October 3, 2026 · Site-wide Visual Refresh

**Context:** Give independently developed quiz pages a consistent appearance and navigation language while retaining their specialized diagrams and 3D layouts.

- Add shared design rules for the brand palette, typography, spacing, corners, shadows, and motion.
- Standardize headers, cards, score displays, progress indicators, answer feedback, and multiple-choice/free-response selectors around one blue color scheme.
- Preserve quiz behavior, calibrated diagram positioning, and the skeletal viewer's specialized layout.
- Improve responsive layouts and reduced-motion behavior across screen sizes and accessibility preferences.

### 1.3.2 · October 2, 2026 · Skeletal System: False Rib Connections

**Context:** Correct the disconnected anterior ends of ribs 8–10 so the model shows their indirect attachment to the sternum and distinguishes them from floating ribs.

- Add missing costal-cartilage connections on both sides. Each lower section joins the cartilage above it.
- Include the new sections in the costal-cartilage highlight; leave ribs 11–12 with free anterior ends.
- Use simplified teaching supplements with anchors derived from the rib tips and seventh costal cartilages, documented under the model's existing attribution and license.
- Preserve the tailbone repair, free-response aliases, saved progress, and randomized multiple-choice answers. Versions 1.3.4 and 1.3.5 record later restoration and bundling of these connections.

### 1.3.1 · October 1, 2026 · Skeletal System: Tailbone Fix & Usability

**Context:** Correct the coccyx's position and make longer 3D practice sessions easier to resume, navigate, and review.

- Anchor the coccyx to the actual inferior tip of the sacrum instead of leaving it floating. Reshape the supplement with closed ends and a small root overlap.
- Verify case-insensitive free response and expand accepted common anatomical names.
- Add optional saved-session resume that preserves the current question and existing multiple-choice order.
- Add reset view, remembered viewing preferences, and mobile shortcuts between the model and question.
- Show the submitted answer in incorrect-answer feedback and missed-structure review, while preserving distractor selection and answer-position randomization.
- Standardize release numbering to the `1.x.x` format, starting with version 1.1.0.

### 1.3.0 · September 30, 2026 · Unit 3: Interactive 3D Skeletal System

**Context:** Add spatial anatomy practice beyond flat diagrams, allowing students to inspect structures from different angles and connect identification with location and function.

- Introduce Unit 3 with a rotatable anatomical skeleton and 42 unique targets. Standardize spellings and remove duplicate anterior/posterior list entries.
- Add orange highlights for bones, bone groups, openings, cartilage, and landmarks. Teach false ribs as pairs 8–12, with floating ribs 11–12 as a subset.
- Offer randomized questions in multiple-choice and free-response modes, with four freshly shuffled choices for each multiple-choice question.
- Add target close-ups, front/back/side views, zoom controls, and an optional X-ray view.
- Provide location and function explanations after each answer and missed-structure practice.
- Bundle the model and rendering files locally so the quiz requires no external model download.

### 1.2.2 · September 25, 2026 · Unit 2: Neurotransmitter Functions

**Context:** Extend nervous-system review from identifying structures to matching neurotransmitters with their functions. This quiz is historical and was removed in version 1.3.7.

- Add Neurotransmitter Functions as Unit 2 Quiz 3 with 14 randomized definition-matching questions in four-choice and free-response modes.
- Cover glutamate, dopamine, endorphins, epinephrine, GABA, serotonin, histamine, norepinephrine, oxytocin, adenosine, endocannabinoids, Substance P, nitric oxide, and acetylcholine.
- Select fresh distractors from the complete term list and reshuffle all four answer positions for every question.
- Include scoring, progress tracking, keyboard controls, a responsive mobile layout, and an extra review fact after each answer.
- Update Unit 2's homepage count and navigation to include the quiz at that time.

### 1.2.1 · September 22, 2026 · Unit 2: Limbic System & Structure Functions

**Context:** Add limbic-system identification and connect nervous-system structures to their functions, so review continues after an answer is marked correct or incorrect.

- Add a six-question Limbic System Quiz with red-dot prompts and hidden diagram labels.
- Support randomized multiple choice and free response, scoring, and keyboard controls.
- Add short function explanations for all six limbic structures and all 13 Brain Anatomy structures.
- Show explanations after both correct and incorrect answers in either mode, then clear them for the next question.
- Group both nervous-system quizzes together on the Unit 2 homepage section.

### 1.2.0 · Date not recorded · Unit 2: Brain Anatomy

**Context:** Expand the library into nervous-system anatomy with a lateral brain diagram, calibrated prompts, and related-category answer choices.

- Introduce Unit 2 and a 13-question Brain Anatomy Quiz.
- Cover frontal, parietal, temporal, and occipital lobes; precentral gyrus, precentral sulcus, central sulcus, postcentral gyrus, and lateral sulcus; plus pons, medulla, cerebellum, and spinal cord.
- Correct the precentral-gyrus target to the pink band and place the precentral-sulcus target at the blue–pink boundary.
- Keep four multiple-choice answers per question, drawing distractors from related anatomical categories.
- Add free-response aliases for common alternative names and spelling formats.

### 1.1.1 · Date not recorded · Unit 1 Expansion

**Context:** Broaden foundational anatomy review from external body regions to internal cavities and fill two gaps in the regional question set.

- Add Body Cavities with 12 visual-identification questions.
- Add Frontal and Antebrachial to Anatomical Regions, increasing its question count from 35 to 37.
- Accept free-response aliases for common spelling variations.
- Organize both quizzes under Unit 1 on the homepage.

### 1.1.0 · Date not recorded · Initial Anatomical Regions Release

**Context:** Establish the site's visual-recall format with anterior and posterior regional anatomy practice.

- Launch Anatomical Regions with the initial 35-question set, before the expansion in version 1.1.1.
- Offer randomized multiple choice and free response, scoring, reshuffling, and keyboard controls.
- Provide a responsive layout for practice across screen sizes.

## Licensing and model attribution

The site's software is covered by the root [MIT license](LICENSE.txt). Bundled anatomical model geometry and adaptations carry their own **CC BY-SA 2.1 Japan** attribution and terms; the software license does not replace them. Three.js and OrbitControls are distributed under MIT.

- [Skeletal model sources, modifications, and teaching supplements](skeletal-system-quiz/LICENSE-model.txt)
- [Muscular model sources, modifications, and teaching supplements](muscular-system-3d-quiz/LICENSE-model.txt)
- [Skeletal viewer's Three.js license](skeletal-system-quiz/vendor/LICENSE-three.txt)
- [Muscular viewer's Three.js license](muscular-system-3d-quiz/vendor/LICENSE-three.txt)
