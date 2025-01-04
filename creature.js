class Creature {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.maxVelocity = 2;
        this.maxForce = 0.2;
        this.radius = 12;

        this.dna = [];
        // this.dna = [1, 2];
        this.dna[0] = random(-1, 1.5);
        this.dna[1] = random(-1, 1.5);
    }

    behavior(good, bad) {
        let steeringGood = this.eat(good);
        let steeringBad = this.eat(bad);

        steeringGood.mult((this.dna)[0]);
        steeringBad.mult(this.dna[1]);

        this.applyForce(steeringGood);
        this.applyForce(steeringBad);
    }

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
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxVelocity);
        this.position.add(this.velocity);
        this.acceleration.set(0, 0);
    }

    show() {
        stroke(255);
        strokeWeight(1);
        fill(127);

        push();
        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading());
        triangle(-this.radius, -this.radius / 2, -this.radius, this.radius / 2, this.radius, 0);

        let longerDNA;
        let shorterDNA;
        let longerColor;
        let shorterColor;
        if (this.dna[0] > this.dna[1]) {
            longerDNA = this.dna[0];
            shorterDNA = this.dna[1];
            longerColor = 'lime';
            shorterColor = 'red';
        }
        else {
            longerDNA = this.dna[1];
            shorterDNA = this.dna[0];
            longerColor = 'red';
            shorterColor = 'lime';
        }

        // stroke('lime');
        stroke(longerColor);
        line(0, 0, longerDNA * 50, 0);

        stroke(shorterColor);
        line(0, 0, shorterDNA * 50, 0);
        pop();
    }

    eat(list) {
        let record = Infinity;
        let closestIndex = -1;

        for (let i = 0; i < list.length; i++) {
            let distance = this.position.dist(list[i]);

            if (distance < record) {
                record = distance;
                closestIndex = i;
            }
        }

        if (record < 5) {
            list.splice(closestIndex, 1);
        }
        else if (closestIndex !== -1) {
            return this.seek(list[closestIndex]);
        }

        return createVector(0, 0);
    }

}