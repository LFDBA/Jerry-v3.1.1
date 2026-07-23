let amt = 100;
let maxPopulation = 150;
let creatures = [];
let speedMultiplier = 1.7;
let distanceScale = 1.5;
let libidoScale = 0.8;
let foodAmt = 200;
let food = []
let fertilityScale = 1;
let foodBoost = 1;

function middle(nums){
    let sum = 0;
    for(let i = 0; i < nums.length; i++){
        sum += nums[i];
    }
    return sum/nums.length;
}

function bias(x1, x2, y1, y2){
    let mid = middle([x1, x2]);
    let sum = y1 + y2;

    if (sum == 0) return mid;

    return (x1 * y1 + x2 * y2) / sum;
}

class creature {
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
        fertility = random(15*fertilityScale, 30*fertilityScale)
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
        // -------------------------- FEAR AND SOCIABILITY FEAR CAUSES AVOIDING OTHER CREATURES, SOCIABILITY CAUSES APPROACHING -------------------------- //
        this.fear = fear;
        this.sociability = sociability;
        this.dead = false;
        this.children = [];
        this.maxKids = maxKids
        this.fitness = 0;
        this.fertility = fertility;
        this.birthPeriod = 0;
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

        for(let i = 0; i < creatures.length; i++) {
            const other = creatures[i];
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
        let child = new creature(
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
        creatures.push(child);
        this.children.push(child);
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
        }
        else {
            this.safe.push(other);
        }

        if(random(0, 10/libidoScale) < this.libido && random(0, 10/libidoScale) < other.libido && !this.children.includes(other) && !other.children.includes(this)) {
            if(creatures.length < maxPopulation && this.children.length < this.maxKids && this.birthPeriod > this.fertility){
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

function setup() {
    canvas = createCanvas(2000, 1000);
    canvas.position((window.innerWidth/2) - (width/2), (window.innerHeight/2) - (height/2));
    
    for (let i = 0; i < amt; i++) {
        creatures.push(new creature(random(0, width), random(0, height)));
    }
    for (let i = 0; i < foodAmt; i++){
        food.push(createVector(random(0, width), random(0, height)));
    }
}

function draw() {

    if(creatures.length <= 1){
        for(let i = 0; i < amt; i++){
            creatures.push(new creature(random(0, width), random(0, height)));
        }
    }
    
    canvas.background(50, 50, 70);


    for(let i = 0; i < food.length; i++){
        noStroke();
        fill(150, 210, 150);
        ellipse(food[i].x, food[i].y, 5, 5);
        for(let j = 0; j < creatures.length; j++) {
            if(dist(food[i].x, food[i].y, creatures[j].pos.x, creatures[j].pos.y) < creatures[j].size){
                creatures[j].hunger -= foodBoost/5;
                creatures[j].health += foodBoost;
                food = food.filter(nugget => nugget != food[i]);
                i--;
                break
            }
        }
    }

    for(let i = 0; i < creatures.length; i++) {
        
        for(let j = 0; j < creatures.length; j++) {
            if(i != j) {
                let d = dist(creatures[i].pos.x, creatures[i].pos.y, creatures[j].pos.x, creatures[j].pos.y);
                let threshold = (width + height) / 30;
                if(d < threshold) {
                    stroke(255, 150, 140, map(d, 0, threshold, 255, 0));
                    line(creatures[i].pos.x, creatures[i].pos.y, creatures[j].pos.x, creatures[j].pos.y);
                    
                }
                if(d < threshold/2) {
                    creatures[i].evaluate(creatures[j]);
                    creatures[j].evaluate(creatures[i]);
                }
                else{
                    creatures[i].safe = creatures[i].safe.filter(creature => creature != creatures[j]);
                    creatures[j].safe = creatures[j].safe.filter(creature => creature != creatures[i]);
                }
            }
        } 
        
    }

    for(let i = 0; i < creatures.length; i++) {
        creatures[i].update();
        noStroke();
        fill(creatures[i].color);
        ellipse(creatures[i].pos.x, creatures[i].pos.y, creatures[i].size);
        if(creatures[i].dead) {
            creatures.splice(i, 1);
            i--;
        }
    }
}