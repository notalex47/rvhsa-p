import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { QUIZZES, acceptsAnswer, choicesFor, normalizeAnswer, shuffle } from './core.mjs';

const counts = [9, 9, 11, 13, 10];
test('all five reference diagrams have their expected distinct structures and local assets', () => {
  assert.equal(Object.keys(QUIZZES).length, 5);
  Object.entries(QUIZZES).forEach(([id, quiz], i) => {
    assert.equal(quiz.questions.length, counts[i]);
    assert.equal(new Set(quiz.questions.map(q => q.answer)).size, counts[i]);
    assert.ok(existsSync(new URL(`./images/${id}.webp`, import.meta.url)));
    const html = readFileSync(new URL(`./${id}/index.html`, import.meta.url), 'utf8');
    assert.ok(html.includes(`data-quiz="${id}"`));
    assert.ok(html.includes(`viewBox="0 0 ${quiz.width} ${quiz.height}"`));
    assert.ok(!html.includes('QUIZ_'));
    assert.ok(html.includes('v1.4.0'));
    for (const question of quiz.questions) {
      assert.ok(question.blurb.length > 20);
      const [x, y] = question.point;
      assert.ok(x >= 0 && x <= quiz.width && y >= 0 && y <= quiz.height, `${id}: ${question.answer}`);
      if (question.marker) {
        const coords = question.marker.match(/\d+(?:\.\d+)?/g).map(Number);
        assert.ok(coords.every(n => n >= 0 && n <= quiz.width));
      }
    }
  });
});

test('every canonical answer and explicit alias is accepted, including case and punctuation variations', () => {
  for (const quiz of Object.values(QUIZZES)) {
    for (const question of quiz.questions) {
      for (const answer of [question.answer, ...question.aliases]) {
        assert.ok(acceptsAnswer(question, answer), answer);
        assert.ok(acceptsAnswer(question, ` The ${answer.toUpperCase().replaceAll(' ', '-')}! `), answer);
      }
      assert.ok(!acceptsAnswer(question, ''));
      assert.ok(!acceptsAnswer(question, 'the'));
      assert.ok(!acceptsAnswer(question, `not ${question.answer}`));
      assert.ok(!acceptsAnswer(question, '???'));
    }
  }
});

test('concise perimysium is accepted wherever it appears, without requiring the reference label phrase', () => {
  const questions = Object.values(QUIZZES).flatMap(quiz => quiz.questions).filter(q => q.answer === 'Perimysium');
  assert.equal(questions.length, 3);
  for (const question of questions) {
    assert.ok(acceptsAnswer(question, 'perimysium'));
    assert.ok(acceptsAnswer(question, 'perimysium around fascicle'));
    for (const wrong of ['epimysium', 'endomysium', 'mysium', 'peri', 'perimysium or endomysium']) {
      assert.ok(!acceptsAnswer(question, wrong));
    }
  }
});

test('common singular/plural names, short names, and anatomical alternatives are supported', () => {
  const question = answer => Object.values(QUIZZES).flatMap(q => q.questions).find(q => q.answer === answer);
  for (const [answer, alias] of [
    ['Mitochondrion', 'mitochondria'], ['Muscle fiber', 'muscle cell'],
    ['Transverse tubule', 'T-tubule'], ['Terminal cisterns', 'terminal cisternae'],
    ['Z disc', 'Z line'], ['Titin filament', 'titin'],
    ['Thin filament', 'actin'], ['Thick filament', 'myosin'],
    ['Sarcoplasmic reticulum', 'SR'], ['Belly of skeletal muscle', 'muscle belly']
  ]) assert.ok(acceptsAnswer(question(answer), alias), alias);
  assert.ok(!acceptsAnswer(question('Thick filament'), 'actin'));
  assert.ok(!acceptsAnswer(question('Thin filament'), 'filament'));
  assert.ok(!acceptsAnswer(question('A band'), 'band'));
});

test('multiple choice always has one correct answer and three distinct, non-equivalent distractors', () => {
  for (const quiz of Object.values(QUIZZES)) {
    for (const question of quiz.questions) {
      for (let i = 0; i < 25; i++) {
        const choices = choicesFor(question, quiz.questions);
        assert.equal(choices.length, 4);
        assert.equal(new Set(choices).size, 4);
        assert.equal(choices.filter(choice => acceptsAnswer(question, choice)).length, 1);
        assert.ok(choices.includes(question.answer));
      }
    }
  }
});

test('normalization and shuffling preserve meaningful distinctions and the source deck', () => {
  assert.equal(normalizeAnswer('  The   Z-Disc! '), 'z disc');
  const deck = Object.values(QUIZZES)[0].questions;
  const original = [...deck];
  assert.deepEqual(new Set(shuffle(deck)), new Set(deck));
  assert.deepEqual(deck, original);
});
