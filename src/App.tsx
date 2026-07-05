import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { SeaMap } from './components/SeaMap'
import { CountryPanel } from './components/CountryPanel'
import { CompareView } from './components/CompareView'
import { useSelectedCountry } from './hooks/useSelectedCountry'
import { countries } from './data/countries'
import { mapsEnabled } from './config'

// Google Maps(vis.gl) は鍵がある時だけ使うので遅延ロード
const GoogleMap = lazy(() =>
  import('./components/GoogleMap').then((m) => ({ default: m.GoogleMap })),
)

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
  const [compareOpen, setCompareOpen] = useState(false)

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
      {mapsEnabled ? (
        <Suspense fallback={null}>
          <GoogleMap
            selected={selected}
            activeHeritage={activeHeritage}
            maxBudget={maxBudget}
            onSelectCountry={selectCountry}
            onSelectHeritage={selectHeritageFromMap}
          />
        </Suspense>
      ) : (
        <SeaMap
          selected={selected}
          activeHeritage={activeHeritage}
          maxBudget={maxBudget}
          onSelectCountry={selectCountry}
          onSelectHeritage={selectHeritageFromMap}
        />
      )}

      <header className="masthead">
        <p className="masthead__eyebrow">Asia Backpacker Map</p>
        <h1 className="masthead__title">アジア弾丸トラベルマップ</h1>
        <p className="masthead__sub">
          国のピンをクリックすると、物価・両替・空港アクセス・ビザ・遊びが分かります。予算で絞って「行ける国」を探そう。
        </p>
      </header>

      {/* 予算フィルタ＋比較 */}
      <div className="controls" role="group" aria-label="地図の操作">
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
        <button className="compare-btn" onClick={() => setCompareOpen(true)}>
          🆚 2国を比較
        </button>
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

      {compareOpen && (
        <CompareView
          countries={countries}
          initialA={selected?.id ?? null}
          onClose={() => setCompareOpen(false)}
        />
      )}
    </div>
  )
}
