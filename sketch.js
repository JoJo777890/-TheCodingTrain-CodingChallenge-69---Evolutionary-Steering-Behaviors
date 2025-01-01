let qtree;
let food = [];

function setup() {
    let width = 800;
    let height = 600;
    createCanvas(width, height);

    for (let i = 0; i < 10; i++) {
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

    fill(255, 0, 0);
    noStroke()

    let target = createVector(mouseX, mouseY);
    circle(target.x, target.y, 4);

    vehicle.seek(target);
    vehicle.update();
    vehicle.show();
}