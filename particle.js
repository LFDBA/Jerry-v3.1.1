class Particle {
    constructor(initPos){
        this.pos = initPos;
        this.vel = createVector(random(-10, 10), random(-10, 10));
        this.acc = createVector(0, 0);
    }
    
    move(target){
        this.acc = target;
        this.vel.add(this.acc);
        this.vel.limit(9);
        this.pos.add(this.vel);
    }

    update(){
        let t = createVector(mouseX, mouseY).sub(this.pos).mult(1/dist(mouseX, mouseY, this.pos.x, this.pos.y));
        t.normalize();


        this.move(t);
        noStroke();
        fill(100, 140, 250, 150);
        ellipse(this.pos.x, this.pos.y, 15);
    }
}   