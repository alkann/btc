const axios = require('axios')
var Sequelize = require('sequelize');
var sequelize = new Sequelize('coinmarket', 'root', null, {
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
// const names = ["BTC","BNB","ETH","BUSD","XRP","MATIC","DOGE","ADA","CHZ","CAKE","DOT","VET","SXP","XVS","FTM","LTC","LINK","SOL","EOS","IOTX","FIL","TRX","ALICE","DENT","UNI","WIN","BTT","EUR","WAVES","USDC","BCH","HOT","TLM","XLM","TKO","LUNA","THETA","BNBUP","AAVE","LINA","ONT","ENJ","GBP","ETC","AVAX","ALPHA","REEF","COTI","EPS","VITE","NEO","CHR","SRM","ATOM","ALGO","ONE","RUNE","1INCH","XEM","SUSHI","IOTA","SKL","NEAR","INJ","AUTO","ZIL","CRV","ZEC","DASH","XMR","MANA","IOST","XRPUP","DODO","DEGO","SC","ICX","MITH","HBAR","QTUM","TFUEL","RSR","GRT","FORTH","SFP","BZRX","WRX","FET","PSG","COMP","BAND","XTZ","ANKR","EGLD","OGN","FTT","MKR","OMG","PNT","HARD","ZEN","BLZ","KSM","YFI","NKN","ETHUP","AUD","KAVA","XRPDOWN","OCEAN","ADAUP","AXS","DGB","OM","DIA","BTCST","BTCDOWN","BAT","RVN","CELR","CTSI","NANO","TOMO","BEL","FIO","SNX","LIT","BAL","BTCUP","STMX","RLC","COCOS","SAND","BNBDOWN","VTHO","TRB","STORJ","ZRX","REN","AUDIO","SUPER","FLM","LRC","PUNDIX","AKRO","ANT","ORN","SXPUP","CTK","KNC","BEAM","MIR","SUSHIUP","GTO","LTO","BAR","PAX","EOSUP","KEY","TCT","DOTUP","MTL","TUSD","BNT","LSK","RAMP","SUN","ARPA","ETHDOWN","CELO","POND","PERP","JUV","DREP","1INCHUP","BTS","UNFI","WTC","SXPDOWN","ROSE","ONG","CKB","HNT","TWT","DNT","GXS","FUN","WING","COS","LINKUP","CFX","JST","STRAX","CVC","AAVEUP","AION","KMD","PERL","ASR","WAN","NULS","YFII","DUSK","HIVE","STX","BADGER","OXT","PAXG","UMA","UTK","MBL","DOCK","WNXM","XLMUP","FILUP","TROY","XTZUP","BTG","MDT","AVA","NMR","LTCUP","ACM","BCHUP","ADADOWN","TRU","DATA","IRIS","DCR","REP","FIRO","UNIUP","OG","RIF","FIS","TRXUP","MFT","ARDR","YFIDOWN","ATM","CTXC","STPT","UNIDOWN","EOSDOWN","AAVEDOWN","SUSHIDOWN","1INCHDOWN","NBS","DOTDOWN","LINKDOWN","TRXDOWN","YFIUP","FILDOWN","BCHDOWN","XLMDOWN","LTCDOWN","SUSD","XTZDOWN","BAKE","BURGER","SLP"]
// const names = ["ZRX","REN","AUDIO","SUPER","FLM","LRC","PUNDIX","AKRO","ANT","ORN","SXPUP","CTK","KNC","BEAM","MIR","SUSHIUP","GTO","LTO","BAR","PAX","EOSUP","KEY","TCT","DOTUP","MTL","TUSD","BNT","LSK","RAMP","SUN","ARPA","ETHDOWN","CELO","POND","PERP","JUV","DREP","1INCHUP","BTS","UNFI","WTC","SXPDOWN","ROSE","ONG","CKB","HNT","TWT","DNT","GXS","FUN","WING","COS","LINKUP","CFX","JST","STRAX","CVC","AAVEUP","AION","KMD","PERL","ASR","WAN","NULS","YFII","DUSK","HIVE","STX","BADGER","OXT","PAXG","UMA","UTK","MBL","DOCK","WNXM","XLMUP","FILUP","TROY","XTZUP","BTG","MDT","AVA","NMR","LTCUP","ACM","BCHUP","ADADOWN","TRU","DATA","IRIS","DCR","REP","FIRO","UNIUP","OG","RIF","FIS","TRXUP","MFT","ARDR","YFIDOWN","ATM","CTXC","STPT","UNIDOWN","EOSDOWN","AAVEDOWN","SUSHIDOWN","1INCHDOWN","NBS","DOTDOWN","LINKDOWN","TRXDOWN","YFIUP","FILDOWN","BCHDOWN","XLMDOWN","LTCDOWN","SUSD","XTZDOWN","BAKE","BURGER","SLP"]
const names = ['BTC','ETH','BUSD','XRP','SHIB','GALA','BNB','AVAX','SOL','LUNA','SLP','SAND','MANA','ADA','ATOM','MATIC','FTM','DOT','DOGE','TRX','LTC','USDC','FIL','NEAR','LINK','NEO','UST','DIA','THETA','AXS','ETC','ICP','VET','ROSE','EGLD','PEOPLE','ALICE','CRV','ONE','EOS','DYDX','LRC','ALPACA','TLM','TORN','AAVE','ENJ','HOT','ZEC','BCH','JASMY','XVS','API3','OMG','EUR','AR','GRT','ALGO','FLOW','XLM','MBOX','DASH','DAR','FTT','CHZ','MDT','KLAY','IMX','TFUEL','SUSHI','CHR','ENS','KNC','XTZ','BLZ','PAXG','ONT','UNI','QTUM','JST','HBAR','1INCH','SUN','WAVES','AUD','GLMR','BTTC','BETA','KAVA','XMR','CAKE','HNT','ANT','BAND','ONG','RUNE','WIN','SXP','DENT','PYR','SUPER','IOTX','MINA','BTCDOWN','CELO','TUSD','ACH','BAT','IDEX','SKL','DUSK','CELR','RNDR','SYS','REEF','ACA','DNT','QNT','WOO','NMR','COTI','SPELL','XRPDOWN','YGG','XRPUP','TKO','RSR','LOKA','WAXP','MIR','UNFI','C98','KSM','ZIL','YFI','BNX','ETHDOWN','LINA','INJ','FLM','IOST','NULS','IOTA','GBP','LINKDOWN','WRX','QI','SRM','AUDIO','XEC','KP3R','FUN','ETHUP','BEAM','RVN','ZEN','BICO','PORTO','ARPA','OCEAN','MOVR','WING','COCOS','FET','SCRT','BTCUP','GTC','ALPHA','DEXE','OGN','CTXC','LINKUP','ERN','OOKI','ANKR','BAKE','SNX','MASK','ADX','CLV','ANC','ADADOWN','POND','EPS','LIT','FLUX','VOXEL','ZRX','GXS','ICX','DODO','CTK','UTK','SFP','CTSI','COMP','RARE','DOTDOWN','ADAUP','DOTUP','USDP','ATA','ANY','SC','FXS','POWR','DREP','HIGH','REN','DGB','CKB','BNBDOWN','STX','RAY','LPT','MC','HARD','AGLD','TVK','RLC','PUNDIX','TRB','ILV','FRONT','FIS','LAZIO','MITH','MKR','FORTH','BNBUP','PSG','CHESS','VGX','BOND','JOE','COS','XEM','STRAX','IRIS','AKRO','AUTO','KEY','CVC','BAL','LTO','TWT','MDX','CVX','TRIBE','HIVE','DATA','REP','STORJ','FIDA','OM','BEL','POLS','REQ','AMP','BTCST','MTL','NKN','DEGO','STMX','POLY','CFX','GTO','BTS','VITE','UMA','FARM','YFII','AVA','BADGER','FIO','PLA','PERP','VIDT','AION','PHA','TROY','VTHO','XVG','TRU','ORN','RAMP','OXT','NBS','WTC','GHST','FOR','PNT','DCR','TOMO','RGT','RAD','MLN','CITY','SANTOS','ALCX','BURGER','CVP','XNO','DOCK','WAN','QUICK','PERL','TRXDOWN','ACM','MFT','ELF','KMD','JUV','BTG','TRXUP','FIRO','BNT','ARDR','DF','RIF','MBL', 'OG', 'ATM', 'BAR', 'LSK', 'GNO', 'TCT', 'STPT', 'WNXM', 'AUCTION', 'ASR', 'SUSD'];

// const names = ["CAKE"]
var Markets = [];
let coin = 0;

function upsert(model, values, condition) {

   // console.log(values)

    return model
        .findOne({ where: condition })
        .then(function(obj) {
            // update
            if(obj)
                return obj.update(values);
            // insert
            return model.create(values);
        })
}

const setMarket = (nameMarkets) => {
    Markets[nameMarkets] = sequelize.define(nameMarkets.toLowerCase(), {
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

    Markets[nameMarkets].sync().then(function () {
        console.log('Created table Market')
    });

    let k = 0;
    const addPrices = (name, time) => {
        axios.get('https://api.binance.com/api/v3/klines', {
            params: {
                symbol: name,
                interval: '1h',
                limit: 100,
                startTime: time,
            }
        })
            .then(function (r) {
                if(r.data && r.data.length && r.status === 200) {
                    console.log(names[coin]+'USDT', k)

                    const len = r.data.length;

                    for(let i =0; i < len; i++){
                        const d = r.data[i];
                        upsert(
                            Markets[nameMarkets],
                            {
                                openTime: d[0],
                                closeTime: d[6],
                                open: d[1],
                                high: d[2],
                                low: d[3],
                                close: d[4],
                                volume: d[5],
                                quoteVolume: d[7],
                                trades: d[8],
                                takerBaseVolume: d[9],
                                takerQuoteVolume: d[10],
                                ignore: d[11]
                            }, {openTime: d[0]})
                    }

                    // if(k === 0) {
                    //     const time = Math.floor((r.data[len-1][0] - 1545021000000) / (5*60*1000*1000))
                    //     if(time > 0){
                    //         console.log('ChangeTime', time)
                    //         k +=time;
                    //     } else {
                    //         k++
                    //     }
                    // } else {
                    //     k++
                    // }

                    k++
                    if(k < 1) {
                        setTimeout(()=>{
                            addPrices(nameMarkets, 1587607871543 + k*3600*1000*1000)
                        }, 200)
                    } else if (k === 1) {
                        coin++
                        setTimeout(()=>{
                            console.log('NEW',names[coin]+'USDT', coin, names.length)
                            setMarket(names[coin]+'USDT');
                        }, 200)
                    }
                }
            })
    }

    addPrices(nameMarkets, 1645207200000)
}

setMarket(names[0]+'USDT');

