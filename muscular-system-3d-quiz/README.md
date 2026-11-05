# Muscular System 3D Quiz

25 requested targets, built to match the RVHS Skeletal System 3D Quiz.

Open `muscular-system-3d-quiz/` through a web server. From the library root, run:

    python3 -m http.server 8080

Then visit http://localhost:8080/muscular-system-3d-quiz/ . Opening the HTML directly
with file:// will not load the ES modules and binary model correctly.

The complete library package includes all required local assets. There are no
runtime CDN dependencies, accounts, or network APIs. Once loaded, quiz progress
and preferences are saved only in the browser when enabled.

## Features

- Study selector for all 25 muscles; front, back, left, and right views.
- Drag, pinch/scroll, keyboard rotation and zoom; auto-focus and whole-body views.
- Complete bilateral highlighting, including all modeled heads and portions.
- See-through context to reveal deep or overlapping portions of the target.
- Multiple choice and free response; regional practice, saved sessions, feedback,
  results, and practice of missed structures.

“Surtorius” is displayed as Sartorius and accepted in typed answers.
“Pars peripheralis” means the peripheral portion of orbicularis oris. The quiz
requires that part's name; the unspecific whole muscle name is not accepted.
Six targets use clearly documented teaching approximations. See About the model
in the quiz and LICENSE-model.txt for anatomical and licensing details.

## Files

Keep `muscular-system-3d-quiz/`, `skeletal-system-quiz/`, and `assets/` in their
existing relative positions. The new viewer reuses the skeletal quiz's bone data
and shared library styles, while preserving the existing skeletal quiz.

Run model, answer, scoring, and session checks from the library root:

    node muscular-system-3d-quiz/quiz.test.mjs
