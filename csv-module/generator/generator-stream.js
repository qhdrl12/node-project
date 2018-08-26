const fs = require('fs');
const moment = require('moment');
const cluster = require('cluster');
const program = require('commander');
const chalk = require('chalk');

const numCpus = require('os').cpus().length;
const kcity = require('./config/csv-stream-mapper');

let now = moment();
let count = 0;
let outputFile;
let outputStream;

if (cluster.isMaster) {

    const checkMandatoryArgs = (option) => {
        if (!program[option]) {
            console.log(chalk.red(`--${option} required. process exit\nif you need more information use --help`));
            process.exit(1);
        }
    }

    program
        .version('0.1.0')
        .option('-f, --file <file>', 'Add file')
        .option('-c, --cluster <cluster>', 'Add cluster')
        .action((data) => {
            if (!program.file) program.file = "imsi_stream.csv";
            if (!program.cluster) program.cluster = 1;

            console.log(`cluster count[${program.cluster}], numCpus count[${numCpus}]`);
            if (program.cluster > numCpus) {
                console.log(chalk.red('clustr count less then cpus'));
                process.exit();
            }
        })
        .parse(process.argv);

    outputFile = 'output/' + program.file;
    outputStream = fs.createWriteStream(outputFile, { flags: 'a' });
}

const writeRecord = () => {
    process.send({ cmd: 'increase' });

    let record = {}
    let mandratoryMap = kcity.generatatorMandatoryMap(now);

    kcity.headers.map(item => {
        let v = mandratoryMap[item];
        record[item] = (v == undefined) ? '' : v;
    })

    outputStream.write(JSON.stringify(record) + "\n");
}


// let outputFile = 'output/' + program.file;
// let outputStream = fs.createWriteStream(outputFile, { flags: 'a' });

outputStream.on('error', (err) => {
    if (err) {
        return console.log(`${err}`);
    }
});

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < program.cluster; i++) {
        // cluster.fork();
        let worker = cluster.fork();
        worker.on('message', (msg) => {
            if (msg.cmd == 'increase') {
                now = now.add(1, 'seconds');
                worker.send({ cmd: 'update', now: now });
            }
        });

        worker.send({ cmd: 'file', file: program.file });
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else { // worker process Logic
    console.log(`Worker ${process.pid} started`);
    process.send({ cmd: 'increase' });

    process.on('message', function (msg) {
        if (msg.cmd == 'update') {
            now = msg.now;
        } else if (msg.cmd == 'file') {
            outputFile = 'output/' + msg.file;
            outputStream = fs.createWriteStream(outputFile, { flags: 'a' });

        }
    });

    setInterval(writeRecord, 1000);
}



process.on('SIGINT', function () {
    if (cluster.isMaster) {
        console.log(chalk.red("Caught interrupt signal"));
        console.log(chalk.cyan("outputStream.end()"));
        outputStream.end();
        console.log(chalk.cyan("outputStream.close()"));
        outputStream.close();
    }

    process.exit();
});