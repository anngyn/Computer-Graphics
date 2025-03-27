export class Painter {
    constructor(context, width, height, lineRgba, vlineRgba) {
        this.context = context;
        this.lineRgba = lineRgba;
        this.vlineRgba = vlineRgba;
        this.imageData = context.createImageData(width, height);
        this.point = [];
        this.end = [];
        this.now = [-1, -1];
        this.width = width;
        this.height = height;
        this.getPixelIndex = function (x, y) {
            if (x < 0 || y < 0 || x >= this.width || y >= this.height)
                return -1;
            return (x + y * width) << 2;
        };
        this.setPixel = function (x, y, rgba) {
            var pixelIndex = this.getPixelIndex(x, y);
            if (pixelIndex == -1) return;
            for (var i = 0; i < 4; i++) {
                this.imageData.data[pixelIndex + i] = rgba[i];
            }

        };
        this.clear = function () {
            for (var i = 0; i < this.imageData.data.length; i += 4) {
                this.imageData.data[i + 3] = 0;
            }

        };
        this.drawPoint = function (p, rgba) {
            var x = p[0];
            var y = p[1];
            for (var i = -1; i <= 1; i++)
                for (var j = -1; j <= 1; j++)
                    this.setPixel(x + i, y + j, rgba);
        };
        this.drawLine = function (p0, p1, rgba) {
            var x0 = p0[0], y0 = p0[1];
            var x1 = p1[0], y1 = p1[1];
            var dx = x1 - x0, dy = y1 - y0;
            if (dx == 0 && dy == 0)
                return;
            if (Math.abs(dy) <= Math.abs(dx)) {
                if (x1 < x0) {
                    var tx = x0; x0 = x1; x1 = tx;
                    var ty = y0; y0 = y1; y1 = ty;
                }
                var k = dy / dx;
                var y = y0;
                for (var x = x0; x <= x1; x++) {
                    this.setPixel(x, Math.floor(y + 0, 5), rgba);
                    y = y + k;
                }
            }
            else {
                if (y1 < y0) {
                    var tx = x0; x0 = x1; x1 = tx;
                    var ty = y0; y0 = y1; y1 = ty;
                }
                var k = dx / dy;
                var x = x0;
                for (var y = y0; y <= y1; y++) {
                    this.setPixel(Math.floor(x + 0.5), y, rgba);
                    x = x + k;
                }
            }
        };
        this.addPoint = function (p) {
            this.point.push(p);
        };
        this.addEnd = function (p) {
            this.end.push(p);
        };
        this.draw = function (p) {
            this.clear();
            for (var i = 0; i < this.point.length - 1; i += 2) {
                this.drawLine(this.point[i], this.point[i + 1], this.lineRgba);
            }
            if (i < this.point.length) {
                this.drawLine(this.point[i], p, this.vlineRgba);
            }
            this.context.putImageData(this.imageData, 0, 0);
        };
    }
}
