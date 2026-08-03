class Body{
    constructor(pos, gravity = 9.8){
        this.pos = pos;
        this.gravity = gravity;
        this.size = 100;
    }

    draw(){
        fill(250, 140, 140, 200);
        ellipse(this.pos.x, this.pos.y, this.size);
    }

    update(){
        for(let particle of particles){
            let t = this.pos.copy().sub(particle.pos).mult(1/dist(particle.pos.x, particle.pos.y, this.pos.x, this.pos.y));
            t.normalize();

            if(dist(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y) > this.size/2) particle.move(t, this.gravity);
            
        }

        this.draw();
    }
}