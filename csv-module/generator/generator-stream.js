const fs = require('fs');
const cluster = require('cluster');
const numCpus = require('os').cpus().length;
const program = require('commander');
const chalk = require('chalk');
const kcity = require('./config/csv-mapper');

let now = new Date();

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
}

const writeRecord = () => {
    console.log(`Worker ${process.pid} write record`);

    let record = {}
    let mandratoryMap = kcity.generatatorMandatoryMap();

    kcity.headers.map(item => {
        let v = mandratoryMap[item];
        record[item] = (v == undefined) ? '' : v;
    })
    console.log(`${JSON.stringify(record)}\n`);
    // outputStream.write(JSON.stringify(record) + '\n');
}

const broadCast = () => {
    if (cluster.isMaster) {
        for (let id in cluster.workers) {
            let worker = cluster.workers[id];
            // worker.send({

            // })
        }
    }
}

let outputFile = 'output/' + program.file;
let outputStream = fs.createWriteStream(outputFile);

outputStream.on('error', (err) => {
    if (err) {
        return console.log(`${err}`);
    }
});

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

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < program.cluster; i++) {
        cluster.fork();
    }

    // broadCast();

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else { // worker process Logic
    console.log(`Worker ${process.pid} started`);

    // process.on('message', (message) => {
    //     if (message.cmd == 'date') {

    //     }
    // })

    setInterval(writeRecord, 2000);
}