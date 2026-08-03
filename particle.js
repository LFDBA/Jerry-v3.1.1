class Particle {
    constructor(initPos){
        this.pos = initPos;
        this.vel = createVector(random(-10, 10), random(-10, 10));
        this.acc = createVector(0, 0);
        this.color = color(random(140, 255), random(140, 255), random(140, 255), 150);
        this.newVel = this.vel.copy();
    }
    
    move(target, strength){
        this.acc = target;
        this.vel.add(this.acc);
        this.vel.limit(2);
        this.pos.x = (this.pos.x + this.vel.x + width)%width;
        this.pos.y = (this.pos.y + this.vel.y + height)%height;

        for(let other of particles){

            if(other != this){
                const minDist = particleSize;
                const currentDist = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
                const overlap = minDist - currentDist;

                if (overlap > 0){ 
                    this.newVel = other.vel;
                    other.vel = this.vel;
                    this.vel = this.newVel;
                }
            }
        }
    }

    update(){
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, particleSize);
        let t = createVector(this.pos.x, this.pos.y);
        t.sub(this.pos);
        t.mult(1/dist(this.pos.x, this.pos.y, mouseX, mouseY))
        t.normalize();
        this.move(t);
    }
}   