/// git repo: https://github.com/palei/beep-game

'use strict';

Array.prototype.shuffle = function() {
    return this.sort(function() {
        return .5 - Math.random();
    });
};

function BeepGame(x, y) {
    if ((x * y) % 2 !== 0) {
        console.error("Error: x times y must be divisible by two.");
        return;
    }
    this.x = x;
    this.y = y;

    this.size = x * y;
    
    this.all_possible_beeps = [];

    var n = 'ABCDEFG';
    for (var i = 0; i < n.length; i++) {
        for (var k = 2; k < 8; k++) {
            this.all_possible_beeps.push(n[i] + '#' + k);
        }
    }
    return this;
}

BeepGame.prototype.active_item_1 = undefined;
BeepGame.prototype.active_item_2 = undefined;

BeepGame.prototype.pairs_found = 0;
BeepGame.prototype.moves_done = 0;

BeepGame.prototype.makeBeeps = function() {
    var beeps = this.all_possible_beeps.shuffle().slice(0, this.size / 2);
    return beeps.concat(beeps).shuffle();
};

BeepGame.prototype.render = function() {
    var table = document.getElementById('beep-game');
    
    if (!table)
        return console.error('Error: Could not find table element.');

    table.innerHTML = '';
    
    var tr, td;
    var beeps = this.makeBeeps();
    var _self = this;

    for (var i = 0, beep_index = 0; i < this.y; i++) {
        tr = document.createElement('tr');

        for (var k = 0; k < this.x; k++, beep_index++) {
            td = document.createElement('td');

            td.setAttribute('beep', beeps[beep_index]);

            td.onclick = function(e) {
                _self.clickHandler(e.target, _self);
            };

            tr.appendChild(td);
        }

        table.appendChild(tr);
    }
    return this;
};

BeepGame.prototype.clickHandler = function(_this, _self) {

    beeplay().play(_this.getAttribute('beep'), 1/2);

    console.info(_this.getAttribute('beep')); // for debug

    _this.setAttribute('class', 'active');

    if (!_self.active_item_1) _self.active_item_1 = _this; 
    else                      _self.active_item_2 = _this;

    var a = _self.active_item_1;
    var b = _self.active_item_2;

    if (a && b && !a.isSameNode(b)) {

        document.querySelector('#moves').innerHTML = 'Moves: ' + ++_self.moves_done;

        if (a.getAttribute('beep') == b.getAttribute('beep')) {
            ++_self.pairs_found;

            a.setAttribute('class', 'blank');
            b.setAttribute('class', 'blank');

            a.onclick = undefined;
            b.onclick = undefined;
        
        } else {
            a.setAttribute('class', 'normal');
            b.setAttribute('class', 'normal');
        }

        _self.active_item_1 = undefined;
        _self.active_item_2 = undefined;
    }

    if (_self.pairs_found == _self.size / 2) {
        document.querySelector('p.info').style.display = 'block';
    }
};

BeepGame.prototype.clearActiveClasses = function() {
    var elements = document.querySelectorAll('td');

    Array.prototype.forEach.call(elements, function(e, i) {
        e.setAttribute('class', 'normal');
    });
};