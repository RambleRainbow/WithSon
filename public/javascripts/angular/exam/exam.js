/**
 * Created by 灵 on 2016/3/5.
 */
function  Exam(examPaper) {
    this.examInfo = {name: examPaper.name, id:examPaper._id};
    this.exam = examPaper;
    this.subjects = [];
}

Exam.prototype.checkAnswer = function() {
    var subject = this.subjects[this.subjects.length-1];
    if(subject == null) {
        this.examInfo.startTime = new Date();
        return;
    }

    subject.endTime = new Date();

    if(!subject.question.hasOwnProperty('rightTimes')) {
        subject.question.rightTimes = 0;
    }
    if(subject.answer == subject.question.answer) {
        subject.question.rightTimes++;
        subject.isRight = true;
    }
    else {
        subject.question.rightTimes = 0;
        subject.isRight = false;
    }

    if(subject.question.rightTimes == 2) {
        this.exam.questionPool.splice(this.exam.questionPool.indexOf(subject.question), 1);
    }
}

Exam.prototype.getNextSubject = function() {
    this.checkAnswer();

    if(this.exam.questionPool.length !== 0) {
        var subject = {
            question: this.exam.questionPool[Math.floor(Math.random() * this.exam.questionPool.length)],
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
        return this.subjects.lastChild();
    }
}