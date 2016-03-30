/**
 * Created by 灵 on 2016/3/26.
 */

function SubjectStatisticsVM() {
};

SubjectStatisticsVM.prototype.calc = function(subjects) {
    return [{
        question: '1+1=?',
        rightCount:1,
        wrongCount:0,
        blow6Sec: 1,
        blow10Sec: 0,
        over10Sec: 0
    }];
};
module.exports = SubjectStatisticsVM;