let qtree;
let food = [];

function setup() {
    let width = 800;
    let height = 600;
    createCanvas(width, height);
    let amountOfFood = 20;

    for (let i = 0; i < amountOfFood; i++) {
        let x = random(width);
        let y = random(height);
        food.push(createVector(x, y));
    }

    vehicle = new Vehicle(100, 100);
}

function draw() {
    background(51);

    for (let i = 0; i < food.length; i++) {
        fill(0, 255, 0);
        noStroke();
        ellipse(food[i].x, food[i].y, 6, 6);
    }

    vehicle.eat(food);

    // vehicle.seek(target);
    vehicle.update();
    vehicle.show();
}