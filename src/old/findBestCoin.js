const brain = require('brain.js');
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
const fs = require('file-system');
const names = ['BTC','ETH','BUSD','XRP','SHIB','GALA','BNB','AVAX','SOL','LUNA','SLP','SAND','MANA','ADA','ATOM','MATIC','FTM','DOT','DOGE','TRX','LTC','USDC','FIL','NEAR','LINK','NEO','UST','DIA','THETA','AXS','ETC','ICP','VET','ROSE','EGLD','PEOPLE','ALICE','CRV','ONE','EOS','DYDX','LRC','ALPACA','TLM','TORN','AAVE','ENJ','HOT','ZEC','BCH','JASMY','XVS','API3','OMG','EUR','AR','GRT','ALGO','FLOW','XLM','MBOX','DASH','DAR','FTT','CHZ','MDT','KLAY','IMX','TFUEL','SUSHI','CHR','ENS','KNC','XTZ','BLZ','PAXG','ONT','UNI','QTUM','JST','HBAR','1INCH','SUN','WAVES','AUD','GLMR','BTTC','BETA','KAVA','XMR','CAKE','HNT','ANT','BAND','ONG','RUNE','WIN','SXP','DENT','PYR','SUPER','IOTX','MINA','BTCDOWN','CELO','TUSD','ACH','BAT','IDEX','SKL','DUSK','CELR','RNDR','SYS','REEF','ACA','DNT','QNT','WOO','NMR','COTI','SPELL','XRPDOWN','YGG','XRPUP','TKO','RSR','LOKA','WAXP','MIR','UNFI','C98','KSM','ZIL','YFI','BNX','ETHDOWN','LINA','INJ','FLM','IOST','NULS','IOTA','GBP','LINKDOWN','WRX','QI','SRM','AUDIO','XEC','KP3R','FUN','ETHUP','BEAM','RVN','ZEN','BICO','PORTO','ARPA','OCEAN','MOVR','WING','COCOS','FET','SCRT','BTCUP','GTC','ALPHA','DEXE','OGN','CTXC','LINKUP','ERN','OOKI','ANKR','BAKE','SNX','MASK','ADX','CLV','ANC','ADADOWN','POND','EPS','LIT','FLUX','VOXEL','ZRX','GXS','ICX','DODO','CTK','UTK','SFP','CTSI','COMP','RARE','DOTDOWN','ADAUP','DOTUP','USDP','ATA','ANY','SC','FXS','POWR','DREP','HIGH','REN','DGB','CKB','BNBDOWN','STX','RAY','LPT','MC','HARD','AGLD','TVK','RLC','PUNDIX','TRB','ILV','FRONT','FIS','LAZIO','MITH','MKR','FORTH','BNBUP','PSG','CHESS','VGX','BOND','JOE','COS','XEM','STRAX','IRIS','AKRO','AUTO','KEY','CVC','BAL','LTO','TWT','MDX','CVX','TRIBE','HIVE','DATA','REP','STORJ','FIDA','OM','BEL','POLS','REQ','AMP','BTCST','MTL','NKN','DEGO','STMX','POLY','CFX','GTO','BTS','VITE','UMA','FARM','YFII','AVA','BADGER','FIO','PLA','PERP','VIDT','AION','PHA','TROY','VTHO','XVG','TRU','ORN','RAMP','OXT','NBS','WTC','GHST','FOR','PNT','DCR','TOMO','RGT','RAD','MLN','CITY','SANTOS','ALCX','BURGER','CVP','XNO','DOCK','WAN','QUICK','PERL','TRXDOWN','ACM','MFT','ELF','KMD','JUV','BTG','TRXUP','FIRO','BNT','ARDR','DF','RIF','MBL', 'OG', 'ATM', 'BAR', 'LSK', 'GNO', 'TCT', 'STPT', 'WNXM', 'AUCTION', 'ASR', 'SUSD'];
// const names = [
//     "EPS","VITE","NEO","CHR","SRM","ATOM","ALGO","ONE","RUNE","1INCH","XEM","SUSHI","IOTA","SKL","NEAR","INJ","AUTO","ZIL","CRV","ZEC","DASH","XMR","MANA","IOST",
// ]

const allModels = [];
let allBest = [];
fs.recurseSync('./models', [
    '*.json'
], function(filepath, relative, filename) {
    allModels.push({
        name: filename.split('.')[0],
        json: require(`./${filepath}`)
    })
});

let x = 0;
const rang = 10080
const move = 60

function calculateName(name) {
    if (!allModels.map(m => m.name).includes(name)) {
        x++
        calculateName((names[x]+'USDT').toLowerCase())
    }

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

            console.log(`${x+1}/${names.length}`, name)
            const allReal = [];
            for (let i = lenStart; i < lenStop; i++) {
                const element = [];
                for (let k = 0; k < 47; k++) {
                    const objActual = objs[k - 47 + i];
                    const objPrev = objs[k - 48 + i];
                    const value = (Math.tanh(((objActual.open / objPrev.open) - 1) * 200) + 1) * 0.5;
                    element.push(value <= 0 ? 0 : (value > 1 ? 1 : value));
                }

                const objActual = objs[i].open;
                const output = ((objs[i+7].open / objActual) - 1) * 10 + 0.5;

                trainingData.push({
                    input: [...element],
                    output: [output]
                })
            }

            const net = new brain.NeuralNetwork()
            net.fromJSON(require(`./models/${name}.json`));

            const len = trainingData.length;
            const moneyRatio = [1.015, 1.015];
            const ratioRelative = moneyRatio[1] - moneyRatio[0];

            const money = new Array(20).fill(1000);

            for(let k = 0; k < 1; k++) {
                for(let i = 0; i < len; i++){
                    const outAI = Math.floor(((net.run(trainingData[i].input)[0] - 0.5)/10 + 1)*1000)/1000
                    const outReal = Math.floor(((trainingData[i].output[0] - 0.5)/10 + 1)*1000)/1000
                    if(outAI > (ratioRelative)*k/27 + moneyRatio[0]) {
                        money[k] = money[k]*outReal*(1-0.000075)*(1-0.000075)*(1-0.01);
                        allReal.push(outReal)
                        i += 7
                    }
                }
            }

            const newMonay = money.map(n=> Math.floor(n));
            const maxMon = newMonay[0];
            const days = (1 / ((rang*5)/1440));
            const profit = Math.floor((Math.pow(maxMon/1000, days)-1)*1000)/10

            allBest.push({
                coin: name,
                a: maxMon,
                m: profit,
                i: newMonay.indexOf(maxMon)/100*(ratioRelative) + moneyRatio[0],
                maxR: Math.max(...allReal),
                minR: Math.min(...allReal),
                fullR: allReal.reduce((i, e)=> i*e, 1),
            });

            x++

            if (x === names.length) {
                allBest = allBest.sort((b1, b2) => {
                    return b2.a - b1.a
                })

                fs.writeFile(`./best.json`, JSON.stringify(allBest), function (err) {})
                console.log(allBest)
            } else {
                calculateName((names[x]+'USDT').toLowerCase())
            }
        })
}

calculateName((names[x]+'USDT').toLowerCase())
