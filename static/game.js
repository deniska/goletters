//var alphabet = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
var count = 7;
var letters = []
var speed = 0.3
for (var i = 0; i < count; i++) {
    for (j = 0; j < alphabet.length; j++) {
        letters.push({Letter: alphabet[j],
                        X: 400, tx: 400,
                        Y: 240, ty: 240,
                        w: 0, h: 0});
    }
}
//var letters = [{Letter: "A", X: 100, Y: 75, w: 0, h: 0}];
var first = true;
var isDragging = -1;
var dragOffset = {x: 0, y: 0};

function render(c, delta) {
    c.fillStyle = "white";
    c.fillRect(0, 0, 800, 480);
    c.fillStyle = "black";
    c.font = "40px Sans";
    c.textBaseline = "top";
    for (var i = 0; i < letters.length; i++) {
        var l = letters[i];
        l.X += (l.tx - l.X) * speed
        l.Y += (l.ty - l.Y) * speed
        c.fillText(l.Letter, l.X, l.Y);
        if (first) {
            l.h = 40;
            l.w = c.measureText(l.Letter).width;
        }
    }
    first = false;
}

function keydown(code, char) {

}

function keyup(code, char) {

}

function clamp(x, a, b) {
    return Math.max(a, Math.min(x, b));
}

function mousemove(x, y) {
    if (isDragging > -1) {
        letters[isDragging].X = clamp(x + dragOffset.x, 0, 800 - letters[isDragging].w);
        letters[isDragging].Y = clamp(y + dragOffset.y, 0, 480 - letters[isDragging].w);
        letters[isDragging].tx = letters[isDragging].X;
        letters[isDragging].ty = letters[isDragging].Y;
    }
}

function moveLetter(id, x, y) {
    conn.send(JSON.stringify({Id: id, X: x, Y: y}));
    console.log("Sent");
}

function mousedown(x, y, btn) {
    for (var i = 0; i < letters.length; i++) {
        var l = letters[i];
        if (x > l.X && x < l.X + l.w && y > l.Y && y < l.Y + l.h) {
            isDragging = i;
            dragOffset.x = l.X - x;
            dragOffset.y = l.Y - y;
            return;
        }
    }
}

function mouseup(x, y, btn) {
    if (isDragging > -1) {
        moveLetter(isDragging, x + dragOffset.x, y + dragOffset.y);
        isDragging = -1;
    }
}

function onMessage(evt) {
    var msg = JSON.parse(evt.data);
    //console.log(evt.data)
    letters[msg.Id].tx = msg.X;
    letters[msg.Id].ty = msg.Y;
}

base = new GAMEBASE("canvas", render);
base.keydown(keydown);
base.keyup(keyup);
base.mousemove(mousemove);
base.mousedown(mousedown);
base.mouseup(mouseup);

var conn = new WebSocket(host);
conn.onmessage = onMessage;
