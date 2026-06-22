import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'

// 🔥 ЗАМЕНИ НА СВОИ ДАННЫЕ ИЗ FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Сохранить данные
export async function saveData(data) {
  try {
    await setDoc(doc(db, 'a2', 'main'), { data: JSON.stringify(data) })
  } catch (e) {
    console.error('Save error:', e)
  }
}

// Загрузить данные
export async function loadData() {
  try {
    const snap = await getDoc(doc(db, 'a2', 'main'))
    if (snap.exists()) {
      return JSON.parse(snap.data().data)
    }
  } catch (e) {
    console.error('Load error:', e)
  }
  return null
}
