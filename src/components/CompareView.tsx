import { useEffect, useState } from 'react'
import type { BudgetLevel, Country } from '../data/countries'
import { useRates } from '../hooks/useRates'

const BUDGET_LABEL: Record<BudgetLevel, string> = {
  1: '激安',
  2: '安い',
  3: 'ふつう',
  4: '高い',
}

function BudgetTag({ level }: { level: BudgetLevel }) {
  return (
    <span className="cmp-budget" data-level={level}>
      {'¥'.repeat(level)} {BUDGET_LABEL[level]}
    </span>
  )
}

type Props = {
  countries: Country[]
  initialA?: string | null
  onClose: () => void
}

export function CompareView({ countries, initialA, onClose }: Props) {
  const { getJpy, live } = useRates()

  const defaultA =
    initialA && countries.some((c) => c.id === initialA)
      ? initialA
      : countries[0].id
  const [aId, setAId] = useState(defaultA)
  const [bId, setBId] = useState(
    countries.find((c) => c.id !== defaultA)?.id ?? countries[0].id,
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const a = countries.find((c) => c.id === aId)!
  const b = countries.find((c) => c.id === bId)!

  const rateLabel = (c: Country) => {
    const r = getJpy(c.currencyCode, c.jpyPerUnit)
    const s = r >= 1 ? r.toFixed(2) : Number(r.toPrecision(2)).toString()
    return `1${c.currencyCode} ≈ ${s}円`
  }

  const rows: { label: string; get: (c: Country) => React.ReactNode }[] = [
    { label: '予算', get: (c) => <BudgetTag level={c.budgetLevel} /> },
    { label: '1日予算', get: (c) => c.dailyBudget },
    { label: 'レート', get: rateLabel },
    { label: 'ビザ', get: (c) => c.visaJp },
    { label: '英語', get: (c) => c.englishLevel },
    { label: 'ベスト時期', get: (c) => c.bestSeason },
  ]

  const picker = (value: string, set: (v: string) => void, label: string) => (
    <select
      className="cmp-select"
      value={value}
      onChange={(e) => set(e.target.value)}
      aria-label={label}
    >
      {countries.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  )

  return (
    <div className="cmp-overlay" onClick={onClose}>
      <div
        className="cmp-modal"
        role="dialog"
        aria-modal="true"
        aria-label="2国の比較"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="cmp-close" onClick={onClose} aria-label="閉じる">
          ✕
        </button>
        <h2 className="cmp-title">🆚 2国を比較</h2>
        {live && <p className="cmp-live">為替は本日の実勢レートで計算</p>}

        <div className="cmp-selectors">
          {picker(aId, setAId, '国A')}
          <span className="cmp-vs">VS</span>
          {picker(bId, setBId, '国B')}
        </div>

        <table className="cmp-table">
          <thead>
            <tr>
              <th />
              <th>{a.name}</th>
              <th>{b.name}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <th scope="row">{r.label}</th>
                <td>{r.get(a)}</td>
                <td>{r.get(b)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cmp-prices">
          {[a, b].map((c) => (
            <div className="cmp-prices__col" key={c.id}>
              <h3 className="cmp-prices__title">{c.name}の物価</h3>
              <ul>
                {c.prices.map((p) => (
                  <li key={p.label}>
                    <span>{p.label}</span>
                    <span>{p.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
