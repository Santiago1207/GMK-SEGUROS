// Archivo: particulas-equipo.js
(function () {
    'use strict';

    // Verifica que el elemento .equipo exista antes de ejecutar el script
    const section = document.querySelector('.equipo');
    if (!section) return; // Si no existe la sección, no se ejecuta nada

    const canvas = document.createElement('canvas');
    canvas.className = 'equipo__canvas';
    section.insertBefore(canvas, section.firstChild);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let mouse = { x: null, y: null, radius: 150 };

    // Configuración usando colores GMK
    const config = {
        particleCount: window.innerWidth < 768 ? 25 : 45,
        connectionDistance: 120,
        colors: [
            'rgba(179, 157, 219, 0.6)', // --color-primary-lighter
            'rgba(123, 31, 162, 0.4)',   // --color-primary-light
            'rgba(255, 179, 0, 0.3)',    // --color-accent (dorado sutil)
            'rgba(255, 255, 255, 0.5)'   // blanco
        ]
    };

    function resize() {
        canvas.width = section.offsetWidth;
        canvas.height = section.offsetHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = (Math.random() - 0.5) * 0.8;
            this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
            this.opacity = Math.random() * 0.5 + 0.3;
        }

        update() {
            // Movimiento base
            this.x += this.speedX;
            this.y += this.speedY;

            // Rebote en bordes
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Interacción con mouse (efecto repulsión suave)
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const directionX = dx / distance;
                    const directionY = dy / distance;
                    this.x -= directionX * force * 2;
                    this.y -= directionY * force * 2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connect() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(179, 157, 219, ${0.2 * (1 - distance / config.connectionDistance)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        connect();
        animationId = requestAnimationFrame(animate);
    }

    // Event listeners
    window.addEventListener('resize', () => {
        resize();
        init();
    });

    section.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    section.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Inicialización
    resize();
    init();
    animate();
})();