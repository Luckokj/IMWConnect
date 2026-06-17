import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase web config. I filled values based on the project info you provided.
// PLEASE verify these values in the Firebase Console and replace placeholders if needed.
const firebaseConfig = {
  apiKey: "AIzaSyCH5OcW2eVBG-PH-XusUKEQdlHX9MNXd1U",
  authDomain: "projetoimw.firebaseapp.com",
  projectId: "projetoimw",
  storageBucket: "projetoimw.appspot.com",
  messagingSenderId: "1001940676167",
  appId: "1:1001940676167:web:REPLACE_WITH_YOUR_APP_ID",
};

let app;
try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
} catch (err) {
  // Don't throw during import; warn instead so developer can fill config.
  // eslint-disable-next-line no-console
  console.warn('Firebase init error:', err && err.message ? err.message : err);
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
