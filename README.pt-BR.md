<div align="center">

# SiGOH
### Sistema de Gestão de Ocupação Hospitalar

**Gestão de leitos em tempo real — feito para a operação, pensado para quem decide.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)

[🇺🇸 Read in English](./README.md)

</div>

---

## O Problema

Hospitais perdem visibilidade. Leitos ficam ociosos enquanto pacientes agueitam. A equipe atualiza planilhas em papel ou dashboards lentos de ERP. Gestores tomam decisões de capacidade com dados desatualizados.

O SiGOH resolve isso com um mapa de ocupação em tempo real que qualquer perfil do hospital pode consultar e operar — do técnico atualizando um leito no andar ao administrador planejando capacidade entre blocos inteiros.

---

## O Que Faz

O SiGOH é uma **aplicação web em produção** implantada em um hospital ativo, criada para substituir processos manuais de controle de leitos. Cada perfil tem uma interface construída especificamente para sua rotina:

| Perfil | Interface | Capacidades |
|--------|-----------|-------------|
| **Técnico** | Mobile | Atualizar status do leito, visualizar layout do bloco |
| **Gestor Base** | Dashboard desktop | Monitorar taxas de ocupação, visualizar analytics, executar apresentações |
| **Gestor Admin** | Suite desktop completa | Tudo acima + gerenciar usuários, blocos, enfermarias e leitos |

### Funcionalidades Principais

- **Mapa de Leitos ao Vivo** — Grade visual de todos os leitos em cada enfermaria, com código de cores por status, atualizada em tempo real em todas as sessões conectadas
- **Máquina de Estados de Status** — Leitos transitam por `DISPONÍVEL → OCUPADO → LIMPEZA → DISPONÍVEL`, com `BLOQUEADO` como estado terminal restrito ao admin
- **Analytics de Ocupação** — Gráficos com taxas de ocupação em tempo real e histórico por bloco, enfermaria e hospital, com limites visuais por cor (verde/amarelo/vermelho)
- **Modo Apresentação** — Carrossel automático de slides de ocupação projetado para rodar em TVs ou salas de reunião, dando à gestão uma visão ao vivo do hospital sem interação
- **Trilha de Auditoria Completa** — Cada alteração de status de leito é registrada com data, hora e nome de quem realizou
- **Controle de Acesso por Perfil** — Proteção de rotas, guards de permissão e renderização da interface controlados pelo perfil do usuário, aplicados tanto no cliente quanto via Firestore

---

## Stack Tecnológico

### Frontend
- **React 19** com componentes funcionais, hooks e Context API
- **TypeScript** — tipagem estrita em todo o projeto, incluindo os modelos de dados do Firestore
- **React Router 7** — roteamento declarativo com layouts protegidos por perfil
- **Tailwind CSS 4** + **shadcn/ui** + **Radix UI** — sistema de componentes acessíveis e composíveis
- **Recharts** — gráficos de pizza, barras e séries temporais de ocupação responsivos

### Backend & Infraestrutura
- **Firebase Firestore** — banco NoSQL em tempo real com índices compostos para queries performáticas
- **Firebase Auth** — autenticação por e-mail e senha com cache de sessão
- **Firebase Cloud Functions** — operações server-side (criação de usuários, fluxo de redefinição de senha)
- **Firebase Hosting** — deploy de SPA com regras de rewrite
- **Firebase Emulator Suite** — ambiente local completo espelhando a produção

### Ferramentas
- **Vite 7** — HMR sub-segundo e builds de produção otimizados
- **ESLint + TypeScript ESLint** — qualidade de código aplicada
- **Scripts de seed do Firestore** — configuração de dados reproduzível para produção e emulador

---

## Arquitetura

```
src/
├── pages/
│   ├── login/                  # Fluxo de autenticação
│   ├── desktop/
│   │   ├── dashboard/          # Multi-view: mapa, gráficos, tabela
│   │   ├── apresentacao/       # Modo carrossel de apresentação
│   │   └── gestao/             # Páginas admin CRUD (usuários, blocos, enfermarias, leitos)
│   └── mobile/
│       ├── home/               # Seleção de bloco para o técnico
│       └── bloco/              # Interface de atualização de status do leito
├── components/
│   ├── mapa/                   # Sistema de visualização do mapa de leitos
│   ├── graficos/               # Analytics de ocupação com Recharts
│   └── slides/                 # Componentes de slides de apresentação
├── context/
│   ├── auth-context.tsx        # Estado do Firebase Auth + perfil do usuário
│   └── app-data-context.tsx    # Listeners do Firestore em tempo real + Maps derivados
├── service/                    # CRUD no Firestore — um módulo por entidade
├── model/                      # Interfaces TypeScript para todas as entidades do domínio
└── utils/                      # Cálculos de ocupação, mapeamento de cores por status
```

### Modelo de Dados

```typescript
type StatusLeito = "DISPONIVEL" | "OCUPADO" | "LIMPEZA" | "BLOQUEADO"
type UserRole    = "TECNICO" | "GESTOR_BASE" | "GESTOR_ADMIN"

// Coleções Firestore: blocos → enfermarias → leitos
// Toda alteração de status grava em historico_leitos (log de auditoria)
```

---

## Destaques Técnicos

**Sincronização multi-usuário em tempo real sem polling** — o `AppDataContext` encapsula listeners `onSnapshot` do Firestore para todas as entidades, propagando atualizações ao vivo para todos os clientes conectados automaticamente. A limpeza é feita via unsubscribe do listener no unmount.

**Lookups O(1) em escala** — estruturas `Map<id, entity[]>` derivadas (ex: `leitosByBloco`, `leitosByEnfermaria`) são computadas com `useMemo` uma vez e reutilizadas em toda a árvore de componentes, evitando filtros repetidos em arrays a cada render.

**Transições de status atômicas** — atualizações de status do leito e escritas no log de histórico são executadas como transações Firestore, prevenindo escritas parciais sob atualizações concorrentes.

**Auth com cache de sessão** — o perfil do usuário é armazenado em `sessionStorage` após o primeiro fetch, eliminando leituras desnecessárias no Firestore em reloads de página, mantendo o Firebase Auth como fonte de verdade.

**Divulgação progressiva por perfil** — um único hook `usePermission` e um componente `ProtectedLayout` controlam cada rota e ação da interface, sem lógica de perfil espalhada pelos componentes de negócio.

---

## Rodando Localmente

```bash
# Clone e instale
git clone https://github.com/monteirommd/sigoh.git
cd sigoh
npm install

# Configure as credenciais do Firebase
cp .env.example .env
# Preencha os valores do seu projeto Firebase no .env

# Inicie o desenvolvimento local (com emulador Firebase)
npm run emulator       # Inicia os emuladores Firebase
npm run seed:emulator  # Popula o emulador com dados de exemplo
npm run dev            # Inicia o servidor de desenvolvimento Vite
```

**Portas do emulador:** Auth `9099` · Firestore `8080` · Functions `5001` · Hosting `5000`

---

## Sobre o Desenvolvedor

Olá, sou o **Mateus Monteiro** — desenvolvedor full-stack focado em construir produtos reais que resolvem problemas operacionais reais.

O SiGOH é um sistema em produção que projetei e construí do zero: levantamento de requisitos, modelagem de dados, arquitetura, frontend, backend, deploy e iteração contínua. Ele roda em um ambiente hospitalar ativo.

O que esse projeto demonstra:

- **Tradução de domínio** — entender um fluxo de saúde profundamente o suficiente para modelá-lo com precisão em código, não apenas construir um CRUD genérico
- **Ownership full-stack** — do design do schema Firestore e Cloud Functions à arquitetura de componentes e UI responsiva
- **Mentalidade de produção** — logs de auditoria, controle de acesso, transações atômicas, dev local com emulador e dados de seed não são afterthoughts — foram construídos desde o início
- **Pensamento de UX por perfil** — um técnico mobile e um admin desktop têm fluxos de trabalho fundamentalmente diferentes; o sistema respeita isso em vez de forçar todos na mesma interface

Estou aberto a posições **full-stack**, **frontend** ou **backend** onde possa ter ownership real de features e trabalhar em produtos que importam. Trabalho melhor em times pequenos e de alta confiança onde engenheiros têm ownership ponta a ponta.

**Contato:**
- E-mail: [mateusmonteiroduarte@gmail.com](mailto:mateusmonteiroduarte@gmail.com)
- GitHub: [@monteirommd](https://github.com/monteirommd)
- LinkedIn: [mateusmonteiroduarte](https://www.linkedin.com/in/mateusmonteiroduarte/)

---

<div align="center">
<sub>Construído com TypeScript · React · Firebase · Tailwind CSS</sub>
</div>
