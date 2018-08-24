const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const ProgressBar = require('progress');
const program = require('commander');
const chalk = require('chalk');
const moment = require('moment');

const csvConf = require('./config/csv-config.json');
const kcity = require('./config/csv-mapper');

let now = moment();

const checkMandatoryArgs = (option) => {
    if (!program[option]) {
        console.log(chalk.red(`--${option} required. process exit\nif you need more information use --help`));
        process.exit(1);
    }
}

program
    .version('0.1.0')
    .option('-f, --file <file>', 'Add file')
    .option('-r, --rows <rows>', 'Add rows')
    .action((data) => {
        // checkMandatoryArgs('file');
        if (!program.file) program.file = csvConf.path;
        if (!program.rows) program.rows = csvConf.rows;
    })
    .parse(process.argv);

let headers = kcity.headers;

const giveHeaders = () => {
    let arr = [];
    headers.map(item => {
        arr.push({ 'id': item, 'title': item.toUpperCase() });
    })

    return arr;
}

const makeRecord = (rowCount) => {
    let records = [];

    let style = chalk.magenta('[:bar]')
        + chalk.green(':rate/bps ')
        + chalk.yellow(':current/:total :percent');

    let bar = new ProgressBar(style, {
        complete: "=",
        incomplete: " ",
        width: 100,
        total: rowCount
    });

    for (let i = 0; i < rowCount; i++) {
        let record = {}
        let mandratoryMap = kcity.generatatorMandatoryMap();

        headers.map(item => {
            let v = mandratoryMap[item];
            record[item] = (v == undefined) ? '' : v;
        })

        bar.tick();
        if (bar.curr % (bar.total / 100) == 0) {
            bar.render();
        }

        records.push(record);
    }

    return records;
}

const records = makeRecord(parseInt(program.rows));

let default_output_dir = 'output/';

const csvWriter = createCsvWriter({
    path: default_output_dir + program.file,
    header: giveHeaders()
});

csvWriter.writeRecords(records)
    .then(() => {
        console.log(chalk.cyan("\n...Done"));
    });

/* with async
makeRecord(csvConf.kcity.trip_size).then((records) => {
    csvWriter.writeRecords(records)
        .then(() => {
            console.log(`...Done`);
        });
})
*/

/* generator code 
function* giveHeaders() {
    yield* headers.map(item => {
        return { 'id': item, 'name': item }
    })
}
var fetchHeader = giveHeaders();
fetchHeaer.next()
*/
