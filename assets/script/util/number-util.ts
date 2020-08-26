
function getRandomNum(max: number, min: number = 0): number {
    let num: number = min + Math.random() * (max - min + 1);
    return num;
}

function getRandomInt(max: number, min: number = 0): number {
    return Math.floor(getRandomNum(max, min));
}

export default {
    getRandomNum,
    getRandomInt
}