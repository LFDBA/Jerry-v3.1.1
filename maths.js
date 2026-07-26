function colour(r, g, b, a){
    return {r, g, b, a};
}

function nice(array){
    let sum = 0;

    for(let i = 0; i < array.length; i++){
        sum += array[i];
    }

    return sum/array.length;
}

function bias(x1, x2, y1, y2){
    let mid = nice([x1, x2]);
    let sum = y1 + y2;

    if (sum == 0) return mid;

    return (x1 * y1 + x2 * y2) / sum;
}

