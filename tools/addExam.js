/**
 * Created by 灵 on 2016/3/6.
 */
var mongoClient = require('mongodb').MongoClient;

mongoClient.connect('mongodb://127.0.0.1:27017/gws', function(err, db) {
    if(err) {
        console.log(err);
    }
    var exams = db.collection('exams');

    var ex = [
        {
            _id:1,
            name:"20以内加减法",
            questionQuery:JSON.stringify(
            {
                $or: [
                    {label: {$all: ["<=20"]}},
                    {label: {$all: ["<=10"]}}
                ]
            }
            )
        }
    ];

    //exams.insert(ex,function(err, results) {
    //    if(err) {
    //        console.log(err);
    //    }
    //    else {
    //        console.log('finised');
    //    }
    //    db.close();
    //});

    exams.find({}).toArray().
    then(function(results) {
        r = results;
        var q = JSON.parse(results[0].questionQuery);
        return db.collection("questions").find(q).toArray();
    }).
    then(function(results) {
        console.log(results.length);
    })
    .catch(function(err) {
        console.log(err);
    })

});