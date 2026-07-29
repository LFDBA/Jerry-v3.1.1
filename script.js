let amt = 30;
let maxPopulation = 50;
let jerrys = [];
let speedMultiplier = 15;
let distanceScale = 1.5;
let libidoScale = 6;
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
let walls = [];
let wallSize = 20;
let mousePos;
let analyzing;
let openStats = false;
let tickSpeed = 1;
let slider;



function setup() {
    canvas = createCanvas(1000, 500);
    canvas.position((window.innerWidth/2) - (width/2), (window.innerHeight/2) - (height/2));
    
    for (let i = 0; i < amt; i++) {
        jerrys.push(new jerry(random(0, width), random(0, height)));
    }
    for (let i = 0; i < foodAmt; i++){
        food.push(createVector(random(0, width), random(0, height)));
    }
    rectMode(CENTER);
    slider = createSlider(0.1, 50)
    slider.value(1);
    slider.position(10, 10);
    slider.size(80);
}




function draw() {

    tickSpeed = slider.value();

    mousePos = createVector(mouseX, mouseY);

    if(mouseIsPressed) mouseDown();

    canvas.background(50, 50, 70);


    if(jerrys.length <= 3 && jerrys.length > 0){
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

    for(wall of walls){
        fill(255);
        rect(wall.x, wall.y, wallSize);
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
                

                // for(wall of walls){
                //     if(!isIn(jerrys[i].pos, jerrys[j].pos, wall) && !walls.some(num => num.x >= getLine(jerrys[i].pos, jerrys[j].pos, num.x).x-wallSize && num.x <= getLine(jerrys[i].pos, jerrys[j].pos, num.x).x+wallSize && num.y >= getLine(jerrys[i].pos, jerrys[j].pos, num.x).y-wallSize && num.y <= getLine(jerrys[i].pos, jerrys[j].pos, num.x).y+wallSize)){
                
                //         let d = dist(jerrys[i].pos.x, jerrys[i].pos.y, jerrys[j].pos.x, jerrys[j].pos.y);
                //         let threshold = ((width + height) / 30)*distanceScale;
                //         if(d < threshold) {

                    
                //             stroke(jerrys[i].setActionAlpha(map(d, 0, threshold, 255, 0)));
                //             line(jerrys[i].pos.x, jerrys[i].pos.y, jerrys[j].pos.x, jerrys[j].pos.y);
                //             jerrys[i].observe(jerrys[j]);
                //             jerrys[j].observe(jerrys[i]);
                //         }
                //         if(d < threshold/2) {
                //             jerrys[i].evaluate(jerrys[j]);
                //             jerrys[j].evaluate(jerrys[i]);
                //         }
                //         else{
                //             jerrys[i].safe = jerrys[i].safe.filter(jerry => jerry != jerrys[j]);
                //             jerrys[j].safe = jerrys[j].safe.filter(jerry => jerry != jerrys[i]);
                //         }

                //         console.log("idka")
                //     }
                    
                // }
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
        if(d >= gripping.size/2){
            gripping.move(createVector(mouseX-gripping.pos.x, mouseY-gripping.pos.y));
        }else{
            gripping.vel.mult(0.5);
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
    strokeWeight(1);
    tick+=tickSpeed;
}


function mouseDown() {
    if(mouseButton.left && keyIsDown(SHIFT)){
        if (walls.length == 0) walls.push(mousePos);
        if(!walls.some(num => num.x >= mouseX-wallSize/2 && num.x <= mouseX+wallSize/2 && num.y >= mouseY-wallSize/2 && num.y <= mouseY+wallSize/2)){
            walls.push(mousePos);
        }
    }else{
        if (keyIsDown(SHIFT)) {
            walls = [];
        }else if(walls.some(num => num.x >= mouseX-wallSize/2 && num.x <= mouseX+wallSize/2 && num.y >= mouseY-wallSize/2 && num.y <= mouseY+wallSize/2)){
            walls = walls.filter(num => !(num.x >= mouseX-wallSize/2 && num.x <= mouseX+wallSize/2 && num.y >= mouseY-wallSize/2 && num.y <= mouseY+wallSize/2));
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