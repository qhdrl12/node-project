const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const ProgressBar = require('progress');

const csvConf = require('./config/csv-config.json');
const colors = require('../common/colors');

const kcity = require('./config/csv-mapper');

const print = () => {
    console.log("usage: ./generator-csv.js --max-old-space-size=8192");
    colors.error("need change csv-config");
    colors.error("             path : path/filename");
    colors.error("             rows : generate row count");
    colors.error("[info] this module can generate 200milion line");
    colors.error("if need more generate line should be use 'file-writer-stream'");
}

if (process.argv[2] == 'help') {
    print();
    process.exit();
}

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

    let bar = new ProgressBar(`${colors.c.FgGreen} processing [:bar] :current/:total :percent ${colors.c.Reset}`, {
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

const records = makeRecord(csvConf.rows);

// 생성한 records 전체 로그
// records.forEach(r => {
//     colors.info(`records  : ${JSON.stringify(r)}`);
// });

let default_output_dir = 'output/';

const csvWriter = createCsvWriter({
    path: default_output_dir + csvConf.path,
    header: giveHeaders()
});

csvWriter.writeRecords(records)
    .then(() => {
        colors.info("...Done");
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
