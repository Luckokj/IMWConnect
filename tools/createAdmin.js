#!/usr/bin/env node
/*
  Script para criar/atualizar um usuário admin no Firebase Auth usando Admin SDK

  Uso:
    - Coloque seu serviceAccount JSON em: ./tools/serviceAccountKey.json
    - Execute:
        node tools/createAdmin.js --email adm@example.com --password 123 --displayName adm

    Ou use variáveis de ambiente:
        SERVICE_ACCOUNT=./tools/serviceAccountKey.json ADMIN_EMAIL=adm@example.com ADMIN_PASSWORD=123 node tools/createAdmin.js

  O script:
    - inicializa o Admin SDK com a service account
    - cria o usuário (se não existir) ou atualiza (se existir)
    - seta custom claim { isAdmin: true }
    - cria/atualiza documento na coleção `users` com isAdmin: true

  ATENÇÃO: NÃO comete o serviceAccount JSON a repositórios públicos.
*/

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

function getArg(name, fallback) {
  const idx = process.argv.indexOf(name);
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return fallback;
}

const serviceAccountPath = getArg('--serviceAccount') || process.env.SERVICE_ACCOUNT || path.join(__dirname, 'serviceAccountKey.json');
const email = getArg('--email') || process.env.ADMIN_EMAIL || 'adm@example.com';
const password = getArg('--password') || process.env.ADMIN_PASSWORD || '123';
const displayName = getArg('--displayName') || process.env.ADMIN_NAME || 'adm';

if (!fs.existsSync(serviceAccountPath)) {
  console.error('serviceAccountKey.json não encontrado em:', serviceAccountPath);
  console.error('Coloque o JSON do service account em tools/serviceAccountKey.json ou passe o caminho via --serviceAccount');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

(async () => {
  try {
    let userRecord = null;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
      console.log('Usuário já existe. UID:', userRecord.uid);
      // atualiza displayName e senha
      await admin.auth().updateUser(userRecord.uid, { displayName, password });
      userRecord = await admin.auth().getUser(userRecord.uid);
    } catch (err) {
      // se não existir, cria
      console.log('Criando usuário:', email);
      userRecord = await admin.auth().createUser({ email, password, displayName });
      console.log('Usuário criado. UID:', userRecord.uid);
    }

    // set custom claim isAdmin
    await admin.auth().setCustomUserClaims(userRecord.uid, { isAdmin: true });
    console.log('Custom claim { isAdmin: true } aplicado para UID:', userRecord.uid);

    // cria/atualiza documento na collection users
    const db = admin.firestore();
    // Store a users document compatible with the app's existing login logic.
    // NOTE: storing passwords in plaintext is insecure — this is for compatibility/demo only.
    await db.collection('users').doc(userRecord.uid).set({
      nome: displayName,
      email: email,
      senha: password,
      isAdmin: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log('Documento users/%s criado/atualizado.', userRecord.uid);

    console.log('\nPronto. Agora o usuário é admin (isAdmin).');
    console.log('Obs: o token do usuário só refletirá custom claims depois que ele fizer login novamente (client-side).');
    process.exit(0);
  } catch (err) {
    console.error('Erro durante criação do admin:', err);
    process.exit(2);
  }
})();
