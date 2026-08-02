let molds = []; let num = 10000;
let d; 

function setup() {
  createCanvas(windowWidth/4, windowHeight/2).position(windowWidth/2-windowWidth/8, windowHeight/4);
  angleMode(DEGREES);
  d = pixelDensity();
  
  for (let i=0; i<num; i++) {
    molds[i] = new Mold();
  }
}

function draw() {
  background(50, 50, 70, 10);
  loadPixels();
  
  for (mold of molds){
    mold.update();
    mold.display();
  }
  
}