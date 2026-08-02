let amt = 30;
let maxPopulation = 50;
let jerrys = [];
let speedMultiplier = 15;
let distanceScale = 1.5;
let libidoScale = 6;
let foodAmt = 0;
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
let walls = [];
let wallSize = 20;
let mousePos;
let analyzing;
let openStats = false;
let tickSpeed = 1;
let tSlider;
let wSlider;
let canvWidth = window.innerWidth*0.9;
let canvHeight = window.innerHeight*0.9;
let pheromones = [];
let pheromoneAging = 300;
let hivemind = false;
let trees = [];
let treeAmt = 0;
let treeTimeout = 0;



function setup() {
    canvas = createCanvas(canvWidth, canvHeight);
    canvas.position((window.innerWidth/2) - (canvWidth/2), (window.innerHeight/2) - (canvHeight/2));
    
    for (let i = 0; i < treeAmt; i++){
        trees.push(createVector(random(0, width), random(0, height)));
    }
    for (let i = 0; i < amt; i++) {
        jerrys.push(new jerry(random(0, width), random(0, height)));
    }
    for (let i = 0; i < foodAmt; i++){
        food.push(createVector(random(0, width), random(0, height)));
    }
    rectMode(CENTER);
    tSlider = createSlider(0.1, 50)
    tSlider.value(1);
    tSlider.position(10, 10);
    tSlider.size(80);

    
    wSlider = createSlider(0, canvWidth)
    wSlider.value(canvWidth);
    wSlider.position((window.innerWidth/2)-canvWidth/2, 10);
    wSlider.size(canvWidth);
    strokeMode(SIMPLE);
    
}




function draw() {
    // console.log(JSON.stringify(jerrys[0].brain.net));
    canvas = createCanvas(wSlider.value(), canvHeight);
    canvas.position((window.innerWidth/2)-canvWidth/2, (window.innerHeight/2) - (canvHeight/2));


    tickSpeed = tSlider.value();

    mousePos = createVector(mouseX, mouseY);

    if(mouseIsPressed) mouseDown();

    canvas.background(50, 50, 70);
    for(let p of pheromones){
        p.age += tickSpeed;
        if(p.age > pheromoneAging){
            pheromones = pheromones.filter(num => num != p);
        }
        noStroke();
        fill(255, 140, 140, 255/(map(p.age, 0, pheromoneAging*10, 0, 255)));
        // ellipse(p.pos.x, p.pos.y, 5);
    }

    if(jerrys.length <= 3){
        if(jerrys.length == 0){
            for (let i = 0; i < amt; i++) {
                jerrys.push(new jerry(random(0, width), random(0, height)));
            }
            food = [];
            for (let i = 0; i < foodAmt; i++){
                food.push(createVector(random(0, width), random(0, height)));
            }
            extinctions++;
            tick = 0;
            treeTimeout = 0;
        }else{
            for (let i = 0; i < amt; i++) {
                random(jerrys).babyMake(random(jerrys)).pos = createVector(random(0, width), random(0, height));
                
            }
            food = [];
            for (let i = 0; i < foodAmt; i++){
                
                food.push(createVector(random(0, width), random(0, height)));
            }

            extinctions++;

            tick = 0;
            treeTimeout = 0;
        }
    }
    

    for(let i = 0; i < food.length; i++){
        if(food[i].x > width || food[i].y > height || food[i].x < 0 || food[i].y < 0){
            food = food.filter(nugget => nugget != food[i]);
            i--;
            break;
        }
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

    for(wall of walls){
        fill(255);
        noStroke();
        rect(wall.x, wall.y, wallSize);

        if(wall.x >= width || wall.y >= height) walls = walls.filter(num => num != wall);
        

    }

    for(let i = 0; i < jerrys.length; i++) {
        
        for(let j = 0; j < jerrys.length; j++) {
            if(i != j) {
                let d = dist(jerrys[i].pos.x, jerrys[i].pos.y, jerrys[j].pos.x, jerrys[j].pos.y);
                let dy = jerrys[i].pos.y - jerrys[j].pos.y;
                let dx = jerrys[i].pos.x - jerrys[j].pos.x;

                let threshold = ((width + height) / 30)*distanceScale;
                if(d < threshold) { 
                    if(!walls.some(num => 
                        num.y >= constrain(getLine(jerrys[i].pos, jerrys[j].pos, num.x).y-(wallSize/2+jerrys[i].size/2), jerrys[i].pos.y-d, jerrys[i].pos.y+d) && 
                        num.y <= constrain(getLine(jerrys[i].pos, jerrys[j].pos, num.x).y+(wallSize/2+jerrys[i].size/2), jerrys[i].pos.y-d, jerrys[i].pos.y+d) ||
                        num.x >= constrain(getLine(jerrys[i].pos, jerrys[j].pos, undefined, num.y).x-(wallSize/2+jerrys[i].size/2), jerrys[i].pos.x-d, jerrys[i].pos.x+d) &&
                        num.x <= constrain(getLine(jerrys[i].pos, jerrys[j].pos, undefined, num.y).x+(wallSize/2+jerrys[i].size/2), jerrys[i].pos.x-d, jerrys[i].pos.x+d)
                    )){
                    

                    
                        stroke(jerrys[i].setActionAlpha(map(d, 0, threshold, 255, 0)));
                        line(jerrys[i].pos.x, jerrys[i].pos.y, jerrys[j].pos.x, jerrys[j].pos.y);
                        jerrys[i].observe(jerrys[j]);
                        jerrys[j].observe(jerrys[i]);

                        if(d < threshold/2) {
                            jerrys[i].evaluate(jerrys[j]);
                            jerrys[j].evaluate(jerrys[i]);
                        }
                        else{
                            jerrys[i].safe = jerrys[i].safe.filter(jerry => jerry != jerrys[j]);
                            jerrys[j].safe = jerrys[j].safe.filter(jerry => jerry != jerrys[i]);
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
        } 

        if(mouseIsPressed && dist(mouseX, mouseY, jerrys[i].pos.x, jerrys[i].pos.y) <= jerrys[i].size && gripping == 0){
            gripping = jerrys[i];
        }
        else if (!mouseIsPressed) gripping = 0;
        

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
        rs = gripping.speed;
        if(d >= gripping.size/2){
            gripping.speed = 4*(dist(gripping.pos.x, gripping.pos.y, mouseX, mouseY)/(width/15));
            gripping.move(createVector(mouseX-gripping.pos.x, mouseY-gripping.pos.y));
            gripping.speed = rs;
        }else{
            gripping.vel.mult(0.6);
        }
    }
    textAlign(LEFT, CENTER);
    textSize(10);
    fill(255, 140, 140);
    text(round(tick), 10, 10);

    if(tick > maxLive){
        maxLive = tick;
    }

    textAlign(RIGHT, CENTER);
    textSize(10);
    fill(140, 220, 140);
    text(round(maxLive), width-10, height-10);

    textAlign(RIGHT, CENTER);
    textSize(10);
    fill(255);
    text(jerrys.length, width-10, 10);

    textAlign(LEFT, CENTER);
    textSize(10);
    fill(255);
    text(extinctions, 10, height-10);


    
    if(openStats) {
        fill(150);
        stroke(100);
        strokeWeight(3);
        rectMode(CORNER);
        rect(analyzing.pos.x, analyzing.pos.y, 110, 300, 20);
        textAlign(CENTER, CENTER);

        for(let i = 0; i < analyzing.attributes.length; i++){
            let attribute = analyzing.attributes[i];
            if(typeof attribute === 'number'){
                text(round(attribute, 3), analyzing.pos.x+55, (analyzing.pos.y+i*12)+20);
            }else{
                text(attribute, analyzing.pos.x+55, (analyzing.pos.y+i*12)+20);
            }
        }
    }


    for(let tree of trees){
        noStroke();
        for(let i = 0; i < 10; i++){
            pointsOnCircle(tree, 16, 10).forEach(point => {
                fill(150, 210, 150);
                ellipse(point.x, point.y, 10);
            });
        }
        fill(255, 190, 140);
        ellipse(tree.x, tree.y, 30);
        

        if(tick - treeTimeout > random(50, 150)){
            treeTimeout = tick;
            console.log("tree spawned food");
            food.push(createVector(tree.x+random(-30, 30), tree.y+random(-30, 30)));
        }
    }

    strokeWeight(1);
    if(jerrys.length > 0){
        tick+=tickSpeed;
    }else{
        tick = 0;
    }
    
}


function mouseDown() {
    if(mouseButton.left){
        if(keyIsDown(SHIFT)){
            if (walls.length == 0) walls.push(mousePos);
            if(!walls.some(num => num.x >= mouseX-wallSize/2 && num.x <= mouseX+wallSize/2 && num.y >= mouseY-wallSize/2 && num.y <= mouseY+wallSize/2)){
                walls.push(mousePos);
            }
        }
        if(keyIsDown('f')) {food.push(createVector(mouseX, mouseY)); console.log("poopoofart")}
    }else if(mouseButton.right){
        if (keyIsDown(SHIFT)) {
            walls = [];
        }else if(walls.some(num => num.x >= mouseX-wallSize/2 && num.x <= mouseX+wallSize/2 && num.y >= mouseY-wallSize/2 && num.y <= mouseY+wallSize/2)){
            walls = walls.filter(num => !(num.x >= mouseX-wallSize/2 && num.x <= mouseX+wallSize/2 && num.y >= mouseY-wallSize/2 && num.y <= mouseY+wallSize/2));
        }
        for(creature of jerrys){
            if(dist(mouseX, mouseY, creature.pos.x, creature.pos.y) <= creature.size/2){
                jerrys = jerrys.filter(j => j != creature);
                maxPopulation--;
            }
        }
    }
}

// function mouseClicked(){
//     for(j of jerrys){
//         if(dist(j.pos.x, j.pos.y, mouseX, mouseY) < j.size/2){
//             openStats = true;
//             analyzing = j;
//             break;
//         }else{
//             openStats = false;
//         }
//     }
// }

window.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

function keyPressed(){
    if(key === 's'){
        jerrys.push(new jerry(mouseX, mouseY));
        maxPopulation = jerrys.length;
    }
    if(key === 'b'){
        random(jerrys).babyMake(random(jerrys)).pos = createVector(mouseX, mouseY);
        maxPopulation = jerrys.length;
    }
    if(key === 'r'){
        jerrys.length = 0;
    }
    
}

window.addEventListener('resize', () => {
    canvWidth = window.innerWidth*0.9;
    canvHeight = window.innerHeight*0.9;
    canvas = createCanvas(canvWidth, canvHeight);
    canvas.position((window.innerWidth/2) - (canvWidth/2), (window.innerHeight/2) - (canvHeight/2));
})