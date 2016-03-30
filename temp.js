/**
 * Created by 灵 on 2016/3/26.
 */
var _ = require('underscore')._;

function pushto(a, v, t) {
    for(var x = 0; x < t; x ++ ) {
        a.push(v);
    };
}

function a() {
    var y1 = {max:2, value:5};
    var j5 = {max:5, value:2};
    var j1 = {max:8, value:1};
    var tgr = 12;

    var all = [];
    for(var i = 0; i <= y1.max; i++) {
        for(var j = 0; j <= j5.max; j++) {
            for( var k = 0; k <= j1.max; k++) {
                var one = [];
                pushto(one, y1.value, i);
                pushto(one, j5.value, j);
                pushto(one, j1.value, k);
                all.push(one);
            }
        }
    }

    var r = _.chain(all)
        .map(function(a) {
            return {
                array: a,
                value: _.reduce(a, function (memo, v) {
                    return memo + v
                }, 0)
            }
        })
        .filter(function(a){ return a.value == tgr;})
        .value();

    console.log(r);
}

a();