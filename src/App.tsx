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

  return (
    <div className="app">
      <SeaMap selected={selected} onSelectCountry={(id) => select(id)} />

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

      <CountryPanel country={selected} onClose={() => select(null)} />
    </div>
  )
}
