import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import type {
  BudgetLevel,
  Country,
  HeritageKind,
} from '../data/countries'
import { useRates } from '../hooks/useRates'

// Firestore(firebase) は重いので、パネルを開いた時だけ遅延ロードする
const TipsSection = lazy(() =>
  import('./TipsSection').then((m) => ({ default: m.TipsSection })),
)

const KIND_LABEL: Record<HeritageKind, string> = {
  cultural: '文化遺産',
  natural: '自然遺産',
  mixed: '複合遺産',
}

const BUDGET_LABEL: Record<BudgetLevel, string> = {
  1: '激安',
  2: '安い',
  3: 'ふつう',
  4: '高い',
}

function BudgetBadge({ level }: { level: BudgetLevel }) {
  return (
    <span className="budget-badge" data-level={level}>
      <span className="budget-badge__marks">
        {'¥'.repeat(level)}
        <span className="budget-badge__marks-dim">{'¥'.repeat(4 - level)}</span>
      </span>
      {BUDGET_LABEL[level]}
    </span>
  )
}

function Fact({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`fact${wide ? ' fact--wide' : ''}`}>
      <p className="fact__label">{label}</p>
      <div className="fact__value">{value}</div>
    </div>
  )
}

/** 現地通貨 ⇄ 円 の簡易電卓 */
function CurrencyConverter({
  code,
  jpyPerUnit,
}: {
  code: string
  jpyPerUnit: number
}) {
  const [local, setLocal] = useState('1000')
  const { getJpy, live, updatedAt } = useRates()
  const rate = getJpy(code, jpyPerUnit)

  const jpy = useMemo(() => {
    const n = parseFloat(local.replace(/,/g, ''))
    if (!isFinite(n)) return ''
    const v = n * rate
    return v >= 100 ? Math.round(v).toLocaleString() : v.toFixed(1)
  }, [local, rate])

  const rateLabel = rate >= 1 ? rate.toFixed(2) : Number(rate.toPrecision(2)).toString()

  return (
    <div className="converter">
      <div className="converter__row">
        <input
          className="converter__input"
          inputMode="decimal"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          aria-label={`${code}の金額`}
        />
        <span className="converter__unit">{code}</span>
        <span className="converter__eq">≈</span>
        <span className="converter__result">{jpy}</span>
        <span className="converter__unit">円</span>
      </div>
      <p className="converter__note">
        1 {code} ≈ {rateLabel}円{' '}
        {live ? (
          <span className="converter__live">● 本日のレート{updatedAt ? `（${updatedAt}）` : ''}</span>
        ) : (
          '（概算・相場は変動します）'
        )}
      </p>
    </div>
  )
}

/** 宗教の割合バー */
function ReligionBars({
  religions,
}: {
  religions: { name: string; percent: number }[]
}) {
  return (
    <div className="religions">
      {religions.map((r) => (
        <div className="religion" key={r.name}>
          <div className="religion__head">
            <span className="religion__name">{r.name}</span>
            <span className="religion__pct">{r.percent}%</span>
          </div>
          <div className="religion__track">
            <div className="religion__fill" style={{ width: `${r.percent}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

/** 詳細解説を音声で読み上げるボタン（Web Speech API） */
function SpeakButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false)
  const supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel()
    }
  }, [supported])

  if (!supported) return null

  const toggle = () => {
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'ja-JP'
    utter.rate = 1
    utter.onend = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(utter)
  }

  return (
    <button type="button" className="speak-btn" onClick={toggle} aria-pressed={speaking}>
      <span className="speak-btn__icon" aria-hidden="true">
        {speaking ? '◼' : '▶'}
      </span>
      {speaking ? '停止' : '音声で聞く'}
    </button>
  )
}

type Props = {
  country: Country | null
  activeHeritage: string | null
  onClose: () => void
  onToggleHeritage: (name: string) => void
}

export function CountryPanel({
  country,
  activeHeritage,
  onClose,
  onToggleHeritage,
}: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isOpen = country !== null

  useEffect(() => {
    if (!isOpen) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!activeHeritage) return
    const el = scrollRef.current?.querySelector('.heritage-item.is-active')
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [activeHeritage])

  return (
    <>
      <div
        className={`scrim${isOpen ? ' is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`panel${isOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="false"
        aria-label={country ? `${country.name}の情報` : '国の情報'}
        aria-hidden={!isOpen}
      >
        {country && (
          <>
            <header className="panel__header">
              <button ref={closeRef} className="panel__close" onClick={onClose} aria-label="閉じる">
                ✕
              </button>
              <p className="panel__eyebrow">{country.nameEn}</p>
              <div className="panel__titlerow">
                <h2 className="panel__title">{country.name}</h2>
                <BudgetBadge level={country.budgetLevel} />
              </div>
              <p className="panel__summary">{country.summary}</p>
            </header>

            <div className="panel__scroll" ref={scrollRef}>
              {/* お金まわり */}
              <h3 className="section-title">💰 お金・物価</h3>
              <div className="money-card">
                <p className="money-card__budget">
                  <span>1日の目安予算</span>
                  <strong>{country.dailyBudget}</strong>
                </p>
                <CurrencyConverter code={country.currencyCode} jpyPerUnit={country.jpyPerUnit} />
                <ul className="price-list">
                  {country.prices.map((p) => (
                    <li key={p.label}>
                      <span className="price-list__label">{p.label}</span>
                      <span className="price-list__value">{p.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* みんなのTips（共有） */}
              <h3 className="section-title">💬 みんなのTips</h3>
              <Suspense fallback={<p className="tips__empty">読み込み中…</p>}>
                <TipsSection countryId={country.id} countryName={country.name} />
              </Suspense>

              {/* クイックファクト */}
              <h3 className="section-title">🧭 基本情報</h3>
              <div className="facts">
                <Fact label="首都" value={country.capital} />
                <Fact label="人口" value={country.population} />
                <Fact label="言語" value={country.languages.join('・')} />
                <Fact label="ベストシーズン" value={country.bestSeason} />
                <Fact label="ビザ(日本パスポート)" value={country.visaJp} wide />
                <Fact label="英語" value={country.englishLevel} wide />
                <Fact label="SIM・ネット" value={country.simNote} wide />
                <Fact label="治安・注意" value={country.safety} wide />
              </div>

              {/* 宗教の割合 */}
              <h3 className="section-title">🛐 宗教の割合</h3>
              <ReligionBars religions={country.religions} />

              {/* 主要都市 */}
              <h3 className="section-title">🏙 主要都市</h3>
              <ul className="cities">
                {country.majorCities.map((c) => (
                  <li className="city" key={c.name}>
                    <span className="city__name">{c.name}</span>
                    <span className="city__role">{c.role}</span>
                  </li>
                ))}
              </ul>

              {/* 空港アクセス */}
              <h3 className="section-title">✈️ 空港→市内</h3>
              <p className="access-text">{country.airportAccess}</p>

              {/* この国ならでは */}
              <h3 className="section-title">🎫 この国ならでは</h3>
              <ul className="highlights highlights--gold">
                {country.uniqueExperiences.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>

              {/* 文化・歴史 */}
              <h3 className="section-title">📖 文化・歴史</h3>
              <div className="culture-text">
                {country.culture.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* 見どころ */}
              <h3 className="section-title">📍 見どころ</h3>
              <ul className="highlights">
                {country.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>

              {/* 世界遺産 */}
              <h3 className="section-title">
                🏛 世界遺産
                <span className="section-title__count">{country.heritageSites.length}件</span>
              </h3>
              {country.heritageSites.length === 0 ? (
                <p className="heritage-empty">この国には、まだ世界遺産の登録はありません。</p>
              ) : (
                <>
                  <p className="heritage-hint">カードを選ぶと詳しい解説が開きます。</p>
                  <div className="heritage-list">
                    {country.heritageSites.map((site) => {
                      const active = activeHeritage === site.name
                      return (
                        <div
                          key={site.name}
                          className={`heritage-item${active ? ' is-active' : ''}`}
                          data-kind={site.kind}
                        >
                          <button
                            type="button"
                            className="heritage-header"
                            aria-expanded={active}
                            onClick={() => onToggleHeritage(site.name)}
                          >
                            <span className="heritage-card__top">
                              <span className="badge" data-kind={site.kind}>
                                {KIND_LABEL[site.kind]}
                              </span>
                              <span className="badge__year">{site.inscribedYear}年登録</span>
                            </span>
                            <span className="heritage-card__name">
                              {site.name}
                              <span className="heritage-card__chevron" aria-hidden="true">
                                {active ? '⌄' : '›'}
                              </span>
                            </span>
                            {!active && <span className="heritage-card__note">{site.note}</span>}
                          </button>

                          {active && (
                            <div className="heritage-detail">
                              <p className="heritage-detail__text">{site.detail}</p>
                              <SpeakButton text={`${site.name}。${site.detail}`} />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  )
}
