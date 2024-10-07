//----------------------------------------------------------------
// firebase初期化処理
//----------------------------------------------------------------
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// firebaseプロジェクトとの通信用インスタンス生成
const app = initializeApp(firebaseConfig)

// インスタンス取得
export const auth = getAuth(app)