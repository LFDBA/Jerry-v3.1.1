class Brain {
    constructor(jer1, net = new NeuralNet(round(random(1, 5)), 28, random(0.006, 0.5))) {
        this.net = net;
        this.jer1 = jer1
    }

    evaluate(jer2, action){
        this.inputs = [
            this.jer1.speed, this.jer1.maxHealth, this.jer1.aggression, this.jer1.strength, this.jer1.grip, this.jer1.libido, this.jer1.fear, this.jer1.sociability, this.jer1.maxKids, this.jer1.fertility, this.jer1.infamy, this.jer1.plantFrequency, this.jer1.devotion,
            jer2.speed, jer2.maxHealth, jer2.aggression, jer2.strength, jer2.grip, jer2.libido, jer2.fear, jer2.sociability, jer2.maxKids, jer2.fertility, jer2.infamy, jer2.plantFrequency, jer2.devotion,
            action
        ];
        return this.net.run(this.inputs);
    }

    learn(jer2, action, outcome, importance){
        this.inputs = [
            this.jer1.speed, this.jer1.maxHealth, this.jer1.aggression, this.jer1.strength, this.jer1.grip, this.jer1.libido, this.jer1.fear, this.jer1.sociability, this.jer1.maxKids, this.jer1.fertility, this.jer1.infamy, this.jer1.plantFrequency, this.jer1.devotion,
            jer2.speed, jer2.maxHealth, jer2.aggression, jer2.strength, jer2.grip, jer2.libido, jer2.fear, jer2.sociability, jer2.maxKids, jer2.fertility, jer2.infamy, jer2.plantFrequency, jer2.devotion,
            action
        ];
        this.net.train(this.inputs, outcome + map(maxPopulation, 0, maxPopulation, 0, 0.3), importance=1);
    }
}


class NeuralNet {
    constructor(numLayers, inputAmt, lerningRate = 0.1) {
        this.layers = new Array(numLayers);
        for(let i = 0; i < numLayers; i++){
            this.layers[i] = new NerualNetLayer(inputAmt, lerningRate);
        }
    }

    run(inputs) {
        for(let i = 0; i < this.layers.length; i++){
            inputs = [this.layers[i].run(inputs)];
        }
        return this.layers[this.layers.length - 1].output;
    }

    train(inputs, desire, importance){
        for(let i = 0; i < this.layers.length; i++){
            this.layers[i].train(inputs, desire, importance);
        }
    }
}


class NerualNetLayer {
    constructor(inputAmt, learningRate = 0.1) {
        this.bias = 0;
        this.output = 0;
        this.desire = 0;
        this.learningRate = learningRate;
        this.weights = new Array(inputAmt);

        for(let i = 0; i < inputAmt; i++){
            this.weights[i] = random(-1, 1);
        }
    }

    run(inputs) {
        let z = 0;
        for(let i = 0; i < inputs.length; i++){
            z += inputs[i] * this.weights[i];
        }
        z += this.bias;
        
        this.output = 1 / (1 + Math.exp(-z));

        return this.output;
    }

    train(inputs, desire, importance){
        this.output = this.run(inputs);
        this.error = desire - this.output;
        this.gradient = this.error * this.output * (1 - this.output);

        for(let i = 0; i < inputs.length; i++){
            this.weights[i] += this.learningRate * importance * this.gradient * inputs[i];
        }
        this.bias += this.learningRate * importance * this.gradient;
    }
}