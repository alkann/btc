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
            const result = [];
            const low = Math.min(...objs.map(o => o.low));
            const high = Math.max(...objs.map(o => o.high)) - low;

            for(let i = 0;i<len;i++){
                result.push([(objs[i].open-low)/high,(objs[i].high-low)/high,(objs[i].low-low)/high,(objs[i].close-low)/high]);
            }

            x++
            if(x < names.length){
                console.log(`${x}/${names.length}`, `${names[x]}_USDT`, ((new Date().getTime())-time)*(names.length-x)/1000/x)
                fs.writeFile(`./data2/${name}.json`, JSON.stringify(result), function (err) {})
                calculateName((names[x]+'USDT').toLowerCase())
            } else {
                fs.writeFile(`./data2/${name}.json`, JSON.stringify(result), function (err) {})
            }
        })
}

calculateName((names[x]+'USDT').toLowerCase())
