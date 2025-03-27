export class PainterMid {
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
        this.draw8 = function (x, y, xGoc, yGoc, rgba) {
            this.setPixel(x + xGoc, y + yGoc, rgba);
            this.setPixel(-x + xGoc, y + yGoc, rgba);
            this.setPixel(-x + xGoc, -y + yGoc, rgba);
            this.setPixel(x + xGoc, -y + yGoc, rgba);
            this.setPixel(y + xGoc, x + yGoc, rgba);
            this.setPixel(-y + xGoc, x + yGoc, rgba);
            this.setPixel(-y + xGoc, -x + yGoc, rgba);
            this.setPixel(y + xGoc, -x + yGoc, rgba);
        }
        this.drawLine = function (p0, p1, rgba) {
            var x0 = p0[0], y0 = p0[1];
            var x1 = p1[0], y1 = p1[1];

            var y = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
            var f = 1 - y;
            y = Math.floor(y);

            for (var x = 0; x < y; x++) {
                if (f < 0) {
                    f = f + 2 * x + 3;
                }
                else {
                    f = f + 2 * x - 2 * y + 5;
                    y = y - 1;
                }
                this.draw8(x, y, x0, y0, rgba);
                console.log(x + " " + y);
            }
            this.drawPoint(p0, rgba);
            this.drawPoint(p1, rgba);
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
