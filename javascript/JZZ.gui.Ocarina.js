(function(global, factory) {
  /* istanbul ignore next */
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    factory.Ocarina = factory;
    module.exports = factory;
  }
  else if (typeof define === 'function' && define.amd) {
    define('JZZ.gui.Ocarina', ['JZZ'], factory);
  }
  else {
    factory(JZZ);
  }
})(this, function(JZZ) {

  if (!JZZ.gui) JZZ.gui = {};
  if (JZZ.gui.Ocarina) return;

  function Dot(x, y, r, t) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
  Dot.prototype.dump = function() {
    return '<circle cx="' + this.x + '" cy="' + this.y + '" r="' + this.r + '"/>';
  };
  Dot.prototype.render = function() {
    if (!this.svg) {
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      svg.setAttribute("cx", this.x);
      svg.setAttribute("cy", this.y);
      svg.setAttribute("r", this.r);
      svg.setAttribute("stroke", "black");
      svg.setAttribute("vector-effect", "non-scaling-stroke");
      svg.setAttribute("stroke-width", "1px");
      this.svg = svg;
    }
    return this.svg;
  };
  const _dots = [[0, 0, 0.1], [0.5, 0.5, 0.03], [1, 1, 0.05]];

  function Ocarina(arg) {
    var self = new JZZ.Widget();
    var i, d, svg;
    if (!arg) arg = {};
    if (!arg.dots) arg.dots = _dots;
    self.dots = [];
    for (i = 0; i < arg.dots.length; i++) {
      d = arg.dots[i];
      self.dots.push(new Dot(d[0], d[1], d[2]));
    }
    self.key = JZZ.MIDI.noteValue(arg.key);
    if (self.key == undefined) self.key = 60;
    self.back = arg.back;
    if (arg.at) {
      try {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("version", "1.1");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("viewBox", "0 0 1 1");
      }
      catch (e) {
        svg = undefined;
      }
      if (svg) {
        if (typeof arg.at == 'string') self.at = document.getElementById(arg.at);
        try {
          self.at.appendChild(svg);
        }
        catch (e) {
          document.appendChild(svg);
          self.at = document;
        }
        self.svg = svg;
        if (self.back) self.svg.innerHTML = self.back;
        for (i = 0; i < self.dots.length; i++) {
          d = self.dots[i].render();
          if (d) svg.appendChild(d);
        }
      }
    }
    self.chan = arg.chan || 0;
    self._receive = function(msg) {
      _emit(msg);
    }
    return self;
  }
  Ocarina.prototype.set = function(n, a) {
  }
  Ocarina.prototype.reset = function() {
    for (var i = 0; i < this.dots.length; i++) this.dots[i].reset();
  }
  Ocarina.prototype.dump = function(w, h) {
    var svg = [];
    if (this.back) svg.push(this.back);
    for (i = 0; i < this.dots.length; i++) svg.push(this.dots[i].dump());
    return svg.join('\n');
  };

  JZZ.gui.Ocarina = Ocarina;
});
