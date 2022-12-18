// setup canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number
function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}
//Tran Ngo Tuan Kiet 20521505
class Shape {
    constructor(x, y, velX, velY, exists) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.exists = exists;
    }
}
class Ball extends Shape {
    constructor(x, y, velX, velY, color, size, exists) {
        super(x, y, velX, velY, exists);
        this.color = color;
        this.size = size;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
    update() {
        if (this.x + this.size >= width) {
            this.velX = -this.velX;
        }
        if (this.x - this.size <= 0) {
            this.velX = -this.velX;
        }
        if (this.y + this.size >= height) {
            this.velY = -this.velY;
        }
        if (this.y - this.size <= 0) {
            this.velY = -this.velY;
        }
        this.x += this.velX;
        this.y += this.velY;
    }
    collisionDetect() {
        for (let j = 0; j < balls.length; j++) {
            if (!(this === balls[j]) && balls[j].exists) {
                const dx = this.x - balls[j].x;
                const dy = this.y - balls[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.size + balls[j].size) {
                    balls[j].color = this.color =
                        "rgb(" +
                        random(0, 255) +
                        "," +
                        random(0, 255) +
                        "," +
                        random(0, 255) +
                        ")";
                }
            }
        }
    }
}
class EvilCircle extends Shape {
    constructor(x, y, exists) {
        super(x, y, 20, 20, exists);
        this.color = "rgb(" + 255 + "," + 255 + "," + 255 + ")";
        this.size = 10;
    }
    draw() {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
    }
    checkBounds() {
        if (this.x + this.size >= width) {
            this.x = width - this.velX * 2;
            this.size = 15;
        }
        if (this.x - this.size <= 0) {
            this.x = this.velX * 2;
            this.size = 15;
        }
        if (this.y + this.size >= height) {
            this.y = height - this.velY * 2;
            this.size = 15;
        }
        if (this.y - this.size <= 0) {
            this.y = this.velY * 2;
            this.size = 15;
        }

    }
    setControls() {
        let _this = this;
        window.onkeydown = function (e) {
            if (e.key === "a") {
                _this.x -= _this.velX;
            } else if (e.key === "d") {
                _this.x += _this.velX;
            } else if (e.key === "w") {
                _this.y -= _this.velY;
            } else if (e.key === "s") {
                _this.y += _this.velY;
            }
        };
    }
    collisionDetect() {
        for (let j = 0; j < balls.length; j++) {
            if (balls[j].exists === true) {
                const dx = this.x - balls[j].x;
                const dy = this.y - balls[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.size + balls[j].size) {
                    balls[j].exists = false;
                    count--;
                }
            }
        }
    }
}

var count = 0;

let evilCircle = new EvilCircle(
    random(0 + 10, width - 10),
    random(0 + 10, height - 10),
    true);
evilCircle.setControls();

var balls = [];
while (balls.length < 25) {

    const size = random(10, 20);
    let ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas, to avoid drawing errors
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        "rgb(" + random(0, 255) + "," + random(0, 255) + "," + random(0, 255) + ")",
        size,
        true
    );
    count++;
    balls.push(ball);
}
function loop() {
    evilCircle.draw();
    evilCircle.size = 10;
    evilCircle.checkBounds();
    evilCircle.collisionDetect();
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists === true) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }
    document.querySelector("p").innerHTML ="Ball count: " + count;
    requestAnimationFrame(loop);
}
loop();

