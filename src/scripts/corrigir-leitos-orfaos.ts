// src/scripts/corrigir-leitos-orfaos.ts
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  writeBatch,
} from "firebase/firestore";
import { config } from "dotenv";
config();

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
});

const db = getFirestore(app);

async function corrigir() {
  // 1. Busca todas as enfermarias existentes
  const enfermariaSnap = await getDocs(collection(db, "enfermarias"));
  const enfermariaIds = new Set(enfermariaSnap.docs.map((d) => d.id));

  // 2. Busca todos os leitos
  const leitosSnap = await getDocs(collection(db, "leitos"));

  // 3. Filtra os órfãos
  const orfaos = leitosSnap.docs.filter((d) => {
    const enfermariaId = d.data().enfermariaId;
    return !enfermariaId || !enfermariaIds.has(enfermariaId);
  });

  if (orfaos.length === 0) {
    console.log("Nenhum leito órfão encontrado.");
    return;
  }

  // 4. Lista o que será deletado
  console.log(`\n${orfaos.length} leitos órfãos encontrados:\n`);
  orfaos.forEach((d) => {
    console.log(
      `  Leito ${d.data().codigo} (${d.id}) → enfermariaId: "${d.data().enfermariaId}"`,
    );
  });

  // 5. Confirmação manual antes de deletar
  console.log("\nIniciando deleção em batch...");

  // Divide em grupos de 500 — limite do Firestore por batch
  const grupos: (typeof orfaos)[] = [];
  for (let i = 0; i < orfaos.length; i += 500) {
    grupos.push(orfaos.slice(i, i + 500));
  }

  for (const grupo of grupos) {
    const batch = writeBatch(db);
    grupo.forEach((d) => batch.delete(doc(db, "leitos", d.id)));
    await batch.commit();
  }

  console.log(`\n✅ ${orfaos.length} leitos órfãos deletados permanentemente.`);
}

corrigir().catch(console.error);
