## Expected output
```javascript
[
    { symbol: 'USDT -> ETH -> BTC', profitability: 0.0019 },
    { symbol: 'USDT -> BTC -> ARB', profitability: 0.004 },
    { symbol: 'USDT -> BTC -> PERP', profitability: 0.0054 },
    { symbol: 'USDT -> BTC -> EDU', profitability: 0.0062 },
    { symbol: 'USDT -> BTC -> DYDX', profitability: 0.0106 },
    { symbol: 'USDT -> BTC -> BAL', profitability: 0.013 },
    { symbol: 'USDT -> BTC -> HIVE', profitability: 0.0145 },
    { symbol: 'USDT -> BTC -> HBAR', profitability: 0.0154 },
    { symbol: 'USDT -> BTC -> MAGIC', profitability: 0.0158 },
    { symbol: 'USDT -> BTC -> QNT', profitability: 0.0216 },
    { symbol: 'USDT -> BTC -> BCH', profitability: 0.0236 },
    { symbol: 'USDT -> BTC -> SYN', profitability: 0.0288 },
    { symbol: 'USDT -> ALPACA -> BTC', profitability: 0.0504 },
    { symbol: 'USDT -> WAXP -> BTC', profitability: 0.1553 }
]
```


## How it works
The scanner will look for the most profitable path between USDT, BTC and low volume tokens. It will use the [Binance](https://www.binance.com/) exchange to find the best path.

## Warnings
1) This is a proof of concept. It is not production ready. Use at your own risk.
2) The profitability is calculated based on the current order book. It does not take into account the fees. So the actual profitability will be lower than what is shown.

## Requirements
 1) node.js
 2) npm
 3) typescript
 4) [Binance](https://www.binance.com/) account with API key and secret

## Install
 1) Copy `.env.example` to `.env` and fill in your Binance API key and secret
 2) Run `npm i`

## Run the scanner
`npm start`
