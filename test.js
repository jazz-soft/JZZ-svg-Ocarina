const JZZ = require('jzz');
require('.')(JZZ);

var oca = new JZZ.gui.Ocarina();
var w = 200, h = 200;
var dump = [];
dump.push('<svg version="1.1" width="' + w + '" height="' + h + '" viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg">');
dump.push(oca.dump());
dump.push('</svg>');
console.log(dump.join('\n'));