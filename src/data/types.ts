// アジア弾丸トラベルマップ — データ型（単一の定義元）

export type HeritageKind = 'cultural' | 'natural' | 'mixed'

export type HeritageSite = {
  name: string
  kind: HeritageKind
  coords: [number, number] // [lat, lng]
  inscribedYear: number
  note: string // 一覧用の短い説明
  detail: string // 選択時に開く詳しい解説
}

// 地域グループ（地図の色分け・並び替え用）
export type Region = 'southeast' | 'east' | 'south' | 'central' | 'westasia'

// 予算レベル（1=激安 〜 4=高い）。地図のフィルタに使う。
export type BudgetLevel = 1 | 2 | 3 | 4

export type PriceItem = { label: string; value: string }
export type ReligionShare = { name: string; percent: number }
export type MajorCity = { name: string; role: string }

export type Country = {
  id: string
  name: string
  nameEn: string
  region: Region
  capital: string
  coords: [number, number] // 国ピンの位置（首都）

  // お金まわり
  budgetLevel: BudgetLevel
  dailyBudget: string // 1日予算の目安（円）
  currency: string // 'バーツ (THB)'
  currencyCode: string // 'THB'
  jpyPerUnit: number // 現地通貨1単位 ≈ 何円（概算）
  prices: PriceItem[] // ローカル飯・水・ビール・宿・交通 の目安

  // 基本情報
  population: string
  languages: string[]
  englishLevel: string // 英語の通じやすさ（一言）
  religions: ReligionShare[] // 宗教の割合
  visaJp: string // 日本パスポートでの入国（概要・要確認）
  bestSeason: string
  simNote: string
  safety: string

  // 移動・都市
  majorCities: MajorCity[] // 首都＋主要都市（遊ぶならここ等）
  airportAccess: string // 空港→市内アクセス

  // 読み物・体験
  summary: string
  culture: string
  uniqueExperiences: string[] // この国ならではの遊び・名物体験
  highlights: string[]
  heritageSites: HeritageSite[]
}
