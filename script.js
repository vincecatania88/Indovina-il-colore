const levels = {
    facile: [
        {name: "Rosso", value: "#FF4444"},
        {name: "Blu", value: "#4444FF"},
        {name: "Verde", value: "#44FF44"}
    ],
    medio: [
        {name: "Rosso", value: "#FF4444"},
        {name: "Blu", value: "#4444FF"},
        {name: "Verde", value: "#44FF44"},
        {name: "Giallo", value: "#FFFF44"},
        {name: "Arancione", value: "#FF8844"}
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
let draggedElement = null;
let isDragging = false;
let ghost = document.getElementById('dragGhost');
let dropZones = [];
let lastDropTarget = null;

function startGame(level) {
    document.getElementById("colors").innerHTML = "";
    document.getElementById("names").innerHTML = "";
    document.getElementById("message").innerText = "";
    document.getElementById("stars").innerText = "";
    
    ghost.style.display = 'none';

    const selected = levels[level];
    total = selected.length;
    correct = 0;
    errors = 0;

    // Mescola le parole
    const shuffled = [...selected].sort(() => Math.random() - 0.5);

    // Crea i colori
    selected.forEach(color => {
        const box = createColorElement(color);
        document.getElementById("colors").appendChild(box);
    });

    // Crea le zone di drop
    shuffled.forEach(color => {
        const drop = createDropZone(color);
        document.getElementById("names").appendChild(drop);
    });
    
    // Aggiorna la lista delle zone di drop
    updateDropZones();
}

function createColorElement(color) {
    const box = document.createElement("div");
    box.classList.add("color-box");
    box.style.backgroundColor = color.value;
    box.dataset.name = color.name;
    box.dataset.color = color.value;

    // Eventi mouse
    box.addEventListener("mousedown", startDrag);
    
    // Eventi touch
    box.addEventListener("touchstart", startDrag, { passive: false });

    return box;
}

function createDropZone(color) {
    const drop = document.createElement("div");
    drop.classList.add("drop-zone");
    drop.innerText = color.name;
    drop.dataset.name = color.name;
    
    // Non aggiungere event listener qui - gestiamo tutto tramite il documento
    
    return drop;
}

function updateDropZones() {
    dropZones = Array.from(document.querySelectorAll('.drop-zone:not(.filled)'));
}

function startDrag(e) {
    e.preventDefault();
    
    // Se stiamo già trascinando, ignora
    if (isDragging) return;
    
    // Salva l'elemento trascinato
    draggedElement = this;
    
    // Ottieni le coordinate iniziali
    let clientX, clientY;
    if (e.type === 'mousedown') {
        clientX = e.clientX;
        clientY = e.clientY;
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
    } else {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
        document.addEventListener('touchmove', onDragMove, { passive: false });
        document.addEventListener('touchend', onDragEnd);
        document.addEventListener('touchcancel', onDragEnd);
    }
    
    // Configura il fantasma
    ghost.style.display = 'block';
    ghost.style.backgroundColor = this.style.backgroundColor;
    ghost.style.left = clientX + 'px';
    ghost.style.top = clientY + 'px';
    
    // Aggiungi classe dragging
    this.classList.add('dragging');
    isDragging = true;
    
    // Aggiorna le zone di drop disponibili
    updateDropZones();
}

function onDragMove(e) {
    if (!isDragging || !draggedElement) return;
    
    e.preventDefault();
    
    let clientX, clientY;
    
    if (e.type === 'mousemove') {
        clientX = e.clientX;
        clientY = e.clientY;
    } else {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }
    
    // Muovi il fantasma
    ghost.style.left = clientX + 'px';
    ghost.style.top = clientY + 'px';
    
    // Trova la zona di drop sotto il dito/mouse
    const elementsAtPoint = document.elementsFromPoint(clientX, clientY);
    let dropZone = null;
    
    for (let element of elementsAtPoint) {
        if (element.classList && element.classList.contains('drop-zone') && !element.classList.contains('filled')) {
            dropZone = element;
            break;
        }
    }
    
    // Aggiorna le evidenziazioni
    dropZones.forEach(zone => {
        if (zone === dropZone) {
            zone.classList.add('drop-over');
        } else {
            zone.classList.remove('drop-over');
        }
    });
    
    lastDropTarget = dropZone;
}

function onDragEnd(e) {
    e.preventDefault();
    
    // Rimuovi i listener
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('touchend', onDragEnd);
    document.removeEventListener('touchcancel', onDragEnd);
    
    // Ottieni le coordinate finali per il touch
    if (e.type === 'touchend' && e.changedTouches) {
        const touch = e.changedTouches[0];
        const elementsAtPoint = document.elementsFromPoint(touch.clientX, touch.clientY);
        
        // Cerca una zona di drop valida
        for (let element of elementsAtPoint) {
            if (element.classList && element.classList.contains('drop-zone') && !element.classList.contains('filled')) {
                lastDropTarget = element;
                break;
            }
        }
    }
    
    // Gestisci il drop se abbiamo un target valido
    if (lastDropTarget && draggedElement) {
        handleDrop(lastDropTarget);
    } else if (draggedElement) {
        // Nessun drop valido, annulla il drag
        cancelDrag();
    }
    
    // Pulisci
    endDrag();
}

function handleDrop(target) {
    if (!draggedElement) return;
    
    const draggedName = draggedElement.dataset.name;
    const draggedColor = draggedElement.dataset.color;

    // Verifica se il colore corrisponde
    if (draggedName === target.dataset.name) {
        // Drop corretto
        target.style.backgroundColor = draggedColor;
        target.innerText = draggedName;
        target.classList.add('filled');
        
        draggedElement.remove();
        correct++;

        if (correct === total) {
            showStars();
            launchConfetti();
        }
    } else {
        // Drop errato
        errors++;
        target.classList.add('wrong-drop');
        setTimeout(() => {
            target.classList.remove('wrong-drop');
        }, 300);
        
        // Effetto di rimbalzo per il colore
        if (draggedElement) {
            draggedElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                if (draggedElement) {
                    draggedElement.style.transform = '';
                }
            }, 200);
        }
    }
}

function cancelDrag() {
    if (draggedElement) {
        // Effetto di rimbalzo per annullamento
        draggedElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            if (draggedElement) {
                draggedElement.style.transform = '';
            }
        }, 200);
    }
}

function endDrag() {
    // Rimuovi classe dragging
    if (draggedElement) {
        draggedElement.classList.remove('dragging');
    }
    
    // Nascondi fantasma
    ghost.style.display = 'none';
    
    // Rimuovi tutte le evidenziazioni
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drop-over');
        zone.classList.remove('wrong-drop');
    });
    
    draggedElement = null;
    isDragging = false;
    lastDropTarget = null;
    
    // Aggiorna le zone di drop
    updateDropZones();
}

function showStars() {
    let starCount = errors === 0 ? 3 : errors <= 3 ? 2 : 1;
    
    const messages = {
        3: "🎉 PERFETTO! 🌟🌟🌟",
        2: "👍 BRAVO! 🌟🌟",
        1: "💪 PUOI FARE MEGLIO! 🌟"
    };
    
    document.getElementById("message").innerText = messages[starCount] || "🎉 Livello completato!";
    document.getElementById("stars").innerText = "⭐".repeat(starCount);
}

function launchConfetti() {
    const canvas = document.getElementById("confetti");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const gravity = 0.15;
    const colors = ['#FF4444', '#44FF44', '#4444FF', '#FFFF44', '#FF44FF', '#44FFFF'];

    for (let i = 0; i < 150; i++) {
        pieces.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            size: Math.random() * 10 + 5,
            velocityX: (Math.random() - 0.5) * 12,
            velocityY: (Math.random() - 0.5) * 12 - 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: Math.random() > 0.5 ? "rect" : "circle"
        });
    }

    let animation;
    let startTime = Date.now();

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pieces.forEach(p => {
            p.velocityY += gravity;
            p.x += p.velocityX;
            p.y += p.velocityY;

            ctx.fillStyle = p.color;
            
            if (p.shape === "rect") {
                ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size/2, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        if (Date.now() - startTime < 3000) {
            animation = requestAnimationFrame(update);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    update();
}

// Previeni il comportamento di default del browser
document.addEventListener('dragstart', (e) => e.preventDefault());
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Avvia con livello facile
window.onload = () => startGame('facile');