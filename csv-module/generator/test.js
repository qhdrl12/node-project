const cluster = require('cluster');


let count = 0;
let threadCount = 8;

const increaseCount = () => {
    // console.log(`pid ${process.pid}`);
    process.send({ cmd: 'increase' });
}

if (cluster.isMaster) {
    for (let i = 0; i < threadCount; i++) {
        let worker = cluster.fork();

        worker.on('message', function (msg) {
            if (msg.cmd == 'increase') {
                count++;
                console.log(`count ${count}`);
                worker.send({ cmd: 'update', count: count });
            }
        });


    }
} else {
    process.on('message', function (msg) {
        console.log(`here ${JSON.stringify(msg)}`);
        if (msg.cmd == 'update') {
            count = msg.count;
        }
    });

    setInterval(increaseCount, 1000);
}