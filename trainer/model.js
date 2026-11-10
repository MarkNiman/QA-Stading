/* Educational models only. C1/P1, not production RPG Codex. */
(function (root) {
  const model = {
    initial(preset = 'normal') {
      const participants = preset === 'empty' ? [] : preset === 'single' ? ['Крыса'] : ['Крыса', 'Стражник', 'Контрабандист'];
      return { participants, activeIndex: participants.length ? (preset === 'last' ? 2 : 0) : null, round: 1 };
    },
    advance(state, role, build = 'reference') {
      const next = { ...state, participants: [...state.participants] };
      if (role !== 'gm' && build !== 'B') return { state: next, error: 'FORBIDDEN' };
      if (!state.participants.length) return { state: next, error: 'EMPTY_QUEUE' };
      next.activeIndex = (state.activeIndex + 1) % state.participants.length;
      if (next.activeIndex === 0 && build !== 'A') next.round++;
      return { state: next, error: null };
    },
    strength(x) { return Number.isInteger(x) && x >= 0 && x <= 12 ? Math.floor(x / 2) : 'INVALID_FEEDBACK'; },
    coverage(values) {
      const has = x => values.includes(x);
      return { lower: has(-1) && has(0) && has(1), upper: has(11) && has(12) && has(13), fractional: values.some(x => !Number.isInteger(x)), odd: values.some(x => Number.isInteger(x) && x > 0 && x < 12 && x % 2 === 1) };
    }
  };
  if (typeof module !== 'undefined') module.exports = model;
  root.QAModel = model;
})(typeof globalThis !== 'undefined' ? globalThis : this);
