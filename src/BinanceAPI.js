const axios = require('axios')
const crypto = require('crypto');
const fs = require('file-system');

const API_URL = 'https://api.binance.com/';
const API_KEY = 'SjmIC8aBnDxzzXUd2ML1VNlz1QBEdCTB5uh9tcKll5rbIYH2McBTPg5TzUm1j4Uk';
const API_SECRET = 'YSrTJonxHzeMb5kKkC3LOtC4e6g4Vf5cQIBZAE8CZibgRQyjwSjPolclfaNQk88P';
function signature(query_string) {
    return crypto
        .createHmac('sha256', API_SECRET)
        .update(query_string)
        .digest('hex');
}

const timestamp = (new Date()).getTime();
const params = [
    ['symbol', 'BTCUSDT'],
    ['side', 'BUY'],
    ['type', 'LIMIT'],
    ['timeInForce', 'GTC'],
    ['price', '20000'],
    ['quantity', '0.001733'],
    ['timestamp', timestamp],
]
const url_text = params.map(p => p.join('=')).join('&')

const actual_time = (new Date).getTime();
axios
    .post(API_URL + 'api/v3/order', null,{
        params: {
            symbol: 'BTCUSDT',
            side: 'BUY',
            type: 'LIMIT',
            timeInForce: 'GTC',
            price: '20000',
            quantity: '0.001733',
            timestamp: timestamp,
            signature: signature(url_text)
        },
        headers: {
            'X-MBX-APIKEY': API_KEY,
            'Content-Type': 'application/json',
        }
    })
    .then((res) => {
        console.log(res.data.transactTime - actual_time)
        console.info(res.data)
    })
    .catch((err) => {console.error(err.response.data, err.response.status)})

const timestamp2 = (new Date()).getTime();
const params2 = [
    ['timestamp', timestamp2],
]
const url_text2 = params2.map(p => p.join('=')).join('&')
axios
    .get(API_URL + '//sapi/v1/capital/config/getall', {
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
        const toJson = res.data.map(c => {

            console.log(c.networkList.filter(p => p.coin === 'ADAUP'))

            return {
                coin: c.coin,
                free: c.free,
                freeze: c.free,
                locked: c.free
            };
        });

        fs.writeFile(`./best3.json`, JSON.stringify(toJson), function (err) {})

    })
    .catch((err) => {console.error(err)})


