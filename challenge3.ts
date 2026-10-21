const getNumber = (word: string): number => Number(word.match(/\d/)?.[0]);

const orderWords = (words: string): string =>
    words.split(' ').sort((a, b) => getNumber(a) - getNumber(b)).join(' ');

console.log(orderWords("is2 Thi1s T4est 3a"));       
