let amt = 15;
let maxPopulation = 50;
let jerrys = [];
let speedMultiplier = 15;
let distanceScale = 1.5;
let libidoScale = 0.8;
let foodAmt = 200;
let food = []
let fertilityScale = 1;
let foodBoost = 1;
let tick = 0;
let gripping = 0;
let weakest = [];
let mutationRate = 0.2;
let maxLive = 0;
let extinctions = 0;
let colours = true;
let wall = [];



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




function draw() {
    
    canvas.background(50, 50, 70);
    
    if(jerrys.length <= 3){
        for (let i = 0; i < amt; i++) {
            random(jerrys).babyMake(random(jerrys)).pos = createVector(random(0, width), random(0, height));
            
        }
        food = [];
        for (let i = 0; i < foodAmt; i++){
            
            food.push(createVector(random(0, width), random(0, height)));
        }

        extinctions++;

        tick = 0;
    }
    
    

    for(let i = 0; i < food.length; i++){
        noStroke();
        fill(150, 210, 150);
        ellipse(food[i].x, food[i].y, 5, 5);
        for(let j = 0; j < jerrys.length; j++) {
            if(jerrys[j].full == false){
                if(dist(food[i].x, food[i].y, jerrys[j].pos.x, jerrys[j].pos.y) < jerrys[j].size){
                    jerrys[j].hunger -= foodBoost/5;
                    jerrys[j].health += foodBoost;
                    food = food.filter(nugget => nugget != food[i]);
                    i--;
                    break
                }
            }
        }
    }

    for(let i = 0; i < jerrys.length; i++) {
        
        for(let j = 0; j < jerrys.length; j++) {
            if(i != j) {
                let d = dist(jerrys[i].pos.x, jerrys[i].pos.y, jerrys[j].pos.x, jerrys[j].pos.y);
                let threshold = ((width + height) / 30)*distanceScale;
                if(d < threshold) {
                    stroke(jerrys[i].setActionAlpha(map(d, 0, threshold, 255, 0)));
                    line(jerrys[i].pos.x, jerrys[i].pos.y, jerrys[j].pos.x, jerrys[j].pos.y);
                    jerrys[i].observe(jerrys[j]);
                    jerrys[j].observe(jerrys[i]);
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

        if(mouseIsPressed && dist(mouseX, mouseY, jerrys[i].pos.x, jerrys[i].pos.y) <= jerrys[i].size && gripping == 0){
            gripping = jerrys[i];
        }
        else if (!mouseIsPressed) gripping = 0;
        
        for(let i = 0; i < wall.length; i++){
            if (mouseIsPressed){
                if(dist(mouseX, mouseY, wall[i].x, wall[i].y)) wall.push(createVector(mouseX, mouseY));
            }
            fill(100);
            rect(mouseX, mouseY, 10);
        }

        

        jerrys[i].update();
        noStroke();
        fill(jerrys[i].currentColor);
        ellipse(jerrys[i].pos.x, jerrys[i].pos.y, jerrys[i].size);
        if(jerrys[i].dead) {
            jerrys.splice(i, 1);
            i--;
        }

        
    }

    if(gripping != 0 && dist(gripping.pos.x, gripping.pos.y, mouseX, mouseY)) {
        d = dist(gripping.pos.x, gripping.pos.y, mouseX, mouseY);
        if(d >= gripping.size/2){
            gripping.move(createVector(mouseX-gripping.pos.x, mouseY-gripping.pos.y));
        }else{
            gripping.vel.mult(0.5);
        }
    }
    textAlign(LEFT, CENTER);
    textSize(10);
    fill(255, 140, 140);
    text(tick, 10, 10);

    if(tick > maxLive){
        maxLive = tick;
    }

    textAlign(RIGHT, CENTER);
    textSize(10);
    fill(140, 220, 140);
    text(maxLive, width-10, height-10);

    textAlign(RIGHT, CENTER);
    textSize(10);
    fill(255);
    text(jerrys.length, width-10, 10);

    textAlign(LEFT, CENTER);
    textSize(10);
    fill(255);
    text(extinctions, 10, height-10);

    tick++;
}