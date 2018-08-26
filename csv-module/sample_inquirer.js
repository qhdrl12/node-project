const fs = require('fs');
const exec = require('child_process').exec;
const inquirer = require('inquirer');

const runInfo = require('./run-info.json');

const hasExtension = (fileName, exts) => {
    return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
}

const showValidFiles = (dir) => {
    let files = fs.readdirSync(dir);
    let filterFiles = files.filter(file => {
        return !hasExtension(file, invalidExts);
    });

    return filterFiles;
}

const inquirerListTypeConfig = (dir) => {
    return {
        name: 'file',
        type: 'list',
        message: 'What\'s your run files?',
        choices: showValidFiles(dir),
        default: 1
    }
}

let invalidExts = ['.json', '.md'];
let validName = ['index'];
let baseDir = './';
let nowConfig = runInfo;
let runDir = baseDir;

inquirer.prompt([
    inquirerListTypeConfig(baseDir)
]).then((answers) => {
    nowConfig = nowConfig[answers.file];
    runDir += answers.file + "/";

    console.log(`\nHi ${answers.file}. I like ${answers.iceCream} ice cream too! \n`);

    let isDir = fs.lstatSync(baseDir + answers.file).isDirectory();

    if (isDir) {
        inquirer.prompt([
            inquirerListTypeConfig(baseDir + answers.file)
        ]).then((answers) => {
            //파일의 경우 
            let runFileName = runDir + answers.file;
            nowConfig = nowConfig[answers.file];
            console.log(`nowconfig : ${JSON.stringify(nowConfig)}`);

            let inquirerInput = Object.keys(nowConfig).map(key => {
                return {
                    name: key,
                    type: 'input',
                    message: nowConfig[key]
                }
            });

            inquirer.prompt(
                inquirerInput
            ).then(answers => {
                console.log(`---run with options---`)

                let options = Object.keys(nowConfig).map((key, idx) => {
                    console.log(`[${idx}] ${key} : ${answers[key]}`);
                    return `${key} ${answers[key]}`;
                }).reduce((str, option) => {
                    return str += ` ${option}`;
                });

                console.log(`file with options : node ${runFileName} ${options}`);
                let runScript = `node ${runFileName} ${options}`;
                exec(runScript, (error, stdout, stderr) => {
                    console.log(`stdout : ${stdout}`);
                });
            });
        });
    } else {

    }

});