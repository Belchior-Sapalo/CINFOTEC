import { useState } from "react";
import { handleLogin, handleRegister } from "../../api/authServices";
import { type ILogin, type IRegister } from "../../types/auth";
import {
  FaEye,
  FaEyeSlash,
  FaIdCard,
  FaPhone,
  FaTrash,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import { MdMail, MdPassword } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import { SubmitButton } from "../../components/ui/Buttons";
import { TooltipContent, TooltipProvider } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { RecoverPasswordDialog } from "@/components/ui/Dialogs";

export default function Auth() {
  const [logging, setLogging] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [registerBody, setRegisterBody] = useState<IRegister>({
    bi: "",
    email: "",
    name: "",
    password: "",
    phoneNumber: "",
  });
  const [loginBody, setLoginBody] = useState<ILogin>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { state, login } = useAuth();
  const navigate = useNavigate();

  const handleChangeForm = () => {
    setLogging((prev) => !prev);
    setError(undefined);
  };

  const handleResetForm = () => {
    setRegisterBody({
      bi: "",
      email: "",
      name: "",
      password: "",
      phoneNumber: "",
    });

    setLoginBody({
      email: "",
      password: "",
    });
    setError(undefined);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    if (logging) {
      handleLogin(loginBody!)
        .then((res) => {
          console.log(res.data);
          login({ ...res.data, isAdmin: res.data.role === "ADMIN", isSuperAdmin: res.data.role === "SUPER" });
          handleResetForm();
          navigate(`${res.data.role === "ADMIN" || res.data.role === "SUPER" ? "/dashboard" : "/"}`, {
            replace: true,
          });
        })
        .catch((err) => {
          console.log(err.response);
          if (err.response && err.response.data) {
            if (err.response.data.status === 403) {
              setError("Credenciais inválidas");
            } else {
              setError(err.response.data.message);
            }
          } else {
            setError(err.message);
          }
        })
        .finally(() => {
          setLoading(false);
          setTimeout(() => setError(undefined), 3000);
        });
    } else {
      handleRegister(registerBody!)
        .then((res) => {
          handleChangeForm();
          handleResetForm();
        })
        .catch((err) => {
          if (err.response && err.response.data) {
            setError(err.response.data.message);
          } else {
            setError(err.message);
          }
        })
        .finally(() => {
          setLoading(false);
          setTimeout(() => setError(undefined), 3000);
        });
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center md:justify-center bg-sky-900 p-4">
      <div className="bg-gray-50 p-8 w-full sm:w-[70%] md:w-[60%] lg:w-[40%] rounded">
        <div className="flex items-center mb-4">
          <button
            onClick={handleChangeForm}
            className={`${
              logging
                ? "bg-sky-800 border border-sky-800 text-white"
                : "border border-sky-800 text-sky-800"
            } auth-change-btn rounded-l`}
          >
            Login
          </button>
          <button
            onClick={handleChangeForm}
            className={`${
              !logging
                ? "bg-sky-800 border border-sky-800 text-white"
                : "border border-sky-800 text-sky-800"
            } auth-change-btn rounded-r`}
          >
            Registro
          </button>
        </div>
        <div className="flex flex-col gap-4 items-center justify-center mb-4">
          <i className="bg-sky-900 p-4 rounded-full">
            {logging ? (
              <FaUser className="text-white" size={25} />
            ) : (
              <FaUserPlus className="text-white" size={25} />
            )}
          </i>

          <h1 className="text-sky-900 font-bold text-xl border-b-2 border-b-sky-900">
            {logging ? "Login" : "Registro"}
          </h1>
          {error && (
            <p className="bg-red-300 text-white p-2 w-full text-center rounded-md">
              {error}
            </p>
          )}
        </div>
        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4">
          {!logging && (
            <div className="auth-input-container">
              <i className="auth-icon-container">
                <FaUser className="auth-icon" size={20} />
              </i>
              <input
                type="text"
                value={registerBody.name}
                onChange={(e) =>
                  setRegisterBody({ ...registerBody, name: e.target.value })
                }
                placeholder="Insira o seu nome"
                className="auth-input"
                required
              />
            </div>
          )}
          <div className="auth-input-container">
            <i className="auth-icon-container">
              <MdMail className="auth-icon" size={20} />
            </i>
            <input
              type="email"
              value={logging ? loginBody.email : registerBody.email}
              onChange={(e) => {
                logging
                  ? setLoginBody({ ...loginBody, email: e.target.value })
                  : setRegisterBody({ ...registerBody, email: e.target.value });
              }}
              placeholder="exmplo@gmail.com"
              className="auth-input"
              required
            />
          </div>
          <div className="auth-input-container">
            <i className="auth-icon-container">
              <MdPassword className="auth-icon" size={20} />
            </i>
            <input
              type={showPassword ? "text" : "password"}
              value={logging ? loginBody.password : registerBody.password}
              onChange={(e) => {
                logging
                  ? setLoginBody({ ...loginBody, password: e.target.value })
                  : setRegisterBody({
                      ...registerBody,
                      password: e.target.value,
                    });
              }}
              className="auth-input"
              placeholder="senha"
              required
            />
            <button
              className="cursor-pointer"
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-600" />
              ) : (
                <FaEye className="text-gray-600" />
              )}
            </button>
          </div>
          {!logging && (
            <div className="auth-input-container">
              <i className="auth-icon-container">
                <FaIdCard className="auth-icon" size={20} />
              </i>
              <input
                type="text"
                value={registerBody.bi}
                onChange={(e) =>
                  setRegisterBody({ ...registerBody, bi: e.target.value })
                }
                className="auth-input"
                placeholder="BI"
                required
              />
            </div>
          )}
          {!logging && (
            <div className="auth-input-container">
              <i className="auth-icon-container">
                <FaPhone className="auth-icon" size={20} />
              </i>
              <input
                type="text"
                value={registerBody.phoneNumber}
                onChange={(e) =>
                  setRegisterBody({
                    ...registerBody,
                    phoneNumber: e.target.value,
                  })
                }
                className="auth-input"
                placeholder="Telefone"
                required
              />
            </div>
          )}
          {logging && (
            <RecoverPasswordDialog/>
          )}
          <div className="flex gap-2">
            <SubmitButton
              label={logging ? "Entrar" : "Criar conta"}
              actionLabel="Aguarde..."
              loading={loading}
            />

            {!logging && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <button
                        type="reset"
                        disabled={loading}
                        onClick={() => handleResetForm()}
                        className="bg-sky-800 hover:bg-sky-900 transition-all text-white font-bold py-2 px-4 rounded cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-500 p-2 text-white rounded mb-2">
                      Restaurar formulário
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
