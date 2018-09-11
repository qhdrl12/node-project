const Influx = require('influx');
const _ = require('lodash');

const logger = require('../common/logger');
const config = require('./config.json');

const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];

logger.init('influx', 'kafka-influx');

const finalConfig = _.merge(defaultConfig, environmentConfig);
global.gConfig = finalConfig;

const influx = new Influx.InfluxDB({
    host: gConfig.kafka.host,
    database: gConfig.kafka.database

    /** schema
     measurement: 'kafka',
         fields: {
             response_time: Influx.FieldType.INTEGER
         },
         tags: [
             'host'
         ]
    */
});

//sample code
let getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

let influxWritePoint = () => {
    influx.writePoints([
        {
            measurement: 'kafka',
            tags: { host: "dev1" },
            fields: { response_time: getRandomInt(1, 200) }
        }
    ]).then(() => {
        return influx.query(`
        select * from kafka
        where host = ${Influx.escape.stringLit("dev1")}
        order by time desc
        limit 1
       `)
    }).then(rows => {
        try {
            // throw new Error('오류 핸들링 테스트');
        } catch (error) {
            // logger.error('uncaughtException', { message: err.message, stack: err.stack });
            // logger.error('Fatal uncaught exception crashed cluster', error, function (err, level, msg, meta) {
            //     process.exit(1);
            // });
        }

        rows.forEach(row => logger.info(`A request to ${row.response_time}ms`));
    });
}

setInterval(influxWritePoint, 1000);