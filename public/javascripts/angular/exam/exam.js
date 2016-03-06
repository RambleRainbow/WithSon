/**
 * Created by 灵 on 2016/3/5.
 */
function  Exam(examPaper) {
    this.exam = examPaper;
    this.subjects = [];
}

Exam.prototype.checkAnswer = function() {
    var subject = this.subjects[this.subjects.length-1];
    if(subject == null) return ;

    if(!subject.question.hasOwnProperty('rightTimes')) {
        subject.question.rightTimes = 0;
    }
    if(subject.answer == subject.question.answer) {
        subject.question.rightTimes++;
    }
    else {
        subject.question.rightTimes = 0;
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
            rightTimes: 0
        }

        this.subjects.push(subject);
        return subject;
    } else {
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