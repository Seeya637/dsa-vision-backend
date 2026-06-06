import { SORT_ALGOS } from '../algorithms/sorting.js';

export function runAlgorithm(algo, inputData) {
  // sorting
  if (SORT_ALGOS[algo]) {
    const steps = SORT_ALGOS[algo](inputData);
    return { steps, total: steps.length };
  }

  throw new Error(`Unknown algorithm: ${algo}`);
}