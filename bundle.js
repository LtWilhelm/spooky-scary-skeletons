// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const secretTunnel = new Audio();
secretTunnel.src = "./assets/sounds/secrettunnel.mp3";
const musicBox = new Audio();
musicBox.src = "./assets/sounds/musicBox.mp3";
const spookyLaugh1 = new Audio();
spookyLaugh1.src = "./assets/sounds/spookyLaugh1.mp3";
const spookyLaugh2 = new Audio();
spookyLaugh2.src = "./assets/sounds/spookyLaugh2.mp3";
const treasure = new Audio();
treasure.src = "./assets/sounds/treasure.mp3";
const spookyDrone1 = new Audio();
spookyDrone1.src = "./assets/sounds/spookyDrone1.mp3";
const spookyDrone2 = new Audio();
spookyDrone2.src = "./assets/sounds/spookyDrone2.mp3";
const audioLibrary = {
    secretTunnel,
    musicBox,
    spookyLaugh1,
    spookyLaugh2,
    treasure,
    spookyDrone1,
    spookyDrone2
};
function playRandom(...keys) {
    audioLibrary[keys[Math.floor(Math.random() * keys.length)]].play();
}
const Constants = {
    TWO_PI: Math.PI * 2
};
class Vector {
    x;
    y;
    z;
    constructor(x = 0, y = 0, z = 0){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    set(v, y, z) {
        if (arguments.length === 1 && typeof v !== "number") {
            this.set(v.x || v[0] || 0, v.y || v[1] || 0, v.z || v[2] || 0);
        } else {
            this.x = v;
            this.y = y || 0;
            this.z = z || 0;
        }
    }
    get() {
        return new Vector(this.x, this.y, this.z);
    }
    mag() {
        const x = this.x, y = this.y, z = this.z;
        return Math.sqrt(x * x + y * y + z * z);
    }
    magSq() {
        const x = this.x, y = this.y, z = this.z;
        return x * x + y * y + z * z;
    }
    setMag(v_or_len, len) {
        if (len === undefined) {
            len = v_or_len;
            this.normalize();
            this.mult(len);
        } else {
            const v = v_or_len;
            v.normalize();
            v.mult(len);
            return v;
        }
    }
    add(v, y, z) {
        if (arguments.length === 1 && typeof v !== 'number') {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
        } else if (arguments.length === 2) {
            this.x += v;
            this.y += y ?? 0;
        } else {
            this.x += v;
            this.y += y ?? 0;
            this.z += z ?? 0;
        }
        return this;
    }
    sub(v, y, z) {
        if (arguments.length === 1 && typeof v !== 'number') {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
        } else if (arguments.length === 2) {
            this.x -= v;
            this.y -= y ?? 0;
        } else {
            this.x -= v;
            this.y -= y ?? 0;
            this.z -= z ?? 0;
        }
        return this;
    }
    mult(v) {
        if (typeof v === 'number') {
            this.x *= v;
            this.y *= v;
            this.z *= v;
        } else {
            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;
        }
        return this;
    }
    div(v) {
        if (typeof v === 'number') {
            this.x /= v;
            this.y /= v;
            this.z /= v;
        } else {
            this.x /= v.x;
            this.y /= v.y;
            this.z /= v.z;
        }
        return this;
    }
    rotate(angle) {
        const prev_x = this.x;
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        this.x = c * this.x - s * this.y;
        this.y = s * prev_x + c * this.y;
        return this;
    }
    dist(v) {
        const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    dot(v, y, z) {
        if (arguments.length === 1 && typeof v !== 'number') {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        }
        return this.x * v + this.y * y + this.z * z;
    }
    cross(v) {
        const x = this.x, y = this.y, z = this.z;
        return new Vector(y * v.z - v.y * z, z * v.x - v.z * x, x * v.y - v.x * y);
    }
    lerp(v_or_x, amt_or_y, z, amt) {
        const lerp_val = (start, stop, amt)=>{
            return start + (stop - start) * amt;
        };
        let x, y;
        if (arguments.length === 2 && typeof v_or_x !== 'number') {
            amt = amt_or_y;
            x = v_or_x.x;
            y = v_or_x.y;
            z = v_or_x.z;
        } else {
            x = v_or_x;
            y = amt_or_y;
        }
        this.x = lerp_val(this.x, x, amt);
        this.y = lerp_val(this.y, y, amt);
        this.z = lerp_val(this.z, z, amt);
        return this;
    }
    normalize() {
        const m = this.mag();
        if (m > 0) {
            this.div(m);
        }
        return this;
    }
    limit(high) {
        if (this.mag() > high) {
            this.normalize();
            this.mult(high);
        }
        return this;
    }
    heading() {
        return -Math.atan2(-this.y, this.x);
    }
    heading2D() {
        return this.heading();
    }
    toString() {
        return "[" + this.x + ", " + this.y + ", " + this.z + "]";
    }
    array() {
        return [
            this.x,
            this.y,
            this.z
        ];
    }
    copy() {
        return new Vector(this.x, this.y, this.z);
    }
    drawDot() {
        if (!doodler) return;
        doodler.dot(this, {
            weight: 2,
            color: 'red'
        });
    }
    static fromAngle(angle, v) {
        if (v === undefined || v === null) {
            v = new Vector();
        }
        v.x = Math.cos(angle);
        v.y = Math.sin(angle);
        return v;
    }
    static random2D(v) {
        return Vector.fromAngle(Math.random() * (Math.PI * 2), v);
    }
    static random3D(v) {
        const angle = Math.random() * Constants.TWO_PI;
        const vz = Math.random() * 2 - 1;
        const mult = Math.sqrt(1 - vz * vz);
        const vx = mult * Math.cos(angle);
        const vy = mult * Math.sin(angle);
        if (v === undefined || v === null) {
            v = new Vector(vx, vy, vz);
        } else {
            v.set(vx, vy, vz);
        }
        return v;
    }
    static dist(v1, v2) {
        return v1.dist(v2);
    }
    static dot(v1, v2) {
        return v1.dot(v2);
    }
    static cross(v1, v2) {
        return v1.cross(v2);
    }
    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
    static sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }
    static angleBetween(v1, v2) {
        return Math.acos(v1.dot(v2) / Math.sqrt(v1.magSq() * v2.magSq()));
    }
    static lerp(v1, v2, amt) {
        const retval = new Vector(v1.x, v1.y, v1.z);
        retval.lerp(v2, amt);
        return retval;
    }
    static vectorProjection(v1, v2) {
        v2 = v2.copy();
        v2.normalize();
        const sp = v1.dot(v2);
        v2.mult(sp);
        return v2;
    }
    static hypot2(a, b) {
        return Vector.dot(Vector.sub(a, b), Vector.sub(a, b));
    }
}
class OriginVector extends Vector {
    origin;
    get halfwayPoint() {
        return {
            x: this.mag() / 2 * Math.sin(this.heading()) + this.origin.x,
            y: this.mag() / 2 * Math.cos(this.heading()) + this.origin.y
        };
    }
    constructor(origin, p){
        super(p.x, p.y, p.z);
        this.origin = origin;
    }
    static from(origin, p) {
        const v = {
            x: p.x - origin.x,
            y: p.y - origin.y
        };
        return new OriginVector(origin, v);
    }
}
const easeInOut = (x)=>x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const map = (value, x1, y1, x2, y2)=>(value - x1) * (y2 - x2) / (y1 - x1) + x2;
class Doodler {
    ctx;
    _canvas;
    layers = [];
    bg;
    framerate;
    get width() {
        return this.ctx.canvas.width;
    }
    get height() {
        return this.ctx.canvas.height;
    }
    draggables = [];
    clickables = [];
    dragTarget;
    constructor({ width, height, canvas, bg, framerate }, postInit){
        if (!canvas) {
            canvas = document.createElement("canvas");
            document.body.append(canvas);
        }
        this.bg = bg || "white";
        this.framerate = framerate || 60;
        canvas.width = width;
        canvas.height = height;
        this._canvas = canvas;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw "Unable to initialize Doodler: Canvas context not found";
        this.ctx = ctx;
        postInit?.(this.ctx);
    }
    init() {
        this._canvas.addEventListener("mousedown", (e)=>this.onClick(e));
        this._canvas.addEventListener("mouseup", (e)=>this.offClick(e));
        this._canvas.addEventListener("mousemove", (e)=>this.onDrag(e));
        this.startDrawLoop();
    }
    timer;
    startDrawLoop() {
        this.timer = setInterval(()=>this.draw(), 1000 / this.framerate);
    }
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = this.bg;
        this.ctx.fillRect(0, 0, this.width, this.height);
        for (const [i, l] of (this.layers || []).entries()){
            l(this.ctx, i);
            this.drawDeferred();
        }
        this.drawUI();
    }
    createLayer(layer) {
        this.layers.push(layer);
    }
    deleteLayer(layer) {
        this.layers = this.layers.filter((l)=>l !== layer);
    }
    moveLayer(layer, index) {
        let temp = this.layers.filter((l)=>l !== layer);
        temp = [
            ...temp.slice(0, index),
            layer,
            ...temp.slice(index)
        ];
        this.layers = temp;
    }
    line(start, end, style) {
        this.setStyle(style);
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
    }
    dot(at, style) {
        this.setStyle({
            ...style,
            weight: 1
        });
        this.ctx.beginPath();
        this.ctx.arc(at.x, at.y, style?.weight || 1, 0, Constants.TWO_PI);
        this.ctx.fill();
    }
    drawCircle(at, radius, style) {
        this.setStyle(style);
        this.ctx.beginPath();
        this.ctx.arc(at.x, at.y, radius, 0, Constants.TWO_PI);
        this.ctx.stroke();
    }
    fillCircle(at, radius, style) {
        this.setStyle(style);
        this.ctx.beginPath();
        this.ctx.arc(at.x, at.y, radius, 0, Constants.TWO_PI);
        this.ctx.fill();
    }
    drawRect(at, width, height, style) {
        this.setStyle(style);
        this.ctx.strokeRect(at.x, at.y, width, height);
    }
    fillRect(at, width, height, style) {
        this.setStyle(style);
        this.ctx.fillRect(at.x, at.y, width, height);
    }
    drawSquare(at, size, style) {
        this.drawRect(at, size, size, style);
    }
    fillSquare(at, size, style) {
        this.fillRect(at, size, size, style);
    }
    drawCenteredRect(at, width, height, style) {
        this.ctx.save();
        this.ctx.translate(-width / 2, -height / 2);
        this.drawRect(at, width, height, style);
        this.ctx.restore();
    }
    fillCenteredRect(at, width, height, style) {
        this.ctx.save();
        this.ctx.translate(-width / 2, -height / 2);
        this.fillRect(at, width, height, style);
        this.ctx.restore();
    }
    drawCenteredSquare(at, size, style) {
        this.drawCenteredRect(at, size, size, style);
    }
    fillCenteredSquare(at, size, style) {
        this.fillCenteredRect(at, size, size, style);
    }
    drawBezier(a, b, c, d, style) {
        this.setStyle(style);
        this.ctx.beginPath();
        this.ctx.moveTo(a.x, a.y);
        this.ctx.bezierCurveTo(b.x, b.y, c.x, c.y, d.x, d.y);
        this.ctx.stroke();
    }
    drawRotated(origin, angle, cb) {
        this.ctx.save();
        this.ctx.translate(origin.x, origin.y);
        this.ctx.rotate(angle);
        this.ctx.translate(-origin.x, -origin.y);
        cb();
        this.ctx.restore();
    }
    drawScaled(scale, cb) {
        this.ctx.save();
        this.ctx.transform(scale, 0, 0, scale, 0, 0);
        cb();
        this.ctx.restore();
    }
    drawWithAlpha(alpha, cb) {
        this.ctx.save();
        this.ctx.globalAlpha = Math.min(Math.max(alpha, 0), 1);
        cb();
        this.ctx.restore();
    }
    drawImage(img, at, w, h) {
        w && h ? this.ctx.drawImage(img, at.x, at.y, w, h) : this.ctx.drawImage(img, at.x, at.y);
    }
    drawImageWithOutline(img, at, w, h, style) {
        this.ctx.save();
        const s = (typeof w === "number" || !w ? style?.weight : w.weight) || 1;
        this.ctx.shadowColor = (typeof w === "number" || !w ? style?.color || style?.fillColor : w.color || w.strokeColor) || "red";
        this.ctx.shadowBlur = 0;
        for(let x = -s; x <= s; x++){
            for(let y = -s; y <= s; y++){
                this.ctx.shadowOffsetX = x;
                this.ctx.shadowOffsetY = y;
                typeof w === "number" && h ? this.ctx.drawImage(img, at.x, at.y, w, h) : this.ctx.drawImage(img, at.x, at.y);
            }
        }
        this.ctx.restore();
    }
    drawSprite(img, spritePos, sWidth, sHeight, at, width, height) {
        this.ctx.drawImage(img, spritePos.x, spritePos.y, sWidth, sHeight, at.x, at.y, width, height);
    }
    deferredDrawings = [];
    deferDrawing(cb) {
        this.deferredDrawings.push(cb);
    }
    drawDeferred() {
        while(this.deferredDrawings.length){
            this.deferredDrawings.pop()?.();
        }
    }
    setStyle(style) {
        const ctx = this.ctx;
        ctx.fillStyle = style?.color || style?.fillColor || "black";
        ctx.strokeStyle = style?.color || style?.strokeColor || "black";
        ctx.lineWidth = style?.weight || 1;
        ctx.textAlign = style?.textAlign || ctx.textAlign;
        ctx.textBaseline = style?.textBaseline || ctx.textBaseline;
    }
    fillText(text, pos, maxWidth, style) {
        this.setStyle(style);
        this.ctx.fillText(text, pos.x, pos.y, maxWidth);
    }
    strokeText(text, pos, maxWidth, style) {
        this.setStyle(style);
        this.ctx.strokeText(text, pos.x, pos.y, maxWidth);
    }
    clearRect(at, width, height) {
        this.ctx.clearRect(at.x, at.y, width, height);
    }
    mouseX = 0;
    mouseY = 0;
    registerDraggable(point, radius, style) {
        if (this.draggables.find((d)=>d.point === point)) return;
        const id = this.addUIElement("circle", point, radius, {
            fillColor: "#5533ff50",
            strokeColor: "#5533ff50"
        });
        this.draggables.push({
            point,
            radius,
            style,
            id
        });
    }
    unregisterDraggable(point) {
        for (const d of this.draggables){
            if (d.point === point) {
                this.removeUIElement(d.id);
            }
        }
        this.draggables = this.draggables.filter((d)=>d.point !== point);
    }
    registerClickable(p1, p2, cb) {
        const top = Math.min(p1.y, p2.y);
        const left = Math.min(p1.x, p2.x);
        const bottom = Math.max(p1.y, p2.y);
        const right = Math.max(p1.x, p2.x);
        this.clickables.push({
            onClick: cb,
            checkBound: (p)=>p.y >= top && p.x >= left && p.y <= bottom && p.x <= right
        });
    }
    unregisterClickable(cb) {
        this.clickables = this.clickables.filter((c)=>c.onClick !== cb);
    }
    addDragEvents({ onDragEnd, onDragStart, onDrag, point }) {
        const d = this.draggables.find((d)=>d.point === point);
        if (d) {
            d.onDragEnd = onDragEnd;
            d.onDragStart = onDragStart;
            d.onDrag = onDrag;
        }
    }
    onClick(e) {
        const mouse = new Vector(this.mouseX, this.mouseY);
        for (const d of this.draggables){
            if (d.point.dist(mouse) <= d.radius) {
                d.beingDragged = true;
                d.onDragStart?.call(null);
                this.dragTarget = d;
            } else d.beingDragged = false;
        }
        for (const c of this.clickables){
            if (c.checkBound(mouse)) {
                c.onClick();
            }
        }
    }
    offClick(e) {
        for (const d of this.draggables){
            d.beingDragged = false;
            d.onDragEnd?.call(null);
        }
        this.dragTarget = undefined;
    }
    onDrag(e) {
        this._canvas.getBoundingClientRect();
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
        for (const d of this.draggables.filter((d)=>d.beingDragged)){
            d.point.add(e.movementX, e.movementY);
            d.onDrag && d.onDrag({
                x: e.movementX,
                y: e.movementY
            });
        }
    }
    uiElements = new Map();
    uiDrawing = {
        rectangle: (...args)=>{
            !args[3].noFill && this.fillRect(args[0], args[1], args[2], args[3]);
            !args[3].noStroke && this.drawRect(args[0], args[1], args[2], args[3]);
        },
        square: (...args)=>{
            !args[2].noFill && this.fillSquare(args[0], args[1], args[2]);
            !args[2].noStroke && this.drawSquare(args[0], args[1], args[2]);
        },
        circle: (...args)=>{
            !args[2].noFill && this.fillCircle(args[0], args[1], args[2]);
            !args[2].noStroke && this.drawCircle(args[0], args[1], args[2]);
        }
    };
    drawUI() {
        for (const [shape, ...args] of this.uiElements.values()){
            this.uiDrawing[shape].apply(null, args);
        }
    }
    addUIElement(shape, ...args) {
        const id = crypto.randomUUID();
        for (const arg of args){
            delete arg.color;
        }
        this.uiElements.set(id, [
            shape,
            ...args
        ]);
        return id;
    }
    removeUIElement(id) {
        this.uiElements.delete(id);
    }
}
class ZoomableDoodler extends Doodler {
    scale = 1;
    dragging = false;
    origin = {
        x: 0,
        y: 0
    };
    mouse = {
        x: 0,
        y: 0
    };
    previousTouchLength;
    touchTimer;
    hasDoubleTapped = false;
    zooming = false;
    scaleAround = {
        x: 0,
        y: 0
    };
    maxScale = 4;
    constructor(options, postInit){
        super(options, postInit);
        this._canvas.addEventListener("wheel", (e)=>{
            this.scaleAtMouse(e.deltaY < 0 ? 1.1 : .9);
            if (this.scale === 1) {
                this.origin.x = 0;
                this.origin.y = 0;
            }
        });
        this._canvas.addEventListener("dblclick", (e)=>{
            e.preventDefault();
            this.scale = 1;
            this.origin.x = 0;
            this.origin.y = 0;
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        });
        this._canvas.addEventListener("mousedown", (e)=>{
            e.preventDefault();
            this.dragging = true;
        });
        this._canvas.addEventListener("mouseup", (e)=>{
            e.preventDefault();
            this.dragging = false;
        });
        this._canvas.addEventListener("mouseleave", (e)=>{
            this.dragging = false;
        });
        this._canvas.addEventListener("mousemove", (e)=>{
            const prev = this.mouse;
            this.mouse = {
                x: e.offsetX,
                y: e.offsetY
            };
            if (this.dragging && !this.dragTarget) this.drag(prev);
        });
        this._canvas.addEventListener("touchstart", (e)=>{
            e.preventDefault();
            if (e.touches.length === 1) {
                const t1 = e.touches.item(0);
                if (t1) {
                    this.mouse = this.getTouchOffset({
                        x: t1.clientX,
                        y: t1.clientY
                    });
                }
            } else {
                clearTimeout(this.touchTimer);
            }
        });
        this._canvas.addEventListener("touchend", (e)=>{
            if (e.touches.length !== 2) {
                this.previousTouchLength = undefined;
            }
            switch(e.touches.length){
                case 1:
                    break;
                case 0:
                    if (!this.zooming) {
                        this.events.get("touchend")?.map((cb)=>cb(e));
                    }
                    break;
            }
            this.dragging = e.touches.length === 1;
            clearTimeout(this.touchTimer);
        });
        this._canvas.addEventListener("touchmove", (e)=>{
            e.preventDefault();
            if (e.touches.length === 2) {
                const t1 = e.touches.item(0);
                const t2 = e.touches.item(1);
                if (t1 && t2) {
                    const vect = OriginVector.from(this.getTouchOffset({
                        x: t1.clientX,
                        y: t1.clientY
                    }), {
                        x: t2.clientX,
                        y: t2.clientY
                    });
                    if (this.previousTouchLength) {
                        const diff = this.previousTouchLength - vect.mag();
                        this.scaleAt(vect.halfwayPoint, diff < 0 ? 1.01 : .99);
                        this.scaleAround = {
                            ...vect.halfwayPoint
                        };
                    }
                    this.previousTouchLength = vect.mag();
                }
            }
            if (e.touches.length === 1) {
                this.dragging === true;
                const t1 = e.touches.item(0);
                if (t1) {
                    const prev = this.mouse;
                    this.mouse = this.getTouchOffset({
                        x: t1.clientX,
                        y: t1.clientY
                    });
                    this.drag(prev);
                }
            }
        });
        this._canvas.addEventListener("touchstart", (e)=>{
            if (e.touches.length !== 1) return false;
            if (!this.hasDoubleTapped) {
                this.hasDoubleTapped = true;
                setTimeout(()=>this.hasDoubleTapped = false, 300);
                return false;
            }
            console.log(this.mouse);
            if (this.scale > 1) {
                this.frameCounter = map(this.scale, this.maxScale, 1, 0, 59);
                this.zoomDirection = -1;
            } else {
                this.frameCounter = 0;
                this.zoomDirection = 1;
            }
            if (this.zoomDirection > 0) {
                this.scaleAround = {
                    ...this.mouse
                };
            }
            this.events.get("doubletap")?.map((cb)=>cb(e));
        });
    }
    worldToScreen(x, y) {
        x = x * this.scale + this.origin.x;
        y = y * this.scale + this.origin.y;
        return {
            x,
            y
        };
    }
    screenToWorld(x, y) {
        x = (x - this.origin.x) / this.scale;
        y = (y - this.origin.y) / this.scale;
        return {
            x,
            y
        };
    }
    scaleAtMouse(scaleBy) {
        if (this.scale === this.maxScale && scaleBy > 1) return;
        this.scaleAt({
            x: this.mouse.x,
            y: this.mouse.y
        }, scaleBy);
    }
    scaleAt(p, scaleBy) {
        this.scale = Math.min(Math.max(this.scale * scaleBy, 1), this.maxScale);
        this.origin.x = p.x - (p.x - this.origin.x) * scaleBy;
        this.origin.y = p.y - (p.y - this.origin.y) * scaleBy;
        this.constrainOrigin();
    }
    moveOrigin(motion) {
        if (this.scale > 1) {
            this.origin.x += motion.x;
            this.origin.y += motion.y;
            this.constrainOrigin();
        }
    }
    drag(prev) {
        if (this.scale > 1) {
            const xOffset = this.mouse.x - prev.x;
            const yOffset = this.mouse.y - prev.y;
            this.origin.x += xOffset;
            this.origin.y += yOffset;
            this.constrainOrigin();
        }
    }
    constrainOrigin() {
        this.origin.x = Math.min(Math.max(this.origin.x, -this._canvas.width * this.scale + this._canvas.width), 0);
        this.origin.y = Math.min(Math.max(this.origin.y, -this._canvas.height * this.scale + this._canvas.height), 0);
    }
    draw() {
        this.ctx.setTransform(this.scale, 0, 0, this.scale, this.origin.x, this.origin.y);
        this.animateZoom();
        this.ctx.fillStyle = this.bg;
        this.ctx.fillRect(0, 0, this.width / this.scale, this.height / this.scale);
        super.draw();
    }
    getTouchOffset(p) {
        const { x, y } = this._canvas.getBoundingClientRect();
        const offsetX = p.x - x;
        const offsetY = p.y - y;
        return {
            x: offsetX,
            y: offsetY
        };
    }
    onDrag(e) {
        const d = {
            ...e,
            movementX: e.movementX / this.scale,
            movementY: e.movementY / this.scale
        };
        super.onDrag(d);
        const { x, y } = this.screenToWorld(e.offsetX, e.offsetY);
        this.mouseX = x;
        this.mouseY = y;
    }
    zoomDirection = -1;
    frameCounter = 60;
    animateZoom() {
        if (this.frameCounter < 60) {
            const frame = easeInOut(map(this.frameCounter, 0, 59, 0, 1));
            switch(this.zoomDirection){
                case 1:
                    {
                        this.scale = map(frame, 0, 1, 1, this.maxScale);
                    }
                    break;
                case -1:
                    {
                        this.scale = map(frame, 0, 1, this.maxScale, 1);
                    }
                    break;
            }
            this.origin.x = this.scaleAround.x - this.scaleAround.x * this.scale;
            this.origin.y = this.scaleAround.y - this.scaleAround.y * this.scale;
            this.constrainOrigin();
            this.frameCounter++;
        }
    }
    events = new Map();
    registerEvent(eventName, cb) {
        let events = this.events.get(eventName);
        if (!events) events = this.events.set(eventName, []).get(eventName);
        events.push(cb);
    }
}
const init = (opt, zoomable, postInit)=>{
    if (window.doodler) {
        throw "Doodler has already been initialized in this window";
    }
    window.doodler = zoomable ? new ZoomableDoodler(opt, postInit) : new Doodler(opt, postInit);
    window.doodler.init();
};
const hallway = new Image();
hallway.src = "./assets/images/rooms/hallway/hallway.png";
const basementHallway = new Image();
basementHallway.src = "./assets/images/rooms/hallway/basement hallway.png";
const hallwayDoor = new Image();
hallwayDoor.src = "./assets/images/rooms/hallway/hallway door.png";
const basementHallwayDoor = new Image();
basementHallwayDoor.src = "./assets/images/rooms/hallway/basement hallway door.png";
const diningRoom = new Image();
diningRoom.src = "./assets/images/rooms/dining room.png";
const bedroom = new Image();
bedroom.src = "./assets/images/rooms/bedroom.png";
const parlor = new Image();
parlor.src = "./assets/images/rooms/parlor.png";
const library = new Image();
library.src = "./assets/images/rooms/library.png";
const cellar = new Image();
cellar.src = "./assets/images/rooms/cellar.png";
const catacombs = new Image();
catacombs.src = "./assets/images/rooms/catacombs.png";
const alcoves = new Image();
alcoves.src = "./assets/images/rooms/alcoves.png";
const dungeon = new Image();
dungeon.src = "./assets/images/rooms/dungeon.png";
const entrance = new Image();
entrance.src = "./assets/images/rooms/entrance.png";
const lowerStairs = new Image();
lowerStairs.src = "./assets/images/rooms/stair/lower stairs.png";
const upperStairs = new Image();
upperStairs.src = "./assets/images/rooms/stair/upper stairs.png";
const stairsDoor = new Image();
stairsDoor.src = "./assets/images/rooms/stair/stairs door.png";
const basementStairs = new Image();
basementStairs.src = "./assets/images/rooms/stair/basement stairs.png";
const basementStairsDoor = new Image();
basementStairsDoor.src = "./assets/images/rooms/stair/basement stairs door.png";
const door = new Image();
door.src = "./assets/images/rooms/door.png";
const basementDoor = new Image();
basementDoor.src = "./assets/images/rooms/basement door.png";
const window1 = new Image();
window1.src = "./assets/images/rooms/window.png";
const study = new Image();
study.src = "./assets/images/rooms/study.png";
const gameRoom = new Image();
gameRoom.src = "./assets/images/rooms/game room.png";
const treasure1 = new Image();
treasure1.src = "./assets/images/treasure.png";
const explorer = new Image();
explorer.src = "./assets/images/explorer.png";
const skeleton = new Image();
skeleton.src = "./assets/images/skeleton.png";
const ghost = new Image();
ghost.src = "./assets/images/ghost.png";
const trap = new Image();
trap.src = "./assets/images/trap.png";
const tunnel = new Image();
tunnel.src = "./assets/images/tunnel.png";
const compass = new Image();
compass.src = "./assets/images/items/compass.png";
const dice = new Image();
dice.src = "./assets/images/items/dice.png";
const hourglass = new Image();
hourglass.src = "./assets/images/items/hourglass.png";
const lantern = new Image();
lantern.src = "./assets/images/items/lantern.png";
const mirror = new Image();
mirror.src = "./assets/images/items/mirror.png";
const painting = new Image();
painting.src = "./assets/images/items/painting.png";
const quill = new Image();
quill.src = "./assets/images/items/quill.png";
const skull = new Image();
skull.src = "./assets/images/items/skull.png";
const spiders = new Image();
spiders.src = "./assets/images/items/spiders.png";
const spyglass = new Image();
spyglass.src = "./assets/images/items/spyglass.png";
const thread = new Image();
thread.src = "./assets/images/items/thread.png";
const crystalBall = new Image();
crystalBall.src = "./assets/images/items/crystal ball.png";
const musicBox1 = new Image();
musicBox1.src = "./assets/images/items/music box.png";
const imageLibrary = {
    hallway,
    basementHallway,
    hallwayDoor,
    basementHallwayDoor,
    diningRoom,
    bedroom,
    parlor,
    library,
    cellar,
    catacombs,
    alcoves,
    dungeon,
    entrance,
    lowerStairs,
    upperStairs,
    stairsDoor,
    basementStairs,
    basementStairsDoor,
    door,
    basementDoor,
    treasure: treasure1,
    explorer,
    skeleton,
    ghost,
    window: window1,
    trap,
    compass,
    dice,
    crystalBall,
    hourglass,
    lantern,
    mirror,
    musicBox: musicBox1,
    painting,
    quill,
    skull,
    spiders,
    spyglass,
    thread,
    tunnel,
    study,
    gameRoom
};
const Constants1 = {
    TWO_PI: Math.PI * 2
};
class Vector1 {
    x;
    y;
    z;
    constructor(x = 0, y = 0, z = 0){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    set(v, y, z) {
        if (arguments.length === 1 && typeof v !== "number") {
            this.set(v.x || v[0] || 0, v.y || v[1] || 0, v.z || v[2] || 0);
        } else {
            this.x = v;
            this.y = y || 0;
            this.z = z || 0;
        }
    }
    get() {
        return new Vector1(this.x, this.y, this.z);
    }
    mag() {
        const x = this.x, y = this.y, z = this.z;
        return Math.sqrt(x * x + y * y + z * z);
    }
    magSq() {
        const x = this.x, y = this.y, z = this.z;
        return x * x + y * y + z * z;
    }
    setMag(v_or_len, len) {
        if (len === undefined) {
            len = v_or_len;
            this.normalize();
            this.mult(len);
        } else {
            const v = v_or_len;
            v.normalize();
            v.mult(len);
            return v;
        }
    }
    add(v, y, z) {
        if (arguments.length === 1 && typeof v !== 'number') {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
        } else if (arguments.length === 2) {
            this.x += v;
            this.y += y ?? 0;
        } else {
            this.x += v;
            this.y += y ?? 0;
            this.z += z ?? 0;
        }
        return this;
    }
    sub(v, y, z) {
        if (arguments.length === 1 && typeof v !== 'number') {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
        } else if (arguments.length === 2) {
            this.x -= v;
            this.y -= y ?? 0;
        } else {
            this.x -= v;
            this.y -= y ?? 0;
            this.z -= z ?? 0;
        }
        return this;
    }
    mult(v) {
        if (typeof v === 'number') {
            this.x *= v;
            this.y *= v;
            this.z *= v;
        } else {
            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;
        }
        return this;
    }
    div(v) {
        if (typeof v === 'number') {
            this.x /= v;
            this.y /= v;
            this.z /= v;
        } else {
            this.x /= v.x;
            this.y /= v.y;
            this.z /= v.z;
        }
        return this;
    }
    rotate(angle) {
        const prev_x = this.x;
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        this.x = c * this.x - s * this.y;
        this.y = s * prev_x + c * this.y;
        return this;
    }
    dist(v) {
        const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    dot(v, y, z) {
        if (arguments.length === 1 && typeof v !== 'number') {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        }
        return this.x * v + this.y * y + this.z * z;
    }
    cross(v) {
        const x = this.x, y = this.y, z = this.z;
        return new Vector1(y * v.z - v.y * z, z * v.x - v.z * x, x * v.y - v.x * y);
    }
    lerp(v_or_x, amt_or_y, z, amt) {
        const lerp_val = (start, stop, amt)=>{
            return start + (stop - start) * amt;
        };
        let x, y;
        if (arguments.length === 2 && typeof v_or_x !== 'number') {
            amt = amt_or_y;
            x = v_or_x.x;
            y = v_or_x.y;
            z = v_or_x.z;
        } else {
            x = v_or_x;
            y = amt_or_y;
        }
        this.x = lerp_val(this.x, x, amt);
        this.y = lerp_val(this.y, y, amt);
        this.z = lerp_val(this.z, z, amt);
        return this;
    }
    normalize() {
        const m = this.mag();
        if (m > 0) {
            this.div(m);
        }
        return this;
    }
    limit(high) {
        if (this.mag() > high) {
            this.normalize();
            this.mult(high);
        }
        return this;
    }
    heading() {
        return -Math.atan2(-this.y, this.x);
    }
    heading2D() {
        return this.heading();
    }
    toString() {
        return "[" + this.x + ", " + this.y + ", " + this.z + "]";
    }
    array() {
        return [
            this.x,
            this.y,
            this.z
        ];
    }
    copy() {
        return new Vector1(this.x, this.y, this.z);
    }
    drawDot() {
        if (!doodler) return;
        doodler.dot(this, {
            weight: 2,
            color: 'red'
        });
    }
    static fromAngle(angle, v) {
        if (v === undefined || v === null) {
            v = new Vector1();
        }
        v.x = Math.cos(angle);
        v.y = Math.sin(angle);
        return v;
    }
    static random2D(v) {
        return Vector1.fromAngle(Math.random() * (Math.PI * 2), v);
    }
    static random3D(v) {
        const angle = Math.random() * Constants1.TWO_PI;
        const vz = Math.random() * 2 - 1;
        const mult = Math.sqrt(1 - vz * vz);
        const vx = mult * Math.cos(angle);
        const vy = mult * Math.sin(angle);
        if (v === undefined || v === null) {
            v = new Vector1(vx, vy, vz);
        } else {
            v.set(vx, vy, vz);
        }
        return v;
    }
    static dist(v1, v2) {
        return v1.dist(v2);
    }
    static dot(v1, v2) {
        return v1.dot(v2);
    }
    static cross(v1, v2) {
        return v1.cross(v2);
    }
    static add(v1, v2) {
        return new Vector1(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
    static sub(v1, v2) {
        return new Vector1(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }
    static angleBetween(v1, v2) {
        return Math.acos(v1.dot(v2) / Math.sqrt(v1.magSq() * v2.magSq()));
    }
    static lerp(v1, v2, amt) {
        const retval = new Vector1(v1.x, v1.y, v1.z);
        retval.lerp(v2, amt);
        return retval;
    }
    static vectorProjection(v1, v2) {
        v2 = v2.copy();
        v2.normalize();
        const sp = v1.dot(v2);
        v2.mult(sp);
        return v2;
    }
    static hypot2(a, b) {
        return Vector1.dot(Vector1.sub(a, b), Vector1.sub(a, b));
    }
}
class Item {
    name;
    uses;
    points;
    player;
    game;
    pickupDescription;
    img;
    get usable() {
        return false;
    }
    constructor(name, uses, points, player, game, pickupDescription, img){
        this.name = name;
        this.uses = uses;
        this.points = points;
        this.player = player;
        this.game = game;
        this.pickupDescription = pickupDescription;
        this.img = img;
        this.onFind();
    }
    addEventListener(event, handler) {
        addEventListener(event, (e)=>{
            if (this.use()) {
                handler?.(e);
            }
        });
    }
    use() {
        if (!this.uses) return false;
        this.uses--;
        this.player.move("search");
        return true;
    }
    onFind() {
        const prev = this.game.dialog?.innerHTML;
        this.game.dialog.innerHTML = this.pickupDescription.replace(/(<br>)?\r?\n/g, "<br>");
        this.game.dialog.prepend(this.img);
        const close = ()=>{
            this.game.dialog?.close();
            this.game.dialog.innerHTML = prev || "";
        };
        const takeBtn = document.createElement("button");
        takeBtn.addEventListener("click", ()=>{
            this.onPickup?.();
            this.game.render();
            close();
        });
        takeBtn.textContent = "Take";
        const leaveBtn = document.createElement("button");
        leaveBtn.addEventListener("click", ()=>{
            close();
        });
        leaveBtn.textContent = "Leave";
        this.game.dialog?.append(document.createElement("br"), takeBtn, leaveBtn);
        this.game.dialog?.showModal();
    }
    pickup() {
        console.log("item picked up", console.log(this.player));
        this.player.item?.onDrop?.();
        this.player.item = this;
        debugger;
    }
    render() {
        const start = new Vector1(0, this.game.gridSize.y).mult(32).add(2, 2);
        doodler.fillSquare(start, 12, {
            fillColor: "#00000050"
        });
        doodler.drawImage(this.img, start.copy().add(1, 1), 10, 10);
        doodler.fillText(this.name, start.copy().add(15, 8), 48, {
            fillColor: "white",
            textBaseline: "middle"
        });
    }
}
class Spyglass extends Item {
    constructor(player, game){
        super("Spyglass", Infinity, 5, player, game, `
      You found a spyglass!
      This let's you see monsters and players through doors across the map
      `, imageLibrary.spyglass);
    }
    onPickup() {
        super.pickup();
        this.player.sight = 6;
    }
    onDrop() {
        this.player.sight = 0;
    }
}
class Mirror extends Item {
    constructor(player, game){
        super("Mystical Mirror", 1, 30, player, game, `
      A Haunted Mirror!<br>
      Peering through it reveals all monsters
      `, imageLibrary.mirror);
        this.addEventListener("captured", ()=>{
            this.onDrop();
            this.player.item = undefined;
        });
    }
    onPickup() {
        super.pickup();
        this.player.vision = 10;
        this.player.visionIncludesAllMonsters = true;
    }
    onDrop() {
        this.player.vision = 0;
        this.player.visionIncludesAllMonsters = false;
    }
}
class Skull extends Item {
    constructor(player, game){
        super("Skull", 1, 10, player, game, `You found a skull!<br>
      Protects you from skeletons, but they're not likely to fall for it more than once!<br>
      Let's you see skeletons in neighboring rooms.`, imageLibrary.skull);
    }
    onPickup() {
        super.pickup();
        this.player.item?.onDrop();
        this.player.item = this;
        this.player.safe = true;
        this.player.vision = 1;
    }
    onDrop() {
        this.player.safe = false;
        this.player.vision = 0;
    }
    use() {
        if (!super.use()) return false;
        !this.uses && (this.player.safe = false);
        return true;
    }
}
class CrystalBall extends Item {
    onPickup() {
        super.pickup();
    }
    onDrop() {}
    constructor(player, game){
        super("Cyrstal Ball", 1, 30, player, game, `
      The glint of a Crystal Ball catches your eye.<br>
      The mist within swirls with visions of treasure!<br>
      Can be used once to find the treasure on the current floor.
      `, imageLibrary.crystalBall);
        this.usable;
    }
    levelTreasure;
    get usable() {
        this.levelTreasure = this.game.rooms.filter((r)=>r.level === this.game.floor).find((r)=>r._hasTreasure);
        return !!(this.levelTreasure && !this.player.knownTreasures.includes(this.levelTreasure) && this.uses > 0);
    }
    use() {
        if (!super.use() || !this.levelTreasure) return false;
        this.player.knownTreasures.push(this.levelTreasure);
        return true;
    }
}
class SpiderJar extends Item {
    constructor(player, game){
        super("Spider Jar", 1, 15, player, game, `
      Ew, a jar full of spiders!
      Might be useful to slow down your opponents...
      `, imageLibrary.spiders);
    }
    get usable() {
        return this.uses > 0;
    }
    use() {
        if (!this.uses) return false;
        const buttons = document.createElement("div");
        buttons.classList.add("buttons");
        const prev = this.game.dialog?.innerHTML;
        const close = ()=>{
            this.game.dialog?.close();
            this.game.dialog.innerHTML = prev || "";
        };
        for (const door of this.player.room.doors){
            const room = this.player.room.neighbors[door];
            if (!room) continue;
            const button = document.createElement("button");
            button.dataset.dir = door;
            button.textContent = door;
            button.addEventListener("click", ()=>{
                this.game.sendMessage({
                    action: "trap",
                    roomId: room.uuid,
                    playerId: this.player.uuid,
                    playerName: this.player.name
                });
                this.uses--;
                this.onDrop();
                this.player.item = undefined;
                this.player.move("search");
                close();
            });
            buttons.append(button);
        }
        const button = document.createElement("button");
        button.dataset.dir = "c";
        button.textContent = "Here";
        button.addEventListener("click", ()=>{
            this.game.sendMessage({
                action: "trap",
                roomId: this.player.room.uuid,
                playerId: this.player.uuid,
                playerName: this.player.name
            });
            this.uses--;
            this.onDrop();
            this.player.item = undefined;
            this.player.move("search");
            close();
        });
        buttons.append(button);
        const cancel = document.createElement("button");
        cancel.dataset.dir = "b";
        cancel.textContent = "Nevermind...";
        cancel.addEventListener("click", ()=>{
            close();
        });
        buttons.append(cancel);
        this.game.dialog.innerHTML = "Which way would you like to throw the jar of spiders?";
        this.game.dialog.append(buttons);
        this.game.dialog.showModal();
        return true;
    }
    onDrop() {}
    onPickup() {
        super.pickup();
    }
}
class Lantern extends Item {
    constructor(p, g){
        super("Spectral Lantern", Infinity, 15, p, g, `
      A strange blue lantern catches your eye.
      The cobwebs in the corners of the room glow brightly when you pick it up.
      `, imageLibrary.lantern);
    }
    onPickup() {
        super.pickup();
        this.player.canSeeTraps = true;
    }
    onDrop() {
        this.player.canSeeTraps = false;
    }
}
class Hourglass extends Item {
    constructor(p, g){
        super("Bone-sand Hourglass", 2, 30, p, g, `
      The sound of sand draws your attention to an hourglass.
      The irregular, bone-colored sand seems to last just long enough for you to move between rooms.
      Highlights nearby skeletons while held and for 5 turns after using.
      `, imageLibrary.hourglass);
    }
    sandDrops = 5;
    handleMove = (e)=>{
        if (e.detail === this.player && !this.sandDrops--) this.onDrop();
    };
    onPickup() {
        super.pickup();
        this.player.vision = 1;
    }
    onDrop() {
        this.player.vision = 0;
    }
    use() {
        if (!this.uses) return false;
        this.game.sendMessage({
            action: "freeze",
            playerId: this.player.uuid
        });
        if (this.uses === 1) {
            addEventListener("playermove", this.handleMove);
        }
        return super.use();
    }
    get usable() {
        return !!this.uses;
    }
}
class Dice extends Item {
    constructor(p, g){
        super("Cursed Dice", Infinity, 0, p, g, `
      The dice on the gaming table glow a sinister red.
      Are you feeling lucky?
      `, imageLibrary.dice);
    }
    handler = (e)=>{
        this.player.addPoints(e.detail);
        this.game.sendMessage({
            action: "dice",
            playerId: this.player.uuid
        });
    };
    onPickup() {
        super.pickup();
        addEventListener("score", this.handler);
    }
    onDrop() {
        removeEventListener("score", this.handler);
    }
}
class Quill extends Item {
    onPickup() {
        super.pickup();
    }
    onDrop() {}
    constructor(p, g){
        super("Ethereal Quill", 1, 30, p, g, `
      A ghostly quill floats above the desk.
      Maybe you could use it draw a door?
      `, imageLibrary.quill);
    }
    get usable() {
        return !!this.uses && !this.player.room.secretTunnel;
    }
    use() {
        if (!super.use()) return false;
        while(!this.player.room.secretTunnel){
            const room = this.game.grid.get(this.game.randomSelector(this.player.room.level));
            if (!room.secretTunnel) {
                room.secretTunnel = this.player.room;
                this.player.room.secretTunnel = room;
            }
        }
        this.player.room.tunnelKnown = true;
        this.player.room.secretTunnel.tunnelKnown = true;
        this.player.item = undefined;
        return true;
    }
}
class Thread extends Item {
    path;
    constructor(p, g){
        super("Spool of Thread", Infinity, 10, p, g, `
      Someone dropped a spool of thread.
      It looks like one end was tied to something in a different room. Maybe you could follow it?
      `, imageLibrary.thread);
    }
    handler = ()=>{
        const entrance = this.game.rooms.find((r)=>r.name === "entrance");
        this.path = this.player.room.findPathTo(entrance, false, true);
    };
    onPickup() {
        super.pickup();
        addEventListener("playermove", this.handler);
        addEventListener("captured", this.handler);
        this.handler();
    }
    onDrop() {
        removeEventListener("playermove", this.handler);
        removeEventListener("captured", this.handler);
    }
    render() {
        super.render();
        if (this.path) {
            const path = this.path;
            doodler.deferDrawing(()=>{
                doodler.drawScaled(10, ()=>{
                    let prev = new Vector(this.player.room.position.x, this.player.room.position.y).mult(32).add(16, 16);
                    for (const step of path.filter((r)=>r.level === this.player.room.level)){
                        const next = new Vector(step.position.x, step.position.y).mult(32).add(16, 16);
                        doodler.line(prev, next, {
                            color: "red"
                        });
                        prev = next;
                    }
                });
            });
        }
    }
}
class Compass extends Item {
    path;
    constructor(p, g){
        super("Spectral Compass", 3, 50, p, g, `
      The glint of this ghostly compass catches your eye.
      The needle flickers in and out of existence. It seems to point to your desires!
      `, imageLibrary.compass);
    }
    handler = ()=>{
        console.log("pathing");
        const floor = this.player.room.level;
        const target = this.player.gatheredTreasures.includes(this.game.treasureRooms[floor]) ? this.game.stairs[floor] : this.game.treasureRooms[floor];
        this.path = this.player.room.findPathTo(target, false, true);
        for (const __char of this.player.room.characters.values()){
            if (__char.name === "skeleton") {
                this.use();
                if (this.uses < 1) {
                    this.onDrop();
                    this.player.item = undefined;
                }
            }
        }
    };
    onPickup() {
        this.player.safe = true;
        this.player.vision = 1;
        addEventListener("playermove", this.handler);
        addEventListener("captured", this.handler);
        this.handler();
        super.pickup();
    }
    onDrop() {
        removeEventListener("playermove", this.handler);
        removeEventListener("captured", this.handler);
        this.player.safe = false;
        this.player.vision = 0;
    }
    render() {
        super.render();
        if (this.path) {
            const center = new Vector(0, this.game.gridSize.y).mult(32).add(8, 7);
            const [current, next] = this.path;
            if (!current || !next) return;
            const dir = new Vector(next.position.x, next.position.y).sub(current.position.x, current.position.y);
            dir.setMag(4);
            doodler.line(center, center.copy().add(dir), {
                color: "black"
            });
        }
    }
}
class Painting extends Item {
    constructor(p, g){
        super("Suspicious Painting", Infinity, 10, p, g, `
      The sheet falls from the corner of a suspicious painting of a door.
      Looking at it, you get the feeling that you've seen the room before...
      `, imageLibrary.painting);
    }
    onPickup() {
        super.pickup();
        this.player.seesTunnels = true;
    }
    onDrop() {
        this.player.seesTunnels = false;
    }
}
class MusicBox extends Item {
    turns = 0;
    constructor(p, g){
        super("Creepy Music Box", 3, 25, p, g, `
      A haunting tune catches your attention.
      Perhaps you could use this to distract skeletons?
      `, imageLibrary.musicBox);
    }
    onPickup() {
        super.pickup();
    }
    onDrop() {}
    get usable() {
        return !!this.uses;
    }
    handler = ()=>{
        this.turns--;
        if (!this.turns) {
            for (const skelly of this.game.skeletons){
                skelly.path = undefined;
            }
        }
    };
    use() {
        if (!this.uses) {
            this.player.item = undefined;
            return false;
        }
        this.game.sendMessage({
            action: "music",
            roomId: this.player.room.uuid,
            playerId: this.player.uuid
        });
        this.turns = 5;
        for (const skelly of this.game.skeletons){
            skelly.path = skelly.room.findPathTo(this.player.room);
        }
        addEventListener("playermove", this.handler);
        return super.use();
    }
    render() {
        super.render();
        for (const skelly of this.game.skeletons){
            if (skelly.path) {
                const path = skelly.path.filter((r)=>r.level === this.player.room.level);
                doodler.deferDrawing(()=>{
                    doodler.drawScaled(10, ()=>{
                        let prev;
                        for (const [i, step] of path.entries()){
                            const next = step.getRoomPos().mult(32).add(16, 16);
                            if (!prev) {
                                prev = next;
                                continue;
                            }
                            doodler.line(prev, next, {
                                color: "aqua"
                            });
                            prev = next;
                        }
                    });
                });
            }
        }
    }
}
const ITEMS = [
    Spyglass,
    CrystalBall,
    SpiderJar,
    Lantern,
    Hourglass,
    Thread,
    Compass,
    MusicBox
];
class Channel {
    id;
    socket;
    callbacks = [];
    joinCallbacks = [];
    leaveCallbacks = [];
    echo;
    constructor(id, socket){
        this.id = id;
        this.socket = socket;
    }
    send = (message, clientToSendTo)=>this.socket.OPEN && this.socket.send(JSON.stringify({
            send_packet: {
                to: this.id,
                message,
                clientToSendTo,
                echo: this.echo
            }
        }));
    addListener = (callback)=>this.callbacks.push(callback);
    onJoinConfirm = (callback)=>this.joinCallbacks.push(callback);
    onLeave = (callback)=>this.leaveCallbacks.push(callback);
    execListeners = (message)=>this.callbacks.forEach((cb)=>cb(message));
    execJoinListeners = ()=>this.joinCallbacks.forEach((cb)=>cb('join'));
    execLeaveListeners = ()=>this.leaveCallbacks.forEach((cb)=>cb('leave'));
}
class Message {
    from;
    to;
    message;
    event;
    status;
    channelId;
    constructor(m){
        this.to = m.to;
        this.from = m.from;
        this.message = m.message;
        this.event = m.event;
        this.status = m.status;
        this.channelId = m.channelId;
    }
}
class Sockpuppet {
    socket;
    channels;
    callbacks;
    initialPing;
    keepAlive = true;
    _versionMismatch;
    get versionMismatch() {
        return this._versionMismatch;
    }
    _handshakeAccepted = false;
    get handshakeAccepted() {
        return this._handshakeAccepted;
    }
    handshakeCheckDelay = 4000;
    socketReady = false;
    static puppetVersion = "0.6";
    messageQueue = [];
    constructor(path, onConnect, options){
        if (isFullUrl(path)) this.socket = new WebSocket(path);
        else this.socket = new WebSocket(`${window.location.host}${path}`);
        if (onConnect) {
            this.socket.addEventListener("open", ()=>{
                this.socket.send("handshake");
                this.socketReady = true;
                setTimeout(()=>{
                    if (!this.handshakeAccepted && this.socketReady) {
                        this._versionMismatch = true;
                        console.warn(`Socket has connected successfully but did not receive a handshake. If the host is a Sockpuppet server, then it may be an older version that does not support handshakes. Consider upgrading the server to ${Sockpuppet.puppetVersion}`);
                    }
                }, this.handshakeCheckDelay);
                onConnect();
            });
        }
        this.keepAlive = options?.keepAlive ?? this.keepAlive;
        this.socket.addEventListener("message", this.handleMessage);
        if (this.keepAlive) {
            this.initialPing = setTimeout(()=>this.socket.OPEN && this.socket.send("pong"), 5000);
        }
        this.channels = new Map();
        this.callbacks = new Map([
            [
                "disconnect",
                []
            ]
        ]);
    }
    joinChannel = (channelId, handler)=>{
        if (this.socket.readyState === 1) {
            const channel = new Channel(channelId, this.socket);
            this.channels.set(channelId, channel);
            channel.addListener(handler);
            this.socket.send(JSON.stringify({
                connect_to: [
                    channelId
                ]
            }));
        } else {
            this.socket.addEventListener("open", ()=>{
                const channel = new Channel(channelId, this.socket);
                this.channels.set(channelId, channel);
                channel.addListener(handler);
                this.socket.send(JSON.stringify({
                    connect_to: [
                        channelId
                    ]
                }));
            });
        }
    };
    on = (event, callback)=>{
        if (!this.callbacks.has(event)) {
            this.callbacks.set(event, []).get;
        }
        this.callbacks.get(event)?.push(callback);
    };
    onDisconnect = (callback)=>this.callbacks.get("disconnect")?.push(callback);
    handleMessage = (message)=>{
        switch(message.data){
            case "open":
            case "connected":
                break;
            case "disconnected":
                this.callbacks.get("disconnect")?.forEach((cb)=>cb(message.data));
                this.channels.forEach((channel)=>channel.execLeaveListeners());
                break;
            case "ping":
                clearTimeout(this.initialPing);
                if (this.keepAlive) {
                    this.socket.send("pong");
                }
                break;
            default:
                this.messageQueue.push(message);
                this.processQueue();
                break;
        }
    };
    processQueue() {
        let message = this.messageQueue.shift();
        while(message){
            try {
                const msg = new Message(JSON.parse(message.data));
                this.handleEvents(msg);
            } catch (_e) {
                const msg = message.data;
                this.callbacks.get(msg)?.forEach((cb)=>cb(msg));
            }
            message = this.messageQueue.shift();
        }
    }
    handleEvents = (message)=>{
        switch(message.event){
            case "leave":
                this.deleteChannel(message.to);
                break;
            case "join":
                this.channels.get(message.to)?.execJoinListeners();
                break;
            case "create":
                this.onChannelCreate(message);
                break;
            case "handshake":
                {
                    this._handshakeAccepted = true;
                    this._versionMismatch = message.message.puppetVersion < Sockpuppet.puppetVersion;
                    if (this._versionMismatch) {
                        console.warn("Sockpuppet server version is older than client. Functionality is limited");
                    }
                }
        }
        this.callbacks.get(message.event || message.message)?.forEach((cb)=>cb(message));
        this.channels.get(message.to)?.execListeners(message.message);
    };
    leaveChannel = (channelId)=>this.socket.send(JSON.stringify({
            disconnect_from: [
                channelId
            ]
        }));
    deleteChannel = (channelId)=>{
        const channel = this.channels.get(channelId);
        if (channel) {
            channel.execLeaveListeners();
            this.channels.delete(channelId);
        }
    };
    getChannel = (channelId)=>this.channels.get(channelId);
    createChannel = (channelId)=>new Promise((res, rej)=>{
            this.socket.send(JSON.stringify({
                create_channel: channelId
            }));
            const poll = setInterval(()=>{
                const channelMessage = this.channelCreateMessages.get(channelId);
                if (channelMessage) {
                    clearInterval(poll);
                    switch(channelMessage.status){
                        case "FAILED":
                            rej(channelMessage);
                            break;
                        case "SUCCESS":
                            res(channelMessage);
                            break;
                    }
                    this.channelCreateMessages.delete(channelId);
                }
            }, 10);
        });
    channelCreateMessages = new Map();
    onChannelCreate = (msg)=>{
        this.channelCreateMessages.set(msg.channelId, msg);
    };
}
const isFullUrl = (url)=>/(wss?|https?):\/\/.+\.(io|com|org|net)(\/.*)?/i.test(url) || url.includes("localhost");
const solver = (rooms)=>{
    const basementStairs = rooms.find((r)=>r.name === "stairs" && r.level === "basement");
    const lowerStairs = rooms.find((r)=>r.name === "stairs" && r.level === "lower");
    const upperStairs = rooms.find((r)=>r.name === "stairs" && r.level === "upper");
    return recursiveSearch(basementStairs, [], "dungeon") && recursiveSearch(basementStairs, [], "treasure") && recursiveSearch(lowerStairs, [], "entrance") && recursiveSearch(lowerStairs, [], "treasure") && recursiveSearch(upperStairs, [], "treasure");
};
const recursiveSearch = (current, last, target)=>{
    if (target === "treasure" && current.hasTreasure) return true;
    if (target === current.name) return true;
    if (target === current) return true;
    for (const door of current.doors){
        if (current.neighbors[door] && !last.includes(current.neighbors[door]) && recursiveSearch(current.neighbors[door], [
            ...last,
            current
        ], target)) {
            return true;
        }
    }
    return false;
};
const rooms = [
    {
        name: "bedroom",
        floors: [
            "upper"
        ]
    },
    {
        name: "hallway",
        floors: [
            "upper",
            "lower",
            "basement"
        ]
    },
    {
        name: "dining room",
        floors: [
            "lower"
        ]
    },
    {
        name: "parlor",
        floors: [
            "lower",
            "upper"
        ]
    },
    {
        name: "library",
        floors: [
            "lower",
            "upper"
        ]
    },
    {
        name: "study",
        floors: [
            "lower",
            "upper"
        ]
    },
    {
        name: "game room",
        floors: [
            "lower"
        ]
    },
    {
        name: "cellar",
        floors: [
            "basement"
        ]
    },
    {
        name: "catacomb",
        floors: [
            "basement"
        ]
    },
    {
        name: "alcoves",
        floors: [
            "basement"
        ]
    }
];
const directions = [
    "north",
    "south",
    "east",
    "west"
];
class Room {
    level;
    name;
    uuid;
    trapCount = 0;
    position;
    unique;
    game;
    doors;
    characters = new Map();
    _hasTreasure;
    _lootTable;
    get hasTreasure() {
        return this._hasTreasure;
    }
    set hasTreasure(t) {
        this._hasTreasure = t;
        this.color = "goldenrod";
    }
    element;
    known = false;
    color;
    image;
    doorImage;
    itemChance;
    secretTunnel;
    secretTunnelId;
    constructor(r, g){
        this.level = r.level;
        this.name = r.name;
        this.hasTreasure = r.hasTreasure || false;
        this.doors = r.doors || [];
        this.position = r.position;
        this.uuid = r.uuid || window.crypto.randomUUID();
        this.image = new Image(32, 32);
        this.doorImage = new Image(32, 32);
        this.game = g;
        this.itemChance = Math.max(0, Math.random() - .2);
        this.doorImage = this.level === "basement" ? imageLibrary.basementDoor : imageLibrary.door;
        const lootNames = [
            "a coin",
            "a neat painting",
            "a bag of marbles",
            "a broken flashlight",
            "a cool beetle"
        ];
        switch(this.name){
            case "hallway":
                this.image = this.level !== "basement" ? imageLibrary.hallway : imageLibrary.basementHallway;
                this.doorImage = this.level !== "basement" ? imageLibrary.hallwayDoor : imageLibrary.basementHallwayDoor;
                break;
            case "dining room":
                this.image = imageLibrary.diningRoom;
                lootNames.push("tarninshed silver spoon", "mostly intact China");
                break;
            case "bedroom":
                this.image = imageLibrary.bedroom;
                break;
            case "parlor":
                this.image = imageLibrary.parlor;
                lootNames.push("a chipped vase", "a ratty old magazine");
                break;
            case "library":
                this.image = imageLibrary.library;
                lootNames.push("a dusty old book", "a heavy tome");
                break;
            case "cellar":
                this.image = imageLibrary.cellar;
                lootNames.push("a jar of pickled eyes");
                break;
            case "catacomb":
                this.image = imageLibrary.catacombs;
                lootNames.push("a headless skeleton");
                break;
            case "alcoves":
                this.image = imageLibrary.alcoves;
                lootNames.push("a faded painting");
                break;
            case "dungeon":
                this.image = imageLibrary.dungeon;
                break;
            case "entrance":
                this.image = imageLibrary.entrance;
                this.itemChance = .05;
                break;
            case "stairs":
                switch(this.level){
                    case "upper":
                        this.image = imageLibrary.upperStairs;
                        break;
                    case "lower":
                        this.image = imageLibrary.lowerStairs;
                        break;
                    case "basement":
                        this.image = imageLibrary.basementStairs;
                        break;
                }
                this.doorImage = this.level !== "basement" ? imageLibrary.stairsDoor : imageLibrary.basementStairsDoor;
                break;
            case "study":
                this.image = imageLibrary.study;
                lootNames.push("strongly worded letter");
                break;
            case "game room":
                this.image = imageLibrary.gameRoom;
                lootNames.push("burned playing card");
                break;
        }
        this._lootTable = [];
        let acc = 0;
        while(acc < 1000){
            const weight = Math.random() * 150 + 50;
            if (Math.random() < .2) {
                this._lootTable.push({
                    type: "item",
                    item: ITEMS[Math.floor(Math.random() * ITEMS.length)],
                    weight
                });
            } else {
                this._lootTable.push({
                    type: "points",
                    name: lootNames[Math.floor(Math.random() * lootNames.length)],
                    weight,
                    value: Math.ceil(Math.random() * 10)
                });
            }
            acc += weight;
        }
        this.rotation = this.name === "entrance" ? 0 : 2 * Math.PI * (Math.floor(Math.random() * 4) / 4);
    }
    get neighbors() {
        return {
            north: this.game?.grid.get(`${this.position.x},${this.position.y - 1},${this.level}`),
            south: this.game?.grid.get(`${this.position.x},${this.position.y + 1},${this.level}`),
            east: this.game?.grid.get(`${this.position.x + 1},${this.position.y},${this.level}`),
            west: this.game?.grid.get(`${this.position.x - 1},${this.position.y},${this.level}`)
        };
    }
    generateDoors = ()=>{
        if (this.neighbors.north?.doors.includes("south")) this.doors.push("north");
        if (this.neighbors.west?.doors.includes("east")) this.doors.push("west");
        if (this.position.y !== this.game.gridSize.y - 1 && Math.random() > this.doors.length / 5) this.doors.push("south");
        if (this.position.x !== this.game.gridSize.x - 1 && Math.random() > this.doors.length / 5) this.doors.push("east");
        if (this.doors.length === 0 || this.doors.length === 1) {
            let randomDoor = directions[Math.floor(Math.random() * directions.length)];
            tryAdd: while(this.doors.length === 0){
                randomDoor = directions[Math.floor(Math.random() * directions.length)];
                switch(randomDoor){
                    case "east":
                        {
                            if (this.position.x === this.game.gridSize.x - 1) continue tryAdd;
                            this.neighbors.east?.doors.push("west");
                            break;
                        }
                    case "west":
                        {
                            if (this.position.x === 0) continue tryAdd;
                            this.neighbors.west?.doors.push("east");
                            break;
                        }
                    case "north":
                        {
                            if (this.position.y === 0) continue tryAdd;
                            this.neighbors.north?.doors.push("south");
                            break;
                        }
                    case "south":
                        {
                            if (this.position.y === this.game.gridSize.y - 1) continue tryAdd;
                            this.neighbors.south?.doors.push("north");
                            break;
                        }
                }
                this.doors.push(randomDoor);
            }
        }
        this.doors = Array.from(new Set(this.doors));
    };
    get accessor() {
        return `${this.position.x},${this.position.y},${this.level}`;
    }
    get lootTable() {
        switch(this.name){
            case "stairs":
                return [];
            case "bedroom":
                this._lootTable.push({
                    type: "item",
                    item: Mirror,
                    weight: Math.random() * 100 + 10
                });
                break;
            case "game room":
                this._lootTable.push({
                    type: "item",
                    item: Dice,
                    weight: Math.random() * 100 + 200
                });
                break;
            case "study":
                this._lootTable.push({
                    type: "item",
                    item: Quill,
                    weight: Math.random() * 100 + 50
                });
                break;
            case "catacomb":
                this._lootTable.push({
                    type: "item",
                    item: Skull,
                    weight: Math.random() * 100 + 100
                });
                break;
            case "alcoves":
                this._lootTable.push({
                    type: "item",
                    item: Painting,
                    weight: Math.random() * 100
                });
                break;
            case "entrance":
                return [
                    {
                        item: Compass,
                        type: "item",
                        weight: 1
                    }
                ];
        }
        return this._lootTable;
    }
    hasBeenSearched = false;
    get tunnelMessage() {
        switch(this.name){
            case "library":
                return "You try to pull a book off of a shelf, but it catches on something and the whole bookcase swings to reveal a passageway.";
            default:
                return "A hidden door! I wonder where it leads?";
        }
    }
    tunnelKnown = false;
    search() {
        this.hasBeenSearched = true;
        if (this.secretTunnel && !this.tunnelKnown) {
            this.tunnelKnown = true;
            this.secretTunnel.tunnelKnown = true;
            this.game.alert(this.tunnelMessage, 5000);
        } else if (Math.random() < this.itemChance) {
            const loots = [];
            for (const loot of this.lootTable){
                for(let i = 0; i < loot.weight; i++){
                    loots.push(loot);
                }
            }
            const loot = loots[Math.floor(Math.random() * loots.length)];
            switch(loot.type){
                case "points":
                    {
                        this.game.player?.addPoints(loot.value, true);
                        const prev = this.game.dialog.innerHTML;
                        this.game.dialog.innerHTML = `You found ${loot.name} worth ${loot.value} points!`;
                        this.game.dialog.showModal();
                        setTimeout(()=>{
                            this.game.dialog.close();
                            this.game.dialog.innerHTML = prev || "";
                        }, 3000);
                        break;
                    }
                case "item":
                    {
                        const item = new loot.item(this.game.player, this.game);
                        this.game.player?.addPoints(item.points);
                        break;
                    }
            }
        }
        this.game.player?.move("search");
        this.game.render();
    }
    rotation;
    drawTreasure(pos) {
        doodler.drawScaled(.5, ()=>{
            doodler.drawImage(imageLibrary.treasure, pos.add(20, 20).mult(2));
        });
    }
    getRoomPos() {
        return new Vector(this.position.x, this.position.y);
    }
    render(offset = new Vector(0, 0)) {
        const startPos = new Vector(this.position.x + offset.x, this.position.y).mult(32);
        if (this.known || this.game.isHost) {
            doodler.drawRotated(startPos.copy().add(16, 16), this.rotation, ()=>{
                doodler.drawImage(this.image, startPos);
            });
            for (const door of this.doors){
                let angle = 0;
                switch(door){
                    case "south":
                        angle = Math.PI;
                        break;
                    case "east":
                        angle = Math.PI / 2;
                        break;
                    case "west":
                        angle = 2 * Math.PI * (3 / 4);
                        break;
                }
                doodler.drawRotated(startPos.copy().add(16, 16), angle, ()=>{
                    doodler.drawImage(this.doorImage, startPos);
                });
            }
        }
        if (this.game?.isHost || this.game?.player && this.characters.get(this.game.player.uuid)) {
            for (const __char of this.characters.values()){
                __char.render(startPos);
            }
        }
        if (this.hasTreasure && (this.game.isHost || this.known || this.game.player?.knownTreasures.includes(this))) {
            this.drawTreasure(startPos.copy());
        }
        if (this.position.x === 0 && this.level !== "basement" && this.name !== "hallway") {
            doodler.drawImage(imageLibrary.window, startPos);
        }
        if (this.game.player?.vision && this.characters.size) {
            const roomPos = this.getRoomPos().mult(32);
            const player = this.game.player;
            const distance = this.calculateDistanceToRoom(player.room);
            if (distance < player.vision && player.room !== this) {
                const renderables = [
                    "skeleton",
                    "ghost"
                ].filter((r)=>player.visionIncludesAllMonsters || r === "skeleton");
                for (const __char of this.characters.values()){
                    if (!renderables.includes(__char.name)) continue;
                    doodler.deferDrawing(()=>{
                        doodler.drawScaled(10, ()=>{
                            __char.render(roomPos);
                        });
                    });
                }
            }
        }
        if (this.game?.player?.sight && this.characters.get(this.game.player.uuid)) {
            for (const door of this.doors){
                let room = this.neighbors[door];
                while(room && this.calculateDistanceToRoom(room) < this.game.player.sight + 1){
                    const r = room;
                    const roomPos = r.getRoomPos().mult(32);
                    if (this.game.isHost) {
                        roomPos.add(Room.FloorZ[r.level] * 32 * this.game.gridSize.x, 0);
                    }
                    doodler.deferDrawing(()=>{
                        doodler.drawScaled(10, ()=>{
                            if (r.hasTreasure) r.drawTreasure(roomPos.copy());
                            for (const __char of r.characters.values()){
                                __char.render(roomPos);
                            }
                        });
                    });
                    if (room.doors.includes(door)) room = room.neighbors[door];
                    else room = undefined;
                }
            }
        }
        if (this.trapCount && (this.game.isHost || this.game.player?.canSeeTraps)) {
            const point = startPos.copy().add(2, 22);
            doodler.drawScaled(.5, ()=>{
                doodler.drawImage(imageLibrary.trap, point.mult(2));
            });
        }
        if ((this.game.isHost || this.known && this.tunnelKnown || this.game.player?.seesTunnels) && this.secretTunnel) {
            doodler.drawScaled(.5, ()=>{
                doodler.drawImageWithOutline(imageLibrary.tunnel, startPos.copy().mult(2).add(3, 3), {
                    weight: 6,
                    color: "white"
                });
            });
        }
        if (this.game.player?.seesTunnels && this.secretTunnel) {
            for (const __char of this.characters.values()){
                doodler.deferDrawing(()=>{
                    doodler.drawScaled(10, ()=>{
                        __char.render(startPos);
                    });
                });
            }
        }
    }
    calculateDistanceToRoom(room) {
        const thisVec = new Vector(this.position.x, this.position.y);
        const roomVec = new Vector(room.position.x, room.position.y);
        return thisVec.dist(roomVec);
    }
    findPathTo(targetRoom, includeDiagonal = false, includeSecretTunnel = false) {
        const openSet = [
            this
        ];
        const cameFrom = {};
        const gScore = {
            [this.getKey()]: 0
        };
        const fScore = {
            [this.getKey()]: this.heuristic(targetRoom, includeDiagonal)
        };
        while(openSet.length > 0){
            const current = this.getMinFScoreRoom(openSet, fScore);
            if (current === targetRoom) {
                return this.reconstructPath(cameFrom, current);
            }
            openSet.splice(openSet.indexOf(current), 1);
            const neighbors = current.getNeighbors(includeDiagonal, includeSecretTunnel);
            for (const neighbor of neighbors){
                const tentativeGScore = gScore[current.getKey()] + Room.distance(current, neighbor, includeDiagonal);
                if (!gScore[neighbor.getKey()] || tentativeGScore < gScore[neighbor.getKey()]) {
                    cameFrom[neighbor.getKey()] = current;
                    gScore[neighbor.getKey()] = tentativeGScore;
                    fScore[neighbor.getKey()] = tentativeGScore + neighbor.heuristic(targetRoom, includeDiagonal);
                    if (openSet.indexOf(neighbor) === -1) {
                        openSet.push(neighbor);
                    }
                }
            }
        }
        return null;
    }
    getNeighbors(includeDiagonal, includeSecretTunnel) {
        const neighbors = [];
        for (const door of this.doors){
            const neighbor = this.neighbors[door];
            if (!neighbor) continue;
            neighbors.push(neighbor);
            if (includeDiagonal) {
                let doors;
                switch(door){
                    case "north":
                    case "south":
                        doors = [
                            "east",
                            "west"
                        ];
                        break;
                    case "east":
                    case "west":
                        doors = [
                            "north",
                            "south"
                        ];
                        break;
                }
                doors = doors.filter((d)=>neighbor.doors.includes(d));
                for (const door of doors){
                    const diagonal = neighbor.neighbors[door];
                    if (!diagonal) continue;
                    neighbors.push(diagonal);
                }
            }
        }
        if (this.name === "stairs") {
            let stairs = this.game.rooms.filter((r)=>r.name === "stairs");
            switch(this.level){
                case "upper":
                case "basement":
                    stairs = stairs.filter((s)=>s.level === "lower");
                    break;
                case "lower":
                    stairs = stairs.filter((s)=>s.level !== "lower");
                    break;
            }
            neighbors.push(...stairs);
        }
        if (includeSecretTunnel && this.secretTunnel && this.tunnelKnown) {
            neighbors.push(this.secretTunnel);
        }
        return Array.from(new Set(neighbors));
    }
    getMinFScoreRoom(openSet, fScore) {
        let minRoom = openSet[0];
        for (const room of openSet){
            if (fScore[room.getKey()] < fScore[minRoom.getKey()]) {
                minRoom = room;
            }
        }
        return minRoom;
    }
    reconstructPath(cameFrom, current) {
        const path = [
            current
        ];
        while(cameFrom[current.getKey()] && current !== this){
            current = cameFrom[current.getKey()];
            path.unshift(current);
        }
        return path;
    }
    static distance(room1, room2, includeDiagonal) {
        if (room1.name === "stairs" && room2.name === "stairs") return 1;
        return includeDiagonal ? new Vector(room1.position.x, room1.position.y, Room.FloorZ[room1.level]).dist(new Vector(room2.position.x, room2.position.y, Room.FloorZ[room2.level])) : Math.abs(room1.position.x - room2.position.x) + Math.abs(room1.position.y - room2.position.y) + Math.abs(Room.FloorZ[room1.level] - Room.FloorZ[room1.level]);
    }
    static FloorZ = {
        basement: 0,
        lower: 1,
        upper: 2
    };
    heuristic(targetRoom, includeDiagonal) {
        return targetRoom.level === this.level ? Room.distance(this, targetRoom, includeDiagonal) : Room.distance(this, this.game.stairs[this.level], includeDiagonal);
    }
    getKey() {
        return `${this.position.x}-${this.position.y}-${Room.FloorZ[this.level]}`;
    }
}
const floors = [
    "basement",
    "lower",
    "upper"
];
class Character {
    name;
    uuid;
    _room;
    get room() {
        return this._room;
    }
    set room(r) {
        this._room?.characters.delete(this.uuid);
        this._room = r;
        this._room.characters.set(this.uuid, this);
        if (this.uuid === this.game?.player?.uuid) {
            this.room.known = true;
            if (!this.game?.isHost) {
                this.game.floor = this._room.level;
            }
        }
    }
    game;
    image;
    teleportLocation;
    constructor(name, game){
        this.name = name;
        this.uuid = window.crypto.randomUUID();
        this.image = new Image();
        switch(this.name){
            case "ghost":
                this.image.src = "./assets/images/ghost.png";
                break;
            default:
                this.image.src = "./assets/images/explorer.png";
        }
        this.game = game;
        this.randomizeRoomPosition();
    }
    get validSpaces() {
        const spaces = this.room.doors.map((d)=>[
                d,
                this.room?.neighbors[d]
            ]);
        if (this.room?.name === "stairs") {
            const currentLevel = this.room.level;
            const options = {
                up: {
                    basement: "lower",
                    lower: "upper",
                    upper: "asdf"
                },
                down: {
                    upper: "lower",
                    lower: "basement",
                    basement: "asdf"
                }
            };
            const up = this.game?.rooms.find((r)=>r.name === "stairs" && r.level === options["up"][currentLevel]);
            const down = this.game?.rooms.find((r)=>r.name === "stairs" && r.level === options["down"][currentLevel]);
            spaces.push([
                "up",
                up
            ]);
            spaces.push([
                "down",
                down
            ]);
        }
        return spaces.filter((s)=>!!s[1]);
    }
    move(dir, target) {
        this.randomizeRoomPosition();
        if (dir && this.room.trapCount && dir !== "search" && !this.game.isHost) {
            this.room === this.room;
            this.room.trapCount -= 1;
            const prev = this.game?.dialog?.innerHTML;
            this.game.dialog.innerHTML = "AAAARRRGH! A BUNCH OF SPIDERS HAVE YOU TRAPPED!";
            this.game.dialog?.showModal();
            setTimeout(()=>{
                this.game.dialog?.close();
                this.game.dialog.innerHTML = prev || "";
            }, 3000);
            !this.game.isHost && this.game.sendMessage({
                action: "move",
                playerId: this.uuid,
                direction: "search",
                playerName: this.name
            });
            this.game.render();
        } else if (dir) {
            this.room?.element?.classList.remove("current");
            if (dir === "up" || dir === "down") {
                const currentLevel = this.room.level;
                const options = {
                    up: {
                        basement: "lower",
                        upper: "upper",
                        lower: "upper"
                    },
                    down: {
                        upper: "lower",
                        lower: "basement",
                        basement: "basement"
                    }
                };
                this.room = this.game?.rooms.find((r)=>r.name === "stairs" && r.level === options[dir][currentLevel]);
            } else if (dir === "search") {
                this.room === this.room;
            } else if (dir === "secret") {
                this.room = this.room.secretTunnel || this.room;
            } else if (dir === "nav") {
                this.room = target;
            } else {
                this.room = this.room.neighbors[dir];
            }
        }
        const moveEvent = new CustomEvent("playermove", {
            detail: this
        });
        dispatchEvent(moveEvent);
    }
    searchRoom = ()=>{};
    roomPosition;
    randomizeRoomPosition() {
        this.roomPosition = new Vector(Math.floor(Math.random() * 26), Math.floor(Math.random() * 24));
    }
    path;
    renderPath(pos) {
        if (this.path && this.game.isHost) {
            const path = this.path;
            doodler.deferDrawing(()=>{
                doodler.drawScaled(10, ()=>{
                    let prev = pos.copy().add(16, 16);
                    for (const step of path){
                        const next = step.getRoomPos().add(Room.FloorZ[step.level] * this.game.gridSize.x, 0).mult(32).add(16, 16);
                        doodler.line(prev, next, {
                            color: "red"
                        });
                        prev = next;
                    }
                });
            });
        }
    }
}
class Player extends Character {
    gatheredTreasures = [];
    knownTreasures = [];
    hasMoved = true;
    item;
    seesTunnels = false;
    vision = 0;
    sight = 0;
    visionIncludesAllMonsters = false;
    canSeeTraps = false;
    _safe = false;
    get safe() {
        return this._safe;
    }
    set safe(s) {
        this._safe = s;
        if (!this.game?.isHost) {
            this.game.channel?.send(JSON.stringify({
                playerId: this.uuid,
                action: "safe",
                safe: this._safe
            }));
        }
    }
    hasWon = false;
    _score = 0;
    get score() {
        return this._score;
    }
    addPoints(s, doubleable) {
        this._score = Math.max(0, this._score + s);
        if (doubleable) {
            dispatchEvent(new CustomEvent("score", {
                detail: s
            }));
        }
        this.game.sendMessage({
            action: "score",
            score: this.score,
            playerId: this.uuid
        });
    }
    init = ()=>{
        const buttons = document.querySelectorAll("button.movement");
        buttons.forEach((b)=>b.addEventListener("click", (e)=>{
                const dir = e.target.dataset.dir;
                switch(dir){
                    case "c":
                        this.room.search();
                        break;
                    case "b":
                        this.item?.use();
                        break;
                    case "d":
                        {
                            this.move("secret");
                            audioLibrary.secretTunnel.play();
                            break;
                        }
                    default:
                        this.move(dir);
                }
            }));
    };
    buttons = ()=>{
        const buttons = document.querySelectorAll("button.movement");
        const validSpaces = this.validSpaces;
        buttons.forEach((b)=>{
            const dir = b.dataset.dir;
            const room = validSpaces?.find((s)=>s[0] === dir);
            if (room) {
                b.disabled = false;
            } else {
                b.disabled = true;
            }
            if (dir === "up" && this.room?.name === "stairs" && (this.room.level === "basement" || this.room.level === "lower")) {
                b.disabled = false;
            }
            if (dir === "down" && this.room?.name === "stairs" && (this.room.level === "upper" || this.room.level === "lower")) {
                b.disabled = false;
            }
            if (dir === "c" && !this.room.hasBeenSearched && !this.hasWon) {
                b.disabled = false;
                b.textContent = this.room.itemChance > 0 ? `Search ${Math.floor(this.room.itemChance * 100)}%` : "Search";
            }
            if (dir === "b" && this.item?.usable) {
                b.disabled = false;
            }
            if (dir === "d" && this.room.tunnelKnown) {
                b.classList.remove("hidden");
                b.disabled = false;
            }
            if (this.hasMoved) {
                switch(dir){
                    case "d":
                        b.classList.add("hidden");
                        break;
                    default:
                        b.disabled = true;
                }
            }
        });
    };
    move(dir, target) {
        this.hasMoved = true;
        dir === "nav" ? super.move(dir, target) : super.move(dir);
        this.game?.render();
        this.game.sendMessage({
            action: "move",
            playerId: this.uuid,
            direction: dir,
            roomId: this.room.uuid
        });
        if (this.room?.hasTreasure && !this.gatheredTreasures.includes(this.room)) {
            this.gatheredTreasures.push(this.room);
            audioLibrary.treasure.play();
            this.addPoints(50);
        }
        this.game.floor = this.room?.level || this.game.floor;
    }
    render(startPos) {
        doodler.drawWithAlpha(this.safe ? .25 : 1, ()=>{
            doodler.drawScaled(1 / 2, ()=>{
                this.game?.player === this ? doodler.drawImageWithOutline(this.image, startPos.copy().add(this.roomPosition).mult(2), {
                    color: "lime",
                    weight: 6
                }) : doodler.drawImage(this.image, startPos.copy().add(this.roomPosition).mult(2));
            });
        });
        doodler.deferDrawing(()=>{
            doodler.drawScaled(10 / 2, ()=>{
                const name = this.uuid === this.game?.player?.uuid ? "" : this.name;
                doodler.fillText(name, startPos.copy().add(this.roomPosition).add(4, 12).mult(2), 40, {
                    color: "lime",
                    textAlign: "center"
                });
            });
        });
    }
}
class Skeleton extends Character {
    frozen = 0;
    targetRoom = [];
    targetingTurns = 0;
    constructor(index, game){
        super("skeleton", game);
        this.uuid = "skeleton-" + index;
        this.image.src = "./assets/images/skeleton.png";
    }
    navigate() {
        const target = this.targetRoom.sort((a, b)=>Room.distance(this.room, b, true) - Room.distance(this.room, a, true))[0];
        if (target && this.targetingTurns && (!this.path || this.path.at(-1) !== target)) {
            this.path = this.room.findPathTo(target);
            this.path?.shift();
        }
        if (this.path && this.path.length && this.targetingTurns) {
            this.room = this.path.shift();
            this.targetingTurns--;
            if (!this.targetingTurns || this.room === target) {
                this.path = undefined;
                this.targetRoom = [];
            }
        } else {
            const validSpaces = this.validSpaces;
            const room = this.room.trapCount || this.frozen ? this.room : this.teleportLocation || validSpaces[Math.floor(Math.random() * validSpaces.length)][1];
            this.room.trapCount && this.room.trapCount--;
            this.frozen && this.frozen--;
            this.teleportLocation = undefined;
            this.move("nav", room);
        }
    }
    render(startPos) {
        doodler.drawScaled(1 / 3, ()=>{
            doodler.drawImageWithOutline(this.image, startPos.copy().add(this.roomPosition).mult(3), {
                weight: 6,
                color: "purple"
            });
        });
        super.renderPath(startPos);
    }
}
class Game {
    rooms = [];
    characters = new Map();
    gridSize = {
        x: 5,
        y: 6
    };
    grid = new Map();
    entranceD = {
        x: 0,
        y: 0
    };
    isHost = false;
    player;
    players = [];
    dialog = document.querySelector("dialog");
    floor = "basement";
    tick = ()=>{
        this.skeletonCheck();
        this.skeletonMove();
        this.render();
    };
    skeletonCount = 3;
    stairs;
    dungeon;
    entrance;
    treasureRooms;
    generate = ()=>{
        let solvable = false;
        const allStairs = {
            upper: undefined,
            lower: undefined,
            basement: undefined
        };
        const treasureRooms = {
            upper: undefined,
            lower: undefined,
            basement: undefined
        };
        this.skeletonCount = Number(prompt("How many skeletons?") || "3");
        while(!solvable){
            const floors = [
                "basement",
                "lower",
                "upper"
            ];
            this.grid = new Map();
            this.rooms = [];
            this.characters = new Map();
            for (const floor of floors){
                const stairX = Math.floor(Math.random() * this.gridSize.x);
                const stairY = Math.floor(Math.random() * this.gridSize.y);
                const stairs = new Room({
                    name: "stairs",
                    position: {
                        x: stairX,
                        y: stairY
                    },
                    level: floor
                }, this);
                allStairs[floor] = stairs;
                this.grid.set(`${stairX},${stairY},${floor}`, stairs);
                if (floor === "basement") {
                    let spaceIsOccupied = false;
                    let dungeonX;
                    let dungeonY;
                    do {
                        dungeonX = Math.floor(Math.random() * this.gridSize.x);
                        dungeonY = Math.floor(Math.random() * this.gridSize.y);
                        spaceIsOccupied = !!this.grid.get(`${dungeonX},${dungeonY},${floor}`);
                    }while (spaceIsOccupied)
                    const dungeon = new Room({
                        name: "dungeon",
                        position: {
                            x: dungeonX,
                            y: dungeonY
                        },
                        level: floor
                    }, this);
                    this.grid.set(`${dungeonX},${dungeonY},${floor}`, dungeon);
                    this.dungeon = dungeon;
                }
                if (floor === "lower") {
                    let entranceX;
                    const entranceY = this.gridSize.y - 1;
                    let spaceIsOccupied = false;
                    do {
                        entranceX = Math.floor(Math.random() * this.gridSize.x);
                        spaceIsOccupied = !!this.grid.get(`${entranceX},${entranceY},${floor}`);
                    }while (spaceIsOccupied)
                    const entrance = new Room({
                        name: "entrance",
                        position: {
                            x: entranceX,
                            y: entranceY
                        },
                        level: floor
                    }, this);
                    entrance.known = true;
                    this.grid.set(`${entranceX},${entranceY},${floor}`, entrance);
                    this.entranceD = {
                        x: entranceX,
                        y: entranceY
                    };
                    this.entrance = entrance;
                }
                for(let x = 0; x < this.gridSize.x; x++){
                    for(let y = 0; y < this.gridSize.y; y++){
                        if (!this.grid.get(`${x},${y},${floor}`)) {
                            const validRooms = rooms.filter((r)=>r.floors.includes(floor));
                            const selectedRoom = validRooms[Math.floor(Math.random() * validRooms.length)];
                            const room = new Room({
                                name: selectedRoom.name,
                                level: floor,
                                position: {
                                    x,
                                    y
                                }
                            }, this);
                            this.grid.set(`${x},${y},${floor}`, room);
                        }
                    }
                }
            }
            for (const floor of floors){
                for(let x = 0; x < this.gridSize.x; x++){
                    for(let y = 0; y < this.gridSize.y; y++){
                        const room = this.grid.get(`${x},${y},${floor}`);
                        room?.generateDoors();
                    }
                }
                const bannedRooms = [
                    "hallway",
                    "stairs",
                    "entrance",
                    "dungeon"
                ];
                let treasureRoom = this.grid.get(this.randomSelector(floor));
                while(!treasureRoom?.doors.length || bannedRooms.includes(treasureRoom.name)){
                    treasureRoom = this.grid.get(this.randomSelector(floor));
                }
                treasureRoom.hasTreasure = true;
                treasureRooms[floor] = treasureRoom;
            }
            for (const room of this.grid.values())this.rooms.push(room);
            solvable = solver(this.rooms);
        }
        this.stairs = allStairs;
        this.treasureRooms = treasureRooms;
        const tunnel1 = this.grid.get(this.randomSelector("basement"));
        const tunnel2 = this.grid.get(this.randomSelector());
        tunnel1.secretTunnel = tunnel2;
        tunnel2.secretTunnel = tunnel1;
    };
    init = ()=>{
        const rooms = Array.from(this.grid.values()).sort((a)=>{
            if (a.level === "basement") return -1;
            if (a.level === "lower") return 0;
            if (a.level === "upper") return 1;
            return 0;
        }).sort((a, b)=>{
            const posA = a.position;
            const posB = b.position;
            return posA.x - posB.x;
        }).sort((a, b)=>{
            const posA = a.position;
            const posB = b.position;
            return posA.y - posB.y;
        });
        document.querySelectorAll(".floor").forEach((f)=>f.innerHTML = "");
        for (const room of rooms){
            const floor = document.querySelector(`.floor#${room.level}`);
            const div = document.createElement("div");
            div.textContent = room.name;
            div.classList.add(...room.doors);
            div.classList.add("hidden");
            for (const character of this.characters.values()){
                if (character.room === room) div.textContent += " 💀";
            }
            if (room.hasTreasure) div.classList.add("treasure");
            if (room.name === "stairs") div.classList.add("stairs");
            floor?.append(div);
            room.element = div;
        }
        this.player?.init();
        doodler.createLayer(this.renderDoodle);
        if (!this.isHost) {
            doodler.createLayer(()=>{
                doodler.drawScaled(10, ()=>{
                    doodler.fillRect(new Vector(0, this.gridSize.y).mult(32), this.gridSize.x * 32, 16, {
                        color: "purple"
                    });
                    this.player?.item?.render();
                    const treasureStart = new Vector(2, this.gridSize.y).mult(32).add(2, 2);
                    doodler.drawImage(imageLibrary.treasure, treasureStart, 12, 12);
                    doodler.fillText(this.player?.gatheredTreasures.length.toString() || "0", treasureStart.copy().add(16, 6), 16, {
                        fillColor: "white",
                        textBaseline: "middle"
                    });
                    doodler.fillText("Score " + this.player?.score, treasureStart.copy().add(48, 6), 44, {
                        fillColor: "white",
                        textBaseline: "middle"
                    });
                });
            });
        }
    };
    renderDoodle = ()=>{
        const rooms = this.rooms;
        doodler.drawScaled(10, ()=>{
            for (const room of rooms.filter((r)=>r.level === this.floor || this.isHost)){
                this.isHost ? room.render(new Vector(Room.FloorZ[room.level] * this.gridSize.x, 0)) : room.render();
            }
        });
    };
    render = ()=>{
        this.player?.buttons();
    };
    changeFloor = (dir)=>{
        const options = {
            up: {
                basement: "lower",
                upper: "upper",
                lower: "upper"
            },
            down: {
                upper: "lower",
                lower: "basement",
                basement: "basement"
            }
        };
        this.floor = options[dir][this.floor];
        this.render();
    };
    randomSelector = (floor)=>`${Math.floor(Math.random() * this.gridSize.x)},${Math.floor(Math.random() * this.gridSize.y)},${floor || floors[Math.floor(Math.random() * floors.length)]}`;
    skeletonCheck = ()=>{
        for (const character of this.players){
            skellies: for (const skeleton of this.skeletons){
                if (skeleton.frozen) continue skellies;
                if (!character.safe && character.room === skeleton.room) {
                    character.room = this.rooms.find((r)=>r.name === "dungeon");
                    this.channel?.send(JSON.stringify({
                        action: "captured",
                        playerId: character.uuid
                    }));
                } else {
                    this.channel?.send(JSON.stringify({
                        action: "success",
                        playerId: character.uuid
                    }));
                }
            }
        }
    };
    skeletonMove = ()=>{
        for (const skeleton of this.skeletons){
            skeleton.navigate();
            this.sendRoom(skeleton.room.uuid, skeleton.uuid);
        }
        this.skeletonCheck();
    };
    checkPlayerMoves = ()=>{
        if (this.players.every((c)=>c.hasMoved)) {
            this.tick();
            setTimeout(()=>{
                this.players.forEach((c)=>c.hasMoved = false);
                this.channel?.send(JSON.stringify({
                    action: "unlock"
                }));
            }, 500);
        }
    };
    puppet = new Sockpuppet("wss://sockpuppet.cyborggrizzly.com");
    hostGame = async ()=>{
        this.initDoodler("red", {
            height: 32 * this.gridSize.y * 10,
            width: 32 * this.gridSize.x * 10 * 3
        });
        this.isHost = true;
        this.generate();
        this.init();
        const channelId = "spooky_scary_skeletons";
        await this.puppet.createChannel(channelId);
        this.puppet.joinChannel(channelId, (msg)=>{
            const message = JSON.parse(msg);
            switch(message.action){
                case "join":
                    {
                        if (!message.playerName) break;
                        const __char = new Player(message.playerName, this);
                        __char.uuid = message.playerId;
                        __char.room = this.entrance;
                        this.characters.set(message.playerId, __char);
                        this.players.push(__char);
                        const map = this.rooms.map((r)=>({
                                name: r.name,
                                level: r.level,
                                position: r.position,
                                hasTreasure: r.hasTreasure,
                                doors: r.doors,
                                uuid: r.uuid,
                                secretTunnelId: r.secretTunnel?.uuid
                            }));
                        this.channel?.send(JSON.stringify({
                            action: "map",
                            map
                        }));
                        this.sendRoom(__char.room.uuid, __char.uuid);
                        this.sendMessage({
                            action: "scoreboard",
                            charsInRoom: this.players.map((c)=>`${c.uuid},${c.name}`),
                            playerId: __char.uuid
                        });
                        break;
                    }
                case "move":
                    {
                        console.log("player moving");
                        const c = this.characters.get(message.playerId);
                        const room = this.rooms.find((r)=>r.uuid === message.roomId);
                        if (!room) break;
                        c.move("nav", room);
                        this.checkPlayerMoves();
                        this.sendRoom(c.room.uuid, c.uuid);
                        break;
                    }
                case "win":
                    {
                        const buttons = document.querySelector(".buttons");
                        const butt = document.createElement("button");
                        butt.dataset.dir = "north";
                        butt.textContent = "Continue";
                        butt.addEventListener("click", ()=>{
                            this.channel?.send(JSON.stringify({
                                action: "continue"
                            }));
                            butt.remove();
                        });
                        buttons?.append(butt);
                        break;
                    }
                case "score":
                    {
                        const __char = this.players.find((p)=>p.uuid === message.playerId);
                        if (!__char) break;
                        __char._score = message.score || 0;
                        break;
                    }
                case "safe":
                    {
                        const __char = this.players.find((p)=>p.uuid === message.playerId);
                        if (!__char) break;
                        __char.safe = !!message.safe;
                        break;
                    }
                case "trap":
                    {
                        const room = this.rooms.find((r)=>r.uuid === message.roomId);
                        if (!room) break;
                        room.trapCount += 1;
                        break;
                    }
                case "freeze":
                    {
                        for (const skelly of this.skeletons){
                            skelly.frozen += 3;
                        }
                        break;
                    }
                case "dice":
                    {
                        const skellies = Array.from(this.characters.values()).filter((c)=>c.name === "skeleton");
                        const skelly = skellies[Math.floor(Math.random() * skellies.length)];
                        if (Math.random() < .3) {
                            const players = Array.from(this.characters.values()).filter((c)=>c.name !== "ghost" && c.name !== "skeleton");
                            skelly.teleportLocation = players[Math.floor(Math.random() * players.length)].room;
                        }
                        break;
                    }
                case "music":
                    {
                        const room = this.rooms.find((r)=>r.uuid === message.roomId);
                        if (!room) break;
                        for (const skelly of this.skeletons){
                            skelly.targetRoom.push(room);
                            skelly.targetingTurns = 5;
                        }
                        break;
                    }
            }
        });
        this.channel = this.puppet.getChannel(channelId);
    };
    skeletons = [];
    startGame = ()=>{
        for(let i = 0; i < this.skeletonCount; i++){
            const skeleton = new Skeleton(i, this);
            skeleton.room = this.grid.get(this.randomSelector());
            while(skeleton.room.name === "entrance"){
                skeleton.room = this.grid.get(this.randomSelector());
            }
            this.characters.set(skeleton.uuid, skeleton);
            this.sendRoom(skeleton.room.uuid, skeleton.uuid);
            this.skeletons.push(skeleton);
        }
        this.channel?.send(JSON.stringify({
            action: "unlock"
        }));
        const buttons = document.querySelector(".buttons");
        buttons.innerHTML = `
    <button class="movement" data-dir="up">Up</button>
    <button class="movement" data-dir="down">Down</button>`;
        document.querySelectorAll(".movement[data-dir]").forEach((b)=>{
            b = b;
            b.addEventListener("click", ()=>this.changeFloor(b.dataset.dir));
        });
        const unlockButton = document.createElement("button");
        unlockButton.dataset.dir = "c";
        unlockButton.addEventListener("click", ()=>{
            for (const __char of this.players){
                if (!__char.hasMoved) {
                    this.characters.delete(__char.uuid);
                    this.players = this.players.filter((p)=>p !== __char);
                } else {
                    __char.hasMoved = false;
                }
            }
            this.channel?.send(JSON.stringify({
                action: "unlock"
            }));
        });
        unlockButton.textContent = "Unlock";
        buttons.append(unlockButton);
        for (const player of this.players){
            player.hasMoved = false;
        }
        this.render();
    };
    joinGame = ()=>{
        this.initDoodler("black", {
            width: 32 * this.gridSize.x * 10,
            height: 32 * this.gridSize.y * 10 + 160
        });
        this.isHost = false;
        const channelId = "spooky_scary_skeletons";
        this.floor = "lower";
        this.puppet.joinChannel(channelId, (msg)=>{
            const message = JSON.parse(msg);
            switch(message.action){
                case "map":
                    {
                        if (!this.rooms.length) {
                            const tunnel = [];
                            const allStairs = {
                                basement: undefined,
                                lower: undefined,
                                upper: undefined
                            };
                            const treasureRooms = {
                                basement: undefined,
                                lower: undefined,
                                upper: undefined
                            };
                            this.rooms = message.map.map((r)=>{
                                const room = new Room(r, this);
                                if (room.name === "stairs") allStairs[room.level] = room;
                                if (room.hasTreasure) treasureRooms[room.level] = room;
                                if (room.name === "dungeon") this.dungeon = room;
                                if (room.name === "entrance") this.entrance = room;
                                if (r.secretTunnelId) tunnel.push(room);
                                this.grid.set(`${room.position.x},${room.position.y},${room.level}`, room);
                                return room;
                            });
                            this.stairs = allStairs;
                            this.treasureRooms = treasureRooms;
                            const [room1, room2] = tunnel;
                            if (room1 && room2) {
                                room1.secretTunnel = room2;
                                room2.secretTunnel = room1;
                            }
                            this.player.room = this.entrance;
                            this.render();
                            this.init();
                        }
                        break;
                    }
                case "captured":
                    {
                        if (this.player?.uuid === message.playerId && !this.player.safe) {
                            playRandom("spookyLaugh1", "spookyLaugh2");
                            const event = new CustomEvent("captured");
                            this.player.room = this.rooms.find((r)=>r.name === "dungeon");
                            dispatchEvent(event);
                            this.dialog?.showModal();
                            setTimeout(()=>{
                                this.dialog?.close();
                            }, 2000);
                        }
                        break;
                    }
                case "success":
                    {
                        if (this.player?.gatheredTreasures.length === 3 && this.player.room?.name === "entrance") {
                            this.player.hasWon = true;
                            this.dialog.innerHTML = `
              🎃🎃🎃<br>
              Congratulations! You have collected all of the treasures and escaped to safety!<br>
              🎃🎃🎃
            `;
                            this.dialog?.showModal();
                            this.channel?.send(JSON.stringify({
                                action: "win",
                                playerName: this.player.name
                            }));
                            this.player.safe = true;
                        }
                        break;
                    }
                case "unlock":
                    {
                        this.player.hasMoved = false;
                        this.player?.buttons();
                        break;
                    }
                case "win":
                    {
                        this.player.hasMoved = true;
                        this.dialog.innerHTML = `
          🎃🎃🎃<br>
          ${message.playerName} has collected all of the treasures and escaped to safety!<br>
          🎃🎃🎃
          `;
                        this.dialog?.showModal();
                        break;
                    }
                case "continue":
                    {
                        this.player.hasMoved = false;
                        this.player?.buttons();
                        this.dialog?.close();
                        break;
                    }
                case "room":
                    {
                        if (!this.player || !message.charsInRoom) break;
                        for (const __char of message.charsInRoom){
                            const [uuid, name] = __char.split(",");
                            if (uuid === this.player.uuid) continue;
                            let c = this.characters.get(uuid);
                            if (!c) {
                                switch(name){
                                    case "skeleton":
                                        c = new Skeleton(this.skeletons.length, this);
                                        this.skeletons.push(c);
                                        break;
                                    default:
                                        c = new Player(name, this);
                                        break;
                                }
                            }
                            c.uuid = uuid;
                            this.characters.set(c.uuid, c);
                            c.game = this;
                            c.room = this.rooms.find((r)=>r.uuid === message.roomId);
                        }
                        break;
                    }
                case "trap":
                    {
                        const room = this.rooms.find((r)=>r.uuid === message.roomId);
                        if (this.player?.uuid === message.playerId || !room) break;
                        room.trapCount += 1;
                        break;
                    }
            }
        });
        this.channel = this.puppet.getChannel(channelId);
    };
    initDoodler = (bg, { height, width, framerate = 5 }, zoom)=>{
        if (window.doodler) return;
        init({
            height: height,
            width: width,
            canvas: document.querySelector("canvas"),
            bg,
            framerate
        }, zoom || false, (ctx)=>{
            ctx.imageSmoothingEnabled = false;
            ctx.font = "12px spk";
        });
    };
    sendRoom(roomId, playerId) {
        this.channel?.send(JSON.stringify({
            action: "room",
            roomId,
            playerId,
            charsInRoom: Array.from(this.rooms.find((r)=>r.uuid === roomId)?.characters.values() || []).map((c)=>`${c.uuid},${c.name}`)
        }));
    }
    createCharacter = (name)=>{
        this.player = new Player(name, this);
        this.channel?.send(JSON.stringify({
            action: "join",
            playerId: this.player.uuid,
            playerName: name
        }));
    };
    channel;
    sendMessage(p) {
        this.channel?.send(JSON.stringify(p));
    }
    alertTimer;
    alert(message, time) {
        const prev = this.dialog.innerHTML || "";
        if (typeof message === "string") {
            this.dialog.innerHTML = message;
        } else {
            this.dialog.append(message);
        }
        this.dialog.showModal();
        if (time) {
            clearTimeout(this.alertTimer);
            this.alertTimer = setTimeout(()=>{
                this.dialog.close();
                this.dialog.innerHTML = prev;
            }, time);
        }
    }
    startScoreboard() {
        this.initDoodler("#00000050", {
            width: document.body.clientWidth * .9,
            height: document.body.clientHeight * .9,
            framerate: 40
        }, true);
        doodler.createLayer((c)=>{
            c.font = "32px spk";
            const pos = new Vector(12, 12);
            for (const player of this.players){
                const [gamepad] = navigator.getGamepads();
                if (gamepad) {
                    const d = doodler;
                    const [leftX, leftY] = gamepad.axes;
                    d.moveOrigin({
                        x: Math.min(Math.max(leftX - 0.04, 0), leftX + 0.04) * -15,
                        y: Math.min(Math.max(leftY - 0.04, 0), leftY + 0.04) * -15
                    });
                    if (gamepad.buttons[7].value) {
                        d.scaleAt(d.screenToWorld(c.canvas.width / 2, c.canvas.height / 2), 1 + gamepad.buttons[7].value / 20);
                    }
                    if (gamepad.buttons[6].value) {
                        d.scaleAt(d.screenToWorld(c.canvas.width / 2, c.canvas.height / 2), 1 - gamepad.buttons[6].value / 20);
                    }
                }
                doodler.fillText(player.name, pos.copy().add(2, 2), c.canvas.width / 3, {
                    fillColor: "purple",
                    textBaseline: "top"
                });
                doodler.fillText(player.name, pos, c.canvas.width / 3, {
                    fillColor: "orange",
                    textBaseline: "top"
                });
                const scorePos = pos.copy().add(c.canvas.width / 3, 0);
                doodler.fillText(player.score + " points", scorePos.copy().add(2, 2), c.canvas.width / 3, {
                    fillColor: "purple",
                    textBaseline: "top"
                });
                doodler.fillText(player.score + " points", scorePos, c.canvas.width / 3, {
                    fillColor: "orange",
                    textBaseline: "top"
                });
                pos.add(0, 36);
            }
        });
        const channelId = "spooky_scary_skeletons";
        document.addEventListener("click", ()=>{
            audioLibrary.spookyDrone1.loop = true;
            audioLibrary.spookyDrone2.loop = true;
            audioLibrary.spookyDrone1.play();
            audioLibrary.spookyDrone2.play();
        });
        this.puppet.joinChannel(channelId, (msg)=>{
            const message = JSON.parse(msg);
            switch(message.action){
                case "scoreboard":
                    {
                        this.players = message.charsInRoom.map((c)=>{
                            const [uuid, name] = c.split(",");
                            const player = new Player(name, this);
                            player.uuid = uuid;
                            return player;
                        });
                        break;
                    }
                case "score":
                    {
                        const player = this.players.find((p)=>p.uuid === message.playerId);
                        if (!player) break;
                        player._score = message.score || 0;
                        break;
                    }
                case "music":
                    {
                        audioLibrary.musicBox.play();
                        break;
                    }
                case "captured":
                    {
                        playRandom("spookyLaugh1", "spookyLaugh2");
                    }
            }
        });
    }
}
const game = new Game();
const init1 = ()=>{
    const buttonContainer = document.querySelector(".buttons");
    if (buttonContainer) {
        const hostButton = document.createElement("button");
        hostButton.textContent = "Host";
        hostButton.dataset.dir = "c";
        hostButton.addEventListener("click", host);
        const joinButton = document.createElement("button");
        joinButton.textContent = "Join";
        joinButton.dataset.dir = "c";
        joinButton.addEventListener("click", join);
        location.pathname.includes("host") ? buttonContainer.append(hostButton) : buttonContainer.append(joinButton);
    }
};
const join = ()=>{
    game.joinGame();
    const name = prompt("What name would you like to use?") || "Treasure Hunter";
    game.createCharacter(name);
    document.querySelector(".buttons").innerHTML = `
  <button class="movement" data-dir="north">North</button>
  <button class="movement" data-dir="south">South</button>
  <button class="movement" data-dir="east">East</button>
  <button class="movement" data-dir="west">West</button>
  <button class="movement" data-dir="up">Up</button>
  <button class="movement" data-dir="down">Down</button>
  <button class="movement" data-dir="c">Search</button>
  <button class="movement" data-dir="b">Use Item</button>
  <button class="movement" data-dir="d">SECRET TUNNEL</button>
  `;
};
const host = ()=>{
    game.hostGame();
    const container = document.querySelector(".buttons");
    if (container) {
        const startButton = document.createElement("button");
        startButton.textContent = "Start Game";
        startButton.dataset.dir = "north";
        startButton.addEventListener("click", game.startGame);
        const upButton = document.createElement("button");
        upButton.textContent = "Up";
        upButton.dataset.dir = "up";
        upButton.addEventListener("click", ()=>game.changeFloor("up"));
        const downButton = document.createElement("button");
        downButton.textContent = "Down";
        downButton.dataset.dir = "down";
        downButton.addEventListener("click", ()=>game.changeFloor("down"));
        container.append(startButton, upButton, downButton);
    }
};
init1();
