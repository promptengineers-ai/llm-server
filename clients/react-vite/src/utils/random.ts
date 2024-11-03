
export function generateRandomNumber() {
    const min = 1000000000;
    const max = 9999999999;
    let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
}