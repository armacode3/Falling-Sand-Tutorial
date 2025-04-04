/**
 * Gets a random number within the range [min, max]
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}