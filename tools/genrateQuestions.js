/**
 * Created by 灵 on 2016/3/6.
 */
var _ = require("underscore")._;
var fs = require('fs');
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var additionQuestions = require('./additionQuestions.js');

var plusQuestions = additionQuestions.generateAddQuestions(100);

mongoClient.connect('mongodb://127.0.0.1:27017/gws', function(err, db) {
    assert.equal(err, null);

    var questions = db.collection('questions');
    questions.insertMany(plusQuestions, function(err) {
        if(err != null) {
            console.log(err);
        }
        else {
            console.log('write ok');
        }

        db.close();
    })
    var questions = db.collections('questions');

})