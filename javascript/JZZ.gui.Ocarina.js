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
    var i, d, svg;
    if (!arg) arg = {};
    if (!arg.dots) arg.dots = _dots;
    this.dots = [];
    for (i = 0; i < arg.dots.length; i++) {
      d = arg.dots[i];
      this.dots.push(new Dot(d[0], d[1], d[2]));
    }
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
        if (typeof arg.at == 'string') this.at = document.getElementById(arg.at);
        try {
          this.at.appendChild(svg);
        }
        catch (e) {
          document.appendChild(svg);
          this.at = document;
        }
        this.svg = svg;
        for (i = 0; i < this.dots.length; i++) {
          d = this.dots[i].render();
          if (d) svg.appendChild(d);
        }
      }
    }
  }
  Ocarina.prototype.dump = function(w, h) {
    var svg = [];
    for (i = 0; i < this.dots.length; i++) svg.push(this.dots[i].dump());
    return svg.join('\n');
  };

  JZZ.gui.Ocarina = Ocarina;
});
