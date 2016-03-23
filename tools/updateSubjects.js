/**
 * Created by 灵 on 2016/3/23.
 */
var mongoClient = require('mongodb').MongoClient;
var _ = require('underscore')._;
var async = require('async');

mongoClient.connect('mongodb://localhost:27017/gws', function(err, db) {
    var examsCollection = db.collection('exams');
    examsCollection.find({}).toArray()
        .then(function(exams) {
            _.each(exams, function(exam) {
                _.each(exam.subjects, function(subject) {
                    subject.timeSpan = new Date(subject.endTime) - new Date(subject.startTime)
                });
            });

            var updatePromises = _.map(exams, function(exam) {
                var id = exam._id;
                delete exam._id;
                return examsCollection.updateOne({_id:id},exam);
            });

            return Promise.all(updatePromises);
        })
        .then(function() {
            db.close();
            return true;
        })
        .catch(function(err) {
            console.log(err.message);
            db.close();
        });
});