
function getExamPaper(examParam, callback) {
    var papertest = {
        name: "test",
        questionPool: [
            {
                text: "11-2=?",
                answer: 9,
                input:{
                    type: 0
                }
            },
            {
                text: "13-8=?",
                answer: 5,
                input:{
                    type: 0
                }
            }
        ]
    };
    callback(null, papertest);
}

module.exports = {
    getExamPaper: getExamPaper
}