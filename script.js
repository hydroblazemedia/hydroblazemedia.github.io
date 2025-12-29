const canvas = document.getElementById('sphereCanvas');
const ctx = canvas.getContext('2d');

let w = window.innerWidth;
let h = window.innerHeight;
canvas.width = w;
canvas.height = h;

const CENTER_X = w / 2;
const CENTER_Y = h / 2;
const RADIUS = 300;
const PERSPECTIVE = w * 0.8;
const DOTS = 800;

const particles = [];

for (let i = 0; i < DOTS; i++) {
    const phi = Math.acos(-1 + (2 * i) / DOTS);
    const theta = Math.sqrt(DOTS * Math.PI) * phi;

    particles.push({
        x: RADIUS * Math.cos(theta) * Math.sin(phi),
        y: RADIUS * Math.sin(theta) * Math.sin(phi),
        z: RADIUS * Math.cos(phi)
    });
}

function animate() {
    ctx.clearRect(0,0,w,h);

    particles.forEach(p => {
        const scale = PERSPECTIVE / (PERSPECTIVE + p.z + RADIUS);
        const x2d = p.x * scale + CENTER_X;
        const y2d = p.y * scale + CENTER_Y;

        ctx.fillStyle = `rgba(120,100,255,${scale})`;
        ctx.beginPath();
        ctx.arc(x2d,y2d,1.5*scale,0,Math.PI*2);
        ctx.fill();

        const rot = 0.002;
        const x = p.x * Math.cos(rot) - p.z * Math.sin(rot);
        const z = p.x * Math.sin(rot) + p.z * Math.cos(rot);
        p.x = x; p.z = z;
    });

    requestAnimationFrame(animate);
}

animate();
