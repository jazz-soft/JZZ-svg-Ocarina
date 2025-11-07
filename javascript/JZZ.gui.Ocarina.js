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

  function Hole(x, y, r, t) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.state = 0;
  }
  Hole.prototype.dump = function() {
    return '<circle stroke-width="1px" vector-effect="non-scaling-stroke" stroke="currentColor" fill="' + (this.state ? 'currentColor' : 'none') + '" cx="' + this.x + '" cy="' + this.y + '" r="' + this.r + '"/>';
  };
  Hole.prototype.render = function(at) {
    if (at) this.at = at;
    if (this.svg) arguments.removeChild(this.svg);
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.svg.setAttribute('cx', this.x);
    this.svg.setAttribute('cy', this.y);
    this.svg.setAttribute('r', this.r);
    this.svg.setAttribute('stroke', 'currentColor');
    this.svg.setAttribute('fill', this.state ? 'currentColor' : 'none');
    this.svg.setAttribute('vector-effect', 'non-scaling-stroke');
    this.svg.setAttribute('stroke-width', '1px');
    at.appendChild(this.svg);
  };
  Hole.prototype.set = function(x) {
    if (this.state == x) return;
    this.state = x;
    this.render();
  }

  function Ocarina(arg) {
    var self = new JZZ.Widget();
    var i, d, svg;
    if (!arg) arg = {};
    self.holes = [];
    for (i = 0; i < arg.holes.length; i++) {
      d = arg.holes[i];
      self.holes.push(new Hole(d[0], d[1], d[2]));
    }
    self.key = JZZ.MIDI.noteValue(arg.key);
    if (self.key == undefined) self.key = 60;
    self.back = arg.back;
    if (arg.at) {
      try {
        svg = document.createElementNS('http://www.w3.org/2000/svg', "svg");
        svg.setAttribute('version', "1.1");
        svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
        svg.setAttribute('viewBox', "0 0 1 1");
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
        for (i = 0; i < self.holes.length; i++) self.holes[i].render(svg);
      }
    }
    self.chan = arg.chan || 0;
    self._receive = function(msg) {
      self._emit(msg);
    }
    self.dump = function(w, h) {
      var svg = [];
      if (this.back) svg.push(this.back);
      svg.push('<g>');
      for (i = 0; i < this.holes.length; i++) svg.push(this.holes[i].dump());
      svg.push('</g>');
      return svg.join('\n');
    };
    self.set = function(n, a) {
    };
    self.reset = function() {
      for (var i = 0; i < this.holes.length; i++) this.holes[i].set(0);
    };
    return self;
  }

  JZZ.gui.Ocarina = Ocarina;
});
