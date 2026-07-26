const Actions = Object.freeze({
    // 0=nothing, 1=eat, 2=breed, 3=approach, 4=flee, 5=plant
    NOTHING: 0,
    EAT: 1,
    BREED: 2,
    APPROACH: 3,
    FLEE: 4,
    PLANT: 5,
});

class jerry {
    constructor(
        x,
        y,
        speed = random(1, 3) * speedMultiplier,
        maxHealth = random(1, 2),
        aggression = random(0, 1),
        strengthGene = random(1, 3),
        gripGene = random(0, 1),
        libido = random(0, 1),
        fear = random(0, 1),
        sociability = random(0, 1),
        maxKids = round(random(0, 5)),
        fertility = random(15 * fertilityScale, 30 * fertilityScale),
        infamy = 0,
        brain = new Brain(this),
        plantFrequency = random(0.008, 0.03),
        devotion = random(1, 200)
    ) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.speed = speed;
        this.hunger = 0;
        this.maxHealth = maxHealth;
        this.health = this.maxHealth;
        this.size = this.health * 10;
        this.aggression = aggression;

        this.strengthGene = strengthGene;
        this.gripGene = gripGene;

        this.strength = strengthGene * this.size / 10;
        this.grip = gripGene * (this.strength / 2);
        this.color = color(255, 255, 255, 255);
        this.safe = [];
        this.libido = libido;

        this.devotion = devotion;
        this.devote = 0;

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
        this.full = false;
        this.infamy = infamy;
        this.actionColor = colour(0, 0, 0);
        this.latestAction = [0, this];
        this.brain = brain;
        this.steer = createVector(0, 0);
        this.plantFrequency = plantFrequency;
        this.plantCooldown = 0;
        this.approaching = 0;
        this.fleeing = 0;


        // actions //
        this.approach = this.approach.bind(this);
        this.flee = this.flee.bind(this);
        this.eat = this.eat.bind(this);
        this.babyMake = this.babyMake.bind(this);
        this.plant = this.plant.bind(this);

    }


    // ------------------------------ ACTIONS ------------------------------ // 

    act(func, param) {

        if (tick - this.devote >= this.devotion) {
            this.devote = tick;

            return func(param);
        }

    }

    eat(other) {
        other.die();
        this.health += other.maxHealth - other.hunger;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
        this.latestAction[0] = Actions.EAT;
        this.latestAction[1] = other;
        this.infamy++;

        this.brain.learn(other, Actions.EAT, 1, this.fitness / 1000);
    }

    babyMake(other) {
        this.acc = createVector((this.pos.x + other.pos.x) * 2, (this.pos.y + other.pos.y) * 2);

        let child;
        if (random(0, 1) >= 1 - mutationRate) {
            child = new jerry(
                (this.pos.x + other.pos.x) / 2,
                (this.pos.y + other.pos.y) / 2,
                bias(this.speed, other.speed, this.fitness, other.fitness),
                bias(this.maxHealth, other.maxHealth, this.fitness, other.fitness),
                bias(this.aggression, other.aggression, this.fitness, other.fitness),
                bias(this.strengthGene, other.strengthGene, this.fitness, other.fitness),
                bias(this.gripGene, other.gripGene, this.fitness, other.fitness),
                bias(this.libido, other.libido, this.fitness, other.fitness),
                bias(this.fear, other.fear, this.fitness, other.fitness),
                bias(this.sociability, other.sociability, this.fitness, other.fitness),
                bias(this.maxKids, other.maxKids, this.fitness, other.fitness),
                bias(this.fertility, other.fertility, this.fitness, other.fitness),
                bias(this.plantFrequency, other.plantFrequency, this.fitness, other.fitness),
                bias(this.devotion, other.devotion, this.fitness, other.fitness)

            ); console.log("pretty chill")
        } else {
            child = new jerry((this.pos.x + other.pos.x) / 2, (this.pos.y + other.pos.y) / 2);
            console.log("freak")
        }

        // this.fitness += 1000;

        this.brain.jer1 = child;
        child.brain = this.brain;
        jerrys.push(child);
        this.children.push(child);
        this.latestAction[0] = Actions.BREED;
        this.latestAction[1] = other;

        console.log("babyMake")

        this.brain.learn(other, Actions.BREED, 1, this.fitness / 1000);
        this.color = color(240, 150, 150)

        return child;
    }

    approach(other) {
        this.direction = p5.Vector.sub(other.pos, this.pos);
        if (this.direction.mag() === 0) {
            this.direction = createVector(random(-1, 1), random(-1, 1));
        }
        this.steer = this.direction.copy().normalize();
        this.actionColor = colour(0, 255, 0);

        this.latestAction[0] = Actions.APPROACH;
        this.latestAction[1] = other;

        this.approaching = other;

        this.brain.learn(other, Actions.APPROACH, 1, this.fitness / 1000);
    }

    flee(other) {
        this.direction = p5.Vector.sub(this.pos, other.pos);
        if (this.direction.mag() === 0) {
            this.direction = createVector(random(-1, 1), random(-1, 1));
        }
        this.steer = this.direction.copy().normalize();
        this.actionColor = colour(10);
        this.latestAction[0] = Actions.FLEE;
        this.latestAction[1] = other;

        this.fleeing = other;

        this.brain.learn(other, Actions.FLEE, 1, this.fitness / 1000);
    }

    plant() {
        food.push(this.pos);

        this.latestAction[0] = Actions.PLANT;
        this.latestAction[1] = this;

        this.brain.learn(this, Actions.PLANT, 1, this.fitness / 1000);
    }




    die(killer) {
        this.brain.learn(this.latestAction[1], this.latestAction[0], 0);
        this.dead = true;
    }




    move(target = createVector(random(-1, 1) * (this.speed / 10), random(-1, 1) * (this.speed / 10))) {
        this.acc = target.copy();
        this.vel.add(this.acc);
        this.vel.limit(this.speed);
        this.pos.add(this.vel);
        if ((this.pos.x > width - this.size / 2 && this.vel.x >= 0) || (this.pos.x < 0 + this.size / 2 && this.vel.x <= 0)) {
            this.vel.x *= -1;
        }
        if ((this.pos.y > height - this.size / 2 && this.vel.y >= 0) || (this.pos.y < 0 + this.size / 2 && this.vel.y <= 0)) {
            this.vel.y *= -1;
        }

        if (this.pos.x > width + 1 || this.pos.x < -1) {
            this.pos.x = width / 2;
        }
        if (this.pos.y > height + 1 || this.pos.y < -1) {
            this.pos.y = height / 2;
        }


        for (let i = 0; i < jerrys.length; i++) {
            const other = jerrys[i];
            if (other === this || other.dead) continue;

            const minDist = this.size / 2 + other.size / 2;
            const currentDist = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
            const overlap = minDist - currentDist;

            if (overlap > 0) {
                const normal = p5.Vector.sub(this.pos, other.pos);
                if (normal.mag() === 0) {
                    normal.set(random(-1, 1), random(-1, 1));
                }
                normal.normalize();

                this.pos.add(normal.copy().mult(overlap * 0.6));
                const relVel = this.vel.dot(normal);
                if (relVel < 0) {
                    this.vel.sub(normal.mult(relVel * 1.2));
                }
            }
        }

    }


    async observe(other) {

        // ------------------------- JERRY SPECIFIC ------------------------- //
        // if(this.brain.evaluate(other, Actions.APPROACH) > 0.5 + (this.fear - this.sociability) * 0.1 && (this.latestAction[0] != 4 && this.latestAction[1] == other) && (this.approaching == 0 || this.approaching == other)){
        //     this.approach(other);
        //     console.log("approaching")
        // }else{
        //     this.approaching = 0;
        // }

        // if(this.brain.evaluate(other, Actions.FLEE) > 0.5 + (this.sociability - this.fear) * 0.1 && (this.latestAction[0] != 3 && this.latestAction[1] == other) && (this.fleeing == 0 || this.fleeing == other)){
        //     this.flee(other);
        //     console.log("fleeing")
        // }
        // else{
        //     this.fleeing = 0;    
        // }

        // ------------------------- NOT JERRY SPECIFIC ------------------------- //
        if (this.brain.evaluate(other, Actions.APPROACH) > 0.5 + (this.fear - this.sociability) * 0.1 && this.latestAction[0] != Actions.FLEE && (this.approaching == 0 || this.approaching == other)) {
            this.act(this.approach, other);
        } else {
            this.approaching = 0;
        }

        if (this.brain.evaluate(other, Actions.FLEE) > 0.5 + (this.sociability - this.fear) * 0.1 && this.latestAction[0] != Actions.APPROACH && (this.fleeing == 0 || this.fleeing == other)) {
            this.act(this.flee, other);
        } else {
            this.fleeing = 0;
        }
    }

    setActionAlpha(alpha) {
        return color(this.actionColor.r, this.actionColor.g, this.actionColor.b, alpha);
    }

    evaluate(other) {
        this.actionColor = colour(150, 150, 255);
        if (!other || other.dead || other === this) {
            return;
        }

        if (random(0, 1) < this.aggression && !this.safe.includes(other) && this.brain.evaluate(other, Actions.EAT) >= this.sociability) {
            other.health -= 15 / 255
            if (other.health <= 0) {
                this.act(this.eat, other);
            }

            this.actionColor = colour(255, 140, 140);

            this.observe(other);
        }
        else {
            this.safe.push(other);
        }

        if (random(0, 10 / libidoScale) < this.libido && random(0, 10 / libidoScale) < other.libido && !this.children.includes(other) && !other.children.includes(this) && this.brain.evaluate(other, Actions.BREED) >= 0.5 - this.libido) {
            if (jerrys.length < maxPopulation && this.children.length < this.maxKids && this.birthPeriod > this.fertility) {
                console.log("be")
                this.act(this.babyMake, other);
                this.birthPeriod = 0;
                this.actionColor = colour(150, 210, 150);
            }
        }


        other.acc = createVector((this.pos.x - other.pos.x) * (this.grip), (this.pos.y - other.pos.y) * (this.grip));

    }

    update() {
        this.plantCooldown += this.plantFrequency;
        let steering = this.steer.copy();
        this.steer.set(0, 0);

        if (steering.mag() === 0) {
            steering = createVector(random(-1, 1) * (this.speed / 10), random(-1, 1) * (this.speed / 10));
        }

        this.move(steering);
        this.birthPeriod++;
        this.hunger += 0.001;
        if (this.hunger > 2) {
            this.full = false;
        }
        if (this.hunger < 0) {
            this.full = true;
        }
        this.fitness++;
        // this.fitness -= this.health/8;
        this.health -= this.hunger / 200;
        this.color = color(255, 255, 255, map(this.health, 0, this.maxHealth, 0, 255));

        if (this.brain.evaluate(this, Actions.PLANT) > 0.5 && this.plantCooldown > 3) {
            this.full = true;
            this.act(this.plant);
            this.color = color(150, 210, 150);
            this.plantCooldown = 0;
        }

        if (this.health <= 0) {
            this.die();
        }

    }
}