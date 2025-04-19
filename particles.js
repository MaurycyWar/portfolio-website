const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];
const numberOfParticles = 100;

class Particle {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.targetSize = size;
        this.speed = .005;
        this.velocityX = 0;
        this.velocityY = 0;
        this.maxVelocity = .25;
        this.directionX = 0;
        this.directionY = 0;
        this.counter = 0;
        this.maxCounter = 10;
    }
    update() {
        if (this.y > canvas.height + this.size)
            this.y = 0 - this.size;
        if (this.y < 0 - this.size)
            this.y = canvas.height + this.size;
        if (this.x > canvas.width + this.size)
            this.x = 0 - this.size;
        if (this.x < 0 - this.size)
            this.x = canvas.width + this.size;

        this.velocityX = Math.max(Math.min(this.velocityX + this.speed * this.directionX * deltaTime, this.maxVelocity), -this.maxVelocity);
        this.velocityY = Math.max(Math.min(this.velocityY + this.speed * this.directionY * deltaTime, this.maxVelocity), -this.maxVelocity);
        this.y += this.velocityY;
        this.x += this.velocityX;

        if (this.size < this.targetSize)
            this.size += .01;
        else if (this.size > this.targetSize)
            this.size -= .01;
        
        if (Math.abs(this.targetSize - this.size) < 1) {
            this.targetSize = 3 + Math.random() * 15;
        }

        this.counter++;
        if (this.counter > this.maxCounter) {
            this.counter = 0;
            this.maxCounter = Math.round(60 + Math.random() * 60);

            this.velocityX /= 2;
            this.velocityY /= 2;
            this.directionY = -1 + Math.round(Math.random()) * 2;
            this.directionX = -1 + Math.round(Math.random()) * 2;
        }

        this.draw();
    }
    draw() {
        ctx.fillStyle = '#ffffff80';
        ctx.beginPath();
        ctx.moveTo(this.x-this.size/2, this.y+this.size/2);
        ctx.lineTo(this.x, this.y-this.size/2);
        ctx.lineTo(this.x+this.size/2, this.y+this.size/2);
        // ctx.arc(this.x, this.y, this.size, 0, 360);
        ctx.closePath();
        ctx.fill();
    }
}

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = 3 + Math.random() * 15;
        particlesArray.push(new Particle(x, y, size));
    }
}

function handleParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();

        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx**2 + dy**2);

            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = '#ffffff60';
                ctx.lineWidth = Math.min(particlesArray[i].size, particlesArray[j].size) * 10 / Math.max(distance,20);
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
}

let lastTime = 0;
const fps = 60;
const nextFrame = 1000/fps;
let timer = 0;
let deltaTime = 0;

function animate(timeStamp) {
    deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    if (timer > nextFrame) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        handleParticles();

        timer = 0;
    } else {
        timer += deltaTime;
    }

    // particlesArray.forEach(element => {
    //     element.update();
    // });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    init();
})

init();
animate(0);