let canvWidth = window.innerWidth*0.9;
let canvHeight = window.innerHeight*0.9;
let particles = []
let amt = 40;
let bodys = [];
let bAmt = 1;
let particleSize = 20;


function setup() {
    canvas = createCanvas(canvWidth, canvHeight);
    canvas.position((window.innerWidth/2) - (canvWidth/2), (window.innerHeight/2) - (canvHeight/2));

    for(let i = 0; i < bAmt; i++) bodys.push(new Body(createVector(500, 500)))

    for (let i = 0; i < amt; i++) {
        let rand = createVector(random(0, width), random(0, height));
        for(let body of bodys){
            while(dist(rand.x, rand.y, body.pos.x, body.pos.y) < body.size/2) rand = createVector(random(0, width), random(0, height));
        }
        for(let body of particles){
            while(dist(rand.x, rand.y, body.pos.x, body.pos.y) < body.size+100) rand = createVector(random(0, width), random(0, height));
        }
        particles.push(new Particle(rand));
    }

    
    
}

function draw(){
    background(50, 50, 70);

    for(let particle of particles){
        particle.update();
    }
    for(b of bodys){
        b.update();
        if(mouseIsPressed && dist(mouseX, mouseY, b.pos.x, b.pos.y) < b.size/2) b.pos = createVector(mouseX, mouseY);
    }

    
}