// src/scripts/add-exibir-resumo.ts
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  writeBatch,
  doc,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { config } from "dotenv";

config();

const USE_EMULATOR = process.env.VITE_USE_EMULATOR === "true";

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
});

const db = getFirestore(app);

if (USE_EMULATOR) {
  connectFirestoreEmulator(db, "localhost", 8080);
  console.log("⚡ Usando emulator local\n");
} else {
  console.log("⚠️  ATENÇÃO: Gravando em PRODUÇÃO");
  console.log(`Projeto: ${process.env.VITE_FIREBASE_PROJECT_ID}\n`);
  await new Promise((resolve) => setTimeout(resolve, 3000));
}

async function addExibirResumo() {
  const snap = await getDocs(collection(db, "enfermarias"));

  if (snap.empty) {
    console.log("Nenhuma enfermaria encontrada.");
    return;
  }

  // Divide em grupos de 500 — limite do batch
  const grupos: (typeof snap.docs)[] = [];
  for (let i = 0; i < snap.docs.length; i += 500) {
    grupos.push(snap.docs.slice(i, i + 500));
  }

  for (const grupo of grupos) {
    const batch = writeBatch(db);
    grupo.forEach((d) => {
      batch.update(doc(db, "enfermarias", d.id), { exibirResumo: false });
    });
    await batch.commit();
  }

  console.log(
    `✅ Campo exibirResumo adicionado em ${snap.docs.length} enfermarias.`,
  );
}

addExibirResumo().catch(console.error);
