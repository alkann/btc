const brain = require('brain.js');
const fs = require('file-system');
const iterations = 20000;
const errorThresh = 0.0030;
const netOptions = {
    hiddenLayers: [72, 36, 6],
    // activation: 'tanh'
};
const trainingData = [];

fs.recurseSync('./data', [
    '*.json'
], function(filepath) {
    trainingData.push(...(require(`../../${filepath}`)));
});

function calculateMap() {
    const starttime = (new Date()).getTime()

    console.log('Start Calculate Map');
    const trainingOptions = {
        iterations: iterations,
        errorThresh: errorThresh,
        logPeriod: 1,
        epsilon: 1e-15,
        log: (details) => {
            const time = Math.floor(((new Date()).getTime() - starttime) / details.iterations) / 1000;
            const timeLeft = `${('0'+Math.floor(Math.floor((iterations - details.iterations) * time) / 3600)).slice(-2)}:${('0'+Math.floor((Math.floor((iterations - details.iterations) * time) % 3600) / 60)).slice(-2)}:${('0'+Math.floor(Math.floor((iterations - details.iterations) * time) % 60)).slice(-2)}`

            process.stdout.clearLine();  // clear current text
            process.stdout.cursorTo(0);
            process.stdout.write(
                `${details.iterations} | ${details.error} | ${Math.floor(details.error / errorThresh * 100) / 100} | ${timeLeft}`
            );

            if (details.iterations%200 === 0) {
                console.log('')
            }
        }
    };
    const net = new brain.NeuralNetwork(netOptions);
    net
        .trainAsync(trainingData, trainingOptions)
        .then((res) => {
            console.log(res);
            fs.writeFile(`./models2/model.json`, JSON.stringify(net.toJSON()), function (err) {})
        })
}

calculateMap();
