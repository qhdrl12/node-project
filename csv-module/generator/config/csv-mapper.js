// const utils = require('../../common/utils');
const utils = require('../../common/utils');
const KCITY_DATE_FORMAT = "yyyy/mm/dd hh:MM:ss";

// const dUtils = utils.DateSingleton();

//headers와 generatatorMandatoryMap는 Kcity 설정 값임.
const headers = [
    "vrn",
    "nick",
    "ttime",
    "lat",
    "lon",
    "flattire",
    "accuracy",
    "stoplineviolation",
    "obdabsengload",
    "fuellvlinput",
    "bsmlat",
    "bsmlon",
    "drvbehavior",
    "disabledvehicle",
    "accelpos",
    "getondown",
    "equratio",
    "hazardlights",
    "coolanttemp",
    "hlturn",
    "huturn",
    "hrturn",
    "hstart",
    "hstop",
    "hdecel",
    "haccel",
    "trouble",
    "v2xtid",
    "distance",
    "tripseq",
    "obdspeed",
    "obdrpm",
    "obdvolt",
    "obdfuelrate",
    "mdistance",
    "mfco",
    "gpsspeed",
    "heading",
    "dtc",
    "obddist",
    "pedesstat",
    "Pedeseventterminaltime",
    "Pedesclearterminaltime",
    "Collistat",
    "Collieventterminaltime",
    "Colliclearterminaltime",
    "Estopstat",
    "Estopeventtime",
    "Estopfintime",
    "Estopcmdsource",
    "Estopbrakedistance",
    "Estopbraketime"
]

const generatatorMandatoryMap = (date) => {
    //todo window size
    return {
        vrn: 1516,
        nick: 'test',
        ttime: utils.datetimechangeFormat(KCITY_DATE_FORMAT, date),
        // ttime: utils.generatorDatetime(KCITY_DATE_FORMAT, 1),
        lat: utils.generatorRandomNumber(37.46000, 37.46200).toFixed(5),
        lon: utils.generatorRandomNumber(126.9200, 126.9250).toFixed(4),
        obdspeed: utils.generatorRandomNumber(0, 20).toFixed(0),
        mdistance: utils.generatorRandomNumber(0, 9.99999).toFixed(4)
    }
}

module.exports.generatatorMandatoryMap = generatatorMandatoryMap;
module.exports.headers = headers;
