const Sequelize = require('sequelize');
const regression = require('regression');
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
// let names = [
// "BTC","BNB","ETH","BUSD","XRP","MATIC","DOGE","ADA","CHZ","CAKE","DOT","VET","SXP","XVS","FTM","LTC","LINK","SOL","EOS","IOTX","FIL","TRX","ALICE","DENT","UNI","WIN","BTT","EUR","WAVES","USDC","BCH","HOT","TLM","XLM","TKO","LUNA","THETA","BNBUP","AAVE","LINA","ONT","ENJ","GBP","ETC","AVAX","ALPHA","REEF","COTI","EPS","VITE","NEO","CHR","SRM","ATOM","ALGO","ONE","RUNE","1INCH","XEM","SUSHI","IOTA","SKL","NEAR","INJ","AUTO","ZIL","CRV","ZEC","DASH","XMR","MANA","IOST","XRPUP","DODO","DEGO","SC","ICX","MITH","HBAR","QTUM","TFUEL","RSR","GRT","FORTH","SFP","BZRX","WRX","FET","PSG","COMP","BAND","XTZ","ANKR","EGLD","OGN","FTT","MKR","OMG","PNT","HARD","ZEN","BLZ","KSM","YFI","NKN","ETHUP","AUD","KAVA","XRPDOWN","OCEAN","ADAUP","AXS","DGB","OM","DIA","BTCST","BTCDOWN","BAT","RVN","CELR","CTSI","NANO","TOMO","BEL","FIO","SNX","LIT","BAL","BTCUP","STMX","RLC","COCOS","SAND","BNBDOWN","VTHO","TRB","STORJ","ZRX","REN","AUDIO","SUPER","FLM","LRC","PUNDIX","AKRO","ANT","ORN","SXPUP","CTK","KNC","BEAM","MIR","SUSHIUP","GTO","LTO","BAR","PAX","EOSUP","KEY","TCT","DOTUP","MTL","TUSD","BNT","LSK","RAMP","SUN","ARPA","ETHDOWN","CELO","POND","PERP","JUV","DREP","1INCHUP","BTS","UNFI","WTC","SXPDOWN","ROSE","ONG","CKB","HNT","TWT","DNT","GXS","FUN","WING","COS","LINKUP","CFX","JST","STRAX","CVC","AAVEUP","AION","KMD","PERL","ASR","WAN","NULS","YFII","DUSK","HIVE","STX","BADGER","OXT","PAXG","UMA","UTK","MBL","DOCK","WNXM","XLMUP","FILUP","TROY","XTZUP","BTG","MDT","AVA","NMR","LTCUP","ACM","BCHUP","ADADOWN","TRU","DATA","IRIS","DCR","REP","FIRO","UNIUP","OG","RIF","FIS","TRXUP","MFT","ARDR","YFIDOWN","ATM","CTXC","STPT","UNIDOWN","EOSDOWN","AAVEDOWN","SUSHIDOWN","1INCHDOWN","NBS","DOTDOWN","LINKDOWN","TRXDOWN","YFIUP","FILDOWN","BCHDOWN","XLMDOWN","LTCDOWN","SUSD","XTZDOWN","BAKE","BURGER","SLP"
// ]
// let names = [
// "XRP","MATIC","DOGE","ADA","CHZ","CAKE","DOT","VET","SXP","XVS","FTM","LTC","LINK","SOL","EOS","IOTX","FIL","TRX","ALICE","DENT","UNI","WIN","BTT","EUR","WAVES","USDC","BCH","HOT","TLM","XLM","TKO","LUNA","THETA","AAVE","LINA","ONT","ENJ","GBP","ETC","AVAX","ALPHA","REEF","COTI","EPS","VITE","NEO","CHR","SRM","ATOM","ALGO","ONE","RUNE","1INCH","XEM","SUSHI","IOTA","SKL","NEAR","INJ","AUTO","ZIL","CRV","ZEC","DASH","XMR","MANA","IOST","DODO","DEGO","SC","ICX","MITH","HBAR","QTUM","TFUEL","RSR","GRT","FORTH","SFP","BZRX","WRX","FET","PSG","COMP","BAND","XTZ","ANKR","EGLD","OGN","FTT","MKR","OMG","PNT","HARD","ZEN","BLZ","KSM","YFI","NKN","AUD","KAVA","OCEAN","AXS","DGB","OM","DIA","BTCST","BAT","RVN","CELR","CTSI","NANO","TOMO","BEL","FIO","SNX","LIT","BAL","STMX","RLC","COCOS","SAND","VTHO","TRB","STORJ","ZRX","REN","AUDIO","SUPER","FLM","LRC","PUNDIX","AKRO","ANT","ORN","CTK","KNC","BEAM","MIR","GTO","LTO","BAR","PAX","KEY","TCT","MTL","TUSD","BNT","LSK","RAMP","SUN","ARPA","CELO","POND","PERP","JUV","DREP","BTS","UNFI","WTC","ROSE","ONG","CKB","HNT","TWT","DNT","GXS","FUN","WING","COS","CFX","JST","STRAX","CVC","AION","KMD","PERL","ASR","WAN","NULS","YFII","DUSK","HIVE","STX","BADGER","OXT","PAXG","UMA","UTK","MBL","DOCK","WNXM","TROY","BTG","MDT","AVA","NMR","ACM","TRU","DATA","IRIS","DCR","REP","FIRO","OG","RIF","FIS","MFT","ARDR","ATM","CTXC","STPT","NBS","SUSD","BAKE","BURGER","SLP"
// ]
let names = ["ONG"]
const Models = [];
const AllData = [];
const fax = 0.99925 * 0.99925 * 0.995;
const totalBest = [];

names = names
    .filter(b => !(b.toLowerCase().indexOf("down") >= b.toLowerCase().split("down")[0].length))
    .filter(b => !(b.toLowerCase().indexOf("up") >= b.toLowerCase().split("up")[0].length));

for (let n = 0; n < names.length; n++) {
    Models[n] = sequelize.define(names[n].toLowerCase()+'usdt', {
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
}

const limitList = 1440;

for(let m = 0; m < Models.length; m++) {
    Models[m].findAll({
        order: [['openTime', 'DESC']],
        limit: limitList,
        raw: true,
    })
        .then(function (response) {
            AllData.push(response.reverse())


            if (m === Models.length - 1) {
                calculationAll(AllData, 0.98, 0.95);
            }

            // if (m === Models.length - 1) {
            //     for(let x = 0.98; x <= 0.99;) {
            //         for(let c = 0.94; c < 0.95;) {
            //             calculationAll(AllData, x, c);
            //             c += 0.01
            //         }
            //         x += 0.005
            //     }
            //     fs.writeFile(`./totalbest.json`, JSON.stringify(totalBest), function (err) {})
            // }
        })
}

function calculationAll(AllData, profitPer, profitPerSTOP) {
    let bestCoin = []

    for (let x = 0; x < AllData.length; x++){
        const lenStop = AllData[x].length
        let coinA = 1000;
        let coinB = 1000;
        let volume = 0;
        let price = 0;

        for (let i = 10; i < lenStop; i++) {
            const actual = AllData[x][i];
            const avr = (actual.open + actual.low)/2
            const avr10 = AllData[x].filter((item, index)=> index >= i - 10 &&  index < i).map((a, index) => [index,a.open])
            const regres = regression.linear(avr10,{
                order: 4,
                precision: 5,
            }).equation[0]/actual.open*100;



            if ('ONG' === names[x] && i > 1440 - 120) {
                console.log(regres, names[x], new Date(actual.openTime))
            }

            volume = volume + actual.quoteVolume;

            if (coinA > 0 && (actual.low / avr) <= profitPer && (actual.low/actual.open) <= profitPer && regres < 0.15 && regres - 0.15) {
                coinB = (coinA * fax / avr) * 0.9995;
                coinA = 0;
                price = avr;
            } else if(coinA === 0 && (actual.high / price >= (1/profitPer)) && (actual.low / price) <= profitPerSTOP) {
                coinA = coinB * actual.high * 0.9995;
                coinB = 0;
                price = 0;
            }

            if(i === lenStop -1 && coinA === 0) {
                coinA = coinB * actual.high;
            }
        }

        bestCoin.push({n: names[x], c:coinA, v: volume});
    }

    totalBest.push(
        {
            stop: profitPerSTOP,
            x: profitPer,
            c: bestCoin
                .sort((a,b)=>b.c - a.c)
                .filter(b => b.c > 1050 && b.c < 4000)
                .filter(b => b.v > limitList*1000)
                .map(b => parseInt(b.v/limitList)),
            limit: bestCoin
                .sort((a,b)=>b.c - a.c)
                .filter(b => b.c > 1050 && b.c < 4000)
                .filter(b => b.v > limitList*1000)
                .map(b => b.n).length,
            name: bestCoin
                .sort((a,b)=>b.c - a.c)
                .filter(b => b.c > 1050 && b.c < 4000)
                .filter(b => b.v > limitList*1000)
                .map(b => b.n)
        }
    )
}

