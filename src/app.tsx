import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/mobile/home/home";
import BlocoPage from "./pages/mobile/bloco/bloco-page";
import Login from "./pages/login/login";
import Dashboard from "./pages/desktop/dashboard/dashboard";
import ProtectedLayout from "./layouts/protected-layout";
import { AuthProvider } from "./context/auth-context";
import GestaoUsuarios from "./pages/desktop/gestao/gestao-usuarios";
import GestaoBlocos from "./pages/desktop/gestao/gestao-blocos";
import GestaoEnfermarias from "./pages/desktop/gestao/gestao-enfermaria";
import GestaoLeitos from "./pages/desktop/gestao/gestao-leitos";
import Apresentacao from "./pages/desktop/apresentacao/apresentacao";
import DetalhesTaxaBloco from "./pages/desktop/dashboard/detalhes-taxa-bloco";
import { AppDataProvider } from "./context/app-data-context";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppDataProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            {/*ROTAS DE TÉCNICO*/}
            <Route element={<ProtectedLayout allowedRoles={["TECNICO"]} />}>
              <Route path="/home" element={<Home />} />
              <Route path="/bloco/:id" element={<BlocoPage />} />
            </Route>
            {/*ROTAS DE DASHBOARD LIBERADAS*/}
            <Route
              element={
                <ProtectedLayout
                  allowedRoles={["GESTOR_ADMIN", "GESTOR_BASE"]}
                />
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/apresentacao" element={<Apresentacao />} />
              <Route path="/detalhes/:id" element={<DetalhesTaxaBloco />} />
            </Route>
            {/*ROTAS DE GESTOR*/}
            <Route
              element={<ProtectedLayout allowedRoles={["GESTOR_ADMIN"]} />}
            >
              <Route path="/gestao/usuarios" element={<GestaoUsuarios />} />
              <Route path="/gestao/blocos" element={<GestaoBlocos />} />
              <Route
                path="/gestao/enfermarias/:blocoId"
                element={<GestaoEnfermarias />}
              />
              <Route
                path="/gestao/leitos/:blocoId/:enfermariaId"
                element={<GestaoLeitos />}
              />
            </Route>
          </Routes>
        </AppDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
