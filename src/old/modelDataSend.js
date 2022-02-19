const express = require('express')
const app = express()
const port = 3001
const Sequelize = require('sequelize');
const sequelize = new Sequelize('coinmarket', 'root', null, {
    port: 3306,
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    define: {
        timestamps: false // true by default
    },
    logging: false
})

app.get('/:name', (req, res) => {
    const name = req.params['name'];

    console.log(name)

    const Model = sequelize.define(name, {
        openTime: {
            type: Sequelize.DOUBLE,
            unique: true
        },
        closeTime: {
            type: Sequelize.DOUBLE,
        },
        open: {
            type: Sequelize.DOUBLE,
            set: function (val) {
                this.setDataValue('open', parseFloat(val));
            }
        },
        high: {
            type: Sequelize.DOUBLE,
            set: function (val) {
                this.setDataValue('high', parseFloat(val));
            }
        },
        low: {
            type: Sequelize.DOUBLE,
            set: function (val) {
                this.setDataValue('low', parseFloat(val));
            }
        },
        close: {
            type: Sequelize.DOUBLE,
            set: function (val) {
                this.setDataValue('close', parseFloat(val));
            }
        },
        volume: {
            type: Sequelize.DOUBLE,
            set: function (val) {
                this.setDataValue('volume', parseFloat(val));
            }
        },
        quoteVolume: {
            type: Sequelize.DOUBLE,
            set: function (val) {
                this.setDataValue('quoteVolume', parseFloat(val));
            }
        },
        trades: {
            type: Sequelize.DOUBLE,
        },
        takerBaseVolume: {
            type: Sequelize.DOUBLE,
            set: function (val) {
                this.setDataValue('takerBaseVolume', parseFloat(val));
            }
        },
        takerQuoteVolume: {
            type: Sequelize.DOUBLE,
            set: function (val) {
                this.setDataValue('takerQuoteVolume', parseFloat(val));
            }
        },
        ignore: {
            type: Sequelize.DOUBLE,
            set: function (val) {
                this.setDataValue('ignore', parseFloat(val));
            }
        }
    }, {
        freezeTableName: true
    })
    const rang = 12096
    const move = 48

    Model.findAll({
        order: [['openTime', 'DESC']],
        limit: rang + move * 2,
        raw: true,
    })
        .then(function (response) {
            const objs = response.reverse();
            const lenStop = objs.length - move
            const lenStart = ((lenStop - rang) < 0) ? move : lenStop - rang
            const trainingData = [];

            console.log(name, lenStart, lenStop)

            for (let i = lenStart; i < lenStop; i++) {
                const element = [];
                for (let k = 0; k < 47; k++) {
                    const objActual = objs[k - 47 + i];
                    const objPrev = objs[k - 48 + i];
                    const value = (Math.tanh(((objActual.open / objPrev.open) - 1) * 200) + 1) * 0.5;
                    element.push(value <= 0 ? 0 : (value > 1 ? 1 : value));
                }

                const objActual = objs[i].open;
                const m30 = calculateArr(objs, i, 12);

                const output = ((m30 / objActual) - 1) * 10 + 0.5;

                trainingData.push({
                    input: [...element],
                    output: [output <= 0 ? 0 : (output > 1 ? 1 : output)]
                })
            }

            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Methods', 'GET,OPTIONS')
            res.send(trainingData)
        })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


function calculateArr(arrObj, point, diff) {
    return [
        arrObj[point - 4 + diff],
        arrObj[point - 3 + diff],
        arrObj[point - 2 + diff],
        arrObj[point - 1 + diff],
        arrObj[point + diff]
    ]
        .map(obj => {
            return [obj.open]
        })
        .reduce((arr, obj) => {
            return arr + obj[0]
        }, 0)/5
}
