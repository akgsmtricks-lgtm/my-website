document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Drawer Navigation
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

    // 2. Interactive 3D Card Physics
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

    // 4. Particle Background & Live HUD Coordinates
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

    // 5. Quote Inquiry Form Dispatch
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

    // 6. Check and Trigger Automated Festival Greeting
    checkFestivalGreeting();
});

// Viewport Switcher for Scan Inspector Simulator
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

// 7. Automated Indian Festival & Govt Holiday Engine with Dynamic Artwork & Particle Canvas
let animReqId = null;

function checkFestivalGreeting() {
    if (sessionStorage.getItem('dismissed_festival_banner') === 'true') {
        return;
    }

    const today = new Date();
    const currentYear = today.getFullYear();

    // Universal Fixed Solar & National Holidays (Runs automatically every single year)
    const fixedHolidays = [
        { name: "New Year's Day", icon: "✨", theme: "gold", month: 0, day: 1, msg: "Team ApexMech wishes you a prosperous, innovative, and joyful New Year!" },
        { name: "Makar Sankranti & Pongal", icon: "🪁", theme: "harvest", month: 0, day: 14, msg: "Wishing you and your family abundant happiness, prosperity, and success this Makar Sankranti!" },
        { name: "Republic Day", icon: "🇮🇳", theme: "tricolor", month: 0, day: 26, msg: "Saluting Indian engineering ingenuity, unity, and progress. Happy Republic Day!" },
        { name: "Dr. B.R. Ambedkar Jayanti", icon: "⚖️", theme: "blue", month: 3, day: 14, msg: "Honoring the legacy of Dr. B.R. Ambedkar and the principles of equality, knowledge, and integrity." },
        { name: "May Day / Workers' Day", icon: "🛠️", theme: "blue", month: 4, day: 1, msg: "Saluting the dedication and skill of the engineers and craftsmen building our future!" },
        { name: "Telangana Formation Day", icon: "🏛️", theme: "gold", month: 5, day: 2, msg: "Happy Telangana Formation Day! Proud to engineer and innovate from Hyderabad." },
        { name: "Independence Day", icon: "🇮🇳", theme: "tricolor", month: 7, day: 15, msg: "Celebrating freedom, sovereign innovation, and nation-building engineering. Happy Independence Day!" },
        { name: "Mahatma Gandhi Jayanti", icon: "👓", theme: "tricolor", month: 9, day: 2, msg: "Remembering the Father of the Nation and his eternal ideals of truth, peace, and simplicity." },
        { name: "Christmas Day", icon: "🎄", theme: "festive-red", month: 11, day: 25, msg: "Season's greetings! Wishing you a Merry Christmas and continuous success in the coming year." }
    ];

    // Multi-Year Lunar / Tithi-based Calendar Definitions
    const lunarHolidaysByYear = {
        2026: [
            { name: "Maha Shivaratri", icon: "🕉️", theme: "divine-blue", month: 1, day: 15, msg: "Wishing you peace, determination, and divine blessings on Maha Shivaratri." },
            { name: "Holi", icon: "🎨", theme: "holi-color", month: 2, day: 3, msg: "May your journey be filled with vibrant happiness, colors, and creative breakthroughs. Happy Holi!" },
            { name: "Ugadi / Gudi Padwa", icon: "🌿", theme: "green-gold", month: 2, day: 19, msg: "Wishing you a bountiful, joyful, and successful Telugu New Year! Happy Ugadi." },
            { name: "Eid-ul-Fitr", icon: "🌙", theme: "islamic-green", month: 2, day: 21, msg: "May this blessed occasion bring harmony, good health, and success. Eid Mubarak!" },
            { name: "Sri Rama Navami", icon: "🏹", theme: "gold", month: 2, day: 26, msg: "Wishing you strength, wisdom, and righteousness on the auspicious occasion of Sri Rama Navami." },
            { name: "Vinayaka Chavithi (Ganesh Chaturthi)", icon: "🐘", theme: "ganesh-orange", month: 8, day: 14, msg: "May Lord Ganesha eliminate every obstacle and illuminate your ventures with prosperity!" },
            { name: "Vijaya Dashami (Dussehra)", icon: "🏹", theme: "dussehra-gold", month: 9, day: 20, msg: "Celebrating the triumph of wisdom, truth, and perseverance. Happy Dussehra from ApexMech!" },
            { name: "Deepavali (Diwali)", icon: "🪔", theme: "diwali-glow", month: 10, day: 8, msg: "Wishing you and your family a luminous, sparkling, and prosperous Diwali! Warm wishes from Team ApexMech." }
        ],
        2027: [
            { name: "Maha Shivaratri", icon: "🕉️", theme: "divine-blue", month: 2, day: 6, msg: "Wishing you peace, determination, and divine blessings on Maha Shivaratri." },
            { name: "Holi", icon: "🎨", theme: "holi-color", month: 2, day: 22, msg: "May your journey be filled with vibrant happiness and colors. Happy Holi!" },
            { name: "Ugadi / Gudi Padwa", icon: "🌿", theme: "green-gold", month: 3, day: 7, msg: "Wishing you a fruitful, joyous, and successful Telugu New Year! Happy Ugadi." },
            { name: "Eid-ul-Fitr", icon: "🌙", theme: "islamic-green", month: 2, day: 10, msg: "May this blessed occasion bring harmony, peace, and health. Eid Mubarak!" },
            { name: "Vinayaka Chavithi (Ganesh Chaturthi)", icon: "🐘", theme: "ganesh-orange", month: 8, day: 4, msg: "May Lord Ganesha bless your path with wisdom and achievement!" },
            { name: "Vijaya Dashami (Dussehra)", icon: "🏹", theme: "dussehra-gold", month: 9, day: 10, msg: "Celebrating the victory of excellence and truth. Happy Dussehra!" },
            { name: "Deepavali (Diwali)", icon: "🪔", theme: "diwali-glow", month: 9, day: 29, msg: "Wishing you and your family a luminous and prosperous Diwali! Greetings from ApexMech." }
        ]
    };

    // Combine universal fixed events with year-specific calendar
    const activeHolidays = [...fixedHolidays, ...(lunarHolidaysByYear[currentYear] || [])];
    const oneDayMS = 24 * 60 * 60 * 1000;

    for (const fest of activeHolidays) {
        const festDate = new Date(currentYear, fest.month, fest.day, 0, 0, 0);
        const diffDays = (today - festDate) / oneDayMS;

        // Condition: Exactly 1 day before (-1.0) through 1 day after (+1.99)
        if (diffDays >= -1.0 && diffDays <= 1.99) {
            setupFestiveTheme(fest);
            break;
        }
    }
}

// Injects custom SVG vector artwork, animated color gradients, and particle flows
function setupFestiveTheme(fest) {
    const banner = document.getElementById('festival-banner');
    const iconEl = document.getElementById('festival-icon');
    const titleEl = document.getElementById('festival-title');
    const msgEl = document.getElementById('festival-message');
    const bgEl = document.getElementById('festival-bg');
    const headerSvg = document.getElementById('festival-svg-header');

    if (!banner || !iconEl || !titleEl || !msgEl || !bgEl || !headerSvg) return;

    iconEl.innerText = fest.icon;
    titleEl.innerText = `Happy ${fest.name}!`;
    msgEl.innerText = fest.msg;

    // Theme Graphics & Gradients
    if (fest.theme === 'diwali-glow') {
        bgEl.className = "absolute inset-0 bg-gradient-to-br from-amber-950 via-slate-950 to-orange-950 z-0";
        headerSvg.innerHTML = `
            <svg class="w-full h-full" viewBox="0 0 400 120" fill="none">
                <radialGradient id="diwaliGlow" cx="50%" cy="80%" r="65%">
                    <stop offset="0%" stop-color="#ff9900" stop-opacity="0.85"/>
                    <stop offset="100%" stop-color="#ff6600" stop-opacity="0"/>
                </radialGradient>
                <rect width="400" height="120" fill="url(#diwaliGlow)"/>
                <circle cx="200" cy="85" r="45" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 2"/>
                <circle cx="200" cy="85" r="30" stroke="#fbbf24" stroke-width="1.5"/>
                <path d="M 175 85 Q 200 106 225 85 Z" fill="#b45309" stroke="#f59e0b" stroke-width="1.5"/>
                <path d="M 200 58 Q 207 72 200 85 Q 193 72 200 58 Z" fill="#fbbf24" class="animate-pulse"/>
                <circle cx="200" cy="74" r="3.5" fill="#ffffff"/>
            </svg>`;
        startFestiveAnimation('sparks');
    } else if (fest.theme === 'tricolor') {
        bgEl.className = "absolute inset-0 bg-gradient-to-br from-[#101c10] via-slate-950 to-[#271506] z-0";
        headerSvg.innerHTML = `
            <svg class="w-full h-full" viewBox="0 0 400 120" fill="none">
                <rect x="0" y="20" width="400" height="25" fill="#ff9933" fill-opacity="0.25"/>
                <rect x="0" y="45" width="400" height="25" fill="#ffffff" fill-opacity="0.15"/>
                <rect x="0" y="70" width="400" height="25" fill="#138808" fill-opacity="0.25"/>
                <circle cx="200" cy="57" r="16" stroke="#0080ff" stroke-width="1.5"/>
                <circle cx="200" cy="57" r="2.5" fill="#0080ff"/>
            </svg>`;
        startFestiveAnimation('confetti');
    } else if (fest.theme === 'holi-color') {
        bgEl.className = "absolute inset-0 bg-gradient-to-br from-pink-950 via-slate-950 to-purple-950 z-0";
        headerSvg.innerHTML = `
            <svg class="w-full h-full" viewBox="0 0 400 120" fill="none">
                <circle cx="90" cy="60" r="45" fill="#ec4899" fill-opacity="0.3" class="filter blur-xl"/>
                <circle cx="200" cy="50" r="50" fill="#eab308" fill-opacity="0.3" class="filter blur-xl"/>
                <circle cx="310" cy="60" r="45" fill="#06b6d4" fill-opacity="0.3" class="filter blur-xl"/>
                <text x="200" y="68" fill="#f43f5e" font-size="28" text-anchor="middle" font-weight="bold" letter-spacing="4">FESTIVAL OF COLORS</text>
            </svg>`;
        startFestiveAnimation('splash');
    } else if (fest.theme === 'ganesh-orange' || fest.theme === 'dussehra-gold' || fest.theme === 'harvest') {
        bgEl.className = "absolute inset-0 bg-gradient-to-br from-amber-950 via-slate-950 to-yellow-950 z-0";
        headerSvg.innerHTML = `
            <svg class="w-full h-full" viewBox="0 0 400 120" fill="none">
                <circle cx="200" cy="60" r="40" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="6 3"/>
                <path d="M 160 60 Q 200 20 240 60 Q 200 100 160 60 Z" stroke="#eab308" stroke-width="2" fill="#f59e0b" fill-opacity="0.1"/>
            </svg>`;
        startFestiveAnimation('petals');
    } else {
        bgEl.className = "absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-cyan-950 z-0";
        headerSvg.innerHTML = `
            <svg class="w-full h-full" viewBox="0 0 400 120" fill="none">
                <path d="M 40 60 Q 200 10 360 60 Q 200 110 40 60 Z" stroke="#00f0ff" stroke-width="1.5" stroke-dasharray="4 2"/>
            </svg>`;
        startFestiveAnimation('stars');
    }

    banner.classList.remove('hidden');
}

// Particle Physics Simulation Canvas
function startFestiveAnimation(animType) {
    const canvas = document.getElementById('festival-anim-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.offsetWidth || 340;
    canvas.height = canvas.parentElement.offsetHeight || 300;

    if (animReqId) cancelAnimationFrame(animReqId);

    const particles = [];
    const colors = animType === 'confetti' 
        ? ['#ff9933', '#ffffff', '#138808', '#00f0ff'] 
        : animType === 'sparks' 
        ? ['#fbbf24', '#f59e0b', '#f97316', '#ffedd5'] 
        : animType === 'splash'
        ? ['#ec4899', '#8b5cf6', '#eab308', '#06b6d4']
        : ['#38bdf8', '#fbbf24', '#a78bfa', '#ffffff'];

    for (let i = 0; i < 35; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedY: Math.random() * 1.2 + 0.3,
            speedX: (Math.random() - 0.5) * 0.8,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.8 + 0.2
        });
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.y -= p.speedY; // floats upwards like luminous sparks
            p.x += p.speedX;

            if (p.y < 0) {
                p.y = canvas.height;
                p.x = Math.random() * canvas.width;
            }

            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        animReqId = requestAnimationFrame(render);
    }
    render();
}

function dismissFestivalBanner() {
    const banner = document.getElementById('festival-banner');
    if (banner) {
        banner.classList.add('hidden');
        sessionStorage.setItem('dismissed_festival_banner', 'true');
        if (animReqId) cancelAnimationFrame(animReqId);
    }
}