export { QUIZZES } from './data.mjs?v=1.4.1-pointers';

// The open arrowhead meets the calibrated target exactly; nothing is filled
// over the tissue. The SVG uses non-scaling strokes when the image is zoomed.
export function pointerPaths(question) {
  const [x, y] = question.point;
  const [fromX, fromY] = question.pointerFrom;
  const length = Math.hypot(x - fromX, y - fromY);
  const ux = (x - fromX) / length;
  const uy = (y - fromY) / length;
  const headLength = 8;
  const halfWidth = 3;
  const baseX = x - ux * headLength;
  const baseY = y - uy * headLength;
  return {
    stem: `M ${fromX} ${fromY} L ${x} ${y}`,
    head: `M ${baseX - uy * halfWidth} ${baseY + ux * halfWidth} L ${x} ${y} L ${baseX + uy * halfWidth} ${baseY - ux * halfWidth}`
  };
}

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
