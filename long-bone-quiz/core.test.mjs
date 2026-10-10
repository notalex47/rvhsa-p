import test from 'node:test';
import assert from 'node:assert/strict';
import { QUESTIONS, IMAGE_WIDTH, IMAGE_HEIGHT, acceptsAnswer, choicesFor, shuffle } from './core.mjs';

test('every reference structure has a distinct question, explanation, and valid target', () => {
  assert.equal(QUESTIONS.length, 12);
  assert.equal(new Set(QUESTIONS.map(q => q.answer)).size, 12);
  for (const q of QUESTIONS) {
    assert.ok(q.blurb.length > 40);
    assert.ok(q.point[0] > 0 && q.point[0] < IMAGE_WIDTH);
    assert.ok(q.point[1] > 0 && q.point[1] < IMAGE_HEIGHT);
    if (q.region) {
      const [left, top, right, bottom] = q.region;
      assert.ok(left < right && right <= IMAGE_WIDTH && top < bottom && bottom <= IMAGE_HEIGHT);
    }
  }
});

test('free response accepts case and punctuation variants and anatomical aliases', () => {
  for (const q of QUESTIONS) {
    for (const answer of [q.answer, ...q.aliases]) assert.ok(acceptsAnswer(q, ` THE ${answer.toUpperCase().replaceAll(' ', '-')} `));
    assert.equal(acceptsAnswer(q, ''), false);
    assert.equal(acceptsAnswer(q, 'some other bone structure'), false);
  }
  assert.equal(acceptsAnswer(QUESTIONS.find(q => q.answer === 'Epiphyseal line'), 'epiphyseal plate'), false);
  assert.equal(acceptsAnswer(QUESTIONS.find(q => q.answer === 'Red bone marrow'), 'yellow marrow'), false);
});

test('shuffled questions and four-choice answers preserve the complete unique sets', () => {
  for (let run = 0; run < 60; run++) {
    assert.deepEqual(new Set(shuffle(QUESTIONS)), new Set(QUESTIONS));
    for (const q of QUESTIONS) {
      const choices = choicesFor(q);
      assert.equal(choices.length, 4);
      assert.equal(new Set(choices).size, 4);
      assert.equal(choices.filter(choice => choice === q.answer).length, 1);
      assert.ok(choices.every(choice => QUESTIONS.some(item => item.answer === choice)));
    }
  }
});
