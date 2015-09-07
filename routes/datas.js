var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET users listing. */
router.get('/', function(req, res, next) {
    switch  (req.query['type']) {
        case 'alphabet':
            fs.readFile('./datas/alphabets.json', function(err, data) {
                res.send(data);
            });
            break;
        case 'a':
            res.send('a');
            break;
        default:
            res.send(req.query['type']);
            break;
    }
});

module.exports = router;
