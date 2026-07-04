import { useEffect, useRef, useState } from 'react'
import type { Country, HeritageKind } from '../data/countries'

const KIND_LABEL: Record<HeritageKind, string> = {
  cultural: '文化遺産',
  natural: '自然遺産',
  mixed: '複合遺産',
}

function Fact({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`fact${wide ? ' fact--wide' : ''}`}>
      <p className="fact__label">{label}</p>
      <div className="fact__value">{value}</div>
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
    <button
      type="button"
      className="speak-btn"
      onClick={toggle}
      aria-pressed={speaking}
    >
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

  // 開いたら閉じるボタンにフォーカス、Esc で閉じる
  useEffect(() => {
    if (!isOpen) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // 選択された世界遺産カードをパネル内で見える位置へスクロール
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
              <button
                ref={closeRef}
                className="panel__close"
                onClick={onClose}
                aria-label="閉じる"
              >
                ✕
              </button>
              <p className="panel__eyebrow">{country.nameEn}</p>
              <h2 className="panel__title">{country.name}</h2>
              <p className="panel__summary">{country.summary}</p>
            </header>

            <div className="panel__scroll" ref={scrollRef}>
              <div className="facts">
                <Fact label="首都" value={country.capital} />
                <Fact label="人口" value={country.population} />
                <Fact label="言語" value={country.languages.join('・')} />
                <Fact label="通貨" value={country.currency} />
                <Fact label="主な宗教" value={country.religion} wide />
              </div>

              <h3 className="section-title">文化・歴史</h3>
              <div className="culture-text">
                {country.culture.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <h3 className="section-title">見どころ</h3>
              <ul className="highlights">
                {country.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>

              <h3 className="section-title">
                世界遺産
                <span className="section-title__count">
                  {country.heritageSites.length}件
                </span>
              </h3>
              {country.heritageSites.length === 0 ? (
                <p className="heritage-empty">
                  この国には、まだ世界遺産の登録はありません。
                </p>
              ) : (
                <>
                  <p className="heritage-hint">
                    カードを選ぶと詳しい解説が開きます。
                  </p>
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
                              <span className="badge__year">
                                {site.inscribedYear}年登録
                              </span>
                            </span>
                            <span className="heritage-card__name">
                              {site.name}
                              <span className="heritage-card__chevron" aria-hidden="true">
                                ›
                              </span>
                            </span>
                            {!active && (
                              <span className="heritage-card__note">{site.note}</span>
                            )}
                          </button>

                          {active && (
                            <div className="heritage-detail">
                              <p className="heritage-detail__text">{site.detail}</p>
                              <SpeakButton
                                text={`${site.name}。${site.detail}`}
                              />
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
