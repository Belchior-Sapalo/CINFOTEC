import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { SubmitButton } from "./Buttons";
import { handleResetPassword } from "@/api/authServices";
import { useNavigate } from "react-router";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
    const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  async function resetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      setSuccess(false);
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    await handleResetPassword({ token, newPassword })
      .then((res) => {
        setMessage("Senha redefinida com sucesso!");
        setNewPassword("")
        setConfirmPassword("")
        setSuccess(true);
        setTimeout(() => navigate("/auth"), 2000)
      })
      .catch((err) => {
        setMessage(err.response.data.message || "Erro ao redefinir senha.");
        setSuccess(false);
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => setMessage(null), 3000);
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <form
        onSubmit={(e) => resetPassword(e)}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg flex flex-col gap-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-700">Reposição de Senha</h1>

        {message && (
          <div
            className={`text-sm p-3 rounded font-medium text-center ${
              success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        {/* Nova Senha */}
        <div className="relative">
          <MdPassword className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nova senha"
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Confirmar Senha */}
        <div className="relative">
          <MdPassword className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar senha"
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Botão */}
        <div className="pt-2">
          <SubmitButton
            label="Redefinir senha"
            actionLabel="Aguarde..."
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
}
