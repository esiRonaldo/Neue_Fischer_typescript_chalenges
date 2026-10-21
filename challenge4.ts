const findMissingLetter = (letters: string[]): string => {
    for (let i = 0; i < letters.length - 1; i++) {
        const current = letters[i].charCodeAt(0);
        const next = letters[i + 1].charCodeAt(0);

        if (next !== current + 1) {
            return String.fromCharCode(current + 1);
        }
    }
    return '';
};

console.log(findMissingLetter(['a', 'b', 'c', 'd', 'f'])); // 'e'

