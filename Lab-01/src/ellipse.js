export class PainterEllipse {
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
    }

    getPixelIndex(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height)
            return -1;
        return (x + y * this.width) << 2;
    }

    setPixel(x, y, rgba) {
        var pixelIndex = this.getPixelIndex(x, y);
        if (pixelIndex == -1) return;
        for (var i = 0; i < 4; i++) {
            this.imageData.data[pixelIndex + i] = rgba[i];
        }
    }

    clear() {
        for (var i = 0; i < this.imageData.data.length; i += 4) {
            this.imageData.data[i + 3] = 0;
        }
    }

    drawEllipsePoints(xc, yc, x, y, rgba) {
        this.setPixel(xc + x, yc + y, rgba);
        this.setPixel(xc - x, yc + y, rgba);
        this.setPixel(xc + x, yc - y, rgba);
        this.setPixel(xc - x, yc - y, rgba);
    }

    drawEllipse(xc, yc, rx, ry, rgba) {
        let x = 0;
        let y = ry;
        let rx2 = rx * rx;
        let ry2 = ry * ry;
        let twoRx2 = 2 * rx2;
        let twoRy2 = 2 * ry2;
        let px = 0;
        let py = twoRx2 * y;

        let p = ry2 - rx2 * ry + 0.25 * rx2;
        while (px < py) {
            this.drawEllipsePoints(xc, yc, x, y, rgba);
            x++;
            px += twoRy2;

            if (p < 0) {
                p += ry2 + px;
            } else {
                y--;
                py -= twoRx2;
                p += ry2 + px - py;
            }
        }

        p = ry2 * (x + 0.5) * (x + 0.5) + rx2 * (y - 1) * (y - 1) - rx2 * ry2;
        while (y >= 0) {
            this.drawEllipsePoints(xc, yc, x, y, rgba);
            y--;
            py -= twoRx2;

            if (p > 0) {
                p -= rx2 - py;
            } else {
                x++;
                px += twoRy2;
                p -= rx2 - py + px;
            }
        }
    }

    drawPoint(p, rgba) {
        var x = p[0];
        var y = p[1];
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                this.setPixel(x + i, y + j, rgba);
            }
        }
    }

    addPoint(p) {
        this.point.push(p);
    }

    draw(p) {
        this.clear();

        for (var i = 0; i < this.point.length - 1; i += 2) {
            const center = this.point[i];
            const radiusPoint = this.point[i + 1];
            const radiusX = Math.abs(radiusPoint[0] - center[0]);
            const radiusY = Math.abs(radiusPoint[1] - center[1]);

            this.drawEllipse(
                center[0],
                center[1],
                radiusX,
                radiusY,
                this.lineRgba
            );
        }

        if (this.point.length % 2 === 1) {
            const center = this.point[this.point.length - 1];
            const radiusX = Math.abs(p[0] - center[0]);
            const radiusY = Math.abs(p[1] - center[1]);

            this.drawEllipse(
                center[0],
                center[1],
                radiusX,
                radiusY,
                this.vlineRgba
            );
        }

        this.context.putImageData(this.imageData, 0, 0);
    }
}
