// --- 1. PRELOADER ---
const preloader = document.getElementById('preloader');
const text = document.querySelector('.loader-text');
const line = document.querySelector('.loader-line');

let load = 0;
function loading() {
    load += Math.random() * 2;
    if (load > 99) load = 100;
    
    text.innerHTML = Math.floor(load).toString().padStart(2, '0');
    line.style.width = load + '%';

    if (load < 100) {
        requestAnimationFrame(loading);
    } else {
        setTimeout(() => {
            preloader.style.transform = 'translateY(-100%)';
        }, 600);
    }
}
loading();

// --- 2. 3D ROTATING SPHERE (The "Brain" Effect) ---
const canvas = document.getElementById('sphereCanvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

// Sphere Config
const PERSPECTIVE = width * 0.8; // The "camera lens"
const PROJECTION_CENTER_X = width / 2;
const PROJECTION_CENTER_Y = height / 2;
const GLOBE_RADIUS = width < 600 ? width * 0.4 : 300; // Responsive radius
const DOT_RADIUS = 1.5;

// Generate Points on a Sphere (Fibonacci Sphere Algorithm for even distribution)
const particles = [];
const PARTICLE_COUNT = 900; // Density of the sphere

for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Math to place points evenly on a sphere surface
    const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
    const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
    
    particles.push({
        x: GLOBE_RADIUS * Math.cos(theta) * Math.sin(phi),
        y: GLOBE_RADIUS * Math.sin(theta) * Math.sin(phi),
        z: GLOBE_RADIUS * Math.cos(phi),
        xProjected: 0,
        yProjected: 0,
        scaleProjected: 0 // Size changes based on depth (z-axis)
    });
}

function render() {
    ctx.clearRect(0, 0, width, height);
    
    // Rotation speed
    const rotationX = 0.001; 
    const rotationY = 0.002;

    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Rotate the point in 3D space
        // Rotate around Y axis
        let y = p.y;
        let z = p.z * Math.cos(rotationX) - p.x * Math.sin(rotationX);
        let x = p.z * Math.sin(rotationX) + p.x * Math.cos(rotationX);
        
        // Rotate around X axis
        let z_new = z * Math.cos(rotationY) - y * Math.sin(rotationY);
        let y_new = z * Math.sin(rotationY) + y * Math.cos(rotationY);
        
        // Update particle coords
        p.x = x; p.y = y_new; p.z = z_new;

        // 2. Project 3D point to 2D screen
        // Scale based on depth (things further away are smaller)
        const scale = PERSPECTIVE / (PERSPECTIVE + z_new + GLOBE_RADIUS); 
        p.xProjected = (x * scale) + PROJECTION_CENTER_X;
        p.yProjected = (y_new * scale) + PROJECTION_CENTER_Y;
        p.scaleProjected = scale;

        // 3. Draw the particle
        // Fade out particles at the back of the sphere for depth effect
        const alpha = Math.max(0, (scale - 0.5) * 1.5); 
        
        ctx.fillStyle = `rgba(120, 100, 255, ${alpha})`; // HydroBlaze Blue/Purple
        ctx.beginPath();
        ctx.arc(p.xProjected, p.yProjected, DOT_RADIUS * scale, 0, Math.PI * 2);
        ctx.fill();
    }
    
    requestAnimationFrame(render);
}

render();

// --- 3. UI INTERACTIONS ---
// Spotlight Effect
const cards = document.querySelectorAll('.card');
document.addEventListener('mousemove', e => {
    // Update cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
    
    cursorOutline.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
    }, { duration: 400, fill: "forwards" });

    // Update Card Glow
    for(const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    }
});

// Resize Handler
window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});
