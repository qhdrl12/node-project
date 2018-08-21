const dateFormat = require('dateformat');

let now = new Date();

/**
 * 최대 최소값 사이의 RANDOM 값을 구하기 위한 함수 
 * @param {*} min
 * @param {*} max
 */
const generatorRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
}

/**
 * sec가 Default면 format에 맞는 현재 시간을,
 * 아닐 경우 초기 설정 값인 now를 이용하여 셋팅 된 sec를 더한 값을 return 
 * @param {*} format (sample - yyyy/mm/dd hh:MM:ss)
 * @param {*} sec (default 0)
 */
const generatorDatetime = (format, sec = 0) => {
    let datetime = (sec == 0) ? dateFormat(new Date(), format) :
        dateFormat(now.setSeconds(now.getSeconds() + sec), format);

    return datetime;
}

module.exports.generatorRandomNumber = generatorRandomNumber;
module.exports.generatorDatetime = generatorDatetime;