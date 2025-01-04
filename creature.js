class Creature {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.maxVelocity = 2;
        this.maxForce = 0.2;
        this.radius = 12;

        this.dna = [1.075, -1];
        // this.dna[0] = random(-5, 5);
        // this.dna[1] = random(-5, 5);
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