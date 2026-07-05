import { useCallback, useEffect, useRef, useState } from 'react'
import { SeaMap } from './components/SeaMap'
import { CountryPanel } from './components/CountryPanel'
import { useSelectedCountry } from './hooks/useSelectedCountry'

// 予算フィルタ（この予算レベル以下の国を強調）
const BUDGET_FILTERS: { label: string; value: number | null }[] = [
  { label: 'すべて', value: null },
  { label: '激安だけ', value: 1 },
  { label: '〜安い', value: 2 },
  { label: '〜ふつう', value: 3 },
]

// ピンの色 = 予算レベルの凡例
const BUDGET_LEGEND = [
  { level: 1, label: '激安' },
  { level: 2, label: '安い' },
  { level: 3, label: 'ふつう' },
  { level: 4, label: '高い' },
]

export default function App() {
  const { selected, select } = useSelectedCountry()
  const [activeHeritage, setActiveHeritage] = useState<string | null>(null)
  const [maxBudget, setMaxBudget] = useState<number | null>(null)

  // 国が切り替わったら世界遺産の選択をリセット
  const prevCountry = useRef(selected?.id)
  useEffect(() => {
    if (selected?.id !== prevCountry.current) {
      setActiveHeritage(null)
      prevCountry.current = selected?.id
    }
  }, [selected])

  const selectCountry = useCallback(
    (id: string | null) => {
      select(id)
      setActiveHeritage(null)
    },
    [select],
  )

  const toggleHeritage = useCallback((name: string) => {
    setActiveHeritage((prev) => (prev === name ? null : name))
  }, [])

  const selectHeritageFromMap = useCallback(
    (countryId: string, name: string) => {
      if (selected?.id !== countryId) select(countryId)
      setActiveHeritage(name)
    },
    [selected, select],
  )

  return (
    <div className="app">
      <SeaMap
        selected={selected}
        activeHeritage={activeHeritage}
        maxBudget={maxBudget}
        onSelectCountry={selectCountry}
        onSelectHeritage={selectHeritageFromMap}
      />

      <header className="masthead">
        <p className="masthead__eyebrow">Asia Backpacker Map</p>
        <h1 className="masthead__title">アジア弾丸トラベルマップ</h1>
        <p className="masthead__sub">
          国のピンをクリックすると、物価・両替・空港アクセス・ビザ・遊びが分かります。予算で絞って「行ける国」を探そう。
        </p>
      </header>

      {/* 予算フィルタ */}
      <div className="controls" role="group" aria-label="予算で絞る">
        <span className="controls__label">予算で絞る</span>
        <div className="segmented">
          {BUDGET_FILTERS.map((f) => (
            <button
              key={f.label}
              className={`segmented__btn${maxBudget === f.value ? ' is-on' : ''}`}
              onClick={() => setMaxBudget(f.value)}
              aria-pressed={maxBudget === f.value}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 凡例（ピンの色＝予算） */}
      <div className="legend" aria-label="ピンの色（予算の目安）">
        {BUDGET_LEGEND.map((l) => (
          <span className="legend__item" key={l.level}>
            <span className="legend__dot" data-level={l.level} />
            {l.label}
          </span>
        ))}
      </div>

      <CountryPanel
        country={selected}
        activeHeritage={activeHeritage}
        onClose={() => selectCountry(null)}
        onToggleHeritage={toggleHeritage}
      />
    </div>
  )
}
