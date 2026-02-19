

const levels = {
    facile: [
        {name: "Rosso", value: "red"},
        {name: "Blu", value: "blue"},
        {name: "Verde", value: "green"}
    ],
    medio: [
        {name: "Rosso", value: "red"},
        {name: "Blu", value: "blue"},
        {name: "Verde", value: "green"},
        {name: "Giallo", value: "yellow"},
        {name: "Arancione", value: "orange"}
    ],
    difficile: [
        {name: "Ciano", value: "#00FFFF"},
        {name: "Beige", value: "#F5F5DC"},
        {name: "Ocra", value: "#CC7722"},
        {name: "Lilla", value: "#C8A2C8"},
        {name: "Turchese", value: "#40E0D0"},
        {name: "Salmone", value: "#FA8072"},
        {name: "Indaco", value: "#4B0082"}
    ],
    esperto: [
        {name: "Amaranto", value: "#E52B50"},
        {name: "Avorio", value: "#FFFFF0"},
        {name: "Chartreuse", value: "#7FFF00"},
        {name: "Magenta", value: "#FF00FF"},
        {name: "Corallo", value: "#FF7F50"},
        {name: "Verde Smeraldo", value: "#50C878"},
        {name: "Blu Petrolio", value: "#003366"},
        {name: "Grigio Ardesia", value: "#708090"},
        {name: "Ruggine", value: "#B7410E"},
        {name: "Malva", value: "#E0B0FF"}
    ],
    super: [
        {name: "Ceruleo", value: "#2A52BE"},
        {name: "Vermiglio", value: "#E34234"},
        {name: "Zafferano", value: "#F4C430"},
        {name: "Acquamarina", value: "#7FFFD4"},
        {name: "Prugna", value: "#8E4585"},
        {name: "Perla", value: "#EAE0C8"},
        {name: "Topazio", value: "#FFC87C"},
        {name: "Giada", value: "#00A86B"},
        {name: "Cremisi", value: "#DC143C"},
        {name: "Blu Klein", value: "#002FA7"}
    ]
};

let total = 0;
let correct = 0;
let errors = 0;
let currentDragged = null;

function startGame(level) {

    document.getElementById("colors").innerHTML = "";
    document.getElementById("names").innerHTML = "";
    document.getElementById("message").innerText = "";
    document.getElementById("stars").innerText = "";

    const selected = levels[level];
    total = selected.length;
    correct = 0;
    errors = 0;

    const shuffled = [...selected].sort(() => Math.random() - 0.5);

    selected.forEach(color => {
        const box = document.createElement("div");
        box.classList.add("color-box");
        box.style.backgroundColor = color.value;
        box.dataset.name = color.name;
        box.dataset.color = color.value;

        box.draggable = true;
        box.addEventListener("dragstart", () => currentDragged = box);
        box.addEventListener("touchstart", () => currentDragged = box);

        document.getElementById("colors").appendChild(box);
    });

    shuffled.forEach(color => {
        const drop = document.createElement("div");
        drop.classList.add("drop-zone");
        drop.innerText = color.name;
        drop.dataset.name = color.name;

        drop.addEventListener("dragover", e => e.preventDefault());
        drop.addEventListener("drop", handleDrop);
        drop.addEventListener("touchend", handleDrop);

        document.getElementById("names").appendChild(drop);
    });
}

function handleDrop(e) {

    if (!currentDragged) return;

    const draggedName = currentDragged.dataset.name;
    const draggedColor = currentDragged.dataset.color;
    const target = e.currentTarget;

    if (draggedName === target.dataset.name && !target.classList.contains("filled")) {

        target.style.backgroundColor = draggedColor;
        target.innerText = draggedName;
        target.classList.add("filled");

        currentDragged.remove();
        correct++;

        if (correct === total) {
            showStars();
            launchConfetti();
        }

    } else {
        errors++;
    }

    currentDragged = null;
}

function showStars() {

    let starCount = errors === 0 ? 3 : errors <= 3 ? 2 : 1;

    document.getElementById("message").innerText = "🎉 Livello completato!";
    document.getElementById("stars").innerText = "⭐".repeat(starCount);
}

/* 🎉 CONFETTI */

function launchConfetti() {

    const canvas = document.getElementById("confetti");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const gravity = 0.15;
    const friction = 0.999;

    for (let i = 0; i < 180; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            size: Math.random() * 10 + 5,
            velocityX: (Math.random() - 0.5) * 6,
            velocityY: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            shape: Math.random() > 0.5 ? "rect" : "circle"
        });
    }

    let animation;

    function update() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pieces.forEach(p => {

            p.velocityY += gravity;
            p.velocityX *= friction;

            p.x += p.velocityX;
            p.y += p.velocityY;
            p.rotation += p.rotationSpeed;

            // Rimbalzo leggero sul fondo
            if (p.y + p.size > canvas.height) {
                p.y = canvas.height - p.size;
                p.velocityY *= -0.4;
            }

            ctx.save();
            ctx.translate(p.x + p.size / 2, p.y + p.size / 2);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;

            if (p.shape === "rect") {
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        });

        animation = requestAnimationFrame(update);
    }

    update();

    setTimeout(() => {
        cancelAnimationFrame(animation);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 4000);
}
