const Sequelize = require('sequelize');
const brain = require('brain.js');
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
let Market = null;
let moneyUSDT = 1000;
let moneyCOIN = 0;
let priceCOIN = 0;
let timeCOIN = 0;
const moneyRatio = 1.00180222986 + 0.00318;
const fax = 0.99925 * 0.99925 * 0.9997;
const limit = 2880;

Market = sequelize.define('xrpusdt', {
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
    freezeTableName: true // Model tableName will be the same as the model name
})

const net = new brain.NeuralNetwork()
net.fromJSON(require('../../models/xrpusdt_B.json'));

Market.findAll({
    order: [['openTime', 'DESC']],
    limit: limit,
    raw: true,
})
    .then(function (response) {

        for (let n = 0; n < response.length - 201; n++) {
            if (moneyUSDT === 0) {
                const actualEL = response[201 + n];

                console.log(actualEL.openTime - timeCOIN)

                if ((actualEL.close / priceCOIN) >= moneyRatio || (actualEL.openTime - timeCOIN) >= 1000 * 60 * 15) {
                    moneyUSDT = moneyCOIN * actualEL.close * fax;
                    console.log('SELL XRP_B', moneyUSDT, actualEL.close / priceCOIN)
                    console.log('FULL', moneyUSDT)

                    priceCOIN = 0;
                    moneyCOIN = 0;
                }
            } else {
                const obj200 = response.slice(n, 201 + n).reverse();

                for (let i = 0; i < obj200.length && moneyUSDT > 0; i++) {
                    const elements = [];
                    const data101 = [];
                    const actualEL = obj200[0].high;
                    priceCOIN = obj200[0].high;
                    timeCOIN = obj200[0].openTime

                    obj200.reduce((r, i, index) => {
                        if (index % 2 === 0) elements.push((r + i.close) / (index + 1))
                        return (r += i.close)
                    }, 0)


                    for (let k = 0; k < elements.length; k++) {
                        const value = (Math.tanh(((actualEL / elements[k]) - 1) * 100) + 1) * 0.5;
                        data101.push(value <= 0 ? 0 : (value > 1 ? 1 : value));
                    }

                    if (net.run(data101)[0] > 0.85) {
                        moneyCOIN = moneyUSDT / priceCOIN;
                        moneyUSDT = 0;
                        console.log('BUY XRP_B', moneyCOIN, priceCOIN)
                    }
                }
            }
        }
    })

