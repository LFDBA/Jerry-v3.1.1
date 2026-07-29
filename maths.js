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

function getLine(p1, p2, x){
    m = (p2.y - p1.y)/(p2.x - p1.x);
    b = p1.y - m*p1.x;
    y = m*x+b;
    return createVector(x, y);
}

function isIn(p1, p2, item) {
    const minX = Math.min(p1.x, p2.x);
    const maxX = Math.max(p1.x, p2.x);
    const minY = Math.min(p1.y, p2.y);
    const maxY = Math.max(p1.y, p2.y);

    return item.x >= minX && item.x <= maxX &&
           item.y >= minY && item.y <= maxY;
}