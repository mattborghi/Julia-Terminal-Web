// We dont need an efficient method, the number of terminals will be small
export function findElement(A) {
    // only positive values, sorted
    A = A.sort((a, b) => a - b)

    let x = 1

    for (let i = 0; i < A.length; i++) {
        // if we find a smaller number no need to continue, cause the array is sorted
        if (x < A[i]) {
            return x
        }
        x = A[i] + 1
    }

    return x
}

export const hexToRgb = hex => {
    const rgb = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
        , (m, r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1).match(/.{2}/g)
        .map(x => parseInt(x, 16))

    return rgb[0] + "," + rgb[1] + "," + rgb[2]
}