class Creature {
    constructor(x, y, dna) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.maxVelocity = 2;
        this.maxForce = 0.2;
        this.radius = 8;

        this.health = 1;

        // w: weight
        // p: perception
        this.mutationRate = 0.25;
        this.wMutationDiff = 0.1;
        this.pMutationDiff = 10;
        this.wLimits = [-1, 1.5];
        this.pLimits = [0, 100];

        if (dna === undefined) {
            this.dna = [];

            // Food weight
            this.dna[0] = random(this.wLimits[0], this.wLimits[1]);
            // Poison weight
            this.dna[1] = random(this.wLimits[0], this.wLimits[1]);
            // Food perception
            this.dna[2] = random(this.pLimits[0], this.pLimits[1]);
            // Poison perception
            this.dna[3] = random(this.pLimits[0], this.pLimits[1]);
        }
        else if (random(1) <= this.mutationRate) {
            this.dna = [];
            // this.dna = dna;
            for (let i = 0; i < 4; i++) {
                this.dna[i] = dna[i];
            }
            // console.log(dna[0]);

            // Mutation Values
            this.wMutation = random(-this.wMutationDiff, this.wMutationDiff);
            this.pMutation = random(-this.pMutationDiff, this.pMutationDiff);

            // Food weight mutation
            if (this.dna[0] + this.wMutation < this.wLimits[0]) {
                this.dna[0] = this.wLimits[0];
            }
            else if (this.dna[0] + this.wMutation > this.wLimits[1]) {
                this.dna[0] = this.wLimits[1];
            }
            else {
                this.dna[0] += this.wMutation;
            }

            // Poison weight mutation
            if (this.dna[1] + this.wMutation < this.wLimits[0]) {
                this.dna[1] = this.wLimits[0];
            }
            else if (this.dna[1] + this.wMutation > this.wLimits[1]) {
                this.dna[1] = this.wLimits[1];
            }
            else {
                this.dna[1] += this.wMutation;
            }

            // Food perception mutation
            if (this.dna[2] + this.pMutation < this.pLimits[0]) {
                this.dna[2] = this.pLimits[0];
            }
            else if (this.dna[2] + this.pMutation > this.pLimits[1]) {
                this.dna[2] = this.pLimits[1];
            }
            else {
                this.dna[2] += this.pMutation;
            }

            // Poison perception mutation
            if (this.dna[3] + this.pMutation < this.pLimits[0]) {
                this.dna[3] = this.pLimits[0];
            }
            else if (this.dna[3] + this.pMutation > this.pLimits[1]) {
                this.dna[3] = this.pLimits[1];
            }
            else {
                this.dna[3] += this.pMutation;
            }
        }
        else {
            this.dna = dna;
        }
    }

    boundaries (distanceOfBoundaries) {
        let desired = null;

        // If we want forces to go left or right, "this.position.y" is the same.
        // Then use "this.maxVelocity" to move back within boundaries.
        if (this.position.x < distanceOfBoundaries) {
            desired = createVector(this.maxVelocity, this.velocity.y);
        }
        else if (this.position.x > width - distanceOfBoundaries) {
            desired = createVector(-this.maxVelocity, this.velocity.y);
        }

        // If we want forces to go up or down, "this.position.x" is the same.
        // Then use "this.maxVelocity" to move back within boundaries.
        if (this.position.y < distanceOfBoundaries) {
            desired = createVector(this.velocity.x, this.maxVelocity);
        }
        else if (this.position.y > height - distanceOfBoundaries) {
            desired = createVector(this.velocity.x, -this.maxVelocity);
        }

        if (desired !== null) {
            desired.setMag(this.maxVelocity);

            let steering = p5.Vector.sub(desired, this.velocity);
            steering.limit(this.maxForce);

            this.applyForce(steering);
        }
    }

    behavior(good, bad) {
        // Eating nutrition
        let steeringGood = this.eat(good, 0.2, this.dna[2]);
        let steeringBad = this.eat(bad, -0.8, this.dna[3]);

        steeringGood.mult((this.dna)[0]);
        steeringBad.mult(this.dna[1]);

        this.applyForce(steeringGood);
        this.applyForce(steeringBad);
    }

    // **[(Purpose is to TEST)]** --> boundary forces
    // tmpForce () {
    //     this.applyForce(createVector(0.1, 0.01));
    // }

    seek(target) {
        // ------ Force [Version] ------
        // let force = p5.Vector.sub(target, this.position);
        // force.setMag(this.maxVelocity);
        // force.limit(this.maxForce)
        // this.applyForce(force);

        let desired = p5.Vector.sub(target, this.position);
        desired.setMag(this.maxVelocity);

        let steering = p5.Vector.sub(desired, this.velocity);
        steering.limit(this.maxForce);

        return steering;
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    update() {
        this.health -= 0.004;

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxVelocity);
        this.position.add(this.velocity);
        this.acceleration.set(0, 0);
    }

    show() {
        let colorGreen = color(0, 255, 0);
        let colorRed = color(255, 0, 0);
        let creatureColor = lerpColor(colorRed, colorGreen, this.health);

        stroke(creatureColor);
        strokeWeight(1);
        fill(creatureColor);

        push();

        // Triangle shape
        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading());
        triangle(-this.radius, -this.radius / 2, -this.radius, this.radius / 2, this.radius, 0);

        // let longerDNA;
        // let shorterDNA;
        // let longerColor;
        // let shorterColor;
        // if (this.dna[0] > this.dna[1]) {
        //     longerDNA = this.dna[0];
        //     shorterDNA = this.dna[1];
        //     longerColor = 'lime';
        //     shorterColor = 'red';
        // }
        // else {
        //     longerDNA = this.dna[1];
        //     shorterDNA = this.dna[0];
        //     longerColor = 'red';
        //     shorterColor = 'lime';
        // }

        if (debug.checked() === true) {
            noFill();

            // Food Indicator
            stroke(0, 255, 0);
            strokeWeight(2);
            line(0, 0, this.dna[0] * 50, 0);
            // Food Perception
            ellipse(0, 0, this.dna[2] * 3);

            // Poison Indicator
            stroke(255, 0, 0);
            strokeWeight(1);
            line(0, 0, this.dna[1] * 50, 0);
            // Poison Perception
            ellipse(0, 0, this.dna[3] * 3);
        }
        // stroke('lime');

        pop();
    }

    eat(list, nutrition, perception) {
        let record = Infinity;
        let closestIndex = -1;

        for (let i = list.length-1; i >= 0; i--) {
            let distance = this.position.dist(list[i]);

            if (distance < record && distance <= perception) {
                record = distance;
                closestIndex = i;
            }
        }

        // Eating radius
        if (record < this.radius) {
            list.splice(closestIndex, 1);
            this.health += nutrition;
        }
        else if (closestIndex !== -1) {
            return this.seek(list[closestIndex]);
        }

        return createVector(0, 0);
    }

    clone () {
        if (this.health > 1) {
            this.health -= 0.5;
            return new Creature(this.position.x, this.position.y, this.dna);
        }
        else {
            return null;
        }
    }

    dead () {
        return this.health < 0;
    }
}