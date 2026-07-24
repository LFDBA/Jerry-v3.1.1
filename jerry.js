class jerry {
    constructor(
        x, 
        y, 
        speed = random(1, 3)*speedMultiplier,
        maxHealth = random(1, 2),
        aggression = random(0, 1),
        strengthGene = random(1, 3),
        gripGene = random(0, 1),
        libido = random(0, 1),
        fear = random(0, 1),
        sociability = random(0, 1),
        maxKids = round(random(0, 5)),
        fertility = random(15*fertilityScale, 30*fertilityScale),
        infamy = 0
    ) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.speed = speed;
        this.hunger = 0;
        this.maxHealth = maxHealth;
        this.health = this.maxHealth;
        this.size = this.health*10;
        this.aggression = aggression;

        this.strengthGene = strengthGene;
        this.gripGene = gripGene;

        this.strength = strengthGene*this.size/10;
        this.grip = gripGene*(this.strength/2);
        this.color = color(255, 255, 255, 255);
        this.safe = [];
        this.libido = libido;
        // -------------------------- FEAR AND SOCIABILITY FEAR CAUSES AVOIDING OTHER jerryS, SOCIABILITY CAUSES APPROACHING -------------------------- //
        this.fear = fear;
        this.sociability = sociability;
        this.dead = false;
        this.children = [];
        this.maxKids = maxKids
        this.fitness = 0;
        this.fertility = fertility;
        this.birthPeriod = 0;
        this.age = 0;
        this.infamy = infamy;
    }

    die() {
        this.dead = true;
    }

    eat(other) {
        other.die();
        this.health += other.maxHealth-other.hunger;
        if(this.health > this.maxHealth){
            this.health = this.maxHealth;
        }
        this.infamy++;
    }

    move() {
        this.acc = createVector(random(-1, 1)*(this.speed/10), random(-1, 1)*(this.speed/10));
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        if(this.pos.x > width || this.pos.x < 0) {
            this.vel.x *= -1;
        }
        if(this.pos.y > height || this.pos.y < 0) {
            this.vel.y *= -1;
        }

        for(let i = 0; i < jerrys.length; i++) {
            const other = jerrys[i];
            if(other === this || other.dead) continue;

            const minDist = this.size/2 + other.size/2;
            const currentDist = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
            const overlap = minDist - currentDist;

            if(overlap > 0) {
                const normal = p5.Vector.sub(this.pos, other.pos);
                if(normal.mag() === 0) {
                    normal.set(random(-1, 1), random(-1, 1));
                }
                normal.normalize();

                this.pos.add(normal.copy().mult(overlap * 0.6));
                const relVel = this.vel.dot(normal);
                if(relVel < 0) {
                    this.vel.sub(normal.mult(relVel * 1.2));
                }
            }
        }
    }

    babyMake(other){
        this.acc = createVector((this.pos.x + other.pos.x)*2, (this.pos.y + other.pos.y)*2);
        let child = new jerry(
            (this.pos.x + other.pos.x)/2, 
            (this.pos.y + other.pos.y)/2, 
            bias(this.speed, other.speed, this.fitness, other.fitness),
            bias(this.maxHealth, other.maxHealth, this.fitness, other.fitness), 
            bias(this.aggression, other.aggression, this.fitness, other.fitness), 
            bias(this.strengthGene, other.strengthGene, this.fitness, other.fitness),
            bias(this.gripGene, other.gripGene, this.fitness, other.fitness),
            bias(this.libido, other.libido, this.fitness, other.fitness),
            bias(this.fear, other.fear, this.fitness, other.fitness),
            bias(this.sociability, other.sociability, this.fitness, other.fitness),
            bias(this.maxKids, other.maxKids, this.fitness, other.fitness),
            bias(this.fertility, other.fertility, this.fitness, other.fitness)
        );
        jerrys.push(child);
        this.children.push(child);
    }

    observe(other){
        
    }

    evaluate(other) {
        if (!other || other.dead || other === this) {
            return;
        }

        if(random(0, 1) < this.aggression && !this.safe.includes(other)) {
            other.health -= 15/255
            if(other.health <= 0) {
                this.eat(other);
            }
            this.actionColor = color();
        }
        else {
            this.safe.push(other);
        }

        if(random(0, 10/libidoScale) < this.libido && random(0, 10/libidoScale) < other.libido && !this.children.includes(other) && !other.children.includes(this)) {
            if(jerrys.length < maxPopulation && this.children.length < this.maxKids && this.birthPeriod > this.fertility){
                this.babyMake(other);
                this.birthPeriod = 0;
            }
        }

        other.acc = createVector((this.pos.x - other.pos.x) * (this.grip), (this.pos.y - other.pos.y) * (this.grip));
    }

    update() {
        this.move();
        this.birthPeriod++;
        this.hunger += 0.01;
        this.fitness++;
        this.health -= this.hunger/200;
        this.color = color(255, 255, 255, map(this.health, 0, this.maxHealth, 0, 255));

        if(this.health <= 0) {
            this.die();
        }
    }
}