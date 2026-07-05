// 環境変数から鍵を読む集約点。鍵はコミットせず、ビルド時に注入する。
// 未設定なら Google Maps は Leaflet にフォールバック、共有は端末ローカル保存に切替。

const env = import.meta.env

export const googleMapsKey = env.VITE_GOOGLE_MAPS_API_KEY as string | undefined
export const googleMapsMapId = env.VITE_GOOGLE_MAPS_MAP_ID as string | undefined

// AdvancedMarker には Map ID が要るため、両方そろって初めて有効化。
export const mapsEnabled = Boolean(googleMapsKey && googleMapsMapId)

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: env.VITE_FIREBASE_APP_ID as string | undefined,
}

export const firebaseEnabled = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
)
