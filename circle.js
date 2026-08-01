let canvas;
let points = [];
let pointsb = [];
let pointsc = [];
let divide = 10;
let increment = 10;

function setup() {
    canvas = createCanvas(800, 800);
    canvas.position((window.innerWidth - width) / 2, (window.innerHeight - height) / 2);
    
}

function draw() {
    canvas.background(50, 50, 70);
    increment += 0.01;
    points = pointsOnCircle(createVector(width/4, height/2), 140, divide, increment);
    pointsb = pointsOnCircle(createVector(3*width/4, height/2), 140, divide, increment);
    stroke(230);
    strokeWeight(2);
    fill(0, 0, 0, 0);

    ellipseMode(RADIUS);

    for(let point of points){
        ellipse(point.x, point.y, 10);
    
    }
    for(let point of pointsb){
        ellipse(point.x, point.y, 10);
    
    }
}