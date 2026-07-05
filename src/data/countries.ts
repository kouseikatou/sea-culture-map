// アジア弾丸トラベルマップ — 全データの集約点
// 地域別ファイルを結合し、型も再エクスポートする（既存の import パスを維持）。

export type {
  Country,
  HeritageSite,
  HeritageKind,
  Region,
  BudgetLevel,
  PriceItem,
  ReligionShare,
  MajorCity,
} from './types'

import type { Country } from './types'
import { southeastAsia } from './regions/southeast'
import { eastAsia } from './regions/east'
import { southAsia } from './regions/south'
import { centralAsia } from './regions/central'

export const countries: Country[] = [
  ...southeastAsia,
  ...eastAsia,
  ...southAsia,
  ...centralAsia,
]
