const s = (sketch) => {
    let words = [];
    const proximityThreshold = 500; // Maximum distance for full thickness
    const floatSpeed = 1.5; // Speed of floating effect
    const lineColorDefault = sketch.color(0, 0, 255, 150); // Default line color with reduced opacity
    const lineColorHover = sketch.color(255, 0, 0, 150); // Line color when hovering with reduced opacity

    class Draggable {
        constructor(text, x, y, size) {
            this.text = text;
            this.pos = sketch.createVector(x, y);
            this.size = size * 0.8; // Reduced size for smaller text
            this.dragging = false;
            this.hover = false;
            this.offset = sketch.createVector();
            this.floatDirection = sketch.createVector(sketch.random(-1, 1), sketch.random(-1, 1)); // Random direction for floating
        }

        display() {
            sketch.textSize(this.size);
            sketch.textFont('Montserrat'); // Ensure to use a font that supports bold
            sketch.textStyle(sketch.BOLD); // Make text bold
            this.hover = this.isHovering();
            sketch.fill(this.hover ? sketch.color(255, 0, 0) : sketch.color(0)); // Red on hover, black otherwise
            sketch.noStroke();
            sketch.text(this.text, this.pos.x, this.pos.y);
        }

        isHovering() {
            let w = sketch.textWidth(this.text);
            let h = this.size; // Approximate height based on text size
            return sketch.mouseX > this.pos.x - w / 2 && sketch.mouseX < this.pos.x + w / 2 &&
                sketch.mouseY > this.pos.y - h / 2 && sketch.mouseY < this.pos.y + h / 2;
        }

        pressed() {
            if (this.isHovering()) {
                this.dragging = true;
                this.offset.x = this.pos.x - sketch.mouseX;
                this.offset.y = this.pos.y - sketch.mouseY;
            }
        }

        released() {
            this.dragging = false;
        }

        drag() {
            if (this.dragging) {
                this.pos.x = sketch.mouseX + this.offset.x;
                this.pos.y = sketch.mouseY + this.offset.y;
            }
        }

        float() {
            this.pos.add(this.floatDirection.copy().mult(floatSpeed));

            // Bounce off edges of the canvas
            if (this.pos.x < 0) {
                this.pos.x = 0;
                this.floatDirection.x *= -1;
            }
            if (this.pos.x > sketch.width) {
                this.pos.x = sketch.width;
                this.floatDirection.x *= -1;
            }
            if (this.pos.y < 0) {
                this.pos.y = 0;
                this.floatDirection.y *= -1;
            }
            if (this.pos.y > sketch.height) {
                this.pos.y = sketch.height;
                this.floatDirection.y *= -1;
            }
        }
    }

    sketch.setup = () => {
        let canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
        canvas.parent('canvas-container');
        sketch.textAlign(sketch.CENTER, sketch.CENTER);

        sketch.windowResized = () => {
            sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
        };

        // Initialize words at random positions
        words.push(new Draggable("Resilience", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 24));
        words.push(new Draggable("Justice", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 18));
        words.push(new Draggable("Sustainability", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 20));
        words.push(new Draggable("Ecosystem", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 22));
        words.push(new Draggable("Extreme Weather", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 16));
        words.push(new Draggable("Efficiency", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 24));
        words.push(new Draggable("Innovation", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 20));
        words.push(new Draggable("Design", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 18));
        words.push(new Draggable("Performance", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 22));
        words.push(new Draggable("Building", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 20));
        words.push(new Draggable("Adaptation", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 20));
        words.push(new Draggable("Green Energy", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 20));
        words.push(new Draggable("Conservation", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 20));
        words.push(new Draggable("Climate Action", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 20));
        words.push(new Draggable("Mitigation", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 20));
        words.push(new Draggable("Renewable Resources", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 20));
        words.push(new Draggable("Circular Economy", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 20));
        words.push(new Draggable("Sustainability Goals", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 20));
        words.push(new Draggable("Resource Management", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 20));
        words.push(new Draggable("Environmental Impact", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 20));
        words.push(new Draggable("Low Carbon", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 20));
        words.push(new Draggable("Smart Design", sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - 100), 20));
        // More words...
    };

    sketch.draw = () => {
        sketch.background(255);
        drawConnections();
        words.forEach(word => {
            word.float();
            word.display();
            word.drag();
        });
    };

    function drawConnections() {
        for (let i = 0; i < words.length; i++) {
            for (let j = i + 1; j < words.length; j++) {
                let d = sketch.dist(words[i].pos.x, words[i].pos.y, words[j].pos.x, words[j].pos.y);
                let lineColor = (words[i].hover || words[j].hover) ? lineColorHover : lineColorDefault;
                
                // Create dynamic line effect
                let lineThickness = sketch.map(d, 0, proximityThreshold, 4, 0.5); // Thicker line when closer
                let alpha = sketch.map(d, 0, proximityThreshold, 100, 25); // Less opaque when farther

                sketch.stroke(lineColor.levels[0], lineColor.levels[1], lineColor.levels[2], alpha);
                sketch.strokeWeight(lineThickness);
                sketch.line(words[i].pos.x, words[i].pos.y, words[j].pos.x, words[j].pos.y);
            }
        }
    }

    sketch.mousePressed = () => {
        words.forEach(word => word.pressed());
    };

    sketch.mouseReleased = () => {
        words.forEach(word => word.released());
    };
};

let myp5 = new p5(s);
