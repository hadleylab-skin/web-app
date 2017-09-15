export function convertInToCm(number) {
    const result = parseFloat(number) * 2.54;
    return result.toFixed(2);
}

export function convertCmToIn(number) {
    const result = parseFloat(number) / 2.54;
    return result.toFixed(2);
}

