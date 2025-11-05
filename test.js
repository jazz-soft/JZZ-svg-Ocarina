const JZZ = require('jzz');
require('.')(JZZ);

var svg_grid = `<g fill="white" stroke="#ccc" stroke-width="0.01">
<line x1="0" y1="0" x2="1" y2="0"/><line x1="0" y1="0" x2="0" y2="1"/>
<line x1="0" y1="0.1" x2="1" y2="0.1"/><line x1="0.1" y1="0" x2="0.1" y2="1"/>
<line x1="0" y1="0.2" x2="1" y2="0.2"/><line x1="0.2" y1="0" x2="0.2" y2="1"/>
<line x1="0" y1="0.3" x2="1" y2="0.3"/><line x1="0.3" y1="0" x2="0.3" y2="1"/>
<line x1="0" y1="0.4" x2="1" y2="0.4"/><line x1="0.4" y1="0" x2="0.4" y2="1"/>
<line x1="0" y1="0.5" x2="1" y2="0.5"/><line x1="0.5" y1="0" x2="0.5" y2="1"/>
<line x1="0" y1="0.6" x2="1" y2="0.6"/><line x1="0.6" y1="0" x2="0.6" y2="1"/>
<line x1="0" y1="0.7" x2="1" y2="0.7"/><line x1="0.7" y1="0" x2="0.7" y2="1"/>
<line x1="0" y1="0.8" x2="1" y2="0.8"/><line x1="0.8" y1="0" x2="0.8" y2="1"/>
<line x1="0" y1="0.9" x2="1" y2="0.9"/><line x1="0.9" y1="0" x2="0.9" y2="1"/>
<line x1="0" y1="1" x2="1" y2="1"/><line x1="1" y1="0" x2="1" y2="1"/></g>`;

var oca = new JZZ.gui.Ocarina({ back: svg_grid });
var dump = [];
dump.push('<svg version="1.1" viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg">');
dump.push(oca.dump());
dump.push('</svg>');
console.log(dump.join('\n'));