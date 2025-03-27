import { Painter } from "./dda.js";
import { PainterBre } from "./bresenham.js";
import { PainterMid } from "./midpoint.js";

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var width = 800;
var height = 600;

var bgRgba = [240, 240, 200, 255];
var pointRgba = [0, 0, 255, 255];
var lineRgba = [38, 38, 99, 255];
var vlineRgba = [101, 96, 194, 255];

var Algorithm_title = document.getElementById("algorithm-title")

var painterDDA = new Painter(context, width, height, lineRgba, vlineRgba);
var painterMid = new PainterMid(context, width, height, lineRgba, vlineRgba);
var painterBre = new PainterBre(context, width, height, lineRgba, vlineRgba);

var painter = painterDDA;

document.getElementById("btnDDA").addEventListener("click", function () {
    Algorithm_title.textContent = "DDA Algorithm"
    painter = painterDDA;
    setActiveButton("btnDDA");
});
document.getElementById("btnBresenham").addEventListener("click", function () {
    Algorithm_title.textContent = "Bresenham Algorithm"
    painter = painterBre;
    setActiveButton("btnBresenham");
});
document.getElementById("btnMidpoint").addEventListener("click", function () {
    Algorithm_title.textContent = "Midpoint Circle Algorithm"
    painter = painterMid;
    setActiveButton("btnMidpoint");
});

function setActiveButton(selectedButtonId) {
    const buttons = document.querySelectorAll("#buttonContainer button");
    buttons.forEach(button => {
        button.classList.remove("active");
    });
    document.getElementById(selectedButtonId).classList.add("active");
}

canvas.setAttribute("width", width);
canvas.setAttribute("height", height);

function getPosOnCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return [Math.floor(x - bbox.left * (canvas.width / bbox.width) + 0.5),
    Math.floor(y - bbox.top * (canvas.height / bbox.height) + 0.5)];
};

var state = 0;

function doMouseMove(e) {
    if (state == 0 || state == 2) { return; }
    var p = getPosOnCanvas(e.clientX, e.clientY);
    painter.draw(p);
};

function doMouseDown(e) {
    if (state == 2 || e.button != 0) {
        return;
    }
    var p = getPosOnCanvas(e.clientX, e.clientY);
    painter.addPoint(p);
    painter.draw(p);
    if (state == 0) {
        state = 1;
    }
};

function doKeyDown(e) {
    if (state == 2) { return; }
    var keyId = e.keyCode ? e.keyCode : e.which;
    if (keyId == 27 && state == 1) {
        state = 2;
        painter.draw(painter.points[painter.points.length - 1]);
    }
};

canvas.onmousemove = function (event) { doMouseMove(event) };
canvas.onmousedown = function (event) { doMouseDown(event) };
document.onkeydown = function (event) { doKeyDown(event) };
