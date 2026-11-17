# Big O reasoning

Snippet 1: O(1), because it reads one element by index, no matter how long the array is.

Snippet 2: O(n), because the loop visits every element exactly once.

Snippet 3: O(n²), because for each of the n elements the inner loop walks all n elements again.

Snippet 4: O(n), because the inner loop always runs 10 times, so the work is 10 · n and the constant 10 is dropped.

Snippet 5: O(n²), because filter visits all n elements of a, and for each one includes walks through all n elements of b.

Snippet 6: O(n), because building the Set visits b once and filter visits a once, while each has() lookup takes constant time.
Extra memory: O(n), because the Set stores all n elements of b.

Snippet 7: O(log n), because each step halves the part of the array that is still searched, so it takes about log₂ n steps.

Snippet 8: O(n log n), because the array is halved about log₂ n times, and on each level slice and the spread copy all n elements once.
