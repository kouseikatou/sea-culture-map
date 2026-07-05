import { useCallback, useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  type Timestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export type Tip = {
  id: string
  countryId: string
  category: string
  text: string
  authorName: string
  authorId: string
  createdAt: number // epoch ms
}

export type NewTip = Omit<Tip, 'id' | 'createdAt'>

const TIPS = 'tips'
const MAX = 50

function localKey(countryId: string) {
  return `tips:${countryId}`
}

function readLocal(countryId: string): Tip[] {
  try {
    const raw = localStorage.getItem(localKey(countryId))
    return raw ? (JSON.parse(raw) as Tip[]) : []
  } catch {
    return []
  }
}

/**
 * 旅先のナレッジ（Tips）を国ごとに読み書きする。
 * Firestore が有効なら共有DB、無ければ端末ローカル保存にフォールバック。
 */
export function useTips(countryId: string) {
  const mode: 'firestore' | 'local' = db ? 'firestore' : 'local'
  const [tips, setTips] = useState<Tip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (!db) {
      setTips(readLocal(countryId).sort((a, b) => b.createdAt - a.createdAt))
      setLoading(false)
      return
    }
    const q = query(
      collection(db, TIPS),
      where('countryId', '==', countryId),
      orderBy('createdAt', 'desc'),
      limit(MAX),
    )
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows: Tip[] = snap.docs.map((d) => {
          const data = d.data()
          const ts = data.createdAt as Timestamp | null
          return {
            id: d.id,
            countryId: data.countryId,
            category: data.category,
            text: data.text,
            authorName: data.authorName,
            authorId: data.authorId,
            createdAt: ts ? ts.toMillis() : Date.now(),
          }
        })
        setTips(rows)
        setLoading(false)
      },
      () => setLoading(false),
    )
    return unsub
  }, [countryId])

  const addTip = useCallback(
    async (t: NewTip) => {
      if (db) {
        await addDoc(collection(db, TIPS), {
          ...t,
          createdAt: serverTimestamp(),
        })
        return
      }
      // ローカル保存
      const tip: Tip = { ...t, id: crypto.randomUUID(), createdAt: Date.now() }
      const next = [tip, ...readLocal(countryId)].slice(0, MAX)
      localStorage.setItem(localKey(countryId), JSON.stringify(next))
      setTips(next)
    },
    [countryId],
  )

  return { tips, addTip, mode, loading }
}
