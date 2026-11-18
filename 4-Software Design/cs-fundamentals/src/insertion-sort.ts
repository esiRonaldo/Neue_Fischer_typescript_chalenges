// An empty array and an array with one element need no special case:
// the loop starts at index 1, so for length 0 or 1 the condition
// i < sorted.length is false right away and the loop never runs.
// The copy is returned as it is, and 0 or 1 elements are already sorted.
export function insertionSort(numbers: number[]): { sorted: number[]; comparisons: number } {
    const sorted = [...numbers];
    let comparisons = 0;

    for (let i = 1; i < sorted.length; i++) {
        const current = sorted[i];
        if (current === undefined) continue;

        let j = i - 1;
        while (j >= 0) {
            const left = sorted[j];
            if (left === undefined) break;

            comparisons++;
            if (left <= current) break;

            sorted[j + 1] = left;
            j--;
        }

        sorted[j + 1] = current;
    }

    return { sorted, comparisons };
}

const input = [5, 2, 4, 6, 1, 3];

console.log(insertionSort(input).sorted); // [1, 2, 3, 4, 5, 6]
console.log(insertionSort([]).sorted);    // []
console.log(insertionSort([7]).sorted);   // [7]
console.log(input);                       // [5, 2, 4, 6, 1, 3]  → input taghir nakard


console.log(insertionSort([1, 2, 3, 4, 5]).comparisons);
console.log(insertionSort([5, 4, 3, 2, 1]).comparisons);
console.log(insertionSort([42]).comparisons);
console.log(insertionSort([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]).comparisons);
// Comparisons:
// [1, 2, 3, 4, 5]                    → 4
// [5, 4, 3, 2, 1]                    → 10
// [42]                               → 0
// [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]    → 45
//
// Why the reversed arrays cost so much more:
// In a sorted array every element is compared once with its left neighbor,
// sees that it is already in place, and stops. That is n - 1 comparisons (best case, O(n)).
// In a reversed array every element is smaller than everything on its left,
// so it has to slide all the way to the front: 1 + 2 + ... + (n - 1) = n(n - 1) / 2
// comparisons (worst case, O(n²)).
// From 5 to 10 reversed elements the input doubles, but the count goes from 10 to 45,
// about four times as much. Doubling n and getting about 4× the work is O(n²).
