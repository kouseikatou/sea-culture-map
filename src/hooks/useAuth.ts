import { useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { auth } from '../lib/firebase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!auth) return
    return onAuthStateChanged(auth, setUser)
  }, [])

  const login = async () => {
    if (auth) await signInWithPopup(auth, new GoogleAuthProvider())
  }
  const logout = async () => {
    if (auth) await signOut(auth)
  }

  return { user, login, logout, available: !!auth }
}
