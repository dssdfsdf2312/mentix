import { NextResponse } from "next/server"

const COINGECKO_BASE = "https://api.coingecko.com/api/v3"

const COIN_IDS = "bitcoin,ethereum,solana,ripple,binancecoin,cardano"

export async function GET() {
  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
    }

    // Use demo API key if available
    const apiKey = process.env.COINGECKO_API_KEY
    if (apiKey) {
      headers["x-cg-demo-api-key"] = apiKey
    }

    // Fetch market data and global data in parallel
    const [marketsRes, globalRes, fearGreedRes] = await Promise.all([
      fetch(
        `${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${COIN_IDS}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`,
        { headers, next: { revalidate: 120 } }
      ),
      fetch(`${COINGECKO_BASE}/global`, {
        headers,
        next: { revalidate: 120 },
      }),
      fetch("https://api.alternative.me/fng/?limit=1", {
        next: { revalidate: 300 },
      }),
    ])

    if (!marketsRes.ok) {
      const errorText = await marketsRes.text()
      console.error("CoinGecko markets error:", marketsRes.status, errorText)
      return NextResponse.json(
        { error: `CoinGecko API error: ${marketsRes.status}` },
        { status: 502 }
      )
    }

    const markets = await marketsRes.json()
    const globalData = globalRes.ok ? await globalRes.json() : null
    const fearGreedData = fearGreedRes.ok ? await fearGreedRes.json() : null

    // Process global data
    const global = globalData?.data
      ? {
          totalMarketCap: globalData.data.total_market_cap?.usd ?? null,
          btcDominance: globalData.data.market_cap_percentage?.btc ?? null,
          totalVolume: globalData.data.total_volume?.usd ?? null,
          marketCapChangePercentage24h:
            globalData.data.market_cap_change_percentage_24h_usd ?? null,
          activeCryptocurrencies:
            globalData.data.active_cryptocurrencies ?? null,
        }
      : null

    // Process Fear & Greed index
    const fearGreed = fearGreedData?.data?.[0]
      ? {
          value: parseInt(fearGreedData.data[0].value),
          classification: fearGreedData.data[0].value_classification,
        }
      : null

    // Process markets data
    const coins = markets.map(
      (coin: {
        id: string
        symbol: string
        name: string
        image: string
        current_price: number | null
        price_change_percentage_24h: number | null
        market_cap: number | null
        market_cap_rank: number | null
        total_volume: number | null
        high_24h: number | null
        low_24h: number | null
        ath: number | null
        ath_change_percentage: number | null
        circulating_supply: number | null
        total_supply: number | null
      }) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        image: coin.image,
        currentPrice: coin.current_price,
        change24h: coin.price_change_percentage_24h,
        marketCap: coin.market_cap,
        marketCapRank: coin.market_cap_rank,
        totalVolume: coin.total_volume,
        high24h: coin.high_24h,
        low24h: coin.low_24h,
        ath: coin.ath,
        athChangePercentage: coin.ath_change_percentage,
        circulatingSupply: coin.circulating_supply,
        totalSupply: coin.total_supply,
      })
    )

    return NextResponse.json({
      coins,
      global,
      fearGreed,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Crypto API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch crypto data" },
      { status: 500 }
    )
  }
}
