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
const regression = require("regression");
const names = ['BTC','ETH','BUSD','XRP','SHIB','GALA','BNB','AVAX','SOL','LUNA','SLP','SAND','MANA','ADA','ATOM','MATIC','FTM','DOT','DOGE','TRX','LTC','USDC','FIL','NEAR','LINK','NEO','UST','DIA','THETA','AXS','ETC','ICP','VET','ROSE','EGLD','PEOPLE','ALICE','CRV','ONE','EOS','DYDX','LRC','ALPACA','TLM','TORN','AAVE','ENJ','HOT','ZEC','BCH','JASMY','XVS','API3','OMG','EUR','AR','GRT','ALGO','FLOW','XLM','MBOX','DASH','DAR','FTT','CHZ','MDT','KLAY','IMX','TFUEL','SUSHI','CHR','ENS','KNC','XTZ','BLZ','PAXG','ONT','UNI','QTUM','JST','HBAR','1INCH','SUN','WAVES','AUD','GLMR','BTTC','BETA','KAVA','XMR','CAKE','HNT','ANT','BAND','ONG','RUNE','WIN','SXP','DENT','PYR','SUPER','IOTX','MINA','BTCDOWN','CELO','TUSD','ACH','BAT','IDEX','SKL','DUSK','CELR','RNDR','SYS','REEF','ACA','DNT','QNT','WOO','NMR','COTI','SPELL','XRPDOWN','YGG','XRPUP','TKO','RSR','LOKA','WAXP','MIR','UNFI','C98','KSM','ZIL','YFI','BNX','ETHDOWN','LINA','INJ','FLM','IOST','NULS','IOTA','GBP','LINKDOWN','WRX','QI','SRM','AUDIO','XEC','KP3R','FUN','ETHUP','BEAM','RVN','ZEN','BICO','PORTO','ARPA','OCEAN','MOVR','WING','COCOS','FET','SCRT','BTCUP','GTC','ALPHA','DEXE','OGN','CTXC','LINKUP','ERN','OOKI','ANKR','BAKE','SNX','MASK','ADX','CLV','ANC','ADADOWN','POND','EPS','LIT','FLUX','VOXEL','ZRX','GXS','ICX','DODO','CTK','UTK','SFP','CTSI','COMP','RARE','DOTDOWN','ADAUP','DOTUP','USDP','ATA','ANY','SC','FXS','POWR','DREP','HIGH','REN','DGB','CKB','BNBDOWN','STX','RAY','LPT','MC','HARD','AGLD','TVK','RLC','PUNDIX','TRB','ILV','FRONT','FIS','LAZIO','MITH','MKR','FORTH','BNBUP','PSG','CHESS','VGX','BOND','JOE','COS','XEM','STRAX','IRIS','AKRO','AUTO','KEY','CVC','BAL','LTO','TWT','MDX','CVX','TRIBE','HIVE','DATA','REP','STORJ','FIDA','OM','BEL','POLS','REQ','AMP','BTCST','MTL','NKN','DEGO','STMX','POLY','CFX','GTO','BTS','VITE','UMA','FARM','YFII','AVA','BADGER','FIO','PLA','PERP','VIDT','AION','PHA','TROY','VTHO','XVG','TRU','ORN','RAMP','OXT','NBS','WTC','GHST','FOR','PNT','DCR','TOMO','RGT','RAD','MLN','CITY','SANTOS','ALCX','BURGER','CVP','XNO','DOCK','WAN','QUICK','PERL','TRXDOWN','ACM','MFT','ELF','KMD','JUV','BTG','TRXUP','FIRO','BNT','ARDR','DF','RIF','MBL', 'OG', 'ATM', 'BAR', 'LSK', 'GNO', 'TCT', 'STPT', 'WNXM', 'AUCTION', 'ASR', 'SUSD'];
let x = 0;
const rang = 16000
const RAT = 24*14;
const PROF = 1.2;
const arr = [];
const arr2 = [];
const time = (new Date()).getTime();

function calculateName(name) {
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
        limit: rang,
        raw: true,
    })
        .then(function (response) {
            const objs = response.reverse();
            const len = objs.length;

            for(let i = 0;i<len;i++){
                for(let k = i; (k<len && (k-i)<RAT);k++){
                    const profit = objs[k].low/objs[i].high

                    if(profit>PROF){
                        const input = {
                            open: [],
                            high: [],
                            low: [],
                            close: [],
                            volume: []
                        };

                        for(let l=-12; l<0;l++){
                            if(i+l > 0){
                                input.open.push(objs[i+l].open);
                                input.high.push(objs[i+l].high);
                                input.low.push(objs[i+l].low);
                                input.close.push(objs[i+l].close);
                                input.volume.push(objs[i+l].volume);
                            } else {
                                l=0;
                            }
                        }

                        const priceL = Math.min(...input.low);
                        const priceH = Math.max(...input.high) - priceL;
                        const volumeL = Math.min(...input.volume);
                        const volumeH = Math.max(...input.volume) - volumeL;


                        input.open = input.open.map(io => (io-priceL)/priceH);
                        input.high = input.high.map(ih => (ih-priceL)/priceH);
                        input.low = input.low.map(il => (il-priceL)/priceH);
                        input.close = input.close.map(ic => (ic-priceL)/priceH);
                        input.volume = input.volume.map(iv => (iv-volumeL)/volumeH);
                        input.prg = [];

                        input.low.map((iL, index) => {
                            const full = input.high[index]-iL;
                            const interval = Math.abs(input.open[index]-input.close[index]);

                            input.prg[index] = interval/full;
                        });

                        const res = [];
                        res[0] = regression.linear(input.open, {order: 4, precision: 4}).equation[0];
                        res[1] = regression.linear(input.high, {order: 4, precision: 4}).equation[0];
                        res[2] = regression.linear(input.low, {order: 4, precision: 4}).equation[0];
                        res[3] = regression.linear(input.close, {order: 4, precision: 4}).equation[0];
                        res[4] = regression.linear(input.volume, {order: 4, precision: 4}).equation[0];
                        res[5] = regression.linear(input.prg, {order: 4, precision: 4}).equation[0];

                        const ln = input.volume.length-1

                        arr.push({input: [
                                ...res,
                                input.open[ln],
                                input.high[ln],
                                input.low[ln],
                                input.close[ln],
                                input.volume[ln],
                                input.prg[ln]
                            ], output:[1]})

                        i+=(k-i);

                    }else if(objs[k].low/objs[i].high < 0.99){
                        const input = {
                            open: [],
                            high: [],
                            low: [],
                            close: [],
                            volume: []
                        };

                        for(let l=-12; l<0;l++){
                            if(i+l > 0){
                                input.open.push(objs[i+l].open);
                                input.high.push(objs[i+l].high);
                                input.low.push(objs[i+l].low);
                                input.close.push(objs[i+l].close);
                                input.volume.push(objs[i+l].volume);
                            } else {
                                l=0;
                            }
                        }

                        const priceL = Math.min(...input.low);
                        const priceH = Math.max(...input.high) - priceL;
                        const volumeL = Math.min(...input.volume);
                        const volumeH = Math.max(...input.volume) - volumeL;

                        input.open = input.open.map(io => (io-priceL)/priceH);
                        input.high = input.high.map(ih => (ih-priceL)/priceH);
                        input.low = input.low.map(il => (il-priceL)/priceH);
                        input.close = input.close.map(ic => (ic-priceL)/priceH);
                        input.volume = input.volume.map(iv => (iv-volumeL)/volumeH);
                        input.prg = [];

                        input.low.map((iL, index) => {

                            const full = input.high[index]-iL;
                            const interval = Math.abs(input.open[index]-input.close[index]);

                            input.prg[index] = interval/full;

                        });

                        const res = [];
                        res[0] = regression.linear(input.open, {order: 4, precision: 4}).equation[0];
                        res[1] = regression.linear(input.high, {order: 4, precision: 4}).equation[0];
                        res[2] = regression.linear(input.low, {order: 4, precision: 4}).equation[0];
                        res[3] = regression.linear(input.close, {order: 4, precision: 4}).equation[0];
                        res[4] = regression.linear(input.volume, {order: 4, precision: 4}).equation[0];
                        res[5] = regression.linear(input.prg, {order: 4, precision: 4}).equation[0];

                        const ln = input.volume.length-1
                        arr2.push({input: [
                                ...res,
                                input.open[ln],
                                input.high[ln],
                                input.low[ln],
                                input.close[ln],
                                input.volume[ln],
                                input.prg[ln]
                            ], output:[0]})

                        i+=(k-i);
                    }
                }
            }

            x++
            if(x < names.length){
                console.log(`${x}/${names.length}`, `${names[x]}_USDT`, ((new Date().getTime())-time)*(names.length-x)/1000/x)
                calculateName((names[x]+'USDT').toLowerCase())
            } else {
                const posLen = arr.length
                const negLen = arr2.length
                const rt = Math.floor(negLen/posLen);
                console.log('posLen', posLen);
                console.log('negLen', negLen);
                console.log('rt', rt);
                const result = [];

                arr.map((a,index) =>  {
                    result.push(a);
                    result.push(arr2[index*Math.floor(rt/10)]);
                    result.push(arr2[index*Math.floor(rt/9)]);
                    result.push(arr2[index*Math.floor(rt/8)]);
                    result.push(arr2[index*Math.floor(rt/7)]);
                    result.push(arr2[index*Math.floor(rt/6)]);
                    result.push(arr2[index*Math.floor(rt/5)]);
                    result.push(arr2[index*Math.floor(rt/4)]);
                    result.push(arr2[index*Math.floor(rt/3)]);
                    result.push(arr2[index*Math.floor(rt/2)]);
                    result.push(arr2[index*Math.floor(rt)]);
                })

                fs.writeFile(`./data2/d.json`, JSON.stringify(result), function (err) {})
            }
        })
}

calculateName((names[x]+'USDT').toLowerCase())
