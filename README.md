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

This history uses the repository's GitHub commits, merged pull requests, and [homepage patch notes](index.html#patch-notes). The repository has no formal GitHub Releases or version tags. Dates below identify when the corresponding changes first reached `main`, using **America/Denver** time; they are not independently verified deployment or chat dates. Follow-up work kept under an existing version is described within that version. Each entry links to its supporting GitHub record.

GitHub history supplies the three previously missing dates and corrects five dates from the older homepage notes: 1.2.1 to September 21, 1.3.0 to October 1, 1.3.3 to October 2, and 1.3.4–1.3.5 to October 3, 2026. Early versions originally appeared as 1.0, 1.1, 2.0, 2.1, 2.2, and 3.0; the [October 1 numbering change](https://github.com/notalex47/rvhsa-p/commit/30d9a52809ad65c5be156b956cbfa465f0eacb32) renamed those same releases to 1.1.0, 1.1.1, 1.2.0, 1.2.1, 1.2.2, and 1.3.0. The dates follow the original changes, rather than the later renaming.

### 1.4.1 · November 4, 2026 · Muscular System 3D Quiz

**Context:** Extend Unit 4 from microscopic muscle organization to the location and function of whole muscles, using the interaction pattern of the skeletal 3D quiz. Give the repository one place to explain the site's purpose, operation, and release history as the study library grows.

- Add a sixth Unit 4 quiz with 25 muscle targets, bringing the library to 12 quizzes across four units.
- Highlight complete bilateral targets, including all modeled heads and portions, rather than presenting individual components as separate questions.
- Add a study selector, front/back/left/right views, automatic target focus, whole-body views, rotation, zoom, and see-through context for deep or overlapping structures.
- Support multiple choice, free response, regional practice, optional saved-session resume, answer explanations, scores, and missed-structure review.
- Accept common anatomical aliases, including “Surtorius” for Sartorius, while requiring the specific pars peripheralis name for that portion of orbicularis oris.
- Bundle muscle geometry and rendering assets locally, reuse the skeletal model for bone context, and identify the six targets represented by teaching approximations in the model documentation.
- Correct the pars peripheralis highlight after the initial quiz addition: lower the entire band by 22 mm from the base of the nose to the teeth. Update both procedural geometry and bundled data, and use asset cache version `1.0.1` to load the correction. That asset version is separate from the site's `1.4.1` release number.
- Consolidate the three quiz-specific READMEs into this root README, retaining setup instructions, diagram and answer-matching notes, model limitations, attribution links, and test commands.
- Document all 15 numbered releases, including the retired neurotransmitter quiz, with context for the progression from foundational diagrams to 3D skeletal and muscular practice.

**GitHub record:** [PR #17 — 25-target 3D quiz](https://github.com/notalex47/rvhsa-p/pull/17), [PR #18 — pars peripheralis alignment](https://github.com/notalex47/rvhsa-p/pull/18), and [PR #19 — README consolidation](https://github.com/notalex47/rvhsa-p/pull/19), all merged November 4. PR #18 documents a regression check for tooth alignment and generated/bundled geometry consistency; only the band vertices' heights changed.

### 1.4.0 · November 4, 2026 · Muscular System Unit

**Context:** Add a structured path through skeletal muscle organization, from the whole muscle and fascicles to fibers, sarcomeres, and filaments.

- Introduce Unit 4 with a pinkish-red homepage accent and five standalone diagram quizzes using the shared blue quiz theme.
- Cover 52 structures across Skeletal Muscle Organization (9), Fascicle Anatomy (9), Muscle Fiber Anatomy (11), Muscle Fiber Details (13), and Sarcomere and Filaments (10).
- Adapt the supplied diagrams into unlabeled WebP images, combine repeated labels within each diagram, and calibrate targets to the committed images. Use brackets for regional or thin targets, including bands and the triad.
- Offer randomized multiple choice and free response, explanations after answers, scoring, replay, and missed-item practice through one shared engine.
- Accept concise names and explicit variants such as perimysium, T tubule, mitochondria, and Z line, while rejecting incomplete fragments that would confuse related structures.
- Keep small targets usable on narrow screens with a horizontally scrollable, focusable diagram panel.
- Follow the initial muscular-unit addition with a theme correction: remove its quiz-specific pink palette and restore shared blue controls, cards, featured content, and patch notes, while retaining Unit 4's pinkish-red section and navigation accents. Load shared styles after the diagram layout rules so the common theme takes precedence.

**GitHub record:** [PR #14 — five diagram quizzes](https://github.com/notalex47/rvhsa-p/pull/14) and [PR #15 — shared blue theme correction](https://github.com/notalex47/rvhsa-p/pull/15), both merged November 4. The initial unit brought the library to 11 quizzes; the 3D quiz in 1.4.1 brought it to 12.

### 1.3.7 · October 30, 2026 · Quiz Library Update

**Context:** Keep the homepage layout, unit descriptions, and quiz counts consistent after removing a quiz from the library. The historical notes do not record the reason for removing the topic.

- Remove the Neurotransmitter Functions Quiz and its homepage card. Its earlier introduction remains recorded under version 1.2.2.
- Arrange Brain Anatomy and Limbic System as two equal-width Unit 2 cards, switching to one column on mobile.
- Update the Unit 2 description and library totals to six quizzes across three units at that release. Later Unit 4 releases expand those totals.

**GitHub record:** [PR #13 — remove neurotransmitter quiz and refit cards](https://github.com/notalex47/rvhsa-p/pull/13), merged October 30. Its description confirms the layout and count changes but gives no reason for retiring the topic.

### 1.3.6 · October 10, 2026 · Long Bone Anatomy & Study Library Refresh

**Context:** Complement whole-skeleton practice with the internal anatomy of a long bone, and make the growing quiz library easier to navigate.

- Add Long Bone Anatomy to Unit 3, covering all 12 unique structures in the supplied reference: articular cartilage, red marrow, epiphyseal line, marrow cavity, yellow marrow, periosteum, nutrient foramen, endosteum, compact bone, spongy bone, epiphysis, and diaphysis.
- Use an unlabeled adapted diagram with red target dots and regional brackets. Combine repeated reference labels into one question per structure.
- Add randomized multiple choice and free response, anatomical aliases, scoring, explanations after every answer, and missed-item practice.
- Refresh the homepage with a featured quiz, quick unit navigation, clearer cards, and teal, indigo, and amber unit accents within the existing blue palette.
- List both skeletal quizzes under Unit 3, keep the latest patch visible, and collapse older patch notes so the library stays easy to scan.
- Clarify the epiphyseal-line target and preserve the diagram view when the free-response input receives focus, avoiding a disrupted target view while typing.
- Keep the later homepage refresh within 1.3.6 and scope its styles separately from shared quiz styles. Preserve keyboard navigation, a skip link, and access to the collapsed release history.

**GitHub record:** [PR #11 — long-bone quiz](https://github.com/notalex47/rvhsa-p/pull/11), its [target/input-focus refinement](https://github.com/notalex47/rvhsa-p/commit/d16650b78134ec5163d45296796dddfaac280f1c), and [PR #12 — homepage refresh](https://github.com/notalex47/rvhsa-p/pull/12). Both PRs merged October 10; PR #12 explicitly keeps the refresh in the existing 1.3.6 release.

### 1.3.5 · October 3, 2026 · Skeletal System: Bundled False Rib Repair

**Context:** Make the false-rib correction part of the delivered model data so the connections are present in the asset itself as well as in quiz highlights.

- Bundle six lower costal-cartilage sections into `skeleton.json` and `skeleton.bin`, connecting rib pairs 8–10 on both sides. Retain the 244 original BodyParts3D components, for 250 bundled components including the supplements.
- Keep the attachments visible during exploration and false-rib questions. Floating rib pairs 11–12 retain their free anterior ends.
- Update model-data URLs and quiz modules together so the repaired assets load as one version.
- Add regression checks for bundled geometry, physical attachment overlap, and visibility through highlight changes.
- Preserve the existing tailbone repair, answer aliases, saved progress, multiple-choice randomization, and refreshed site design.
- Retain a generated-cartilage fallback for older model data, but skip generating duplicate supplements when all six connections are already bundled. Test actual endpoint overlap and repeated highlight changes as well as the presence of geometry.

**GitHub record:** The [1.3.5 homepage entry](https://github.com/notalex47/rvhsa-p/commit/12c8072bece3277b0b964788e6c1146c207ff004) and [bundled geometry, fallback, and test changes](https://github.com/notalex47/rvhsa-p/commit/068569c6024fa2ce45d87af7d2056fd3b29fc763) reached `main` October 3. The older homepage date was October 4.

### 1.3.4 · October 3, 2026 · Accessible Quiz Interaction & Results

**Context:** Make quiz controls, feedback, progress, and results easier to interpret across input methods and accessibility preferences.

- Standardize default, hover, pressed, selected, correct, incorrect, disabled, and keyboard-focus states across the quizzes.
- Pair answer feedback with icons and text, unify progress displays for question count, total, and mode, and make success animation respect reduced-motion preferences.
- Add compact score rings, score-based encouragement, and prominent actions to practice missed items, retry, or return to the library.
- Standardize quiz headers with a clickable RVHS brand, unit/subject breadcrumb, one “All quizzes” link, predictable score placement, visible keyboard focus, and at least 44 × 44 CSS pixel interactive targets.
- Restore the skeletal model's cartilage attachments for false ribs 8–10 while leaving floating ribs 11–12 unattached. Version 1.3.5 subsequently bundles the repair into the model data itself.
- Repair the rib display in stages: include generated cartilage in the false-rib target, move roots inside the rib surfaces to remove seams, give cartilage its own material, and restore each mesh's base material when highlights change. Add tests for physical overlap, attachment counts, material assignment, and correctly unattached floating ribs.

**GitHub record:** [PR #6 — shared headers](https://github.com/notalex47/rvhsa-p/pull/6), [PR #7 — interaction/results accessibility](https://github.com/notalex47/rvhsa-p/pull/7), [PR #8 — highlight target membership](https://github.com/notalex47/rvhsa-p/pull/8), [PR #9 — attachment overlap](https://github.com/notalex47/rvhsa-p/pull/9), and [PR #10 — cartilage material and visibility](https://github.com/notalex47/rvhsa-p/pull/10) all merged October 3. These were successive corrections under 1.3.4, explaining why the same anatomical problem appears across multiple PRs and later releases.

### 1.3.3 · October 2, 2026 · Site-wide Visual Refresh

**Context:** Give independently developed quiz pages a consistent appearance and navigation language while retaining their specialized diagrams and 3D layouts.

- Add shared design rules for the brand palette, typography, spacing, corners, shadows, and motion.
- Standardize headers, cards, score displays, progress indicators, answer feedback, and multiple-choice/free-response selectors around one blue color scheme.
- Preserve quiz behavior, calibrated diagram positioning, and the skeletal viewer's specialized layout.
- Improve responsive layouts and reduced-motion behavior across screen sizes and accessibility preferences.
- Complete the rollout with consistent blue quiz buttons, `MCQ`/`FRQ` badges in place of page-specific labels such as `1–4`, `TYPE`, and `Aa`, and refreshed stylesheet cache URLs.

**GitHub record:** [PR #2 — initial shared stylesheet and 1.3.3 patch note](https://github.com/notalex47/rvhsa-p/pull/2) merged October 2. Follow-ups [#3 — blue button colors](https://github.com/notalex47/rvhsa-p/pull/3), [#4 — mode/answer labels](https://github.com/notalex47/rvhsa-p/pull/4), and [#5 — stylesheet cache refresh](https://github.com/notalex47/rvhsa-p/pull/5) merged October 3 without a new release number. The heading uses the first merge date.

### 1.3.2 · October 2, 2026 · Skeletal System: False Rib Connections

**Context:** Correct the disconnected anterior ends of ribs 8–10 so the model shows their indirect attachment to the sternum and distinguishes them from floating ribs.

- Add missing costal-cartilage connections on both sides. Each lower section joins the cartilage above it.
- Include the new sections in the costal-cartilage highlight; leave ribs 11–12 with free anterior ends.
- Use simplified teaching supplements with anchors derived from the rib tips and seventh costal cartilages, documented under the model's existing attribution and license.
- Preserve the tailbone repair, free-response aliases, saved progress, and randomized multiple-choice answers. Versions 1.3.4 and 1.3.5 record later restoration and bundling of these connections.

**GitHub record:** [Initial six-cartilage implementation](https://github.com/notalex47/rvhsa-p/commit/c2d18130be6a1553b9d832512f2ad6b4abc12c03) and [1.3.2 homepage entry](https://github.com/notalex47/rvhsa-p/commit/ae546ae0a7c319feb2ca1a97fb915619ed5a282b), both October 2. The source model supplied cartilages 1–7; this change generated the missing 8–10 chain from model-derived anchors.

### 1.3.1 · October 1, 2026 · Skeletal System: Tailbone Fix & Usability

**Context:** Correct the coccyx's position and make longer 3D practice sessions easier to resume, navigate, and review.

- Anchor the coccyx to the actual inferior tip of the sacrum instead of leaving it floating. Reshape the supplement with closed ends and a small root overlap.
- Verify case-insensitive free response and expand accepted common anatomical names.
- Add optional saved-session resume that preserves the current question and existing multiple-choice order.
- Add reset view, remembered viewing preferences, and mobile shortcuts between the model and question.
- Show the submitted answer in incorrect-answer feedback and missed-structure review, while preserving distractor selection and answer-position randomization.
- Standardize release numbering to the `1.x.x` format, starting with version 1.1.0.
- Add the homepage's bug-and-suggestion contact banner later the same day.

**GitHub record:** [Tailbone, session, and viewer changes](https://github.com/notalex47/rvhsa-p/commit/bb7aa90069440aec8d71c09718a23432d6002051), [release-number migration](https://github.com/notalex47/rvhsa-p/commit/30d9a52809ad65c5be156b956cbfa465f0eacb32), and [contact banner](https://github.com/notalex47/rvhsa-p/commit/508278242800aa53d49b804ffbb4949f1a30f28f), all October 1.

### 1.3.0 · October 1, 2026 · Unit 3: Interactive 3D Skeletal System

**Context:** Add spatial anatomy practice beyond flat diagrams, allowing students to inspect structures from different angles and connect identification with location and function.

- Introduce Unit 3 with a rotatable anatomical skeleton and 42 unique targets. Standardize spellings and remove duplicate anterior/posterior list entries.
- Add orange highlights for bones, bone groups, openings, cartilage, and landmarks. Teach false ribs as pairs 8–12, with floating ribs 11–12 as a subset.
- Offer randomized questions in multiple-choice and free-response modes, with four freshly shuffled choices for each multiple-choice question.
- Add target close-ups, front/back/side views, zoom controls, and an optional X-ray view.
- Provide location and function explanations after each answer and missed-structure practice.
- Bundle the model and rendering files locally so the quiz requires no external model download.

**GitHub record:** [Initial skeletal quiz and model upload](https://github.com/notalex47/rvhsa-p/commit/a944418abc547e03728e970888f84b8b33a890c5) and [local Three.js/OrbitControls upload](https://github.com/notalex47/rvhsa-p/commit/89f055e2a76bcc9da0ad42882095700872a0f7f6), October 1. The homepage had labeled this release September 30, but the corresponding files first appear in GitHub on October 1. It was originally called version 3.0.

### 1.2.2 · September 25, 2026 · Unit 2: Neurotransmitter Functions

**Context:** Extend nervous-system review from identifying structures to matching neurotransmitters with their functions. This quiz is historical and was removed in version 1.3.7.

- Add Neurotransmitter Functions as Unit 2 Quiz 3 with 14 randomized definition-matching questions in four-choice and free-response modes.
- Cover glutamate, dopamine, endorphins, epinephrine, GABA, serotonin, histamine, norepinephrine, oxytocin, adenosine, endocannabinoids, Substance P, nitric oxide, and acetylcholine.
- Select fresh distractors from the complete term list and reshuffle all four answer positions for every question.
- Include scoring, progress tracking, keyboard controls, a responsive mobile layout, and an extra review fact after each answer.
- Update Unit 2's homepage count and navigation to include the quiz at that time.

**GitHub record:** [Neurotransmitter quiz creation](https://github.com/notalex47/rvhsa-p/commit/a299a65f52a62cf89d398dc6ddf7cec01ccaed63) and [homepage/version 2.2 entry](https://github.com/notalex47/rvhsa-p/commit/b624e171332bf5991e1d73d2af14d11422c164a9), both September 25. The October 1 numbering migration renamed 2.2 to 1.2.2.

### 1.2.1 · September 21, 2026 · Unit 2: Limbic System & Structure Functions

**Context:** Add limbic-system identification and connect nervous-system structures to their functions, so review continues after an answer is marked correct or incorrect.

- Add a six-question Limbic System Quiz with red-dot prompts and hidden diagram labels.
- Support randomized multiple choice and free response, scoring, and keyboard controls.
- Add short function explanations for all six limbic structures and all 13 Brain Anatomy structures.
- Show explanations after both correct and incorrect answers in either mode, then clear them for the next question.
- Group both nervous-system quizzes together on the Unit 2 homepage section.

**GitHub record:** [Limbic quiz creation](https://github.com/notalex47/rvhsa-p/commit/38cb0a6955401d9043bdf621d13cd310242bb6cb), [brain function feedback](https://github.com/notalex47/rvhsa-p/commit/5c6f20b4edd1dc7a1cda5c469a7b40b3f8439c75), [limbic function feedback](https://github.com/notalex47/rvhsa-p/commit/4fc06dafc030d86e5a475a3a34808d916a0c3e4a), and [homepage/version 2.1 entry](https://github.com/notalex47/rvhsa-p/commit/0b67426ffd5bc21081602799b20045936f010a04). All reached `main` September 21 in America/Denver, although GitHub's UTC timestamps and the older homepage notes show September 22.

### 1.2.0 · September 14, 2026 · Unit 2: Brain Anatomy

**Context:** Expand the library into nervous-system anatomy with a lateral brain diagram, calibrated prompts, and related-category answer choices.

- Introduce Unit 2 and a 13-question Brain Anatomy Quiz.
- Cover frontal, parietal, temporal, and occipital lobes; precentral gyrus, precentral sulcus, central sulcus, postcentral gyrus, and lateral sulcus; plus pons, medulla, cerebellum, and spinal cord.
- Correct the precentral-gyrus target to the pink band and place the precentral-sulcus target at the blue–pink boundary.
- Keep four multiple-choice answers per question, drawing distractors from related anatomical categories.
- Add free-response aliases for common alternative names and spelling formats.

**GitHub record:** [Initial brain quiz](https://github.com/notalex47/rvhsa-p/commit/f54cddfd68b90ca360228c7c7c898b02ce921a86), [diagram-based rewrite and target corrections](https://github.com/notalex47/rvhsa-p/commit/ab296a558ffd1e2e18e63f45ab3a9ec1b9bf06c8), and [updated version 2.0 patch notes](https://github.com/notalex47/rvhsa-p/commit/334ed8e8689d15f8d81e3fd8188f9c43b6de5add), all September 14. The same-day rewrite replaces the initial embedded drawing with the committed brain image and recalibrated targets.

### 1.1.1 · August 28, 2026 · Unit 1 Expansion

**Context:** Broaden foundational anatomy review from external body regions to internal cavities and fill two gaps in the regional question set.

- Add Body Cavities with 12 visual-identification questions.
- Add Frontal and Antebrachial to Anatomical Regions, increasing its question count from 35 to 37.
- Accept free-response aliases for common spelling variations.
- Organize both quizzes under Unit 1 on the homepage.
- Move Body Cavities out of the Anatomical Regions subfolder to its own top-level quiz folder, matching the library's separate quiz routes.

**GitHub record:** [Body Cavities creation](https://github.com/notalex47/rvhsa-p/commit/2f2478659097239dc2e38f286305ef212c34ae2d), [route correction](https://github.com/notalex47/rvhsa-p/commit/856f2866f540a0180d87f0a09b93698f64791212), [37-question expansion and aliases](https://github.com/notalex47/rvhsa-p/commit/b5492dd4b8c1e5ed94be38c63c7ac0f99c5c66ef), and [version 1.1 patch notes](https://github.com/notalex47/rvhsa-p/commit/5870c192bea13f1ea31267b30fd575340adf7545), all August 28. Version 1.1 was later renamed 1.1.1.

### 1.1.0 · August 24, 2026 · Initial Anatomical Regions Release

**Context:** Establish the site's visual-recall format with anterior and posterior regional anatomy practice.

- Launch Anatomical Regions with the initial 35-question set, before the expansion in version 1.1.1.
- Offer randomized multiple choice and free response, scoring, reshuffling, and keyboard controls.
- Provide a responsive layout for practice across screen sizes.
- Move the quiz and diagram into `anatomy-regions-quiz/` and add a separate root homepage, establishing the folder structure used to grow the study library.

**GitHub record:** [First quiz and diagram upload](https://github.com/notalex47/rvhsa-p/commit/cb392f1f8f4ddbd9697ca3a9ae51e658ff283428), [quiz-folder move](https://github.com/notalex47/rvhsa-p/commit/2a02023bfda37fd4223943400529778c09c881ed), and [root homepage](https://github.com/notalex47/rvhsa-p/commit/ccd8abb7792973a39de392397dffaa1e94434891), all August 24. This original release was later recorded as 1.0, then renamed 1.1.0.

## Licensing and model attribution

The site's software is covered by the root [MIT license](LICENSE.txt). Bundled anatomical model geometry and adaptations carry their own **CC BY-SA 2.1 Japan** attribution and terms; the software license does not replace them. Three.js and OrbitControls are distributed under MIT.

- [Skeletal model sources, modifications, and teaching supplements](skeletal-system-quiz/LICENSE-model.txt)
- [Muscular model sources, modifications, and teaching supplements](muscular-system-3d-quiz/LICENSE-model.txt)
- [Skeletal viewer's Three.js license](skeletal-system-quiz/vendor/LICENSE-three.txt)
- [Muscular viewer's Three.js license](muscular-system-3d-quiz/vendor/LICENSE-three.txt)
