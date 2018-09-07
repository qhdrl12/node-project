const fs = require('fs');
const exec = require('child_process').exec;
const inquirer = require('inquirer');

const runInfo = require('./run-info.json');

/**
 * @param {*} fileName - 파일 또는 폴더명 
 * @param {*} exts - 필터링 항목
 * @returns - RegExp을 이용하여 $filename이 필터링 항목에 포함될 경우 true이다.
 */
const hasExtension = (fileName, exts) => {
    return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
}

/**
 * @param {*} dir - directory path 
 * @returns dir 경로의 파일을 읽은 뒤, hasExtension 함수를 이용하여 Filtering한 값
 */
const showValidFiles = (dir) => {
    let files = fs.readdirSync(dir);
    let filterFiles = files.filter(file => {
        return !hasExtension(file, invalidExts);
    });

    return filterFiles;
}

/**
 *  디렉토리를 조회해 디렉토리/파일을 list로 보여주는 inquirer JSON 구성
 * 
 * @param {*} dir - 디렉토리 
 * @returns
 */
const inquirerListTypeConfig = (dir) => {
    return {
        name: 'file',
        type: 'list',
        message: 'What\'s your run files?',
        choices: showValidFiles(dir),
        default: 1
    }
}

/**
 * run-info의 파일에 정의된 key의 value 항목을 입력받기 위한 inquirer 동적 생성 항목 
 *
 * @param {*} config - {"-f": "file name", "-r": "total rows"}
 * @returns
 */
const inquirerInputTypeConfig = (config) => {
    let inquirerInput = Object.keys(config).map(key => {
        return {
            name: key,
            type: 'input',
            message: config[key]
        }
    });

    return inquirerInput;
}

/**
 * inquirer에서 선택한 항목이 file일 경우 실행하는 함수 
 *
 * @param {*} answers - inquirer에서 선택한 name 데이터가 들어간 json 데이터
 */
const isFileProcess = (answers) => {
    let runFileName = runDir + answers.file;
    nowConfig = nowConfig[answers.file];
    console.log(`nowconfig : ${JSON.stringify(nowConfig)}`);

    inquirer.prompt(
        inquirerInputTypeConfig(nowConfig)
    ).then(answers => {
        console.log(`---run with options---`)

        let options = Object.keys(nowConfig).map((key, idx) => {
            console.log(`[${idx}] ${key} : ${answers[key]}`);
            return `${key} ${answers[key]}`;
        }).reduce((str, option) => {
            return str += ` ${option}`;
        });

        runScriptWithOptions(runFileName, options);
    });
}

/**
 * parameter를 받아 실행 파일을 구동하는 함수
 *
 * @param {*} filename - directory와 filename을 가짐 
 * @param {*} options - config에 정의된 options을 나열한 값 
 *                      ({"-f": "imsi.csv","-r": "200"} -> -f imsi.csv -r 200)
 */
const runScriptWithOptions = (filename, options) => {
    console.log(`file with options : node ${filename} ${options}`);
    let runScript = `node ${filename} ${options}`;

    exec(runScript, (error, stdout, stderr) => {
        console.log(`stdout : ${stdout}`);
        if (error) {
            console.log(`stderr : ${stderr}`);
        }
    });
}


let invalidExts = ['.json', '.md'];
//TODO 실행 가능한 파일만 설정하는 리스트 (사용 예정)
// let validName = ['index'];
let baseDir = './';
let nowConfig = runInfo;
let runDir = baseDir;

inquirer.prompt([
    inquirerListTypeConfig(baseDir)
]).then((answers) => {
    nowConfig = nowConfig[answers.file];
    runDir += answers.file + "/";

    let isDir = fs.lstatSync(baseDir + answers.file).isDirectory();

    /**
     * 1depth 에서의 비교 구문 
     * 선택한 answers.file이 폴더일 경우 
     * 폴더 내의 파일로 선택지를 다시 표시한다. 
     */
    if (isDir) {
        inquirer.prompt([
            inquirerListTypeConfig(baseDir + answers.file)
        ]).then((answers) => {
            isFileProcess(answers);
        });
    } else {
        //file
        isFileProcess(answers);
    }
});