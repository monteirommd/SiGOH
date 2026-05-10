import { config } from "dotenv";
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  Timestamp,
  addDoc,
  collection,
} from "firebase/firestore";

config();

// Cole suas credenciais aqui diretamente — esse script não vai pro bundle
const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
});
const db = getFirestore(app);
const auth = getAuth(app);

const USUARIOS = [
  {
    email: "admin@sigoh.com",
    senha: "123456",
    nome: "Mateus Gestor",
    role: "GESTOR_ADMIN",
  },
  {
    email: "gestor@sigoh.com",
    senha: "123456",
    nome: "Carlos Base",
    role: "GESTOR_BASE",
  },
  {
    email: "tecnico@sigoh.com",
    senha: "123456",
    nome: "João Técnico",
    role: "TECNICO",
  },
  {
    email: "tecnico2@sigoh.com",
    senha: "123456",
    nome: "Maria Técnica",
    role: "TECNICO",
  },
];

const BLOCOS = [
  {
    nome: "Margaridas",
    enfermarias: [
      { nome: "ENF 01", leitos: 7 },
      { nome: "ENF 02", leitos: 10 },
      { nome: "ENF 03", leitos: 6 },
      { nome: "ENF 04", leitos: 8 },
      { nome: "Isolamento", leitos: 1 },
      { nome: "Pétals - NatOf", leitos: 3 },
      { nome: "Indígena", leitos: 2 },
    ],
  },
  {
    nome: "Rosas",
    enfermarias: [
      { nome: "ENF 01 PC", leitos: 7 },
      { nome: "ENF 02 PC", leitos: 7 },
      { nome: "ENF 03 PC", leitos: 7 },
      { nome: "ENF 04 PC", leitos: 7 },
      { nome: "ENF 05 PC", leitos: 7 },
      { nome: "ENF 06 PN", leitos: 9 },
      { nome: "ENF 07 PN", leitos: 7 },
      { nome: "ENF 08 PC", leitos: 5 },
      { nome: "ENF 09 PN", leitos: 7 },
      { nome: "ENF 10 PN", leitos: 5 },
      { nome: "ENF 11 PN", leitos: 6 },
    ],
  },
  {
    nome: "Girassois",
    enfermarias: [
      { nome: "ENF 01", leitos: 7 },
      { nome: "ENF 02", leitos: 7 },
      { nome: "ENF 03", leitos: 6 },
      { nome: "ENF 04", leitos: 7 },
      { nome: "ENF 05", leitos: 4 },
      { nome: "ENF 06", leitos: 7 },
      { nome: "ENF 07", leitos: 6 },
      { nome: "ENF 08", leitos: 6 },
    ],
  },
  {
    nome: "Azaleias",
    enfermarias: [
      { nome: "Respiratório", leitos: 3 },
      { nome: "PN / Foto", leitos: 4 },
      { nome: "Flores", leitos: 3 },
      { nome: "Foto / Resp", leitos: 5 },
      { nome: "RNS Patológicos", leitos: 5 },
      { nome: "PN / Foto 2", leitos: 7 },
      { nome: "ENF 07", leitos: 3 },
      { nome: "ENF 11", leitos: 6 },
    ],
  },
  {
    nome: "Bloco Cirúrgico",
    enfermarias: [
      { nome: "Pré-Op 01", leitos: 6 },
      { nome: "Pré-Op 02", leitos: 6 },
      { nome: "Recuperação", leitos: 8 },
      { nome: "UTI Cirúrgica", leitos: 5 },
    ],
  },
  {
    nome: "UTI Geral",
    enfermarias: [
      { nome: "UTI Adulto", leitos: 10 },
      { nome: "UTI Neonatal", leitos: 8 },
      { nome: "Semi-Intensivo", leitos: 12 },
      { nome: "Isolamento UTI", leitos: 4 },
    ],
  },
];

const STATUS = [
  "DISPONIVEL",
  "OCUPADO",
  "OCUPADO",
  "OCUPADO",
  "LIMPEZA",
  "BLOQUEADO",
] as const;

// Distribui status de forma variada mas realista (~60% ocupado)
function getStatus(index: number): string {
  return STATUS[index % STATUS.length];
}

async function seed() {
  // Seed Users
  for (const u of USUARIOS) {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        u.email,
        u.senha,
      );
      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        email: u.email,
        nome: u.nome,
        role: u.role,
        ativo: true,
      });
      console.log(`✅ Usuário: ${u.email} (${u.role})`);
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") {
        console.log(`⚠️  Usuário já existe: ${u.email}`);
      } else throw e;
    }
  }
  console.log("");

  console.log(
    "⚠️  Seed de blocos, enfermarias e leitos está desativada para evitar dados duplicados. USUARIOS RODOU.\n",
  );

  let totalBlocos = 0;
  let totalEnfermarias = 0;
  let totalLeitos = 0;
  let contadorLeito = 100; // numeração crescente global

  // Blocos → Enfermarias → Leitos
  for (const blocoData of BLOCOS) {
    const blocoRef = await addDoc(collection(db, "blocos"), {
      nome: blocoData.nome,
      ativo: true,
    });
    totalBlocos++;

    for (const enfData of blocoData.enfermarias) {
      const enfRef = await addDoc(collection(db, "enfermarias"), {
        nome: enfData.nome,
        blocoId: blocoRef.id,
        ativo: true,
      });
      totalEnfermarias++;

      for (let i = 0; i < enfData.leitos; i++) {
        await addDoc(collection(db, "leitos"), {
          codigo: String(contadorLeito),
          enfermariaId: enfRef.id,
          blocoId: blocoRef.id,
          status: getStatus(contadorLeito),
          atualizadoEm: Timestamp.now(),
          atualizadoPor: null,
        });
        contadorLeito++;
        totalLeitos++;
      }
    }

    console.log(
      `✅ Bloco "${blocoData.nome}" — ${blocoData.enfermarias.length} enfermarias`,
    );
  }

  console.log(`
  ╔════════════════════════════════════╗
  ║         Seed concluído             ║
  ╠════════════════════════════════════╣
  ║  Blocos:       ${String(totalBlocos).padEnd(20)}║
  ║  Enfermarias:  ${String(totalEnfermarias).padEnd(20)}║
  ║  Leitos:       ${String(totalLeitos).padEnd(20)}║
  ╠════════════════════════════════════╣
  ║  Credenciais de teste:             ║
  ║  admin@sigoh.com   / 123456        ║
  ║  gestor@sigoh.com      / 123456    ║
  ║  tecnico@sigoh.com  / 123456       ║
  ║  tecnico2@sigoh.com / 123456       ║
  ╚════════════════════════════════════╝
    `);
}

seed().catch(console.error);
