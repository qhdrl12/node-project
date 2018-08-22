const fs = require('fs');
const parse = require('csv-parse');
const iconv = require('iconv-lite');
const jschardet = require('jschardet');
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
        // console.log(`read : ${JSON.stringify(record)}`);
        // console.log(`enc : ${JSON.stringify(enc)}`)
        // console.log(`record : ${JSON.stringify(record)}`);
        // Object.keys(record).map((key, idx) => {
        //     if (key == 'benifit') {
        //         record['benifit'] = undefined;
        //         console.log(`readable record : ${JSON.stringify(record)}`);
        //     }
        // });
        result.push(record);
    };
});

parser.on('finish', () => {
    console.log(`finish`);
    console.log(result.length);

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
})

let inputFile = './sample/2018-06-04.csv';

let inputStream = fs.createReadStream(inputFile);

const chardetStream = new Transform({
    //chunk 65536
    transform(chunk, encoding, callback) {
        let enc = jschardet.detect(chunk);
        console.log('enc : ' + JSON.stringify(enc));
        if (enc.encoding != 'UTF-8') {
            // console.log('chunk : ' + chunk);
            chunk = iconv.encode(iconv.decode(chunk, 'euc-kr'), 'utf-8');
            // chunk = iconv.encode(iconv.decode(chunk, enc.encoding == null ?
            //     'euc-kr' : enc.encoding.toLowerCase()), 'utf-8');
        }

        callback(null, chunk);
    }
});

inputStream
    .pipe(chardetStream)
    .pipe(parser)
// .pipe(process.stdout);