//built-in library
const fs = require('fs');
const path = require('path');

//npm library
const winston = require('winston');
const dailyRotateFile = require('winston-daily-rotate-file');
const moment = require('moment');

const now = moment();
const dateFormat = "YYYY-MM-DD";
const logDate = now.format(dateFormat);

const baseDirPath = path.join(process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE, 'logs');

const logger = winston.createLogger();

let winstonConsole = new winston.transports.Console({
    colorize: true,
    json: false,
    timestamp: logDate
});

// let setConsoleAndRotateLog = (filename) => {
//     return [
//         winstonConsole,
//         new dailyRotateFile({
//             colorize: false,
//             timestamp: logDate,
//             filename: filename
//         })];
// }

logger.init = (system, filename) => {
    let logPath = path.join(baseDirPath, system);

    if (!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath);
    }

    logger.configure({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.label({ label: system }),
            winston.format.printf(info => {
                if (info.stack != undefined) info.message += info.stack;
                return `${info.timestamp} [${info.level.toUpperCase()}] ${info.label} - ${info.message}`;
            })
        ),
        // transports: setConsoleAndRotateLog(path.join(logPath, `${filename}.log`)),
        transports: [
            winstonConsole,
            new dailyRotateFile({
                level: 'info',
                colorize: false,
                timestamp: logDate,
                filename: path.join(logPath, `${filename}.log`),
            }),
            new dailyRotateFile({
                level: 'error',
                colorize: false,
                timestamp: logDate,
                filename: path.join(logPath, `${filename}-error.log`),
            })
        ],
        //todo uncaughtException not working...
        exceptionHandlers: [
            new dailyRotateFile({
                colorize: false,
                timestamp: logDate,
                filename: path.join(logPath, `${filename}-exception.log`),
            })
        ]
    });
}

module.exports = logger;