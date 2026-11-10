// Standalone training models C1 and P1. Not RPG Codex production code.
export function advance(state, role) {
  if (role !== 'gm') throw new Error('FORBIDDEN');
  if (!state || !Array.isArray(state.participants)) throw new Error('INVALID_STATE');
  const { participants, activeIndex, round } = state;
  if (!Number.isInteger(round) || round < 1) throw new Error('INVALID_ROUND');
  if (participants.some(p => typeof p !== 'string' || p.trim() === '') ||
      new Set(participants).size !== participants.length) throw new Error('INVALID_PARTICIPANTS');
  if (participants.length === 0) {
    if (activeIndex !== null) throw new Error('INVALID_INDEX');
    throw new Error('EMPTY_QUEUE');
  }
  if (!Number.isInteger(activeIndex) || activeIndex < 0 ||
      activeIndex >= participants.length) throw new Error('INVALID_INDEX');
  const nextIndex = (activeIndex + 1) % participants.length;
  const nextRound = round + (nextIndex === 0 ? 1 : 0);
  return { participants: [...participants], activeIndex: nextIndex, round: nextRound };
}

export function feedbackStrength(value) {
  if (!Number.isInteger(value) || value < 0 || value > 12) {
    throw new Error('INVALID_FEEDBACK');
  }
  return Math.floor(value / 2);
}
