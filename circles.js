const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let mouse = {
    x: undefined,
    y: undefined,
    isDown: false
};

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mousedown', function() {
    mouse.isDown = true;
});

window.addEventListener('mouseup', function() {
    mouse.isDown = false;
});

class Circle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.PI;
        this.baseRadius = this.radius; 
        this.initialDx = (Math.random() - 0.5) * 0.5;
        this.initialDy = (Math.random() - 0.5) * 0.5;
        this.dx = this.initialDx;
        this.dy = this.initialDy;
        this.color = '#adadad';
    }

    draw() {
        if (mouse.isDown) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(255, 255, 255, 0.7)";
        } else {
            ctx.shadowBlur = 0;
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    drawLineToMouse() {
        let distX = this.x - mouse.x;
        let distY = this.y - mouse.y;
        let distance = Math.sqrt(distX * distX + distY * distY);
        const maxDistance = 100; 
        if (distance < maxDistance) {
            let transparency = 1 - distance / maxDistance;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${transparency})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.closePath();
        }
    }

    update() {
        let distX = this.x - mouse.x;
        let distY = this.y - mouse.y;
        let distance = Math.sqrt(distX * distX + distY * distY);
        if (mouse.isDown && distance < 100) {
            let repulsionForce = 1;
            this.dx += (distX / distance) * repulsionForce;
            this.dy += (distY / distance) * repulsionForce;
            this.radius = this.baseRadius * 1.5;
        } else {
            this.dx += (this.initialDx - this.dx) * 0.005;
            this.dy += (this.initialDy - this.dy) * 0.005;
            this.radius += (this.baseRadius - this.radius) * 0.1;
        }
        this.x += this.dx;
        this.y += this.dy;
        if (this.x > canvas.width + this.radius) this.x = -this.radius;
        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.y > canvas.height + this.radius) this.y = -this.radius;
        if (this.y < -this.radius) this.y = canvas.height + this.radius;
        this.draw(); 
        this.drawLineToMouse();
    }
}

const circlesArray = [];
for (let i = 0; i < 150; i++) {
    circlesArray.push(new Circle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circlesArray.forEach(circle => circle.update());
    requestAnimationFrame(animate);
}

animate();
