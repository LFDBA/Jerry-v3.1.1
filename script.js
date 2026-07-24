let amt = 80;
let maxPopulation = 150;
let jerrys = [];
let speedMultiplier = 1.7;
let distanceScale = 1.5;
let libidoScale = 0.8;
let foodAmt = 200;
let food = []
let fertilityScale = 3;
let foodBoost = 1;
let tick = 0;

function setup() {
    canvas = createCanvas(1000, 500);
    canvas.position((window.innerWidth/2) - (width/2), (window.innerHeight/2) - (height/2));
    
    for (let i = 0; i < amt; i++) {
        jerrys.push(new jerry(random(0, width), random(0, height)));
    }
    for (let i = 0; i < foodAmt; i++){
        food.push(createVector(random(0, width), random(0, height)));
    }
}

function middle(nums){
    let sum = 0;
    for(let i = 0; i < nums.length; i++){
        sum += nums[i];
    }
    return sum/nums.length;
}

function bias(x1, x2, y1, y2){
    let mid = middle([x1, x2]);
    let sum = y1 + y2;

    if (sum == 0) return mid;

    return (x1 * y1 + x2 * y2) / sum;
}



function draw() {

    if(jerrys.length <= 1){
        setup();
    }
    
    canvas.background(50, 50, 70);


    for(let i = 0; i < food.length; i++){
        noStroke();
        fill(150, 210, 150);
        ellipse(food[i].x, food[i].y, 5, 5);
        for(let j = 0; j < jerrys.length; j++) {
            if(dist(food[i].x, food[i].y, jerrys[j].pos.x, jerrys[j].pos.y) < jerrys[j].size){
                jerrys[j].hunger -= foodBoost/5;
                jerrys[j].health += foodBoost;
                food = food.filter(nugget => nugget != food[i]);
                i--;
                break
            }
        }
    }

    for(let i = 0; i < jerrys.length; i++) {
        
        for(let j = 0; j < jerrys.length; j++) {
            if(i != j) {
                let d = dist(jerrys[i].pos.x, jerrys[i].pos.y, jerrys[j].pos.x, jerrys[j].pos.y);
                let threshold = ((width + height) / 30)*distanceScale;
                if(d < threshold) {
                    stroke(255, 150, 140, map(d, 0, threshold, 255, 0));
                    
                    stroke(jerrys[i].actionColor);
                    line(jerrys[i].pos.x, jerrys[i].pos.y, jerrys[j].pos.x, jerrys[j].pos.y);
                    
                }
                if(d < threshold/2) {
                    jerrys[i].evaluate(jerrys[j]);
                    jerrys[j].evaluate(jerrys[i]);
                }
                else{
                    jerrys[i].safe = jerrys[i].safe.filter(jerry => jerry != jerrys[j]);
                    jerrys[j].safe = jerrys[j].safe.filter(jerry => jerry != jerrys[i]);
                }
            }
        } 
        
    }

    for(let i = 0; i < jerrys.length; i++) {
        jerrys[i].update();
        noStroke();
        fill(jerrys[i].color);
        ellipse(jerrys[i].pos.x, jerrys[i].pos.y, jerrys[i].size);
        if(jerrys[i].dead) {
            jerrys.splice(i, 1);
            i--;
        }
    }

    tick++;
}