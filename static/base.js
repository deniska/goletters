(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

function GAMEBASE(canvasName, render_func) {
    this.canvas = document.getElementById(canvasName);
    var self = this;
    this.ctx = this.canvas.getContext('2d');
    this.render_func = render_func;
    this.last_tick = (new Date).getTime();
    var rect = this.canvas.getBoundingClientRect();
    this.canvasX = rect.left;
    this.canvasY = rect.top;
    if (window.requestAnimationFrame) {
        window.requestAnimationFrame(function () { self.render(); });
    } else {
        setInterval(function() { self.render(); }, 16);
    }
    this.render();
}


GAMEBASE.prototype.render = function() {
    var rect = this.canvas.getBoundingClientRect();
    this.canvasX = rect.left;
    this.canvasY = rect.top;
    var self = this;
    var curTime = (new Date).getTime()
    this.render_func(this.ctx, curTime - this.last_tick);
    this.last_tick = curTime;
    if (window.requestAnimationFrame) {
        window.requestAnimationFrame(function () { self.render(); });
    }
};

GAMEBASE.prototype.keydown = function(callback) {
    window.addEventListener("keydown", function(event) {
        callback(event.keyCode, event.charCode);
    });
};

GAMEBASE.prototype.keyup = function(callback) {
    window.addEventListener("keyup", function(event) {
        callback(event.keyCode, event.charCode);
    });
};

GAMEBASE.prototype.mousedown = function(callback) {
    var rect = this.canvas.getBoundingClientRect();
    this.canvasX = rect.left;
    this.canvasY = rect.top;
    var self = this;
    this.canvas.addEventListener("mousedown", function(event) {
        callback(event.clientX - self.canvasX, event.clientY - self.canvasY, event.button);
    });
};

GAMEBASE.prototype.mouseup = function(callback) {
    var rect = this.canvas.getBoundingClientRect();
    this.canvasX = rect.left;
    this.canvasY = rect.top;
    var self = this;
    this.canvas.addEventListener("mouseup", function(event) {
        callback(event.clientX - self.canvasX, event.clientY - self.canvasY, event.button);
    });
};

GAMEBASE.prototype.mousemove = function(callback) {
    var rect = this.canvas.getBoundingClientRect();
    this.canvasX = rect.left;
    this.canvasY = rect.top;
    var self = this;
    this.canvas.addEventListener("mousemove", function(event) {
        callback(event.clientX - self.canvasX, event.clientY - self.canvasY);
    });
};
//keydown(key, char), keyup(key, char), mousedown(x, y, btn), mouseup(x, y, btn), mousemove(x, y)
