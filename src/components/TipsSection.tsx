import { useState } from 'react'
import { useTips } from '../hooks/useTips'
import { useAuth } from '../hooks/useAuth'

const CATEGORIES = ['宿', '治安', 'グルメ', '交通', '裏スポット', 'その他'] as const
const MAX_LEN = 400

function timeAgo(ms: number) {
  const s = Math.floor((Date.now() - ms) / 1000)
  if (s < 60) return 'たった今'
  if (s < 3600) return `${Math.floor(s / 60)}分前`
  if (s < 86400) return `${Math.floor(s / 3600)}時間前`
  if (s < 2592000) return `${Math.floor(s / 86400)}日前`
  return new Date(ms).toLocaleDateString('ja-JP')
}

type Props = { countryId: string; countryName: string }

export function TipsSection({ countryId, countryName }: Props) {
  const { tips, addTip, mode, loading } = useTips(countryId)
  const { user, login, logout } = useAuth()

  const [category, setCategory] = useState<string>(CATEGORIES[0])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  const canPost = mode === 'local' || !!user

  const submit = async () => {
    const body = text.trim()
    if (!body || sending) return
    setSending(true)
    try {
      await addTip({
        countryId,
        category,
        text: body.slice(0, MAX_LEN),
        authorName: user?.displayName ?? 'このデバイス',
        authorId: user?.uid ?? 'local',
      })
      setText('')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="tips">
      <p className="tips__lead">
        {countryName}に行った人の生の情報。おすすめ宿・詐欺・裏スポット・相場感など。
        {mode === 'local' && (
          <span className="tips__mode"> ※現在この端末にのみ保存（共有は準備中）</span>
        )}
      </p>

      {/* 投稿フォーム */}
      {canPost ? (
        <div className="tip-form">
          <div className="tip-form__row">
            <select
              className="tip-form__cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="カテゴリ"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {mode === 'firestore' && user && (
              <span className="tip-form__me">
                {user.displayName}
                <button className="tip-form__logout" onClick={logout}>
                  ログアウト
                </button>
              </span>
            )}
          </div>
          <textarea
            className="tip-form__text"
            value={text}
            maxLength={MAX_LEN}
            placeholder="例：〇〇のゲストハウスが安くて清潔。空港タクシーは白タクに注意…"
            onChange={(e) => setText(e.target.value)}
          />
          <div className="tip-form__actions">
            <span className="tip-form__count">
              {text.length}/{MAX_LEN}
            </span>
            <button
              className="tip-form__submit"
              onClick={submit}
              disabled={!text.trim() || sending}
            >
              {sending ? '投稿中…' : '投稿する'}
            </button>
          </div>
        </div>
      ) : (
        <button className="tips__login" onClick={login}>
          Googleでログインして投稿
        </button>
      )}

      {/* 一覧 */}
      {loading ? (
        <p className="tips__empty">読み込み中…</p>
      ) : tips.length === 0 ? (
        <p className="tips__empty">
          まだ投稿がありません。最初のナレッジを共有しよう！
        </p>
      ) : (
        <ul className="tip-list">
          {tips.map((t) => (
            <li className="tip" key={t.id}>
              <div className="tip__head">
                <span className="tip__cat">{t.category}</span>
                <span className="tip__author">{t.authorName}</span>
                <span className="tip__time">{timeAgo(t.createdAt)}</span>
              </div>
              <p className="tip__text">{t.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
