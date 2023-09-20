import Binance from 'binance-api-node'
import * as mathjs from 'mathjs';
import dotenv from 'dotenv';
dotenv.config();

const stableCoin = 'USDT';
const highCoin = 'BTC';

if (!process.env.BINANCE_API_KEY || !process.env.BINANCE_API_SECRET) {
  throw new Error('Please set BINANCE_API_KEY and BINANCE_API_SECRET in .env file');
}

const binance = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
  getTime: Date.now
});

interface Profitability {
  symbol: string;
  profitability: number;
}

interface Rate {
  symbol: string;
  bid: number;
  ask: number;
}
interface Ticker {
  symbol: string,
  bidPrice: string,
  bidQty: string,
  askPrice: string,
  askQty: string,
}

type BinanceBookTickers = { [key: string]: Ticker };

let tickers: BinanceBookTickers;

async function getTickers() {
  return await binance.allBookTickers() as unknown as BinanceBookTickers;
}
async function getRates(symbol: string): Promise<Rate> {
  const ticker = tickers[symbol];
  return {
    symbol,
    bid: parseFloat(ticker.bidPrice),
    ask: parseFloat(ticker.askPrice),
  }
}

async function checkTriArb(stableToken: string, highVolumeToken: string, LowVolumeToken: string) {
  const rateAB = await getRates(highVolumeToken + stableToken);
  const rateBC = await getRates(LowVolumeToken + highVolumeToken);
  const rateCA = await getRates(LowVolumeToken + stableToken);

  if (!rateAB.ask || !rateAB.bid || !rateBC.ask || !rateBC.bid || !rateCA.ask || !rateCA.bid) {
    return;
  }

  const profitability = (100 / rateCA.ask) * rateBC.bid * rateAB.bid;
  const backwardsProfitability = (100 / rateAB.ask) / rateBC.ask * rateCA.bid;

  if (profitability > backwardsProfitability) {
    return {
      symbol: `${stableToken} -> ${LowVolumeToken} -> ${highVolumeToken}`,
      profitability: profitability - 100,
    }
  }

  return {
    symbol: `${stableToken} -> ${highVolumeToken} -> ${LowVolumeToken}`,
    profitability: backwardsProfitability - 100,
  }
}

async function getAltCoins() {
  const altCoins = [];
  const pricesKeys = Object.keys(tickers);
  for (let i = 0; i < pricesKeys.length; i++) {
    const coin = pricesKeys[i];
    if (coin.endsWith(stableCoin)) {
      const reversedCoinPair = coin.replace(stableCoin, highCoin);
      if (tickers[reversedCoinPair]) {
        altCoins.push(coin.replace(stableCoin, ''));
      }
    }
  }

  return altCoins;
}

async function main() {
  console.log('Loading tickers');
  let time = Date.now();
  tickers = tickers ? tickers : await getTickers();
  console.log(`Loaded ${Object.keys(tickers).length} tickers in ${Date.now() - time}ms`);

  console.log('Getting alt coins');
  time = Date.now();
  const altCoins = await getAltCoins();
  console.log(`Got ${altCoins.length} alt coins in ${Date.now() - time}ms`);



  console.log('Checking arbitrage');
  time = Date.now();
  const profitabilities: Profitability[] = [];
  for (let i = 0; i < altCoins.length; i++) {
    const coin = altCoins[i];
    if (coin !== stableCoin && coin !== highCoin) {
      const arb = await checkTriArb(stableCoin, highCoin, coin);
      if (arb && arb.profitability > 0) {
        arb.profitability = mathjs.round(arb.profitability, 4)
        profitabilities.push(arb);
      }
    }
  }
  console.log(`Checked ${altCoins.length} arbitrage opportunities in ${Date.now() - time}ms`);

  profitabilities.sort((a, b) => { return a.profitability - b.profitability });
  console.log(profitabilities);

  console.log('warning - this does not calculates the fees');
}

main();
