(function(global, factory) {
  /* istanbul ignore next */
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    factory.Ocarina = factory;
    module.exports = factory;
  }
  else if (typeof define === 'function' && define.amd) {
    define('JZZ.svg.Ocarina', ['JZZ'], factory);
  }
  else {
    factory(JZZ);
  }
})(this, function(JZZ) {

  if (!JZZ.svg) JZZ.svg = {};
  if (JZZ.svg.Ocarina) return;

  function Hole(x, y, r, t) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.state = 0;
  }
  Hole.prototype.dump = function() {
    return '<circle vector-effect="non-scaling-stroke" ' + (this.state ? '' : 'fill="none" ') + 'cx="' + this.x + '" cy="' + this.y + '" r="' + this.r + '"/>';
  };
  Hole.prototype.render = function(at) {
    if (at) this.at = at;
    if (this.svg) this.at.removeChild(this.svg);
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.svg.setAttribute('cx', this.x);
    this.svg.setAttribute('cy', this.y);
    this.svg.setAttribute('r', this.r);
    this.svg.setAttribute('stroke', 'currentColor');
    this.svg.setAttribute('fill', this.state ? 'currentColor' : 'none');
    this.svg.setAttribute('vector-effect', 'non-scaling-stroke');
    this.svg.setAttribute('stroke-width', '1px');
    this.at.appendChild(this.svg);
  };
  Hole.prototype.set = function(x) {
    if (this.state == x) return;
    this.state = x;
    this.render();
  }

  function _chart(n, c) {
    var i, h;
    var a = new Array(n).fill(0);
    for (i = 0; i < c.length; i++) {
      h = c[i];
      if (Array.isArray(h)) a[h[0]] = h[1];
      else a[h] = 1;
    }
    return a;
  }
  function Ocarina(arg) {
    var self = new JZZ.Widget();
    var i, k, a, x, svg;
    if (!arg) arg = {};
    self.holes = [];
    for (i = 0; i < arg.holes.length; i++) {
      x = arg.holes[i];
      self.holes.push(new Hole(x[0], x[1], x[2]));
    }
    self.chart = [];
    for (i = 0; i < arg.chart.length; i++) {
      x = arg.chart[i];
      if (!x) {
        self.chart.push(undefined);
      }
      else {
        a = [];
        if (Array.isArray(x[0])) for (k = 0; k < x.length; k++) a.push(_chart(self.holes.length, x[k]));
        else a.push(_chart(self.holes.length, x));
        self.chart.push(a);
      }
    }
    self.alt = new Array(self.chart.length).fill(0);
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
      if (msg.getChannel() == self.chan) {
        if (msg.isNoteOn()) self.set(msg.getNote());
      }
      self._emit(msg);
    }
    self.dump = function(w, h) {
      var svg = [];
      if (this.back) svg.push(this.back);
      svg.push('<g vector-effect="non-scaling-stroke" stroke-width="1px" stroke="currentColor" fill="currentColor">');
      for (i = 0; i < this.holes.length; i++) svg.push(this.holes[i].dump());
      svg.push('</g>');
      return svg.join('\n');
    };
    self.set = function(n, a) {
      n = JZZ.MIDI.noteValue(n) - self.key;
      if (!self.chart[n]) {
        self.reset();
        return;
      }
      if (a == parseInt(a) && a >= 0 && a < self.char[n].length) self.alt[n] = a;
      a = self.chart[n][self.alt[n]];
      for (n = 0; n < a.length; n++) self.holes[n].set(a[n]);
    };
    self.reset = function() {
      for (var i = 0; i < self.holes.length; i++) self.holes[i].set(0);
    };
    return self;
  }

  JZZ.svg.Ocarina = Ocarina;
});
