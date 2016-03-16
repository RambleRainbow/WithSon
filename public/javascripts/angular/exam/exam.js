/**
 * Created by 灵 on 2016/3/5.
 */
function ExamRule(times, timeLimit) {
}

ExamRule.prototype.canRemoveQuestion = function(question, elapsed, isCorrect) {
}

function  Exam(examPaper) {
    this.examInfo = {name: examPaper.name, id:examPaper._id};
    this.examPaper = examPaper;
    this.subjects = [];
    if(this.examPaper.timeLimit === 0) {
        this.examPaper.timeLimit = Infinity;
    }

    this.remainCount = examPaper.questionPool.length * 2;

    this.curQuestionIndex = -1;
}

Exam.prototype.checkAnswer = function() {
    var subject = this.subjects[this.subjects.length-1];
    if(subject == null) {
        this.examInfo.startTime = new Date();
        return undefined;
    }

    subject.endTime = new Date();

    if(!subject.question.hasOwnProperty('rightTimes')) {
        subject.question.rightTimes = 0;
    }

    subject.isRight = subject.answer == subject.question.answer;

    if ( subject.isRight && ((subject.endTime - subject.startTime) < (this.examPaper.timeLimit * 1000))) {
        subject.question.rightTimes++;
        this.remainCount--;
    }
    else {
        this.remainCount += subject.question.rightTimes;
        subject.question.rightTimes = 0;
    }

    if(subject.question.rightTimes == 2) {
        this.examPaper.questionPool.splice(this.examPaper.questionPool.indexOf(subject.question), 1);
        this.curQuestionIndex--;
    }

    return subject.isRight;
}

Exam.prototype.getNextSubject = function() {
    if(this.examPaper.questionPool.length !== 0) {
        this.curQuestionIndex = (this.curQuestionIndex + 1) % this.examPaper.questionPool.length;
        var subject = {
            question: this.examPaper.questionPool[this.curQuestionIndex],
            answer:"",
            startTime: new Date()
        }

        this.subjects.push(subject);
        return subject;
    } else {
        this.examInfo.endTime = new Date();
        return null;
    }
}

Exam.prototype.getPrevSubject = function() {
    if(this.subjects.length == 0) {
        return null;
    }
    else {
        return this.subjects[-1];
    }
}

