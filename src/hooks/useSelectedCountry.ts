import { useCallback, useEffect, useState } from 'react'
import { countries, type Country } from '../data/countries'

const PARAM = 'country'

function readParam(): string | null {
  const id = new URLSearchParams(window.location.search).get(PARAM)
  return id && countries.some((c) => c.id === id) ? id : null
}

/**
 * 選択中の国を URL の ?country=<id> と同期する。
 * - リロード・共有で状態を再現できる（URL as state）
 * - 戻る/進むボタンにも追従する
 */
export function useSelectedCountry() {
  const [selectedId, setSelectedId] = useState<string | null>(readParam)

  // ブラウザの戻る/進むに追従
  useEffect(() => {
    const onPop = () => setSelectedId(readParam())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const select = useCallback((id: string | null) => {
    setSelectedId(id)
    const url = new URL(window.location.href)
    if (id) url.searchParams.set(PARAM, id)
    else url.searchParams.delete(PARAM)
    window.history.pushState({}, '', url)
  }, [])

  const selected: Country | null =
    countries.find((c) => c.id === selectedId) ?? null

  return { selected, select }
}
