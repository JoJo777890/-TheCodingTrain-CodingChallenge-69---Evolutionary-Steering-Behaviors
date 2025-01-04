let food = [];
let poison = [];
let creatures = [];

let boundaryDistance = 50;

function setup() {
    let width = 1100;
    let height = 700;
    createCanvas(width, height);
    let amountOfFood = 100;

    for (let i = 0; i < amountOfFood; i++) {
        let x = random(width);
        let y = random(height);
        food.push(createVector(x, y));
    }

    for (let i = 0; i < amountOfFood; i++) {
        let x = random(width);
        let y = random(height);
        poison.push(createVector(x, y));
    }

    for (let i = 0; i < 10; i++) {
        creatures[i] = new Creature(random(width), random(height));
    }
    // creature = new Creature(100, 100);
}

function draw() {
    background(51);

    if (random(0, 1) < 0.05) {
        let x = random(width);
        let y = random(height);
        food.push(createVector(x, y));
    }

    for (let i = 0; i < food.length; i++) {
        fill(0, 255, 0);
        noStroke();
        ellipse(food[i].x, food[i].y, 4, 4);
    }

    for (let i = 0; i < poison.length; i++) {
        fill(255, 0, 0);
        noStroke();
        ellipse(poison[i].x, poison[i].y, 4, 4);
    }

    for (let i = creatures.length-1; i >= 0; i--) {
        creatures[i].boundaries(boundaryDistance);
        creatures[i].behavior(food, poison);

        // **[(Purpose is to TEST)]** --> boundary forces
        // creatures[i].tmpForce();

        creatures[i].update();
        creatures[i].show();

        if (creatures[i].dead()) {
            creatures.splice(i, 1);
        }
    }
}