// const dateFormat = require('dateformat');
const moment = require('moment');
let now = moment();

// /**
//  * 최대 최소값 사이의 RANDOM 값을 구하기 위한 함수 
//  * @param {*} min
//  * @param {*} max
//  */
const generatorRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
}

// /**
//  * sec가 Default면 format에 맞는 현재 시간을,
//  * 아닐 경우 초기 설정 값인 now를 이용하여 셋팅 된 sec를 더한 값을 return 
//  * @param {*} format (sample - YYYY/MM/DD HH:mm:ss)
//  * @param {*} sec (default 0)
//  */
const generatorDatetime = (format, sec = 0) => {
    let datetime = (sec == 0) ? moment().format(format) :
        now.add(1, 'seconds').format(format);

    return datetime;
}

/**
 * 전달받은 date를 해당 포맷에 맞춰 전달.
 * @param {*} format  
 * @param {*} date 
 */
const datetimechangeFormat = (format, date) => {
    return moment(date).format(format);
}

// let instance;
// let DateSingleton = (function () {
//     function DateSingleton() {
//         this.date = new Date();
//     }

//     DateSingleton.prototype.getDate = () => {
//         return this.date;
//     }

//     DateSingleton.prototype.generatorDatetime = (format, sec = 0) => {
//         let datetime = (sec == 0) ? dateFormat(new Date(), format) :
//             dateFormat(instance.date.setSeconds(instance.date.getSeconds() + sec), format);
//         return datetime;
//     }

//     return function () {
//         if (!instance) instance = new DateSingleton();

//         console.log(`return function : ${JSON.stringify(instance.date)}`);
//         return instance;
//     }
// })();

module.exports.generatorRandomNumber = generatorRandomNumber;
module.exports.generatorDatetime = generatorDatetime;
module.exports.datetimechangeFormat = datetimechangeFormat;
// module.exports.DateSingleton = DateSingleton;