import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCm2L5dkL3DlCmCGE9f-B4Fy2s_t1H6cL0",
  authDomain: "a2-avito.firebaseapp.com",
  projectId: "a2-avito",
  storageBucket: "a2-avito.firebasestorage.app",
  messagingSenderId: "286867399069",
  appId: "1:286867399069:web:5cb5a59c8c8ee4b37b4f74",
  measurementId: "G-J54F04YH0Y"
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
