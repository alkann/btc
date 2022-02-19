const WebSocket = require('ws');
const axios = require('axios')
const crypto = require('crypto');
const regression = require('regression');
const API_URL = 'https://api.binance.com/';
const API_KEY = 'SjmIC8aBnDxzzXUd2ML1VNlz1QBEdCTB5uh9tcKll5rbIYH2McBTPg5TzUm1j4Uk';
const API_SECRET = 'YSrTJonxHzeMb5kKkC3LOtC4e6g4Vf5cQIBZAE8CZibgRQyjwSjPolclfaNQk88P';
const Names = [
    "XRP", "DOGE", "ADA", "BUSD", "ETC", "DENT", "SOL", "CHR",
    "SUN", "TLM", "MATIC", "DOT", "VET", "AXS", "EOS", "FIL",
    "LTC", "C98", "TWT", "ICP", "RUNE", "SHIB", "THETA", "BCH",
    "LINK", "TRX", "XLM", "ALICE", "CTSI", "KAVA", "IOTX", "LUNA",
    "USDC", "VTHO", "CHZ", "WIN", "BTT", "BAKE", "EPS", "SLP",
    "UNI", "EUR", "ALGO", "NEO", "FTT", "AAVE", "SRM", "SAND",
    "LINA", "QTUM", "HOT", "CAKE", "SXP", "GRT", "SUSHI", "HBAR",
    "ATA", "WAVES", "ATOM", "ZEC", "COMP", "CRV", "UTK", "OGN",
    "DASH", "XRPUP", "RVN", "KSM", "ONT", "XVS", "LIT", "UNFI",
    "SUPER", "FTM", "XVG", "IOST", "FIS", "SNX", "PSG", "HNT",
    "TRU", "XTZ", "OMG", "XMR", "ANKR", "ENJ"
].reverse();
const urlNames = Names.map(m => `${m.toLowerCase()}usdt@kline_1m`);
const priceCOIN = [];
let SocketData = [];
let SocketData10 = [];
let SELLmoneyCOIN = null;
let BUYmoneyCOIN  = null;
let BUYmoneyCOIN_TO_SELL  = null;
let nameCOIN = null;
let timeCOIN = null;
let volumData = [];
const profitPer = 0.985
const profitPerSTOP = 0.90
const profitPerSELL = 0.996
const buy = 1.0003
const sell = 0.9986;

const ws = new WebSocket('wss://stream.binance.com:9443/stream?streams=' + urlNames.join('/'));
console.log("NAMES: ", Names.length)
const startTime = (new Date()).getTime();
const waitTime = 600*1000;

ws.on('message', (data) => {
    if (data) {
        const trade = JSON.parse(data);
        const coin = trade.data.k;
        const name = coin.s.slice(0, -4);

        if (!SocketData[name]) {
            SocketData[name] = [];
            SocketData10[name] = [];
            priceCOIN[name] = 0;
        }

        BUYmoneyCOIN = parseFloat(volumData.filter(v => v.coin === 'USDT')[0]?.free);
        SELLmoneyCOIN = parseFloat(volumData.filter(v => v.coin === nameCOIN)[0]?.free);

        const volPrec = coin.v.split('.')[1].split("").reverse();
        let qp = 8;
        for(let x = 0; x < volPrec.length; x++) {
            if (volPrec[x] > 0) {
                qp = qp - x;
                x = 10;
            }
        }

        const openPrec = coin.o.split('.')[1].split("").reverse();
        let pp = 8;
        for(let x = 0; x < openPrec.length; x++) {
            if (openPrec[x] > 0) {
                pp = pp - x;
                x = 10;
            }
        }

        SocketData[name].push({
            t: (new Date()).getTime(),
            c: parseFloat(coin.c),
            qp: qp,
            pp: pp,
        })

        SocketData10[name].push({
            t: (new Date()).getTime(),
            c: parseFloat(coin.c)
        })

        SocketData[name] = SocketData[name].filter(d => d.t > ((new Date()).getTime() - 60000))
        SocketData10[name] = SocketData10[name].filter(d => d.t > ((new Date()).getTime() - waitTime))

        if(
            BUYmoneyCOIN &&
            startTime + waitTime < (new Date()).getTime()
        ){
            const last = SocketData[name].length - 1;
            const avr = (SocketData[name][0].c + SocketData[name][Math.floor(last/2)].c)/2
            const avr10 = SocketData10[name].map((a, index) => [index,a.c])
            const regres = regression.linear(avr10,{
                order: 4,
                precision: 4,
            }).equation[0]/SocketData[name][0].c*100;

            process.stdout.clearLine();  // clear current text
            process.stdout.cursorTo(0);
            if (BUYmoneyCOIN > 50) {
                process.stdout.write(
                    `R: ${regres.toFixed(4)} | O:${(SocketData[name][last].c / avr).toFixed(4)} | C:${(SocketData[name][last].c/SocketData[name][0].c).toFixed(4)} | ${(profitPer).toFixed(3)} | P:${(BUYmoneyCOIN*0.95*3.69).toFixed(2)}`
                );
            } else if(BUYmoneyCOIN <= 50 && nameCOIN){
                const l = SocketData[nameCOIN].length - 1;

                if(timeCOIN + 600*1000 > (new Date()).getTime() && SELLmoneyCOIN < BUYmoneyCOIN_TO_SELL) {
                    cancelOrder(nameCOIN+'USDT')
                }

                process.stdout.write(
                    `O:${((SocketData[nameCOIN][l].c * sell) / priceCOIN[nameCOIN]).toFixed(4)} | ${(1/profitPerSELL).toFixed(3)} | P:${(SELLmoneyCOIN*SocketData[nameCOIN][l].c * sell*3.69).toFixed(2)} | ${nameCOIN}`
                );
            }

            if (BUYmoneyCOIN > 50 &&
                regres < 0.09&&
                regres > -0.09 &&
                (SocketData[name][last].c / avr) <= profitPer &&
                (SocketData[name][last].c/SocketData[name][0].c) <= profitPer) {

                trading({
                    symbol: name,
                    side: 'BUY',
                    type: 'LIMIT',
                    timeInForce: 'GTC',
                    price: (SocketData[name][last].c * buy).toFixed(SocketData[name][last].pp),
                    quantity: ((BUYmoneyCOIN)*0.95/(SocketData[name][last].c * buy)).toFixed(SocketData[name][last].qp),
                }, () => {
                    nameCOIN = name;
                    timeCOIN = (new Date()).getTime();
                    priceCOIN[nameCOIN] = (SocketData[name][last].c * buy);
                    BUYmoneyCOIN_TO_SELL = ((BUYmoneyCOIN)*0.95/(SocketData[name][last].c * buy)).toFixed(SocketData[name][last].qp);

                    console.log('');
                    console.log('BUY',nameCOIN,  BUYmoneyCOIN);

                })

            } else if(
                BUYmoneyCOIN <= 50 &&
                nameCOIN &&
                BUYmoneyCOIN_TO_SELL &&
                SELLmoneyCOIN > BUYmoneyCOIN_TO_SELL*0.9 &&
                (
                    ((SocketData[nameCOIN][SocketData[nameCOIN].length - 1].c * sell) / priceCOIN[nameCOIN] >= (1/profitPerSELL)) ||
                    ((SocketData[nameCOIN][SocketData[nameCOIN].length - 1].c * sell) / priceCOIN[nameCOIN] <= profitPerSTOP) ||
                    (
                        (new Date()).getTime() - timeCOIN > 1000*60*2 &&
                        (SocketData[nameCOIN][SocketData[nameCOIN].length - 1].c * sell) / priceCOIN[nameCOIN] >= 1.0017
                    )||
                    (
                        (new Date()).getTime() - timeCOIN > 1000*60*5 &&
                        (SocketData[nameCOIN][SocketData[nameCOIN].length - 1].c * sell) / priceCOIN[nameCOIN] >= 1.0005
                    )
                )
            ) {
                trading({
                    symbol: nameCOIN,
                    side: 'SELL',
                    type: 'LIMIT',
                    timeInForce: 'GTC',
                    price: (SocketData[nameCOIN][SocketData[nameCOIN].length - 1].c * sell).toFixed(SocketData[nameCOIN][SocketData[nameCOIN].length - 1].pp),
                    quantity: SELLmoneyCOIN.toFixed(SocketData[nameCOIN][SocketData[nameCOIN].length - 1].qp),
                }, () => {
                        console.log('')
                        console.log('SELL', nameCOIN, SELLmoneyCOIN * (SocketData[nameCOIN][SocketData[nameCOIN].length - 1].c * 0.9991))
                        priceCOIN[nameCOIN] = 0;
                        nameCOIN = null;
                        BUYmoneyCOIN_TO_SELL = null;
                    }
                )
            }
        }


    }
});

function getValue() {
    const timestamp2 = (new Date()).getTime();
    const params2 = [
        ['timestamp', timestamp2],
    ]
    const url_text2 = params2.map(p => p.join('=')).join('&')
    axios
        .get(API_URL + 'sapi/v1/capital/config/getall', {
            params: {
                timestamp: timestamp2,
                signature: signature(url_text2)
            },
            headers: {
                'X-MBX-APIKEY': API_KEY,
                'Content-Type': 'application/json',
            }
        })
        .then((res) => {
            volumData = res.data.map(c => {
                return {
                    coin: c.coin,
                    free: c.free,
                    freeze: c.free,
                    locked: c.free
                };
            });

            setTimeout(() => getValue(), 1300)

        })
        .catch((err) => {console.error(err)})
}

function trading(param, callback) {
    const timestamp = (new Date()).getTime();
    const params = [
        ['symbol', param.symbol+'USDT'],
        ['side', param.side],
        ['type', param.type],
        ['timeInForce', param.timeInForce],
        ['price', param.price],
        ['quantity', param.quantity],
        ['timestamp', timestamp],
    ]
    const url_text = params.map(p => p.join('=')).join('&')

    axios
        .post(API_URL + 'api/v3/order', null,{
            params: {
                symbol: param.symbol+'USDT',
                side: param.side,
                type: param.type,
                timeInForce: param.timeInForce,
                price: param.price,
                quantity: param.quantity,
                timestamp: timestamp,
                signature: signature(url_text)
            },
            headers: {
                'X-MBX-APIKEY': API_KEY,
                'Content-Type': 'application/json',
            }
        })
        .then((res) => {
            console.info(res.data)
            callback()
        })
        .catch((err) => {console.error(err.response.data, err.response.status)})
}

function cancelOrder(name) {
    const timestamp3 = (new Date()).getTime();
    const params2 = [
        ['symbol', name],
        ['timestamp', timestamp3]
    ]
    const url_text3 = params2.map(p => p.join('=')).join('&')
    axios
        .get(API_URL + 'api/v3/openOrders', {
            params: {
                symbol: name,
                timestamp: timestamp3,
                signature: signature(url_text3)
            },
            headers: {
                'X-MBX-APIKEY': API_KEY,
                'Content-Type': 'application/json',
            }
        })
        .then((res) => {
            volumData = res.data.map(c => {
                return {
                    coin: c.coin,
                    free: c.free,
                    freeze: c.free,
                    locked: c.free
                };
            });

            setTimeout(() => getValue(), 1000)

        })
        .catch((err) => {console.error(err)})
}

function signature(query_string) {
    return crypto
        .createHmac('sha256', API_SECRET)
        .update(query_string)
        .digest('hex');
}

getValue();
