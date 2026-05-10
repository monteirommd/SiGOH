import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { AuthService } from "@/service/auth";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ROUTES_BY_ROLE = {
  TECNICO: "/home",
  GESTOR_BASE: "/dashboard",
  GESTOR_ADMIN: "/dashboard",
} satisfies Record<string, string>;

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const perfil = await AuthService.login(email, password);
      navigate(ROUTES_BY_ROLE[perfil.role]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="bg-linear-to-tr from-[#1D68B4] to-[#4795E4] h-screen w-screen flex flex-col items-center">
      <div className="flex my-20 lg:my-30">
        <span className="text-white font-black text-3xl text-center lg:text-5xl">
          Sistema de Gestão de Ocupação Hospitalar
        </span>
      </div>
      <div className="bg-white w-screen lg:w-[618px] h-screen rounded-t-3xl flex flex-col items-center p-6">
        <span className="text-center mt-5 font-bold text-3xl">Login</span>
        <form className="w-full" onSubmit={handleLogin}>
          <FieldGroup>
            <Field>
              <FieldLabel>E-mail</FieldLabel>
              <Input type="email" onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field
              className="relative
            
          "
            >
              <FieldLabel>Senha</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  type={!showPassword ? "password" : "text"}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label="Mostrar/Ocultar senha"
                    title="Mostrar/Ocultar Senha"
                    size="icon-xs"
                    onClick={togglePasswordVisibility}
                  >
                    {!showPassword ? <Eye /> : <EyeOff />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            {error && (
              <p className="text-red-500 text-sm text-center -mt-2">{error}</p>
            )}
            <Field>
              <Button
                size="lg"
                className="bg-[#4795E4] hover:bg-[#2765a3]"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "ENTRAR"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}

export default Login;
