export { QUIZZES } from './data.mjs';

export function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function normalizeAnswer(text) {
  return text.toLowerCase().trim().replace(/\bthe\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}

// Match explicit anatomical names and aliases, never arbitrary substrings.
export function acceptsAnswer(question, text) {
  const normalized = normalizeAnswer(text);
  return !!normalized && [question.answer, ...question.aliases]
    .some(answer => normalizeAnswer(answer) === normalized);
}

export function choicesFor(question, questions) {
  const related = shuffle(questions.filter(item => item.group === question.group && item.answer !== question.answer));
  const other = shuffle(questions.filter(item => item.group !== question.group && item.answer !== question.answer));
  const distractors = [...new Set([...related, ...other].map(item => item.answer))].slice(0, 3);
  return shuffle([question.answer, ...distractors]);
}
