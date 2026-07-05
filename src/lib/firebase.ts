import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAuth, type Auth } from 'firebase/auth'
import { firebaseConfig, firebaseEnabled } from '../config'

// 設定がそろっている時だけ初期化。未設定ならローカル保存にフォールバックする。
let app: FirebaseApp | undefined
let db: Firestore | undefined
let auth: Auth | undefined

if (firebaseEnabled) {
  app = initializeApp({
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
  })
  db = getFirestore(app)
  auth = getAuth(app)
}

export { db, auth, firebaseEnabled }
