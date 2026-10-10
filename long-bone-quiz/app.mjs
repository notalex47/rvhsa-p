import { IMAGE_WIDTH, IMAGE_HEIGHT, QUESTIONS, shuffle, choicesFor, acceptsAnswer } from "./core.mjs?v=1.3.6";

    const els = {
      menu: document.getElementById("menuScreen"),
      quiz: document.getElementById("quizScreen"),
      results: document.getElementById("resultsScreen"),
      scoreChip: document.getElementById("scoreChip"),
      mcModeButton: document.getElementById("mcModeButton"),
      freeModeButton: document.getElementById("freeModeButton"),
      questionCount: document.getElementById("questionCount"),
      modeLabel: document.getElementById("modeLabel"),
      categoryLabel: document.getElementById("categoryLabel"),
      progressFill: document.getElementById("progressFill"),
      targetDot: document.getElementById("targetDot"),
      regionBracket: document.getElementById("regionBracket"),
      bracketPath: document.getElementById("bracketPath"),
      mcAnswers: document.getElementById("mcAnswers"),
      freeForm: document.getElementById("freeForm"),
      freeAnswer: document.getElementById("freeAnswer"),
      submitButton: document.getElementById("submitButton"),
      feedback: document.getElementById("feedback"),
      structureBlurb: document.getElementById("structureBlurb"),
      changeModeButton: document.getElementById("changeModeButton"),
      nextButton: document.getElementById("nextButton"),
      percentScore: document.getElementById("percentScore"),
      rawScore: document.getElementById("rawScore"),
      resultMessage: document.getElementById("resultMessage"),
      practiceMissedButton: document.getElementById("practiceMissedButton"),
      playAgainButton: document.getElementById("playAgainButton"),
      resultsModeButton: document.getElementById("resultsModeButton")
    };

    let mode = null;
    let deck = [];
    let index = 0;
    let score = 0;
    let missedQuestions = [];
    let answered = false;
    let selectedChoice = null;

    function currentQuestion() { return deck[index]; }

    function showOnly(screen) {
      els.menu.classList.toggle("hidden", screen !== "menu");
      els.quiz.classList.toggle("hidden", screen !== "quiz");
      els.results.classList.toggle("hidden", screen !== "results");
      els.scoreChip.classList.toggle("hidden", screen !== "quiz");
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    function startQuiz(nextMode = mode) {
      mode = nextMode || "mc";
      deck = shuffle(QUESTIONS.map(item => ({ ...item })));
      index = 0;
      score = 0;
      missedQuestions = [];
      answered = false;
      selectedChoice = null;
      showOnly("quiz");
      renderQuestion();
    }

    function renderQuestion() {
      if (index >= deck.length) { showResults(); return; }
      answered = false;
      selectedChoice = null;
      const q = currentQuestion();
      els.questionCount.textContent = `QUESTION ${index + 1} OF ${deck.length}`;
      els.modeLabel.textContent = mode === "mc" ? "Multiple choice" : "Free response";
      els.categoryLabel.textContent = q.category;
      els.progressFill.style.width = `${((index + 1) / deck.length) * 100}%`;
      els.scoreChip.textContent = index ? `${score}/${index}` : "0";
      const [x, y] = q.point;
      els.targetDot.style.left = `${(x / IMAGE_WIDTH) * 100}%`;
      els.targetDot.style.top = `${(y / IMAGE_HEIGHT) * 100}%`;
      els.targetDot.classList.toggle("hidden", !!q.region);
      els.regionBracket.classList.toggle("hidden", !q.region);
      if (q.region) {
        const [left, top, right, bottom] = q.region;
        els.bracketPath.setAttribute("d", `M ${left} ${top} H ${right} V ${bottom} H ${left}`);
      }
      clearFeedback();
      els.nextButton.disabled = true;
      els.nextButton.classList.remove("key-pressed");

      if (mode === "mc") {
        els.mcAnswers.classList.remove("hidden");
        els.freeForm.classList.add("hidden");
        buildChoices(q);
      } else {
        els.mcAnswers.classList.add("hidden");
        els.mcAnswers.replaceChildren();
        els.freeForm.classList.remove("hidden");
        els.freeAnswer.disabled = false;
        els.freeAnswer.value = "";
        els.submitButton.disabled = false;
        requestAnimationFrame(() => els.freeAnswer.focus());
      }
    }

    function buildChoices(q) {
      const choices = choicesFor(q);
      els.mcAnswers.replaceChildren();
      choices.forEach((choice, i) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "rounded-button answer-button";
        button.dataset.choice = choice;
        const badge = document.createElement("span");
        badge.className = "key-badge";
        badge.setAttribute("aria-hidden", "true");
        badge.textContent = String(i + 1);
        const label = document.createElement("span");
        label.textContent = choice;
        button.append(badge, label);
        button.addEventListener("click", () => submitChoice(choice));
        els.mcAnswers.append(button);
      });
    }

    function answerButtons() { return [...els.mcAnswers.querySelectorAll(".answer-button")]; }

    function submitChoice(choice) {
      if (answered || mode !== "mc") return;
      selectedChoice = choice;
      const selectedButton = answerButtons().find(button => button.dataset.choice === choice);
      if (selectedButton) { selectedButton.classList.add("selected"); selectedButton.setAttribute("aria-pressed", "true"); }
      evaluate(choice === currentQuestion().answer);
    }

    function submitFreeResponse() {
      if (answered || mode !== "free") return;
      const typed = els.freeAnswer.value;
      if (!typed.trim()) {
        setFeedback("Type an answer before submitting.", "neutral");
        els.freeAnswer.focus();
        return;
      }
      const q = currentQuestion();
      evaluate(acceptsAnswer(q, typed));
    }

    function evaluate(isCorrect) {
      if (answered) return;
      answered = true;
      const q = currentQuestion();
      els.structureBlurb.textContent = `${q.answer}: ${q.blurb}`;
      if (isCorrect) {
        score += 1;
        setFeedback(`Correct — ${q.answer}. Press Enter for the next question.`, "correct");
      } else {
        missedQuestions.push(q);
        setFeedback(`Incorrect. The correct answer is ${q.answer}. Press Enter to continue.`, "wrong");
      }

      if (mode === "mc") {
        answerButtons().forEach(button => {
          const choice = button.dataset.choice;
          if (choice === q.answer) button.classList.add("correct");
          else if (!isCorrect && choice === selectedChoice) button.classList.add("wrong");
          button.disabled = true;
          button.classList.remove("key-pressed");
        });
      } else {
        els.freeAnswer.disabled = true;
        els.submitButton.disabled = true;
        els.submitButton.classList.remove("key-pressed");
      }

      els.nextButton.disabled = false;
      els.scoreChip.textContent = `${score}/${index + 1}`;
      els.nextButton.focus({ preventScroll: true });
    }

    function setFeedback(message, kind) {
      els.feedback.textContent = message;
      els.feedback.className = `feedback ${kind}`;
    }

    function clearFeedback() {
      els.structureBlurb.textContent = "";
      els.feedback.textContent = "";
      els.feedback.className = "feedback";
    }

    function nextQuestion() {
      if (!answered) return;
      index += 1;
      renderQuestion();
    }

    function showMenu() {
      mode = null;
      showOnly("menu");
    }

    function showResults() {
      showOnly("results");
      const pct = deck.length ? Math.round((score / deck.length) * 100) : 0;
      els.percentScore.textContent = `${pct}%`;
      els.percentScore.style.setProperty("--score", pct);
      els.practiceMissedButton.disabled = missedQuestions.length === 0;
      els.rawScore.textContent = `${score} of ${deck.length} correct`;
      els.resultMessage.textContent = pct >= 90
        ? "Excellent long bone anatomy recall."
        : pct >= 70
          ? "Strong run — review the structures you missed and try another shuffle."
          : "Keep practicing bone regions, coverings, and marrow structures.";
      els.playAgainButton.focus({ preventScroll: true });
    }

    // Keep Enter/Space activation native for buttons and the answer form.
    document.addEventListener("keydown", event => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
      if (!els.quiz.classList.contains("hidden") && mode === "mc" && !answered && /^[1-4]$/.test(event.key)) {
        event.preventDefault();
        answerButtons()[Number(event.key) - 1]?.click();
      }
    });

    els.freeForm.addEventListener("submit", event => { event.preventDefault(); submitFreeResponse(); });
    els.mcModeButton.addEventListener("click", () => startQuiz("mc"));
    els.freeModeButton.addEventListener("click", () => startQuiz("free"));
    els.changeModeButton.addEventListener("click", showMenu);
    els.resultsModeButton.addEventListener("click", showMenu);
    els.nextButton.addEventListener("click", nextQuestion);
    function practiceMissedItems() {
      if (!missedQuestions.length) return;
      deck = shuffle(missedQuestions.map(item => ({ ...item })));
      missedQuestions = [];
      index = 0;
      score = 0;
      answered = false;
      selectedChoice = null;
      showOnly("quiz");
      renderQuestion();
    }

    els.practiceMissedButton.addEventListener("click", practiceMissedItems);
    els.playAgainButton.addEventListener("click", () => startQuiz());
    showMenu();
