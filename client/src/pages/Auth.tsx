import { useState } from "react";
import { handleLogin, handleRegister } from "../api/authServices";
import type { ILogin, IRegister } from "../types/auth";
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
import { Link } from "react-router";
import { Tooltip } from "react-tooltip";

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
          console.log(res);
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
    <div className="h-screen flex flex-col items-center sm:justify-center bg-sky-900 p-4">
      <div className=" bg-gray-50 p-8 w-full md:w-[40%] rounded">
        <div className="flex items-center">
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
            <p className="bg-red-300 text-white p-2 w-full text-center rounded-md text-xl">
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
            <p>
              Esqueceu a senha?{" "}
              <Link className="text-sky-900" to="">
                Clique aqui
              </Link>
            </p>
          )}
          <div className="flex gap-2">
            <button
              disabled={loading}
              type="submit"
              className="bg-sky-800 hover:bg-sky-900 transition-all text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              {logging
                ? loading
                  ? "Aguarde..."
                  : "Entrar"
                : loading
                ? "Aguarde..."
                : "Criar conta"}
            </button>
            {!logging && (
              <>
                <button
                  data-tooltip-id="reset-form-button"
                  data-tooltip-content="Restaurar formulário"
                  data-tooltip-place="top"
                  type="button"
                  disabled={loading}
                  onClick={() => handleResetForm()}
                  className="bg-sky-800 hover:bg-sky-900 transition-all text-white font-bold py-2 px-4 rounded cursor-pointer"
                >
                  <FaTrash />
                </button>
                <Tooltip id="reset-form-button"/>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
