function factor (n) {
    if (n < 1 || isNaN(n)) {
        throw new Exception('factor: invalid input');
    }
    else if (n === 1) {
        return [];
    }
    else {
        for (var i = 2; i <= n; i++) {
            if (n % i === 0) {
                return [i].concat(factor(n / i));
            }
        }
    }
}

function factorDiagram (n, w, h) {
    var factors = factor(n);
    var d = new Diagram(0, 0, w, h);
    var flipFor2 = false;
    d.add(new Circle(0, 0, w / 2));
    while (factors instanceof Array && factors.length) {
        var f = factors.shift();
        var nd = new Diagram(0, 0, w, h);
        var startingOffset = -Math.PI / 2;
        if (f === 2) {
            d.rescale(0.95 / f);
            if (flipFor2) {
                startingOffset = 0;
            }
        }
        else {
            d.rescale(1.2 / f);
        }
        var theta = 2 * Math.PI / f;
        for (var i = 0; i < f; i++) {
            var cd = d.clone();
            cd.x = (w / 2) + (w / 2 - d.width / 2) * Math.cos(i * theta + startingOffset) - (d.width / 2);
            cd.y = (h / 2) + (h / 2 - d.height / 2) * Math.sin(i * theta + startingOffset) - (d.height / 2);
            nd.add(cd);
        }
        d = nd;
        if (f === 2) {
            flipFor2 = !flipFor2;
        }
    }
    return d;
}

function Diagram (x, y, w, h) {
    this.shapes = [];
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
}
Diagram.prototype.add = function (s) {
    this.shapes.push(s);
};
Diagram.prototype.rescale = function (factor) {
    for (var i = 0; i < this.shapes.length; i++) {
        this.shapes[i].rescale(factor);
    }
    this.x *= factor;
    this.y *= factor;
    this.width *= factor;
    this.height *= factor;
};
Diagram.prototype.drawOnCanvas = function (c, offsetX, offsetY) {
    if (offsetX === undefined) {
        offsetX = 0;
    }
    if (offsetY === undefined) {
        offsetY = 0;
    }
    for (var i = 0; i < this.shapes.length; i++) {
        this.shapes[i].drawOnCanvas(c, this.x + offsetX, this.y + offsetY);
    }
};
Diagram.prototype.clone = function () {
    var d = new Diagram(this.x, this.y, this.width, this.height);
    for (var i = 0; i < this.shapes.length; i++) {
        d.add(this.shapes[i].clone());
    }
    return d;
};

function Circle (x, y, r) {
    this.radius = r;
    this.x = x;
    this.y = y;
}
Circle.prototype.rescale = function (factor) {
    this.x *= factor;
    this.y *= factor;
    this.radius *= factor;
};
Circle.prototype.drawOnCanvas = function (c, offsetX, offsetY) {
    var context = c.getContext('2d');
    if (offsetX === undefined) {
        offsetX = 0;
    }
    if (offsetY === undefined) {
        offsetY = 0;
    }
    context.fillStyle = '#000';
    context.beginPath();
    context.arc(this.x + this.radius + offsetX, this.y + this.radius + offsetY, this.radius, 0, 2 * Math.PI);
    context.fill();
};
Circle.prototype.clone = function () {
    return new Circle(this.x, this.y, this.radius);
};
