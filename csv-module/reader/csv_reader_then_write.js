const fs = require('fs');
const parse = require('csv-parse');
const { Transform } = require('stream');

const readline = require('readline');

const parser = parse({
    delimiter: ',',
    quote: '',
    columns: true
});

let result = [];

parser.on('readable', () => {
    while (record = parser.read()) {
        console.log(`record : ${JSON.stringify(record)}`);
        outputStream.write(JSON.stringify(record) + '\n');
        // Object.keys(record).map((key, idx) => {
        //     if (key == 'ESTOPBRAKETIME') {
        //         record['ESTOPBRAKETIME'] = undefined;
        //         console.log(`readable record : ${JSON.stringify(record)}`);
        //     }
        // });
        result.push(record);
    };
});

parser.on('finish', () => {
    console.log(`finish`);
    console.log(result.length);

    outputStream.end();
    // readlineFunc();
    // writeStreamResultRecords();
})

const readlineFunc = () => {
    let r = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let total = 0;

    r.setPrompt("> ");
    r.prompt();

    r.on("line", (data) => {
        if (data == 'exit') r.close();

        let count = parseInt(data);

        for (let i = total; i < total + count; i++) {
            console.log(`check data : ${JSON.stringify(result[i])}`);
        }

        r.prompt();
        total += count;
    });
}

// const chardetStream = new Transform({
//     //chunk 65536
//     transform(chunk, encoding, callback) {
//         console.log(`chunk data : ${chunk.length}`);
//         callback(null, chunk);
//     }
// });

let inputFile = '../generator/output/imsi.csv';
let inputStream = fs.createReadStream(inputFile);

let outputFile = './output/json_imsi.csv';
let outputStream = fs.createWriteStream(outputFile);

outputStream.on('error', (err) => {
    if (err) {
        return console.log(`${err}`);
    }
});

inputStream
    // .pipe(chardetStream) // transform 
    .pipe(parser); // csv-parser 
// .pipe(process.stdout);  // byline

