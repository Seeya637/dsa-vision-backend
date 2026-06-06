
export function bubbleSort(arr) {
  const a = [...arr];
  const steps = [];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      steps.push({ type: 'compare', i: j, j: j + 1 });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ type: 'swap', i: j, j: j + 1, arr: [...a] });
      }
    }
    steps.push({ type: 'sorted', i: a.length - 1 - i });
  }
  return steps;
}

export function selectionSort(arr) {
  const a = [...arr]; const steps = [];
  for (let i = 0; i < a.length; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      steps.push({ type: 'compare', i: min, j });
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      steps.push({ type: 'swap', i, j: min, arr: [...a] });
    }
    steps.push({ type: 'sorted', i });
  }
  return steps;
}

export function insertionSort(arr) {
  const a = [...arr]; const steps = [];
  for (let i = 1; i < a.length; i++) {
    let j = i;
    while (j > 0 && a[j - 1] > a[j]) {
      steps.push({ type: 'compare', i: j - 1, j });
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      steps.push({ type: 'swap', i: j - 1, j, arr: [...a] });
      j--;
    }
    steps.push({ type: 'sorted', i: j });
  }
  return steps;
}

export function mergeSort(arr) {
  const steps = [];
  const a = [...arr];
  function merge(arr, left, mid, right) {
    const L = arr.slice(left, mid + 1);
    const R = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    while (i < L.length && j < R.length) {
      steps.push({ type: 'compare', i: left + i, j: mid + 1 + j });
      if (L[i] <= R[j]) arr[k++] = L[i++];
      else arr[k++] = R[j++];
      steps.push({ type: 'swap', i: k - 1, j: k - 1, arr: [...arr] });
    }
    while (i < L.length) { arr[k++] = L[i++]; steps.push({ type: 'swap', i: k - 1, j: k - 1, arr: [...arr] }); }
    while (j < R.length) { arr[k++] = R[j++]; steps.push({ type: 'swap', i: k - 1, j: k - 1, arr: [...arr] }); }
  }
  function sort(arr, left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    sort(arr, left, mid);
    sort(arr, mid + 1, right);
    merge(arr, left, mid, right);
  }
  sort(a, 0, a.length - 1);
  return steps;
}

export function quickSort(arr) {
  const steps = [];
  const a = [...arr];
  function partition(arr, low, high) {
    const pivot = arr[high]; let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push({ type: 'compare', i: j, j: high });
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({ type: 'swap', i, j, arr: [...arr] });
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({ type: 'swap', i: i + 1, j: high, arr: [...arr] });
    steps.push({ type: 'sorted', i: i + 1 });
    return i + 1;
  }
  function sort(arr, low, high) {
    if (low < high) {
      const pi = partition(arr, low, high);
      sort(arr, low, pi - 1);
      sort(arr, pi + 1, high);
    }
  }
  sort(a, 0, a.length - 1);
  return steps;
}

// Map algo name → function
export const SORT_ALGOS = {
  bubble:    bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge:     mergeSort,
  quick:     quickSort,
};