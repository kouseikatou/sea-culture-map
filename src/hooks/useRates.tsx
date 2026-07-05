import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

// 無料の為替API（キー不要・CORS対応）から JPY 基準レートを取得。
// 取得できない通貨や取得失敗時は、各国データの概算値 fallback を使う。
const RATES_URL = 'https://open.er-api.com/v6/latest/JPY'

type RatesValue = {
  // 現地通貨1単位 ≈ 何円。live があればそれ、無ければ fallback。
  getJpy: (code: string, fallback: number) => number
  live: boolean
  updatedAt: string | null
}

const RatesContext = createContext<RatesValue>({
  getJpy: (_code, fallback) => fallback,
  live: false,
  updatedAt: null,
})

export function RatesProvider({ children }: { children: ReactNode }) {
  const [rates, setRates] = useState<Record<string, number> | null>(null)
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(RATES_URL)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled || d?.result !== 'success' || !d.rates) return
        setRates(d.rates as Record<string, number>)
        const ms = d.time_last_update_unix
          ? d.time_last_update_unix * 1000
          : Date.now()
        setUpdatedAt(new Date(ms).toLocaleDateString('ja-JP'))
      })
      .catch(() => {
        // ネットワーク失敗時は無音でフォールバック（概算値を使う）
      })
    return () => {
      cancelled = true
    }
  }, [])

  // API は「1 JPY = rates[code] 現地通貨」を返す → 1 現地通貨 = 1/rates[code] 円
  const getJpy = (code: string, fallback: number) => {
    const r = rates?.[code]
    return r && r > 0 ? 1 / r : fallback
  }

  return (
    <RatesContext.Provider value={{ getJpy, live: !!rates, updatedAt }}>
      {children}
    </RatesContext.Provider>
  )
}

export function useRates() {
  return useContext(RatesContext)
}
