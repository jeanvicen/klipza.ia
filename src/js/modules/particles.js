/* ==========================================
   klipza.ia - Particles System
   ========================================== */

const canvas = document.getElementById('starborne-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let rippleX = 0, rippleY = 0;
let animationId = null;
let lastFrameTime = 0;
let isInBackground = false;

const particleConfig = {
    connectRadius: 80,
    lineAlphaFactor: 0.6,
    decayRate: 0.98,
    cameraZ: 400
};

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.n = Math.floor(Math.random() * 3) + 1;
        this.a = Math.random() * 5 + 2;
        this.radius = Math.random() * 200 + 50;
        this.omega = (Math.random() * 0.01) - 0.005;
        this.theta = Math.random() * Math.PI * 2;
        this.color = `hsla(${this.radius / 200 * 60 + 270}, 100%, 70%, 0.8)`;
        this.screenX = 0;
        this.screenY = 0;
        this.z = 0;
    }

    update(time) {
        this.theta += 0.01;
        const r = this.radius + this.a * Math.cos(this.n * this.theta + this.omega * time);
        const x = r * Math.cos(this.theta);
        const y = r * Math.sin(this.theta);
        this.z = r * Math.sin(this.theta * 0.5);
        const scale = particleConfig.cameraZ / (particleConfig.cameraZ - this.z);
        this.screenX = canvas.width / 2 + x * scale;
        this.screenY = canvas.height / 2 + y * scale;
    }
}

function initParticles() {
    const count = AppState.settings.focusMode ? 50 : AppState.settings.particleDensity;
    particles = Array.from({ length: count }, () => new Particle());
}

function animateParticles(timestamp) {
    if (!canvas || !ctx) {
        animationId = requestAnimationFrame(animateParticles);
        return;
    }
    if (isInBackground) {
        animationId = requestAnimationFrame(animateParticles);
        return;
    }
    if (timestamp - lastFrameTime < 16) {
        animationId = requestAnimationFrame(animateParticles);
        return;
    }
    lastFrameTime = timestamp;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const time = timestamp;
    particles.forEach(p => {
        p.theta += rippleX * 0.01;
        p.theta += rippleY * 0.01;
        p.update(time);
    });

    rippleX *= particleConfig.decayRate;
    rippleY *= particleConfig.decayRate;

    if (!AppState.settings.focusMode) {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].screenX - particles[j].screenX;
                const dy = particles[i].screenY - particles[j].screenY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < particleConfig.connectRadius) {
                    const alpha = (1 - dist / particleConfig.connectRadius) * particleConfig.lineAlphaFactor;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].screenX, particles[i].screenY);
                    ctx.lineTo(particles[j].screenX, particles[j].screenY);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.screenX, p.screenY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
    });

    animationId = requestAnimationFrame(animateParticles);
}

if (canvas) {
    canvas.addEventListener('pointermove', (e) => {
        const dx = e.clientX - canvas.width / 2;
        const dy = e.clientY - canvas.height / 2;
        rippleX = dx * 0.0001;
        rippleY = dy * 0.0001;
    });
}

document.addEventListener('visibilitychange', () => {
    isInBackground = document.hidden;
});

window.addEventListener('resize', () => {
    resizeCanvas();
});
