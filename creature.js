class Creature {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.maxVelocity = 2;
        this.maxForce = 0.2;
        this.radius = 8;

        this.health = 1;

        this.dna = [];
        // Food weight
        this.dna[0] = random(-1, 1.5);
        // Poison weight
        this.dna[1] = random(-1, 1.5);
        // Food perception
        this.dna[2] = random(0, 100);
        // Poison perception
        this.dna[3] = random(0, 100);
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
        let steeringGood = this.eat(good, 0.2, this.dna[2]);
        let steeringBad = this.eat(bad, -0.5, this.dna[3]);

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
        this.health -= 0.005;

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

        // stroke('lime');

        noFill();

        // Food Indicator
        stroke(0, 255, 0);
        line(0, 1, this.dna[0] * 50, 0);
        // Food Perception
        ellipse(0, 0, this.dna[2] * 3);

        // Poison Indicator
        stroke(255, 0, 0);
        line(0, -1, this.dna[1] * 50, 0);
        // Poison Perception
        ellipse(0, 0, this.dna[3] * 3);

        pop();
    }

    eat(list, nutrition, perception) {
        let record = Infinity;
        let closestIndex = -1;

        for (let i = 0; i < list.length; i++) {
            let distance = this.position.dist(list[i]);

            if (distance < record) {
                record = distance;
                closestIndex = i;
            }
        }

        if (record < 5 && record < perception) {
            list.splice(closestIndex, 1);
            this.health += nutrition;
        }
        else if (closestIndex !== -1) {
            return this.seek(list[closestIndex]);
        }

        return createVector(0, 0);
    }

    dead () {
        return this.health < 0;
    }
}