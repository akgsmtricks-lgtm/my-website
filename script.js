document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navbar Toggle Logic
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // 2. Interactive 3D Card Tilt Physics
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            const dx = (x - xc) / 14;
            const dy = (y - yc) / 14;
            card.style.transform = `perspective(1000px) rotateX(${-dy}deg) rotateY(${dx}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // 3. Dynamic Number Counter on Scroll
    const counters = document.querySelectorAll('[data-target]');
    let hasCounted = false;

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + window.innerHeight;
        const targetSection = document.querySelector('section');
        if (!targetSection) return;
        
        const triggerPos = targetSection.offsetTop + 180;
        if (scrollPos > triggerPos && !hasCounted) {
            hasCounted = true;
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                let count = 0;
                const step = Math.max(1, Math.floor(target / 45));
                
                const updateCounter = () => {
                    count += step;
                    if (count < target) {
                        counter.innerText = count + (target === 99 ? '%' : '+');
                        setTimeout(updateCounter, 25);
                    } else {
                        counter.innerText = target + (target === 99 ? '%' : '+');
                    }
                };
                updateCounter();
            });
        }
    });

    // 4. Particle & Live HUD Coordinates Background
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let mouse = { x: null, y: null };

        function resizeCanvas() {
            if (!canvas.parentElement) return;
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;

            const hudCoords = document.getElementById('hud-coords');
            if (hudCoords && mouse.x !== null && mouse.y !== null) {
                const coordX = (mouse.x * 0.08).toFixed(3);
                const coordY = (mouse.y * 0.08).toFixed(3);
                hudCoords.innerText = `X: ${coordX} Y: ${coordY} Z: 14.250`;
            }
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        const colors = ['#0066ff', '#00f0ff', '#38bdf8', '#818cf8'];
        for (let i = 0; i < 90; i++) {
            particles.push({
                x: Math.random() * (width || window.innerWidth),
                y: Math.random() * (height || window.innerHeight),
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        function renderEngineParticles() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        p.x -= (dx / dist) * 2;
                        p.y -= (dy / dist) * 2;
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = p.color;
                ctx.fill();
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        const alpha = 0.18 * (1 - dist / 100);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 102, 255, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(renderEngineParticles);
        }
        renderEngineParticles();
    }

    // 5. Project Inquiry Form Submission
    const form = document.getElementById('project-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const service = document.getElementById('form-service').value;
            const urgency = document.getElementById('form-urgency').value;
            const message = document.getElementById('form-message').value;

            const recipient = "engineering@apexmech.dev";
            const subject = encodeURIComponent(`Project Inquiry / CAD Registration: ${service} - ${name}`);
            const body = encodeURIComponent(
                `Client / Engineer Name: ${name}\n` +
                `Email: ${email}\n` +
                `Service / Course: ${service}\n` +
                `Timeline: ${urgency}\n\n` +
                `Project Specifications / Goals:\n${message}\n\n` +
                `Sent via ApexMech Engineering Web Portal`
            );

            window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
        });
    }
});

// Inspector Simulation View Switcher
function setInspectorMode(mode) {
    const icon = document.getElementById('inspector-icon');
    const title = document.getElementById('inspector-title');
    const desc = document.getElementById('inspector-desc');
    
    ['mesh', 'cad', 'deviation'].forEach(m => {
        const btn = document.getElementById(`btn-${m}`);
        if (btn) {
            btn.className = "px-5 py-2.5 rounded-xl text-xs font-semibold bg-dark border border-slate-800 text-slate-300 hover:border-blue-400 transition";
        }
    });

    const activeBtn = document.getElementById(`btn-${mode}`);
    if (activeBtn) {
        activeBtn.className = "px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 text-white transition shadow-md";
    }

    if (mode === 'mesh') {
        if (icon) icon.innerText = "📡";
        if (title) title.innerText = "Raw STL Mesh Point Cloud";
        if (desc) desc.innerText = "1,240,000 Triangles Captured • Structured Optical Laser Scanner";
    } else if (mode === 'cad') {
        if (icon) icon.innerText = "📐";
        if (title) title.innerText = "Parametric Solid Model (STEP / SolidWorks)";
        if (desc) desc.innerText = "Feature Trees Extracted • Surfaces Fitted • Tolerances Verified";
    } else if (mode === 'deviation') {
        if (icon) icon.innerText = "🎯";
        if (title) title.innerText = "Color Deviation Metrology Heatmap";
        if (desc) desc.innerText = "Nominal CAD vs. Manufactured Part • Max Deviation: +0.008 mm / -0.004 mm";
    }
}