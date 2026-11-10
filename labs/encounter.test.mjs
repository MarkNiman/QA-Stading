import test from 'node:test';
import assert from 'node:assert/strict';
import { advance, feedbackStrength } from './encounter.mjs';

const queue = () => ({ participants: ['Крыса', 'Стражник', 'Контрабандист'], activeIndex: 0, round: 1 });

test('C1: ordinary transition preserves order and round', () => {
  assert.deepEqual(advance(queue(), 'gm'), {
    participants: ['Крыса', 'Стражник', 'Контрабандист'], activeIndex: 1, round: 1,
  });
});
test('C1: last position wraps and increments round', () => {
  assert.deepEqual(advance({ ...queue(), activeIndex: 2, round: 4 }, 'gm'), {
    participants: queue().participants, activeIndex: 0, round: 5,
  });
});
test('C1: single participant starts a new round', () => {
  assert.deepEqual(advance({ participants: ['Крыса'], activeIndex: 0, round: 1 }, 'gm'),
    { participants: ['Крыса'], activeIndex: 0, round: 2 });
});
test('C1: player is forbidden and input is unchanged', () => {
  const state = queue(), before = structuredClone(state);
  assert.throws(() => advance(state, 'player'), /FORBIDDEN/);
  assert.deepEqual(state, before);
});
test('C1: empty queue cannot advance', () => {
  assert.throws(() => advance({ participants: [], activeIndex: null, round: 1 }, 'gm'), /EMPTY_QUEUE/);
});
test('C1: invalid index is rejected', () => {
  for (const activeIndex of [-1, 3, 0.5, '0', null]) {
    assert.throws(() => advance({ ...queue(), activeIndex }, 'gm'), /INVALID_INDEX/);
  }
});
test('C1: invalid round is rejected', () => {
  for (const round of [0, -1, 1.5, '1', null]) {
    assert.throws(() => advance({ ...queue(), round }, 'gm'), /INVALID_ROUND/);
  }
});
test('C1: invalid participants rejected', () => {
  for (const participants of [['Крыса', 'Крыса'], [''], [4]]) {
    assert.throws(() => advance({ ...queue(), participants }, 'gm'), /INVALID_PARTICIPANTS/);
  }
});
test('C1: successful call does not mutate or share input array', () => {
  const state = queue(), before = structuredClone(state);
  const result = advance(state, 'gm');
  assert.deepEqual(state, before);
  assert.notEqual(result, state);
  assert.notEqual(result.participants, state.participants);
  result.participants.push('Бандит');
  assert.deepEqual(state, before);
});
test('P1: all valid inputs match an explicit table', () => {
  const expected = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6];
  expected.forEach((answer, input) => assert.equal(feedbackStrength(input), answer));
});
test('P1: invalid values rejected', () => {
  for (const input of [-1, 13, 2.5, '6', null, undefined, NaN, Infinity]) {
    assert.throws(() => feedbackStrength(input), /INVALID_FEEDBACK/);
  }
});
