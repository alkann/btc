const brain = require('brain.js');
const fs = require('file-system');
const iterations = 10000;
const errorThresh = 0.0001;
const res = [];
const resFile = [];
let x = 0;

fs.recurseSync('./data2', [
    '*.json'
], function(filepath, c, filename) {
    res.push(filename.split('.')[0]);
    resFile.push(`../../${filepath}`);
});

function calculateMap(name) {
    const starttime = (new Date()).getTime()
    const trainingData = require(resFile[x])

    console.log('Start Calculate Map');
    const trainingOptions = {
        iterations: iterations,
        errorThresh: errorThresh,
        logPeriod: 1,
        epsilon: 1e-15,
        log: (details) => {
            const iteration = parseInt(details.split(',')[0].split('iterations: ')[1]);
            const err = parseFloat(details.split('training error: ')[1]);

            const time = Math.floor(((new Date()).getTime() - starttime) / iteration) / 1000;
            const timeLeft = `${('0'+Math.floor(Math.floor((iterations - iteration) * time) / 3600)).slice(-2)}:${('0'+Math.floor((Math.floor((iterations - iteration) * time) % 3600) / 60)).slice(-2)}:${('0'+Math.floor(Math.floor((iterations - iteration) * time) % 60)).slice(-2)}`

            process.stdout.clearLine();  // clear current text
            process.stdout.cursorTo(0);
            process.stdout.write(
                `${iteration} | ${err} | ${Math.floor(err / errorThresh * 100) / 100} | ${timeLeft}`
            );

            if (iteration%200 === 0) {
                console.log('')
            }
        }
    };
    const net = new brain.recurrent.LSTMTimeStep({
        inputSize: 4,
        hiddenLayers: [32,16],
        outputSize: 4,
    });

    console.log(name, trainingData[0])

    net.train(trainingData, trainingOptions);

    fs.writeFile(`./models2/${name}.json`, JSON.stringify(net.toJSON()), function (err) {})

    x++
    if(x < res.length) {
        calculateMap(res[x]);
    }
}

calculateMap(res[x]);
