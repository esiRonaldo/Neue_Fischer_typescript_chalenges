const maskify = (inputValue: string): string => {
    let result = inputValue.trim().slice(-5).padStart(inputValue.length, '#');
    return result
};

console.log(maskify('4556364607935616')); 