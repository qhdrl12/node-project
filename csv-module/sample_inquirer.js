const fs = require('fs');
const inquirer = require('inquirer');

// inquirer.prompt([{
//     name: 'name',
//     type: 'input',
//     message: 'What\'s your name',
// }, {
//     name: 'iceCream',
//     type: 'list',
//     message: 'Which is your favorite of the following ice cream flavors?',
//     choices: ['green tea', 'poppyseed jam', 'chile', 'vanilla'],
//     default: 3
// }]).then((answers) => {
//     console.log(`\nHi ${answers.name}. I like ${answers.iceCream} ice cream too! \n`);
// });

const hasExtension = (fileName, exts) => {
    return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
}

let invalidExts = ['.json', '.md'];
let baseDir = './';
let files = fs.readdirSync(baseDir);
let filterFiles = files.filter((file) => {
    return !hasExtension(file, invalidExts);
})

inquirer.prompt([{
    name: 'file',
    type: 'list',
    message: 'What\'s your run file?',
    choices: filterFiles,
    default: 1
}, {
    name: 'iceCream',
    type: 'list',
    message: 'Which is your favorite of the following ice cream flavors?',
    choices: ['green tea', 'poppyseed jam', 'chile', 'vanilla'],
    default: 3
}]).then((answers) => {
    console.log(`\nHi ${answers.file}. I like ${answers.iceCream} ice cream too! \n`);
});