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
    //schema
    // measurement: 'kafka',
    //     fields: {
    //         response_time: Influx.FieldType.INTEGER
    //     },
    //     tags: [
    //         'host'
    //     ]
});

influx.writePoints([
    {
        measurement: 'kafka',
        tags: { host: "dev1" },
        fields: { response_time: 11 }
    }
]).then(() => {
    return influx.query(`
    select * from kafka
    where host = ${Influx.escape.stringLit("dev1")}
    order by time desc
    limit 2
   `)
}).then(rows => {
    rows.forEach(row => logger.info(`A request to ${row.response_time}ms`));
});