import { useCallback, useEffect, useRef, useState } from 'react'
import { SeaMap } from './components/SeaMap'
import { CountryPanel } from './components/CountryPanel'
import { useSelectedCountry } from './hooks/useSelectedCountry'

const LEGEND = [
  { kind: 'cultural', label: '文化遺産', varName: '--color-sea' },
  { kind: 'natural', label: '自然遺産', varName: '--color-jade' },
  { kind: 'mixed', label: '複合遺産', varName: '--color-plum' },
] as const

export default function App() {
  const { selected, select } = useSelectedCountry()
  // 選択中の世界遺産（同じ国の中で一意な name）
  const [activeHeritage, setActiveHeritage] = useState<string | null>(null)

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

  // パネル内カードのトグル（同じものをもう一度押すと閉じる）
  const toggleHeritage = useCallback((name: string) => {
    setActiveHeritage((prev) => (prev === name ? null : name))
  }, [])

  // 地図上の世界遺産ピンから選択（必要ならその国を開く）
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
        onSelectCountry={selectCountry}
        onSelectHeritage={selectHeritageFromMap}
      />

      <header className="masthead">
        <p className="masthead__eyebrow">Southeast Asia</p>
        <h1 className="masthead__title">東南アジア文化マップ</h1>
        <p className="masthead__sub">
          国のピンをクリックすると、文化・歴史・世界遺産がわかります。地図を拡大すると世界遺産の場所が表示されます。
        </p>
      </header>

      <div className="legend" aria-label="世界遺産の凡例">
        {LEGEND.map((l) => (
          <span className="legend__item" key={l.kind}>
            <span
              className="legend__dot"
              style={{ background: `var(${l.varName})` }}
            />
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
