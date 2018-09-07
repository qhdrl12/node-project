const fs = require('fs');
const parse = require('csv-parse');
const readline = require('readline');

const program = require('commander');
const chalk = require('chalk');

const parser = parse({
    delimiter: ',',
    quote: '',
    columns: true
});

let count = 0;

program
    .version('0.1.0')
    .option('-r, --rfile <rfile>', 'Add input file')
    .option('-w, --wfile <wfile>', 'Add output file')
    .action(data => {
        if (!program.rfile) program.rfile = '../generator/output/imsi.csv';
        if (!program.wfile) program.wfile = './output/json_imsi.csv';

        console.log(`read file > ${program.rfile}`);
        console.log(`write file > ${program.wfile}`);
    })
    .parse(process.argv);

parser.on('readable', () => {
    while (record = parser.read()) {
        // console.log(`record : ${JSON.stringify(record)}`);
        // record['location'] = {
        //     lat: record['LAT'],
        //     lon: record['LON']
        // }

        outputStream.write(JSON.stringify(record) + '\n');
        // 필요한 컬럼이 있다면 아래와 같은 방식으로 추가하여 사용(수정 등)
        // Object.keys(record).map((key, idx) => {
        //     if (key == 'ESTOPBRAKETIME') {
        //         record['ESTOPBRAKETIME'] = undefined;
        //         console.log(`readable record : ${JSON.stringify(record)}`);
        //     }
        // });
        count++;
    };
});

parser.on('finish', () => {
    console.log(`finish total size ${count}`);
    outputStream.end();
})

let inputFile = program.rfile;
let inputStream = fs.createReadStream(inputFile);

let outputFile = program.wfile;
let outputStream = fs.createWriteStream(outputFile);

outputStream.on('error', (err) => {
    if (err) {
        return console.log(`${err}`);
    }
});

inputStream
    .pipe(parser); // csv-parser 
// .pipe(process.stdout);  // byline

