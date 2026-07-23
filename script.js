let amt = 50;
let maxPopulation = 150;
let creatures = [];
let speedMultiplier = 1.7;
let distanceScale = 1.5;
let libidoScale = 0.8;
let foodAmt = 200;
let food = []
let fertilityScale = 3;
let foodBoost = 1;

function setup() {
    canvas = createCanvas(1000, 500);
    canvas.position((window.innerWidth/2) - (width/2), (window.innerHeight/2) - (height/2));
    
    for (let i = 0; i < amt; i++) {
        creatures.push(new creature(random(0, width), random(0, height)));
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

    if(creatures.length <= 1){
        setup();
    }
    
    canvas.background(50, 50, 70);


    for(let i = 0; i < food.length; i++){
        noStroke();
        fill(150, 210, 150);
        ellipse(food[i].x, food[i].y, 5, 5);
        for(let j = 0; j < creatures.length; j++) {
            if(dist(food[i].x, food[i].y, creatures[j].pos.x, creatures[j].pos.y) < creatures[j].size){
                creatures[j].hunger -= foodBoost/5;
                creatures[j].health += foodBoost;
                food = food.filter(nugget => nugget != food[i]);
                i--;
                break
            }
        }
    }

    for(let i = 0; i < creatures.length; i++) {
        
        for(let j = 0; j < creatures.length; j++) {
            if(i != j) {
                let d = dist(creatures[i].pos.x, creatures[i].pos.y, creatures[j].pos.x, creatures[j].pos.y);
                let threshold = (width + height) / 30;
                if(d < threshold) {
                    stroke(255, 150, 140, map(d, 0, threshold, 255, 0));
                    line(creatures[i].pos.x, creatures[i].pos.y, creatures[j].pos.x, creatures[j].pos.y);
                    
                }
                if(d < threshold/2) {
                    creatures[i].evaluate(creatures[j]);
                    creatures[j].evaluate(creatures[i]);
                }
                else{
                    creatures[i].safe = creatures[i].safe.filter(creature => creature != creatures[j]);
                    creatures[j].safe = creatures[j].safe.filter(creature => creature != creatures[i]);
                }
            }
        } 
        
    }

    for(let i = 0; i < creatures.length; i++) {
        creatures[i].update();
        noStroke();
        fill(creatures[i].color);
        ellipse(creatures[i].pos.x, creatures[i].pos.y, creatures[i].size);
        if(creatures[i].dead) {
            creatures.splice(i, 1);
            i--;
        }
    }
}