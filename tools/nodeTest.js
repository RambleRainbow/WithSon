/**
 * Created by 灵 on 2016/3/9.
 */
var _ = require('underscore')._;

var result = _.chain({a:[1,2],b:[1,2]})
    .mapObject(function(value, key){
        console.log(key);
        return key;
    })
    .value();
console.log(result);