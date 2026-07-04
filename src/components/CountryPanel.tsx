import { useEffect, useRef } from 'react'
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

type Props = {
  country: Country | null
  onClose: () => void
}

export function CountryPanel({ country, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
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

            <div className="panel__scroll">
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
                <div className="heritage-list">
                  {country.heritageSites.map((site) => (
                    <div
                      key={site.name}
                      className="heritage-card"
                      data-kind={site.kind}
                    >
                      <div className="heritage-card__top">
                        <span className="badge" data-kind={site.kind}>
                          {KIND_LABEL[site.kind]}
                        </span>
                        <span className="badge__year">{site.inscribedYear}年登録</span>
                      </div>
                      <div className="heritage-card__name">{site.name}</div>
                      <p className="heritage-card__note">{site.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  )
}
