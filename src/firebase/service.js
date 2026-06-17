import { collection, addDoc, getDocs, query, orderBy, where, serverTimestamp } from 'firebase/firestore';
import { db, storage } from './firebaseConfig';
import { ref as storageRef, uploadBytes, getDownloadURL, uploadString } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';

const usersCol = collection(db, 'users');
const postsCol = collection(db, 'posts');

async function signup({ nome, email, senha }) {
  if (!email || !senha || !nome) throw new Error('Campos obrigatórios');

  const q = query(usersCol, where('email', '==', email));
  const snap = await getDocs(q);
  if (!snap.empty) throw new Error('Email já cadastrado');

  const user = { nome, email, senha, createdAt: serverTimestamp() };
  const ref = await addDoc(usersCol, user);
  return { id: ref.id, ...user };
}

async function login({ emailOrNome, senha }) {
  if (emailOrNome === 'adm' && senha === '123') {
    return { id: 'local-admin', nome: 'adm', email: 'adm', isAdmin: true };
  }

  let q = query(usersCol, where('email', '==', emailOrNome));
  let snap = await getDocs(q);
  if (snap.empty) {
    q = query(usersCol, where('nome', '==', emailOrNome));
    snap = await getDocs(q);
  }

  if (snap.empty) throw new Error('Usuário não encontrado');

  const docSnap = snap.docs[0];
  const data = docSnap.data();
  if (data.senha !== senha) throw new Error('Senha incorreta');

  return { id: docSnap.id, nome: data.nome, email: data.email, isAdmin: !!data.isAdmin };
}

async function addPost({ title, text, imageFile, imageUrl, imageUri, authorId, authorName }) {
  if (!title || !text) throw new Error('Título e texto são obrigatórios');

  let finalImageUrl = null;

  // If an imageFile (Blob / File) is provided, upload to Firebase Storage
  if (imageFile) {
    const filename = `posts/${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const ref = storageRef(storage, filename);
    await uploadBytes(ref, imageFile);
    finalImageUrl = await getDownloadURL(ref);
  } else if (imageUri) {
    // If imageUri is a remote URL, keep it. If it's a local uri (file:// or content://), try to upload.
    if (/^https?:\/\//i.test(imageUri)) {
      finalImageUrl = imageUri;
    } else {
      // first try fetch -> arrayBuffer -> uploadBytes
      try {
        const response = await fetch(imageUri);
        if (!response.ok) throw new Error('fetch failed');
        const arrayBuffer = await response.arrayBuffer();
        const arr = new Uint8Array(arrayBuffer);
        const filename = `posts/${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const ref = storageRef(storage, filename);
        await uploadBytes(ref, arr);
        finalImageUrl = await getDownloadURL(ref);
      } catch (err) {
        // fallback: try expo-file-system base64 upload
        try {
          const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
          const filename = `posts/${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
          const ref = storageRef(storage, filename);
          await uploadString(ref, base64, 'base64');
          finalImageUrl = await getDownloadURL(ref);
        } catch (err2) {
          // final fallback: keep original uri (may not be reachable externally)
          finalImageUrl = imageUri;
        }
      }
    }
  } else if (imageUrl) {
    // legacy param: if an http(s) imageUrl is provided, accept it
    if (/^https?:\/\//i.test(imageUrl)) finalImageUrl = imageUrl;
    else finalImageUrl = null;
  }

  const post = { title, text, imageUrl: finalImageUrl, authorId: authorId || null, authorName: authorName || 'adm', createdAt: serverTimestamp() };
  const ref = await addDoc(postsCol, post);
  return { id: ref.id, ...post };
}

async function getPosts() {
  const q = query(postsCol, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export { signup, login, addPost, getPosts };
