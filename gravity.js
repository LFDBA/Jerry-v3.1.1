let canvWidth = window.innerWidth*0.9;
let canvHeight = window.innerHeight*0.9;
let particles = []
let amt = 10;



function setup() {
    canvas = createCanvas(canvWidth, canvHeight);
    canvas.position((window.innerWidth/2) - (canvWidth/2), (window.innerHeight/2) - (canvHeight/2));

    for (let i = 0; i < amt; i++) {
        particles.push(new Particle(createVector(random(0, width), random(0, height))));
    }
    
}

function draw(){
    background(50, 50, 70);

    for(particle of particles){
        particle.update();
    }
}