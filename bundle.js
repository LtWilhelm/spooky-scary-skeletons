// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

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
const treasure = new Image();
treasure.src = "./assets/images/treasure.png";
const explorer = new Image();
explorer.src = "./assets/images/explorer.png";
const skeleton = new Image();
skeleton.src = "./assets/images/skeleton.png";
const ghost = new Image();
ghost.src = "./assets/images/ghost.png";
const trap = new Image();
trap.src = "./assets/images/trap.png";
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
const musicBox = new Image();
musicBox.src = "./assets/images/items/music box.png";
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
    treasure,
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
    musicBox,
    painting,
    quill,
    skull,
    spiders,
    spyglass,
    thread
};
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
            this.player.item?.onDrop();
            this.player.item = this;
            this.player.item.onPickup();
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
    onPickup() {}
    onDrop() {}
    render() {
        const start = new Vector(0, this.game.gridSize.y).mult(32).add(2, 2);
        doodler.fillSquare(start, 12, {
            fillColor: "#00000050"
        });
        doodler.drawImage(this.img, start.copy().add(1, 1), 10, 10);
        doodler.fillText(this.name, start.copy().add(15, 2), 48, {
            fillColor: "white",
            textBaseline: "top"
        });
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
}
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
        if (this.uuid === this.game?.character?.uuid) {
            this.room.known = true;
            if (!this.game?.isHost) {
                this.game.floor = this._room.level;
            }
        }
    }
    game;
    hasMoved = true;
    gatheredTreasures = [];
    knownTreasures = [];
    score = 0;
    image;
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
    visionIncludesAllMonsters = false;
    vision = 0;
    sight = 0;
    item;
    constructor(name, game){
        this.name = name;
        this.uuid = window.crypto.randomUUID();
        this.image = new Image();
        switch(this.name){
            case "skeleton":
                this.image.src = "./assets/images/skeleton.png";
                break;
            case "ghost":
                this.image.src = "./assets/images/ghost.png";
                break;
            default:
                this.image.src = "./assets/images/explorer.png";
        }
        this.game = game;
        this.roomPosition = new Vector(Math.floor(Math.random() * 26), Math.floor(Math.random() * 24));
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
            if (dir === "c" && !this.room.hasBeenSearched) {
                b.disabled = false;
            }
            if (dir === "b" && this.item?.usable) {
                b.disabled = false;
            }
            if (this.hasMoved) b.disabled = true;
        });
    };
    move = (dir)=>{
        this.roomPosition = new Vector(Math.floor(Math.random() * 26), Math.floor(Math.random() * 24));
        if (dir && this.room.trapCount && dir !== "search" && !this.game.isHost) {
            this.room === this.room;
            this.room.trapCount -= 1;
            this.hasMoved = true;
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
            this.hasMoved = true;
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
            } else {
                this.room = this.room.neighbors[dir];
            }
            if (this.room?.hasTreasure && !this.gatheredTreasures.includes(this.room.accessor)) {
                this.gatheredTreasures.push(this.room.accessor);
            }
            this.game?.render();
            !this.game?.isHost && this.game?.channel?.send(JSON.stringify({
                action: "move",
                playerId: this.uuid,
                direction: dir
            }));
            this.game.floor = this.room?.level || this.game.floor;
        } else {
            const validSpaces = this.validSpaces;
            this.room = this.room.trapCount ? this.room : validSpaces[Math.floor(Math.random() * validSpaces.length)][1];
            this.room.trapCount && (this.room.trapCount -= 1);
        }
    };
    searchRoom = ()=>{};
    roomPosition;
    render() {
        if (!this.room) return;
        const startPos = new Vector(this.room.position.x * 32, this.room.position.y * 32);
        let scale = 2;
        switch(this.name){
            case "skeleton":
                scale = 3;
                break;
        }
        if (this.name !== "skeleton" && this.name !== "ghost") {
            doodler.drawWithAlpha(this.safe ? .25 : 1, ()=>{
                doodler.drawScaled(1 / scale, ()=>{
                    this.game?.character === this ? doodler.drawImageWithOutline(this.image, startPos.copy().add(this.roomPosition).mult(scale), {
                        color: "lime",
                        weight: 6
                    }) : doodler.drawImage(this.image, startPos.copy().add(this.roomPosition).mult(scale));
                });
            });
            doodler.deferDrawing(()=>{
                doodler.drawScaled(10 / scale, ()=>{
                    const name = this.uuid === this.game?.character?.uuid ? "" : this.name;
                    doodler.fillText(name, startPos.copy().add(this.roomPosition).add(4, 12).mult(scale), 40, {
                        color: "lime",
                        textAlign: "center"
                    });
                });
            });
        } else {
            doodler.drawScaled(1 / scale, ()=>{
                doodler.drawImageWithOutline(this.image, startPos.copy().add(this.roomPosition).mult(scale), {
                    weight: 4,
                    color: "purple"
                });
            });
        }
    }
}
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
    send = (message, clientToSendTo)=>this.socket.send(JSON.stringify({
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
    constructor(path, onConnect, options){
        if (isFullUrl(path)) this.socket = new WebSocket(path);
        else this.socket = new WebSocket(`${window.location.host}${path}`);
        if (onConnect) this.socket.addEventListener('open', ()=>{
            onConnect();
        });
        this.keepAlive = options?.keepAlive ?? this.keepAlive;
        this.socket.addEventListener('message', this.handleMessage);
        if (this.keepAlive) this.initialPing = setTimeout(()=>this.socket.send('pong'), 5000);
        this.channels = new Map();
        this.callbacks = new Map([
            [
                'disconnect',
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
            this.socket.addEventListener('open', ()=>{
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
    onDisconnect = (callback)=>this.callbacks.get('disconnect')?.push(callback);
    handleMessage = (message)=>{
        switch(message.data){
            case "open":
            case "connected":
                break;
            case "disconnected":
                this.callbacks.get('disconnect')?.forEach((cb)=>cb(message.data));
                this.channels.forEach((channel)=>channel.execLeaveListeners());
                break;
            case "ping":
                clearTimeout(this.initialPing);
                if (this.keepAlive) this.socket.send('pong');
                break;
            default:
                try {
                    const msg = new Message(JSON.parse(message.data));
                    this.callbacks.get('message')?.forEach((cb)=>cb(msg));
                    if (msg.event === 'leave') this.deleteChannel(msg.to);
                    if (msg.event === 'join') this.channels.get(msg.to)?.execJoinListeners();
                    if (msg.event === 'create') this.onChannelCreate(msg);
                    this.callbacks.get(msg.event || msg.message)?.forEach((cb)=>cb(msg));
                    this.channels.get(msg.to)?.execListeners(msg.message);
                } catch (_e) {
                    const msg = message.data;
                    this.callbacks.get(msg)?.forEach((cb)=>cb(msg));
                }
                break;
        }
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
                        case 'FAILED':
                            rej(channelMessage);
                            break;
                        case 'SUCCESS':
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
const isFullUrl = (url)=>/(wss?|https?):\/\/.+\.(io|com|org|net)(\/.*)?/i.test(url) || url.includes('localhost');
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
        name: 'bedroom',
        floors: [
            'upper'
        ]
    },
    {
        name: 'hallway',
        floors: [
            'upper',
            'lower',
            'basement'
        ]
    },
    {
        name: 'dining room',
        floors: [
            'lower'
        ]
    },
    {
        name: 'parlor',
        floors: [
            'lower',
            'upper'
        ]
    },
    {
        name: 'library',
        floors: [
            'lower',
            'upper'
        ]
    },
    {
        name: 'cellar',
        floors: [
            'basement'
        ]
    },
    {
        name: 'catacomb',
        floors: [
            'basement'
        ]
    },
    {
        name: 'alcoves',
        floors: [
            'basement'
        ]
    }
];
const directions = [
    'north',
    'south',
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
        this.itemChance = Math.max(0, Math.random() - .5);
        this.doorImage = this.level === "basement" ? imageLibrary.basementDoor : imageLibrary.door;
        switch(this.name){
            case "hallway":
                this.image = this.level !== "basement" ? imageLibrary.hallway : imageLibrary.basementHallway;
                this.doorImage = this.level !== "basement" ? imageLibrary.hallwayDoor : imageLibrary.basementHallwayDoor;
                break;
            case "dining room":
                this.image = imageLibrary.diningRoom;
                break;
            case "bedroom":
                this.image = imageLibrary.bedroom;
                break;
            case "parlor":
                this.image = imageLibrary.parlor;
                break;
            case "library":
                this.image = imageLibrary.library;
                break;
            case "cellar":
                this.image = imageLibrary.cellar;
                break;
            case "catacomb":
                this.image = imageLibrary.catacombs;
                break;
            case "alcoves":
                this.image = imageLibrary.alcoves;
                break;
            case "dungeon":
                this.image = imageLibrary.dungeon;
                break;
            case "entrance":
                this.image = imageLibrary.entrance;
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
            case "hallway":
            case "stairs":
            case "dining room":
            case "bedroom":
            case "parlor":
            case "library":
            case "cellar":
            case "dungeon":
            case "entrance":
                return [
                    {
                        item: SpiderJar,
                        type: "item",
                        weight: 1
                    }
                ];
            case "catacomb":
            case "alcoves":
        }
        return [];
    }
    hasBeenSearched = false;
    search() {
        this.hasBeenSearched = true;
        if (Math.random() < this.itemChance) {
            const loots = [];
            for (const loot of this.lootTable){
                for(let i = 0; i < loot.weight; i++){
                    loots.push(loot);
                }
            }
            const loot = loots[Math.floor(Math.random() * loots.length)];
            switch(loot.type){
                case "points":
                    break;
                case "item":
                    new loot.item(this.game.character, this.game);
                    break;
            }
        }
        this.game.character?.move("search");
        this.game.render();
    }
    rotation;
    drawTreasure() {
        doodler.drawScaled(.5, ()=>{
            doodler.drawImage(imageLibrary.treasure, new Vector(this.position.x * 32, this.position.y * 32).add(20, 20).mult(2));
        });
    }
    render() {
        const startPos = new Vector(this.position.x * 32, this.position.y * 32);
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
        if (this.game?.isHost || this.game?.character && this.characters.get(this.game.character.uuid)) {
            for (const __char of this.characters.values()){
                __char.render();
            }
        }
        if (this.hasTreasure && (this.game.isHost || this.known || this.game.character?.knownTreasures.includes(this))) {
            this.drawTreasure();
        }
        if (this.position.x === 0 && this.level !== "basement" && this.name !== "hallway") {
            doodler.drawImage(imageLibrary.window, new Vector(0, this.position.y * 32));
        }
        if (this.game?.character?.vision && this.characters.get(this.game.character.uuid)) {
            const rooms = this.game.rooms.filter((r)=>r.level === this.level && this.calculateDistanceToRoom(r) < (this.game?.character?.vision || 0) + 1);
            const player = this.game.character;
            const renderables = [
                "skeleton",
                "ghost"
            ].filter((r)=>player.visionIncludesAllMonsters || r === "skeleton");
            for (const room of rooms){
                if (room === this) continue;
                for (const __char of room.characters.values()){
                    if (!renderables.includes(__char.name)) continue;
                    doodler.deferDrawing(()=>{
                        doodler.drawScaled(10, ()=>{
                            __char.render();
                        });
                    });
                }
            }
        }
        if (this.game?.character?.sight && this.characters.get(this.game.character.uuid)) {
            for (const door of this.doors){
                let room = this.neighbors[door];
                while(room && this.calculateDistanceToRoom(room) < this.game.character.sight + 1){
                    const r = room;
                    doodler.deferDrawing(()=>{
                        doodler.drawScaled(10, ()=>{
                            if (r.hasTreasure) r.drawTreasure();
                            for (const __char of r.characters.values()){
                                __char.render();
                            }
                        });
                    });
                    if (room.doors.includes(door)) room = room.neighbors[door];
                    else room = undefined;
                }
            }
        }
        if (this.trapCount && (this.game.isHost || this.game.character?.canSeeTraps)) {
            const point = new Vector(this.position.x * 32, this.position.y * 32).add(2, 22);
            doodler.drawScaled(.5, ()=>{
                doodler.drawImage(imageLibrary.trap, point.mult(2));
            });
        }
    }
    calculateDistanceToRoom(room) {
        const thisVec = new Vector(this.position.x, this.position.y);
        const roomVec = new Vector(room.position.x, room.position.y);
        return thisVec.dist(roomVec);
    }
}
const floors = [
    'basement',
    'lower',
    'upper'
];
class Game {
    rooms = [];
    characters = new Map();
    gridSize = {
        x: 5,
        y: 6
    };
    grid = new Map();
    entrance = {
        x: 0,
        y: 0
    };
    isHost = false;
    character;
    dialog = document.querySelector("dialog");
    floor = "basement";
    tick = ()=>{
        this.skeletonCheck();
        this.skeletonMove();
        this.render();
    };
    skeletonCount = 3;
    generate = ()=>{
        let solvable = false;
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
                    entrance.itemChance = 1;
                    entrance.known = true;
                    this.grid.set(`${entranceX},${entranceY},${floor}`, entrance);
                    this.entrance = {
                        x: entranceX,
                        y: entranceY
                    };
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
            }
            for (const room of this.grid.values())this.rooms.push(room);
            solvable = solver(this.rooms);
        }
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
        for (const __char of this.characters.values()){
            console.log(__char.name, __char.room);
        }
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
        this.character?.init();
        doodler.createLayer(this.renderDoodle);
        if (!this.isHost) {
            doodler.createLayer(()=>{
                doodler.drawScaled(10, ()=>{
                    doodler.fillRect(new Vector(0, this.gridSize.y).mult(32), this.gridSize.x * 32, 16, {
                        color: "purple"
                    });
                    this.character?.item?.render();
                    const treasureStart = new Vector(2, this.gridSize.y).mult(32).add(2, 2);
                    doodler.drawImage(imageLibrary.treasure, treasureStart, 12, 12);
                    doodler.fillText(this.character?.gatheredTreasures.length.toString() || "0", treasureStart.copy().add(16, 2), 16, {
                        fillColor: "white",
                        textBaseline: "top"
                    });
                });
            });
        }
    };
    renderDoodle = ()=>{
        const rooms = this.rooms;
        doodler.drawScaled(10, ()=>{
            for (const room of rooms.filter((r)=>r.level === this.floor)){
                room.render();
            }
        });
    };
    render = ()=>{
        this.character?.buttons();
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
        const characters = Array.from(this.characters.values());
        const skeletons = characters.filter((c)=>c.name === "skeleton");
        for (const character of characters){
            if (character.name !== "skeleton") {
                for (const skeleton of skeletons){
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
        }
    };
    skeletonMove = ()=>{
        const characters = Array.from(this.characters.values());
        const skeletons = characters.filter((c)=>c.name === "skeleton");
        for (const skeleton of skeletons){
            skeleton.move();
            this.sendRoom(skeleton.room.uuid, skeleton.uuid);
        }
        this.skeletonCheck();
    };
    checkPlayerMoves = ()=>{
        const characters = Array.from(this.characters.values()).filter((c)=>c.name !== "skeleton");
        if (characters.every((c)=>c.hasMoved)) {
            this.tick();
            setTimeout(()=>{
                characters.forEach((c)=>c.hasMoved = false);
                this.channel?.send(JSON.stringify({
                    action: "unlock"
                }));
            }, 2000);
        }
    };
    puppet = new Sockpuppet("wss://skirmish.ursadesign.io");
    hostGame = async ()=>{
        this.initDoodler("red");
        this.isHost = true;
        this.generate();
        this.init();
        const channelId = "spooky_scary_skeletons";
        await this.puppet.createChannel(channelId);
        this.puppet.on("ping", (e)=>{
            console.log(e);
        });
        this.puppet.joinChannel(channelId, (msg)=>{
            const message = JSON.parse(msg);
            switch(message.action){
                case "join":
                    {
                        if (!message.playerName) break;
                        const __char = new Character(message.playerName, this);
                        __char.game = this;
                        __char.room = this.rooms.find((r)=>r.name === "entrance");
                        __char.uuid = message.playerId;
                        this.characters.set(message.playerId, __char);
                        const map = this.rooms.map((r)=>({
                                name: r.name,
                                level: r.level,
                                position: r.position,
                                hasTreasure: r.hasTreasure,
                                doors: r.doors,
                                uuid: r.uuid
                            }));
                        this.channel?.send(JSON.stringify({
                            action: "map",
                            map
                        }));
                        this.sendRoom(__char.room.uuid, __char.uuid);
                        break;
                    }
                case "move":
                    {
                        const c = this.characters.get(message.playerId);
                        c.move(message.direction);
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
                        const __char = this.characters.get(message.playerId);
                        if (!__char) break;
                        __char.score += message.score || 0;
                        break;
                    }
                case "safe":
                    {
                        const __char = this.characters.get(message.playerId);
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
            }
        });
        this.channel = this.puppet.getChannel(channelId);
    };
    startGame = ()=>{
        for(let i = 0; i < this.skeletonCount; i++){
            const skeleton = new Character("skeleton", this);
            skeleton.uuid = "skeleton-" + i;
            skeleton.game = this;
            skeleton.room = this.grid.get(this.randomSelector());
            while(skeleton.room.name === "entrance"){
                skeleton.room = this.grid.get(this.randomSelector());
            }
            this.characters.set(skeleton.uuid, skeleton);
            this.sendRoom(skeleton.room.uuid, skeleton.uuid);
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
            for (const [id, __char] of this.characters.entries()){
                if (__char.name !== "skeleton" && !__char.hasMoved) {
                    this.characters.delete(id);
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
        this.render();
    };
    joinGame = ()=>{
        this.initDoodler("black", 160);
        this.isHost = false;
        const channelId = "spooky_scary_skeletons";
        this.floor = "lower";
        this.puppet.joinChannel(channelId, (msg)=>{
            const message = JSON.parse(msg);
            switch(message.action){
                case "map":
                    {
                        if (!this.rooms.length) {
                            this.rooms = message.map.map((r)=>{
                                const room = new Room(r, this);
                                this.grid.set(`${room.position.x},${room.position.y},${room.level}`, room);
                                return room;
                            });
                            this.character.room = this.rooms.find((r)=>r.name === "entrance");
                            this.character.room.itemChance = 1;
                            console.log("initing");
                            this.render();
                            this.init();
                        }
                        break;
                    }
                case "captured":
                    {
                        if (this.character?.uuid === message.playerId && !this.character.safe) {
                            const event = new CustomEvent("captured");
                            dispatchEvent(event);
                            this.character.room = this.rooms.find((r)=>r.name === "dungeon");
                            this.dialog?.showModal();
                            setTimeout(()=>{
                                this.dialog?.close();
                            }, 2000);
                        }
                        break;
                    }
                case "success":
                    {
                        if (this.character?.gatheredTreasures.length === 3 && this.character.room?.name === "entrance") {
                            this.dialog.innerHTML = `
              🎃🎃🎃<br>
              Congratulations! You have collected all of the treasures and escaped to safety!<br>
              🎃🎃🎃
            `;
                            this.dialog?.showModal();
                            this.channel?.send(JSON.stringify({
                                action: "win",
                                playerName: this.character.name
                            }));
                            this.character.safe = true;
                        }
                        break;
                    }
                case "unlock":
                    {
                        this.character.hasMoved = false;
                        this.character?.buttons();
                        break;
                    }
                case "win":
                    {
                        this.character.hasMoved = true;
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
                        this.character.hasMoved = false;
                        this.character?.buttons();
                        this.dialog?.close();
                        break;
                    }
                case "room":
                    {
                        if (!this.character || !message.charsInRoom) break;
                        for (const __char of message.charsInRoom){
                            const [uuid, name] = __char.split(",");
                            if (uuid === this.character.uuid) continue;
                            const c = this.characters.get(uuid) || new Character(name, this);
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
                        if (this.character?.uuid === message.playerId || !room) break;
                        room.trapCount += 1;
                        break;
                    }
            }
        });
        this.channel = this.puppet.getChannel(channelId);
    };
    initDoodler = (bg, additionalHeight = 0)=>{
        if (window.doodler) return;
        init({
            height: 32 * 60 + additionalHeight,
            width: 32 * 50,
            canvas: document.querySelector("canvas"),
            bg,
            framerate: 5
        }, false, (ctx)=>{
            ctx.imageSmoothingEnabled = false;
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
        this.character = new Character(name, this);
        this.character.game = this;
        this.channel?.send(JSON.stringify({
            action: "join",
            playerId: this.character.uuid,
            playerName: name
        }));
    };
    channel;
    sendMessage(p) {
        this.channel?.send(JSON.stringify(p));
    }
}
const game = new Game();
const init1 = ()=>{
    const buttonContainer = document.querySelector(".buttons");
    if (buttonContainer) {
        const hostButton = document.createElement("button");
        hostButton.textContent = "Host";
        hostButton.dataset.dir = "west";
        hostButton.addEventListener("click", host);
        const joinButton = document.createElement("button");
        joinButton.textContent = "Join";
        joinButton.dataset.dir = "east";
        joinButton.addEventListener("click", join);
        buttonContainer.append(hostButton, joinButton);
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
