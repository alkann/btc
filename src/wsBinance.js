const WebSocket = require('ws');
const urlNames = []
let SocketData = []
let Market = null;
const moneyUSDT = [1067.693184068912];
const moneyCOIN = [0];
const priceCOIN = [0];
const fax = 0.99925 * 0.99925
const profitPer = 0.985
urlNames.push(`${'DEGO'.toLowerCase()}usdt@kline_1m`)

const ws = new WebSocket('wss://stream.binance.com:9443/stream?streams=' + urlNames.join('/'));

ws.on('message', (data) => {
    if (data) {
        const trade = JSON.parse(data);
        const coin = trade.data.k;

        // upsert(
        //     Market,
        //     {
        //         openTime: coin.t,
        //         closeTime: coin.T,
        //         open: coin.o,
        //         high: coin.h,
        //         low: coin.l,
        //         close: coin.c,
        //         volume: coin.v,
        //         quoteVolume: coin.q,
        //         trades: parseFloat(coin.n),
        //         takerBaseVolume: coin.V,
        //         takerQuoteVolume: coin.Q,
        //         ignore: coin.B
        //     }, {openTime: coin.t})

        SocketData.push({
            t: (new Date()).getTime(),
            c: parseFloat(coin.c)
        })

        SocketData = SocketData.filter(d => d.t > ((new Date()).getTime() - 60000))
        const last = SocketData.length - 1;
        const avr = (SocketData[0].c + SocketData[Math.floor(last/2)].c)/2

        process.stdout.clearLine();  // clear current text
        process.stdout.cursorTo(0);
        process.stdout.write(
            `A:${SocketData[last].c} | O:${SocketData[last].c / avr} | C:${SocketData[last].c/SocketData[0].c} | P:${moneyUSDT[0]} | P:${moneyCOIN[0]*SocketData[0].c}`
        );

        if (moneyUSDT[0] > 0 && (SocketData[last].c / avr) <= profitPer && (SocketData[last].c/SocketData[0].c) <= profitPer) {
            moneyCOIN[0] = moneyUSDT[0] * fax / (SocketData[last].c * 1.0005);
            priceCOIN[0] = (SocketData[last].c * 1.005);
            console.log('')
            console.log('BUY', moneyUSDT[0], priceCOIN[0])
            moneyUSDT[0] = 0;
        } else if(moneyUSDT[0] === 0 && ((SocketData[last].c * 0.9995) / priceCOIN[0] >= (1/profitPer))) {
            moneyUSDT[0] = moneyCOIN[0] * (SocketData[last].c * 0.9995);
            console.log('')
            console.log('SELL', moneyUSDT[0], (SocketData[last].c * 0.9995))
            moneyCOIN[0] = 0;
            priceCOIN[0] = 0;
        }
    }
});

function upsert(model, values, condition) {
    return model
        .findOne({ where: condition })
        .then(function(obj) {
            // update
            if(obj) return obj.update(values);
            // insert
            return model.create(values);
        })
}
