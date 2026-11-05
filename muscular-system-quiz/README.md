# Unit 4: Muscular System — v1.4.0

Five standalone visual quizzes share one dependency-free engine and pinkish-red stylesheet. Start from Unit 4 on the homepage. Each quiz offers randomized multiple choice and free response, explanations after answers, scoring, replay, and missed-item practice.

| Route | Diagram | Structures |
| --- | --- | --- |
| `muscle-organization/` | Whole muscle, attachments, and nested organization | 9 |
| `fascicle-anatomy/` | Fascicle cross section and muscle cells | 9 |
| `muscle-fiber/` | Pulled-out fiber, nerve, capillary, and internal structures | 11 |
| `fiber-details/` | Reticulum, triad, organelles, and contractile structures | 13 |
| `sarcomere/` | Bands, zones, filaments, and Z discs | 10 |

The five WebP images are AI-assisted unlabeled adaptations of the five diagrams supplied for this change. Repeated labels within a reference are combined. Targets in `data.mjs` are calibrated to the committed 1000px-wide images, with each image's own height. Regional targets use brackets rather than tissue dots. The triad includes its transverse tubule and terminal cisterns as separate questions.

Answer matching ignores capitalization, punctuation, hyphens, spacing, and the article “the.” Explicit aliases accept concise names and common anatomical variants (for example, `perimysium`, `perimysium around fascicle`, `T tubule`, `mitochondria`, `Z line`, `actin`, and `myosin`). Matching uses complete names rather than substrings so `mysium`, `filament`, and `band` do not pass as more specific structures.

Serve the repository with a static HTTP server. No build step or external runtime requests are needed. On narrow screens, the diagram remains large enough for small targets and scrolls horizontally within its focusable panel.

Run checks from the repository root:

```sh
node --test muscular-system-quiz/core.test.mjs long-bone-quiz/core.test.mjs skeletal-system-quiz/model.test.mjs
```
