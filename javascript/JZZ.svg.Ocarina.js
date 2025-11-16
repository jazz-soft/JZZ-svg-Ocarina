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

  function Hole(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.state = 0;
  }
  Hole.prototype.dump = function() {
    var d = '<circle vector-effect="non-scaling-stroke" ' + ((this.state & 1) ? '' : 'fill="none" ') + 'cx="' + this.x + '" cy="' + this.y + '" r="' + this.r + '"/>';
    if (this.state == 2) d += '\n<path d="' + _moon(this) + '" vector-effect="non-scaling-stroke"/>';
    return d;
  };
  Hole.prototype.render = function(at) {
    if (at) this.at = at;
    if (!this.at) return;
    if (this.svg) this.at.removeChild(this.svg);
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.svg.appendChild(_circle(this.x, this.y, this.r, (this.state & 1) ? 'currentColor' : 'none'));
    if (this.state == 2) this.svg.appendChild(_path(_moon(this)));
    this.at.appendChild(this.svg);
  };
  Hole.prototype.set = function(x) {
    if (this.state == x) return;
    this.state = x;
    this.render();
  };
  function Blow(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.state = 0;
  }
  Blow.prototype.dump = function() {
    return this.state ? '<circle vector-effect="non-scaling-stroke" cx="' + this.x + '" cy="' + this.y + '" r="' + this.r + '"/>' : '';
  };
  Blow.prototype.render = function(at) {
    if (at) this.at = at;
    if (!this.at) return;
    if (this.svg) this.at.removeChild(this.svg);
    if (this.state) {
      this.svg = _circle(this.x, this.y, this.r, 'currentColor');
      this.at.appendChild(this.svg);
    }
    else this.svg = undefined;
  };
  Blow.prototype.set = function(x) {
    if (this.state == x) return;
    this.state = x;
    this.render();
  };
  function _circle(x, y, r, f) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    svg.setAttribute('cx', x);
    svg.setAttribute('cy', y);
    svg.setAttribute('r', r);
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('fill', f);
    svg.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.setAttribute('stroke-width', '1px');
    return svg;
  }
  function _path(d) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svg.setAttribute('d', d);
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.setAttribute('stroke-width', '1px');
    return svg;
  }
  function _moon(x) {
    return ['M', x.x, x.y - x.r, 'A', x.r, x.r, 0, 0, 1, x.x, x.y + x.r, 'L', x.x, x.y - x.r].join(' ');
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
  function _val_g(x) {
    var i;
    if (!Array.isArray(x)) return false;
    for (i = 0; i < x.length; i++) if (!_val_c(x[i])) return false;
    return true;
  }
  function _val_c(x) {
    var i, j;
    if (!Array.isArray(x)) return false;
    for (i = 0; i < x.length; i++) {
      if (Array.isArray(x[i])) {
        for (j = 0; j < x[i].length; j++) if (parseInt(x[i][j]) != x[i][j]) return false;
      }
      else if (parseInt(x[i]) != x[i]) return false;
    }
    return true;
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
    self.blow = [];
    if (arg.blow) for (i = 0; i < arg.blow.length; i++) {
      x = arg.blow[i];
      self.blow.push(new Blow(x[0], x[1], x[2]));
    }
    self.chart = [];
    for (i = 0; i < arg.chart.length; i++) {
      x = arg.chart[i];
      if (!x) {
        self.chart.push(undefined);
      }
      else {
        a = [];
        if (_val_g(x)) for (k = 0; k < x.length; k++) a.push(_chart(self.holes.length, x[k]));
        else if (_val_c(x)) a.push(_chart(self.holes.length, x));
        else console.error('Bad chart data:', x);
        self.chart.push(a);
      }
    }
    self.alt = new Array(self.chart.length).fill(0);
    self.key = JZZ.MIDI.noteValue(arg.key);
    if (self.key == undefined) self.key = 72;
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
        if (msg.isNoteOn()) {
          self.note = msg.getNote();
          self.set(self.note);
          self.on();
        }
        else if (msg.isNoteOff()) {
          if (self.note == msg.getNote()) self.off();
        }
      }
      self._emit(msg);
    };
    self.dump = function() {
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
      if (a == parseInt(a) && a >= 0 && a < self.chart[n].length) self.alt[n] = a;
      a = self.chart[n][self.alt[n]];
      for (n = 0; n < a.length; n++) self.holes[n].set(a[n]);
    };
    self.on = function() {
    };
    self.off = function() {
    };
    self.reset = function() {
      for (var i = 0; i < self.holes.length; i++) self.holes[i].set(0);
    };
    self.range = function() {
      return [self.key, self.key + self.chart.length - 1];
    };
    return self;
  }

  JZZ.svg.Ocarina = Ocarina;
});
