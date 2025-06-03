import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FaDownload,
  FaEye,
  FaEyeSlash,
  FaFilePdf,
  FaIdCard,
  FaPen,
  FaPhone,
  FaPlus,
  FaTrash,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";

import {
  handleUpdateName,
  handleUpdateEmail,
  handleUpdateBI,
  handleUpdatePhone,
  handleUpdatePassword,
  handleDeleteAccount,
  handleDeleteAdminAccount,
} from "@/api/userServices";
import React, { useState, type ChangeEvent, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  handleCreateCourse,
  handleDeleteCourse,
  handleUpdateCourse,
} from "@/api/coursesServices";
import { data, useNavigate } from "react-router";
import type { ICourse } from "@/types/course";
import type { IInformation } from "@/types/information";
import {
  handleCreateInformation,
  handleDeleteInformation,
  handleUpdateInformation,
} from "@/api/informationsServices";
import { Input } from "./input";
import { handleRegisterEnrollment } from "@/api/EnrollServices";
import type { IStudent } from "@/types/enrollment";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { MdEmail, MdMail, MdPassword } from "react-icons/md";
import { SubmitButton } from "./Buttons";
import type { IRegister, IUser } from "@/types/auth";
import { handleForgotPassword, handleRegisterAdmin } from "@/api/authServices";
import FileViewer from "../FileViewer";
import Information from "@/pages/public/Information";

interface IDialogProps {
  onReload: () => void;
  currentValue?: string;
}

export function EditNameDialog({ onReload, currentValue }: IDialogProps) {
  const [name, setName] = useState<string>(currentValue!);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function updateName() {
    if (!name) {
      setError("O nome não pode ser vazio");
      setSuccess(null);
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return;
    }
    if (name.length < 3) {
      setError("O nome deve ter pelo menos 3 caracteres");
      setSuccess(null);
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return;
    }
    if (name === currentValue) {
      setError("O Nome não pode ser o mesmo");
      setSuccess(null);
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return;
    }
    setLoading(true);
    await handleUpdateName({ name: name.trimEnd().trimStart() })
      .then((res) => {
        setSuccess("Nome atualizado com sucesso");
        onReload();
        setError(null);
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.data) {
          setError(err.response.data.message);
          setSuccess(null);
        } else {
          setError("Erro ao atualizar nome");
          setSuccess(null);
        }
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setError(null);
          setSuccess(null);
        }, 3000);
      });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-sky-700 text-white rounded p-2 cursor-pointer hover:bg-sky-800 transition-all">
          <FaPen />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="mt-8">
          {error && (
            <div className="bg-red-500 text-white p-2 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500 text-white p-2 rounded mb-4">
              {success}
            </div>
          )}
        </div>
        <DialogHeader>
          <DialogTitle>Editar Nome</DialogTitle>
          <DialogDescription>
            Faça alterações no seu perfil aqui. Clique em salvar quando terminar
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="nome" className="text-right">
              Nome
            </label>
            <input
              type="text"
              id="nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3 outline-none p-2 rounded border border-gray-400 focus:border-gray-600"
              placeholder="Insira seu nome"
            />
          </div>
        </div>
        <DialogFooter className="flex">
          <button
            onClick={() => updateName()}
            className={`${
              loading
                ? "bg-gray-300 text-gray-500 font-bold py-1 px-4 rounded cursor-not-allowed"
                : "bg-sky-800 hover:bg-sky-900 transition-all text-white font-bold py-1 px-4 rounded cursor-pointer"
            } self-start`}
          >
            {loading ? "Aguarde..." : "Salvar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditEmailDialog({ onReload, currentValue }: IDialogProps) {
  const [email, setEmail] = useState<string>(currentValue!);
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);

  const { login } = useAuth();

  const togglePass = () => setShowPassword((prev) => !prev);

  async function updateEmail() {
    if (!password) {
      setError("Precisa inserir a senha para continuar");
      setSuccess(null);
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return;
    }
    if (!email) {
      setError("O email não pode ser vazio");
      setSuccess(null);
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return;
    }
    if (email === currentValue) {
      setError("O email não pode ser o mesmo");
      setSuccess(null);
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return;
    }
    setLoading(true);
    await handleUpdateEmail({ email: email.trim(), password: password })
      .then((res) => {
        setSuccess("Email atualizado com sucesso");
        login({ ...res.data, isAdmin: res.data.role === "ADMIN" });
        onReload();
        setError(null);
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.data) {
          setError(err.response.data.message);
          setSuccess(null);
        } else {
          setError("Erro ao atualizar email");
          setSuccess(null);
        }
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setError(null);
          setSuccess(null);
        }, 3000);
      });
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-sky-700 text-white rounded p-2 cursor-pointer hover:bg-sky-800 transition-all">
          <FaPen />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="mt-8">
          {error && (
            <div className="bg-red-500 text-white p-2 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500 text-white p-2 rounded mb-4">
              {success}
            </div>
          )}
        </div>
        <DialogHeader>
          <DialogTitle>Editar Email</DialogTitle>
          <DialogDescription>
            Faça alterações no seu perfil aqui. Clique em salvar quando terminar
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="senha" className="text-right">
              Senha
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3 outline-none p-2 rounded border border-gray-400 focus:border-gray-600"
              placeholder="Insira sua senha"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="Insira seu email" className="text-right">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3 outline-none p-2 rounded border border-gray-400 focus:border-gray-600"
              placeholder="Email"
            />
          </div>
        </div>
        <DialogFooter className="flex flex-row">
          <button
            disabled={loading}
            onClick={() => updateEmail()}
            className={`${
              loading
                ? "bg-gray-300 text-gray-500 font-bold py-1 px-4 rounded cursor-not-allowed"
                : "bg-sky-800 hover:bg-sky-900 transition-all text-white font-bold py-1 px-4 rounded cursor-pointer"
            } `}
          >
            {loading ? "Aguarde..." : "Salvar"}
          </button>

          <button
            onClick={togglePass}
            className={`${
              loading
                ? "bg-gray-300 text-gray-500 font-bold py-1 px-4 rounded cursor-not-allowed"
                : "bg-sky-800 hover:bg-sky-900 transition-all text-white font-bold py-1 px-4 rounded cursor-pointer"
            } `}
          >
            {showPassword ? "Ocultar senha" : "Mostrar senha"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditBiDialog({ onReload, currentValue }: IDialogProps) {
  const [bi, setBi] = useState<string>(currentValue!);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function updateBi() {
    if (!bi) {
      setError("O BI não pode estar vazio");
      setSuccess(null);
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return;
    }
    if (bi === currentValue) {
      setError("O BI não pode ser o mesmo");
      setSuccess(null);
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return;
    }
    setLoading(true);
    await handleUpdateBI({ bi: bi })
      .then((res) => {
        console.log(res.data);
        setSuccess("BI atualizado com sucesso");
        onReload();
        setError(null);
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.data) {
          setError(err.response.data.message);
          setSuccess(null);
        } else {
          setError("Erro ao atualizar BI");
          setSuccess(null);
        }
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setError(null);
          setSuccess(null);
        }, 3000);
      });
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-sky-700 text-white rounded p-2 cursor-pointer hover:bg-sky-800 transition-all">
          <FaPen />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="mt-8">
          {error && (
            <div className="bg-red-500 text-white p-2 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500 text-white p-2 rounded mb-4">
              {success}
            </div>
          )}
        </div>
        <DialogHeader>
          <DialogTitle>Editar BI</DialogTitle>
          <DialogDescription>
            Faça alterações no seu perfil aqui. Clique em salvar quando terminar
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="bi" className="text-right">
              BI
            </label>
            <input
              type="text"
              id="bi"
              value={bi}
              onChange={(e) => setBi(e.target.value)}
              className="col-span-3 outline-none p-2 rounded border border-gray-400 focus:border-gray-600"
              placeholder="Insira o seu BI"
            />
          </div>
        </div>
        <DialogFooter className="flex">
          <button
            onClick={() => updateBi()}
            className={`${
              loading
                ? "bg-gray-300 text-gray-500 font-bold py-1 px-4 rounded cursor-not-allowed"
                : "bg-sky-800 hover:bg-sky-900 transition-all text-white font-bold py-1 px-4 rounded cursor-pointer"
            } self-start`}
          >
            {loading ? "Aguarde..." : "Salvar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditPhoneDialog({ onReload, currentValue }: IDialogProps) {
  const [phone, setPhone] = useState<string>(currentValue!);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function updatePhone() {
    if (!phone) {
      setError("O telefone não pode star vazio");
      setSuccess(null);
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return;
    }
    if (phone === currentValue) {
      setError("O telefone não pode ser o mesmo");
      setSuccess(null);
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return;
    }
    setLoading(true);
    await handleUpdatePhone({ phoneNumber: phone.trim() })
      .then((res) => {
        setSuccess("Telefone atualizado com sucesso");
        onReload();
        setError(null);
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.data) {
          setError(err.response.data.message);
          setSuccess(null);
        } else {
          setError("Erro ao atualizar telefone");
          setSuccess(null);
        }
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setError(null);
          setSuccess(null);
        }, 3000);
      });
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-sky-700 text-white rounded p-2 cursor-pointer hover:bg-sky-800 transition-all">
          <FaPen />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="mt-8">
          {error && (
            <div className="bg-red-500 text-white p-2 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500 text-white p-2 rounded mb-4">
              {success}
            </div>
          )}
        </div>
        <DialogHeader>
          <DialogTitle>Editar telefone</DialogTitle>
          <DialogDescription>
            Faça alterações no seu perfil aqui. Clique em salvar quando terminar
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="telefone" className="text-right">
              Telefone
            </label>
            <input
              type="text"
              id="telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-3 outline-none p-2 rounded border border-gray-400 focus:border-gray-600"
              placeholder="Insira o seu telefone"
            />
          </div>
        </div>
        <DialogFooter className="flex">
          <button
            onClick={() => updatePhone()}
            className={`${
              loading
                ? "bg-gray-300 text-gray-500 font-bold py-1 px-4 rounded cursor-not-allowed"
                : "bg-sky-800 hover:bg-sky-900 transition-all text-white font-bold py-1 px-4 rounded cursor-pointer"
            } self-start`}
          >
            {loading ? "Aguarde..." : "Salvar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditPasswordDialog() {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePass = () => setShowPassword((prev) => !prev);

  async function updatePassword() {
    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      setSuccess(null);
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return;
    }
    setLoading(true);
    await handleUpdatePassword({ password: password, newPassword: newPassword })
      .then(() => {
        setSuccess("Senha atualizada com sucesso");
        setError(null);
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.data) {
          setError(err.response.data.message);
          setSuccess(null);
        } else {
          setError("Erro ao atualizar senha");
          setSuccess(null);
        }
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setError(null);
          setSuccess(null);
        }, 3000);
      });
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-sky-700 text-white rounded p-2 cursor-pointer hover:bg-sky-800 transition-all">
          Editar senha
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="mt-8">
          {error && (
            <div className="bg-red-500 text-white p-2 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500 text-white p-2 rounded mb-4">
              {success}
            </div>
          )}
        </div>
        <DialogHeader>
          <DialogTitle>Editar senha</DialogTitle>
          <DialogDescription>
            Faça alterações no seu perfil aqui. Clique em salvar quando terminar
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col justify-around gap-2">
            <label htmlFor="actpass">Senha actual</label>
            <input
              type={showPassword ? "text" : "password"}
              id="actpass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3 outline-none p-2 rounded border border-gray-400 focus:border-gray-600"
              placeholder="Insira a sua senha actual"
            />
          </div>

          <div className="flex flex-col justify-around gap-2">
            <label htmlFor="pass">Nova senha</label>
            <input
              type={showPassword ? "text" : "password"}
              id="pass"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="col-span-3 outline-none p-2 rounded border border-gray-400 focus:border-gray-600"
              placeholder="Insira a sua nova senha"
            />
          </div>
          <div className="flex flex-col justify-around gap-2">
            <label htmlFor="cpass">Confirmar senha</label>
            <input
              type={showPassword ? "text" : "password"}
              id="cpass"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="col-span-3 outline-none p-2 rounded border border-gray-400 focus:border-gray-600"
              placeholder="Confirme sua nova senha"
            />
          </div>
        </div>
        <DialogFooter className="flex">
          <button
            onClick={() => updatePassword()}
            className="bg-sky-700 text-white rounded p-2 cursor-pointerhover:bg-sky-800"
          >
            {loading ? "Aguarde..." : "Salvar"}
          </button>

          <button
            onClick={togglePass}
            className="bg-sky-700 text-white rounded p-2 cursor-pointer hover:bg-sky-800"
          >
            {showPassword ? "Ocultar senha" : "Mostrar senha"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteAccountDialog() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();
  async function deleteAccount() {
    await handleDeleteAccount()
      .then((res) => {
        logout();
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.data) {
          setError(err.response.data.message);
        } else {
          setError("Erro ao eliminar sua conta");
        }
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setError(null);
        }, 3000);
      });
  }
  return (
    <Dialog>
      <DialogTrigger>
        <button className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-all cursor-pointer">
          Eliminar conta
        </button>
      </DialogTrigger>
      <DialogContent>
        <div className="mt-8">
          {error && (
            <div className="bg-red-500 text-white p-2 rounded mb-4">
              {error}
            </div>
          )}
        </div>
        <DialogHeader>
          <DialogTitle className="mt-8">
            Tem certeza que deseja continuar?
          </DialogTitle>
          <DialogDescription>
            Esta acção não pode ser desfeita. Isso irá eliminar permanentemente
            a sua conta e seus dados do servidor.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex">
          <button
            disabled={loading}
            onClick={() => deleteAccount()}
            className="bg-red-600 text-white rounded p-2 cursor-pointer self-start hover:bg-red-700"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteCourseDialog({
  id,
  onReload,
}: {
  id: string;
  onReload: Function;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  async function deleteCourse() {
    setLoading(true);
    await handleDeleteCourse({ id: id })
      .then((res) => {
        console.log(res.data);
        onReload();
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.data) {
          setError(err.response.data.message);
        } else {
          setError("Erro ao atualizar telefone");
        }
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setError(null);
        }, 3000);
      });
  }
  return (
    <Dialog>
      <DialogTrigger>
        <button className="bg-red-600 text-white rounded p-1 cursor-pointer self-start hover:bg-red-700">
          <FaTrash size={15} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <div className="mt-8">
          {error && (
            <div className="bg-red-500 text-white p-2 rounded mb-4">
              {error}
            </div>
          )}
        </div>
        <DialogHeader>
          <DialogTitle>Eliminar curso</DialogTitle>
          <DialogDescription>
            Tem certeza que quer eliminar este curso
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex">
          <button
            disabled={loading}
            onClick={() => deleteCourse()}
            className={`${
              loading
                ? "bg-gray-300 text-gray-500 font-bold py-1 px-4 rounded cursor-not-allowed"
                : "bg-red-600 text-white rounded p-1 cursor-pointer self-start hover:bg-red-700"
            }`}
          >
            {loading ? "Eliminando..." : "Continuar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

function validateCourse(course: ICourse, creating: boolean): ValidationResult {
  const errors: Record<string, string> = {};

  if (!course.title || course.title.trim().length < 3) {
    errors.title = "O título é obrigatório e deve ter pelo menos 3 caracteres.";
  }

  if (!course.description || course.description.trim().length < 10) {
    errors.description =
      "A descrição é obrigatória e deve ter pelo menos 10 caracteres.";
  }

  if (!course.duration || course.duration.trim().length === 0) {
    errors.duration = "A duração é obrigatória.";
  }

  if (course.payed && (isNaN(course.price) || course.price < 1)) {
    errors.price = "Informe um preço válido (maior que 0) para cursos pagos.";
  }

  if (!creating && (isNaN(course.vacancies) || course.vacancies < 0)) {
    errors.vacancies = "Informe um número válido de vagas (maior ou igual a 0)";
  }
  if (creating && (isNaN(course.vacancies) || course.vacancies < 1)) {
    errors.vacancies = "Informe um número válido de vagas (maior que 0)";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function EditCourseDialog({
  id,
  data,
  onReload,
}: {
  id: string;
  data: ICourse;
  onReload: Function;
}) {
  const initialValues = {
    id: data.id,
    title: data.title,
    description: data.description,
    duration: data.duration,
    payed: data.payed,
    price: data.price,
    vacancies: data.vacancies,
  };

  const [formData, setFormData] = useState<ICourse>(initialValues);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function updateCourse() {
    const result = validateCourse(formData, false);

    if (!result.valid) {
      const firstError = Object.values(result.errors)[0];
      setError(firstError);
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 2000);
      return;
    }
    setError(null);

    setLoading(true);
    await handleUpdateCourse({ id, data: formData })
      .then((res) => {
        console.log(res.data);
        setSuccess(res.data.message);
        onReload();
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.data) {
          setError(err.response.data.message);
          setSuccess(null);
        } else {
          setError("Erro ao atualizar telefone");
          setSuccess(null);
        }
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setError(null);
          setSuccess(null);
        }, 3000);
      });
  }
  return (
    <Dialog>
      <DialogTrigger>
        <button className="bg-sky-600 text-white p-1 rounded hover:bg-sky-700 transition-all cursor-pointer">
          <FaPen size={15} />
        </button>
      </DialogTrigger>
      <DialogContent>
        {error && (
          <div className="bg-red-500 text-white p-2 mt-2 rounded">{error}</div>
        )}
        {success && (
          <div className="bg-green-500 text-white p-2 mt-2 rounded">
            {success}
          </div>
        )}
        <DialogHeader>
          <DialogTitle>Atualizar curso {data.title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form action="" className="flex flex-col gap-2">
          <label htmlFor="title">Título</label>
          <input
            id="title"
            className="outline-none border border-gray-400 p-2 rounded focus:border-gray-600"
            type="text"
            placeholder="Título"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <label htmlFor="description">Descrição</label>
          <textarea
            className="outline-none border border-gray-400 p-2 rounded focus:border-gray-600"
            placeholder="Descrição"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <label htmlFor="duraction">Duração</label>

          <input
            className="outline-none border border-gray-400 p-2 rounded focus:border-gray-600"
            type="text"
            placeholder="Duração"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.payed}
              onChange={(e) =>
                setFormData({ ...formData, payed: e.target.checked })
              }
            />
            Curso pago
          </label>

          {formData.payed && (
            <>
              <label htmlFor="price">Preço</label>

              <input
                id="price"
                className="input-no-spin outline-none border border-gray-400 p-2 rounded focus:border-gray-600"
                type="number"
                placeholder="Preço"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.valueAsNumber })
                }
              />
            </>
          )}
          <label htmlFor="vacancies">Número de vagas</label>

          <input
            id="vacancies"
            className="input-no-spin outline-none border border-gray-400 p-2 rounded focus:border-gray-600"
            type="number"
            placeholder="Vagas"
            value={formData.vacancies}
            onChange={(e) =>
              setFormData({ ...formData, vacancies: e.target.valueAsNumber })
            }
          />
        </form>
        <DialogFooter className="flex">
          <button
            disabled={loading}
            onClick={() => updateCourse()}
            className={`${
              loading
                ? "bg-gray-300 text-gray-500 font-bold py-1 px-4 rounded cursor-not-allowed"
                : "bg-sky-600 text-white rounded p-2 cursor-pointer self-start hover:bg-sky-700"
            }`}
          >
            {loading ? "Atualizando..." : "Atualizar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RenderCourseDescriptionDialog({ course }: { course: ICourse }) {
  return (
    <Dialog>
      <DialogTrigger>
        <button className="text-gray-500 cursor-pointer">Ver mais...</button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{course.title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {course.description.split("\n").map((p, i) => (
            <p className="text-justify" key={i}>
              {p}
            </p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function RenderCourseCreatorDialog({ author }: { author: IUser }) {
  return (
    <Dialog>
      <DialogTrigger>
        <button
          title="Ver autor"
          className="text-gray-500 mb-4 cursor-pointer flex gap-2 items-center"
        >
          <FaUser /> <span>{author.name}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{author.name}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-1">
          <span className="font-medium text-gray-900">
            <MdEmail />
          </span>{" "}
          {author.email || (
            <span className="italic text-gray-400">Não informado</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium text-gray-900">
            <FaIdCard />
          </span>{" "}
          {author.bi || (
            <span className="italic text-gray-400">Não informado</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium text-gray-900">
            <FaPhone />
          </span>{" "}
          {author.phoneNumber || (
            <span className="italic text-gray-400">Não informado</span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CreateCourseDialog({ onReload }: { onReload: Function }) {
  const initialValues = {
    id: "",
    title: "",
    description: "",
    duration: "",
    payed: false,
    vacancies: 0,
    price: 0,
  };

  const [formData, setFormData] = useState<ICourse>(initialValues);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function createCourse() {
    const result = validateCourse(formData, true);

    if (!result.valid) {
      const firstError = Object.values(result.errors)[0];
      setError(firstError);
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 2000);
      return;
    }
    setError(null);

    setLoading(true);
    await handleCreateCourse({ data: formData })
      .then((res) => {
        console.log(res.data);
        setSuccess(res.data.message);
        onReload();
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data) {
          setError(err.response.data.message);
          setSuccess(null);
        } else {
          setError("Erro ao adicionar curso");
          setSuccess(null);
        }
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setError(null);
          setSuccess(null);
        }, 3000);
      });
  }
  return (
    <Dialog>
      <DialogTrigger>
        <button className="bg-sky-600 text-white p-2 rounded hover:bg-sky-700 transition-all cursor-pointer">
          <FaPlus />
        </button>
      </DialogTrigger>
      <DialogContent>
        {error && (
          <div className="bg-red-500 text-white p-2 mt-2 rounded">{error}</div>
        )}
        {success && (
          <div className="bg-green-500 text-white p-2 mt-2 rounded">
            {success}
          </div>
        )}
        <DialogHeader>
          <DialogTitle>Adicionar curso</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form action="" className="flex flex-col gap-2">
          <label htmlFor="title">
            Título<sup className="text-red-500">*</sup>
          </label>
          <input
            id="title"
            className="outline-none border border-gray-400 p-2 rounded focus:border-gray-600"
            type="text"
            placeholder="Título"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <label htmlFor="description">
            Descrição<sup className="text-red-500">*</sup>
          </label>

          <textarea
            id="description"
            className="outline-none border border-gray-400 p-2 rounded focus:border-gray-600"
            placeholder="Descrição"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <label htmlFor="duraction">
            Duração<sup className="text-red-500">*</sup>
          </label>

          <input
            id="duraction"
            className="outline-none border border-gray-400 p-2 rounded focus:border-gray-600"
            type="text"
            placeholder="Duração"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.payed}
              onChange={(e) =>
                setFormData({ ...formData, payed: e.target.checked })
              }
            />
            Curso pago
          </label>

          {formData.payed && (
            <>
              <label htmlFor="price">
                Preço<sup className="text-red-500">*</sup>
              </label>
              <input
                id="price"
                className="input-no-spin outline-none border border-gray-400 p-2 rounded focus:border-gray-600"
                type="number"
                placeholder="Preço"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.valueAsNumber })
                }
              />
            </>
          )}
          <label htmlFor="vacancies">
            Número de vagas<sup className="text-red-500">*</sup>
          </label>
          <input
            id="vacancies"
            className="input-no-spin outline-none border border-gray-400 p-2 rounded focus:border-gray-600"
            type="number"
            placeholder="Vagas"
            value={formData.vacancies}
            onChange={(e) =>
              setFormData({ ...formData, vacancies: e.target.valueAsNumber })
            }
          />
        </form>

        <DialogFooter className="flex">
          <button
            disabled={loading}
            onClick={() => createCourse()}
            className={`${
              loading
                ? "bg-gray-300 text-gray-500 font-bold py-1 px-4 rounded cursor-not-allowed"
                : "bg-sky-600 text-white rounded p-2 cursor-pointer self-start hover:bg-sky-700"
            }`}
          >
            {loading ? "Adicionando..." : "Adicionar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteInfoDialog({
  id,
  onReload,
}: {
  id: string;
  onReload: Function;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  async function deleteInformation() {
    setLoading(true);
    await handleDeleteInformation(id)
      .then((res) => {
        console.log(res.data);
        setSuccess("Informação eliminada com sucesso");
        onReload();
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.data) {
          setError(err.response.data.message);
        } else {
          setError("Erro ao eliminar informação");
        }
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setError(null);
          setSuccess(null);
        }, 3000);
      });
  }
  return (
    <Dialog>
      <DialogTrigger>
        <button className="bg-red-600 text-white rounded p-1 cursor-pointer self-start hover:bg-red-700">
          <FaTrash size={15} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <div className="mt-8">
          {error && (
            <div className="bg-red-500 text-white p-2 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500 text-white p-2 rounded mb-4">
              {success}
            </div>
          )}
        </div>
        <DialogHeader>
          <DialogTitle>Eliminar informação</DialogTitle>
          <DialogDescription>
            Tem certeza que quer eliminar esta informação
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex">
          <button
            disabled={loading}
            onClick={() => deleteInformation()}
            className={`${
              loading
                ? "bg-gray-300 text-gray-500 font-bold py-1 px-4 rounded cursor-not-allowed"
                : "bg-red-600 text-white rounded p-1 cursor-pointer self-start hover:bg-red-700"
            }`}
          >
            {loading ? "Eliminando..." : "Continuar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

function validateInformation(information: IInformation): ValidationResult {
  const errors: Record<string, string> = {};

  if (!information.title || information.title.trim().length < 3) {
    errors.title = "O título é obrigatório e deve ter pelo menos 3 caracteres.";
  }

  if (!information.category || information.category.trim().length === 0) {
    errors.category = "A categoria é obrigatória.";
  }

  if (!information.body || information.body.trim().length < 10) {
    errors.body =
      "A informação é obrigatória e deve ter pelo menos 10 caracteres.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function EditInfoDialog({
  data,
  onReload,
}: {
  data: IInformation;
  onReload: Function;
}) {
  const initialValues = {
    id: data.id,
    title: data.title,
    category: data.category,
    image: data.image,
    body: data.body,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };

  const [formData, setFormData] = useState<IInformation>(initialValues);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function updateInfo() {
    const result = validateInformation(formData);

    if (!result.valid) {
      const firstError = Object.values(result.errors)[0];
      setError(firstError);
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 2000);
      return;
    }
    setError(null);
    setLoading(true);
    await handleUpdateInformation({ id: data.id, data: formData })
      .then((res) => {
        console.log(res.data);
        setSuccess(res.data);
        onReload();
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.data) {
          setError(err.response.data.message);
          setSuccess(null);
        } else {
          setError("Erro ao atualizar telefone");
          setSuccess(null);
        }
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setError(null);
          setSuccess(null);
        }, 3000);
      });
  }
  return (
    <Dialog>
      <DialogTrigger>
        <button className="bg-sky-600 text-white p-1 rounded hover:bg-sky-700 transition-all cursor-pointer">
          <FaPen size={15} />
        </button>
      </DialogTrigger>
      <DialogContent>
        {error && (
          <div className="bg-red-500 text-white p-2 mt-2 rounded">{error}</div>
        )}
        {success && (
          <div className="bg-green-500 text-white p-2 mt-2 rounded">
            {success}
          </div>
        )}
        <DialogHeader>
          <DialogTitle>Atualizar informação {data.title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form action="" className="flex flex-col gap-4">
          <input
            className="outline-none border border-gray-400 p-2 rounded focus:border-gray-600"
            type="text"
            placeholder="Título"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <input
            className="outline-none border border-gray-400 p-2 rounded focus:border-gray-600"
            type="text"
            placeholder="Duração"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />

          <textarea
            className="outline-none border border-gray-400 p-2 rounded focus:border-gray-600"
            placeholder="Descrição"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          />
        </form>
        <DialogFooter className="flex">
          <button
            disabled={loading}
            onClick={() => updateInfo()}
            className={`${
              loading
                ? "bg-gray-300 text-gray-500 font-bold py-1 px-4 rounded cursor-not-allowed"
                : "bg-sky-600 text-white rounded p-2 cursor-pointer self-start hover:bg-sky-700"
            }`}
          >
            {loading ? "Atualizando..." : "Atualizar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CreateInfoDialog({ onReload }: { onReload: Function }) {
  const initialValues = {
    id: "",
    title: "",
    category: "",
    image: null,
    body: "",
    createdAt: "",
    updatedAt: "",
  };

  const [formData, setFormData] = useState<IInformation>(initialValues);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function handleFile(fileToSend: File) {
    if (!fileToSend) {
      const response = await fetch("/news.jpg");
      const blob = await response.blob();
      fileToSend = new File([blob], "news.jpg", { type: "image/jpg" });
    }
  }

  let fileToSend = selectedFile;

  async function createInformation() {
    const result = validateInformation(formData);

    if (!result.valid) {
      const firstError = Object.values(result.errors)[0];
      setError(firstError);
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 2000);
      return;
    }
    setError(null);
    setLoading(true);
    await handleCreateInformation(formData, selectedFile!)
      .then((res) => {
        console.log(res.data);
        setSuccess("Informação adicionada com sucesso");
        onReload();
        setFormData(initialValues);
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.data) {
          setError(err.response.data.message);
          setSuccess(null);
        } else {
          setError("Erro ao adicionar curso");
          setSuccess(null);
        }
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setError(null);
          setSuccess(null);
        }, 3000);
      });
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFileRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <button className="bg-sky-600 text-white p-2 rounded hover:bg-sky-700 transition-all cursor-pointer">
          <FaPlus />
        </button>
      </DialogTrigger>
      <DialogContent>
        {error && (
          <div className="bg-red-500 text-white p-2 mt-2 rounded">{error}</div>
        )}
        {success && (
          <div className="bg-green-500 text-white p-2 mt-2 rounded">
            {success}
          </div>
        )}
        <DialogHeader>
          <DialogTitle>Adicionar informação</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form action="" className="flex flex-col gap-4">
          <label htmlFor="title">
            Título<sup className="text-red-500 font-bold">*</sup>
          </label>
          <input
            id="title"
            className="outline-none border border-gray-400 p-2 rounded focus:border-gray-600"
            type="text"
            placeholder="Título"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <label htmlFor="category">
            Categoria<sup className="text-red-500 font-bold">*</sup>
          </label>

          <input
            id="category"
            className="outline-none border border-gray-400 p-2 rounded focus:border-gray-600"
            type="text"
            placeholder="Categoria"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />

          <label htmlFor="info">
            Informação<sup className="text-red-500 font-bold">*</sup>
          </label>

          <textarea
            id="info"
            className="outline-none border border-gray-400 p-2 rounded focus:border-gray-600"
            placeholder="Informação"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          />
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="picture" className="text-[14px]">
              Anexo<sup className="text-red-500 font-bold">*</sup>
            </label>
            <div className="flex items-center gap-2">
              {previewUrl && (
                <div style={{ margin: "10px 0" }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ maxWidth: "50px" }}
                  />
                </div>
              )}
              <Input
                id="picture"
                type="file"
                accept=".jpeg, .jpg, .png"
                onChange={handleFileChange}
              />
              <button
                onClick={(e) => handleFileRemove(e)}
                className="bg-sky-900 hover:bg-sky-950 transition-all cursor-pointer text-white p-2 rounded"
              >
                <FaTrash />
              </button>
            </div>
            <small className="text-red-500">Extensões permitidas: .jpeg, .jpg, .png (tamanho máximo: 10MB)</small>
          </div>
        </form>
        <DialogFooter className="flex">
          <button
            disabled={loading}
            onClick={() => createInformation()}
            className={`${
              loading
                ? "bg-gray-300 text-gray-500 font-bold py-1 px-4 rounded cursor-not-allowed"
                : "bg-sky-600 text-white rounded p-2 cursor-pointer self-start hover:bg-sky-700"
            }`}
          >
            {loading ? "Adicionando..." : "Adicionar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RenderInfoDescriptionDialog({
  information,
}: {
  information: IInformation;
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <button className="text-gray-500 cursor-pointer">Ver mais...</button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle className="text-2xl">{information.title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {information.body.split("\n").map((p, i) => (
            <p className="text-justify" key={i}>
              {p}
            </p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function RegisterEnrollDialog({ id }: { id: string }) {
  const [selectedPicture, setSelectedPicture] = useState<File | null>();
  const [selectedBi, setSelectedBi] = useState<File | null>();
  const [selectedCertificate, setSelectedCertificate] = useState<File | null>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { state } = useAuth();

  async function registerEnrollment() {
    setLoading(true);
    const data = {
      courseId: id,
      bi: selectedBi!,
      certf: selectedCertificate!,
      photo: selectedPicture!,
      token: state.user?.token!,
    };
    await handleRegisterEnrollment(data)
      .then((res) => {
        setSuccess("A sua inscrição foi seita com sucesso");
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.data) {
          setError(err.response.data.message);
          setSuccess(null);
        } else {
          setError("Erro ao se inscrever");
          setSuccess(null);
        }
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setError(null);
          setSuccess(null);
        }, 3000);
      });
  }

  const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPicture(file);
    }
  };

  const handleBiChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedBi(file);
    }
  };

  const handleCertificateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedCertificate(file);
    }
  };

  const handlePictureRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedPicture(null);
  };

  const handleBiRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedBi(null);
  };

  const handleCertificateRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedCertificate(null);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <button className="bg-sky-600 text-white p-2 rounded hover:bg-sky-700 transition-all cursor-pointer">
          Inscrever-se
        </button>
      </DialogTrigger>
      <DialogContent>
        {error && (
          <div className="bg-red-500 text-white p-2 mt-2 rounded">{error}</div>
        )}
        {success && (
          <div className="bg-green-500 text-white p-2 mt-2 rounded">
            {success}
          </div>
        )}
        <form action={registerEnrollment} className="flex flex-col gap-4">
          <h1 className="text-2xl">Faça a sua inscrição</h1>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="picture">
              Fotografia<sup className="text-red-500">*</sup>
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="picture"
                type="file"
                accept=".jpeg, .jpg, .png, .pdf"
                onChange={handlePictureChange}
              />
              <button
                onClick={(e) => handlePictureRemove(e)}
                className="bg-sky-900 hover:bg-sky-950 transition-all cursor-pointer text-white p-2 rounded"
              >
                <FaTrash />
              </button>
            </div>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="bilhete">
              Bilhete<sup className="text-red-500">*</sup>
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="bilhete"
                type="file"
                accept=".jpeg, .jpg, .png, .pdf"
                onChange={handleBiChange}
              />
              <button
                onClick={(e) => handleBiRemove(e)}
                className="bg-sky-900 hover:bg-sky-950 transition-all cursor-pointer text-white p-2 rounded"
              >
                <FaTrash />
              </button>
            </div>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="cert">
              Certificado<sup className="text-red-500">*</sup>
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="cert"
                type="file"
                accept=".jpeg, .jpg, .png, .pdf"
                onChange={handleCertificateChange}
              />
              <button
                onClick={(e) => handleCertificateRemove(e)}
                className="bg-sky-900 hover:bg-sky-950 transition-all cursor-pointer text-white p-2 rounded"
              >
                <FaTrash />
              </button>
            </div>
          </div>
          <small className="text-red-500">Extensões permitidas: .jpeg, .jpg, .png, .pdf (tamanho máximo: 10MB)</small>
          <button
            disabled={loading}
            onClick={() => registerEnrollment()}
            className="self-start bg-green-600 text-white font-bold cursor-pointer p-2 rounded-md hover:bg-green-800 transition-all"
          >
            {loading ? "Aguarde..." : "Inscrever-se"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function StudentInfoDialog({
  student,
  className,
}: {
  student: IStudent;
  className?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <button className="font-bold cursor-pointer flex flex-col gap-1 items-start">
                {student?.name}
                <span className="flex items-center gap-1 text-gray-600 text-[12px]">
                  <FaIdCard /> {student.bi}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-white rounded p-1">
              Informações do estudante
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent>
        <h1 className="text-2xl font-bold">{student.name}</h1>
        <h4 className="flex items-center gap-2 text-gray-500">
          <i>
            <MdMail />
          </i>
          {student?.email}
        </h4>
        <h4 className="flex items-center gap-2 text-gray-500">
          <i>
            <FaPhone />
          </i>
          {student?.phoneNumber}
        </h4>
        <h4 className="flex items-center gap-2 text-gray-500">
          <i>
            <FaIdCard />
          </i>
          {student?.bi}
        </h4>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmActionDialog({
  children,
  tooltipContent,
  onConfirm,
}: {
  children: ReactNode;
  tooltipContent: string;
  onConfirm: Function;
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>{children}</TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-white rounded p-1 mb-1">
              {tooltipContent}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent>
        <p>Tem certeza que deseja continuar?</p>
        <DialogFooter className="flex">
          <button
            className="cursor-pointer bg-sky-700 text-white font-bold p-2 rounded"
            onClick={() => onConfirm()}
          >
            Confirmar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RegisterAdminDialog({ onReload }: { onReload: Function }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [registerBody, setRegisterBody] = useState<IRegister>({
    bi: "",
    email: "",
    name: "",
    password: "",
    phoneNumber: "",
  });

  async function registerAdmin(e: React.FormEvent<HTMLFormElement>) {
    setLoading(true);
    e.preventDefault();
    await handleRegisterAdmin(registerBody)
      .then((res) => {
        handleResetForm();
        onReload();
        setSuccess("Administradore registrado com sucesso");
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
        setTimeout(() => {
          setError(undefined);
          setSuccess(undefined);
        }, 3000);
      });
  }

  const handleResetForm = () => {
    setRegisterBody({
      bi: "",
      email: "",
      name: "",
      password: "",
      phoneNumber: "",
    });
    setError(undefined);
    setSuccess(undefined);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <button className="bg-sky-600 text-white p-2 rounded hover:bg-sky-700 transition-all cursor-pointer">
          <FaPlus />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex flex-col gap-4 items-center justify-center mb-4">
            <i className="bg-sky-900 p-4 rounded-full">
              <FaUserPlus className="text-white" size={25} />
            </i>

            <h1 className="text-2xl ">Registrar administrador</h1>
            {error && (
              <p className="bg-red-300 text-white p-2 w-full text-center rounded-md">
                {error}
              </p>
            )}
            {success && (
              <p className="bg-green-400 text-white p-2 w-full text-center rounded-md">
                {success}
              </p>
            )}
          </div>
        </DialogHeader>

        <form
          onSubmit={(e) => registerAdmin(e)}
          className="flex flex-col gap-4"
        >
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
          <div className="auth-input-container">
            <i className="auth-icon-container">
              <MdMail className="auth-icon" size={20} />
            </i>
            <input
              type="email"
              value={registerBody.email}
              onChange={(e) =>
                setRegisterBody({ ...registerBody, email: e.target.value })
              }
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
              value={registerBody.password}
              onChange={(e) =>
                setRegisterBody({ ...registerBody, password: e.target.value })
              }
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
          <div className="flex gap-2">
            <SubmitButton
              label={"Criar conta"}
              actionLabel="Aguarde..."
              loading={loading}
            />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    type="button"
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteAdminAccountDialog({
  id,
  onReload,
}: {
  id: string;
  onReload: Function;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  async function deleteAccount() {
    setLoading(true);
    await handleDeleteAdminAccount(id)
      .then((res) => {
        onReload();
        setSuccess("Conta eliminada com sucesso");
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
        setTimeout(() => {
          setError(undefined);
          setSuccess(undefined);
        }, 3000);
      });
  }
  return (
    <Dialog>
      <DialogTrigger>
        <button className="bg-red-600 text-white p-1 rounded hover:bg-red-700 transition-all cursor-pointer">
          Eliminar conta
        </button>
      </DialogTrigger>
      <DialogContent>
        <div className="mt-8">
          {error && (
            <p className="bg-red-300 text-white p-2 w-full text-center rounded-md">
              {error}
            </p>
          )}
          {success && (
            <p className="bg-green-400 text-white p-2 w-full text-center rounded-md">
              {success}
            </p>
          )}
        </div>
        <DialogHeader>
          <DialogTitle className="mt-8">
            Tem certeza que deseja continuar?
          </DialogTitle>
          <DialogDescription>
            Esta acção não pode ser desfeita. Isso irá eliminar permanentemente
            a conta do administrador e seus dados do servidor.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex">
          <button
            disabled={loading}
            onClick={() => deleteAccount()}
            className={`${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-600 text-white rounded p-2 cursor-pointer self-start hover:bg-red-700"
            }`}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type ViewFileDialogProps = {
  downloadLink: string;
  type: string;
};

export const ViewFileDialog: React.FC<ViewFileDialogProps> = ({
  downloadLink,
  type,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="cursor-pointer flex items-center gap-1 bg-gray-200 hover:bg-gray-300 transition-all w-full p-1 rounded"
          title={`Visualizar ${type}`}
        >
          <FaFilePdf size={20} className="text-red-500" />
          <span className="font-bold">{type}</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Visualizar {type}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <FileViewer downloadLink={downloadLink} />

          <div className="text-right">
            <a
              href={downloadLink}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <FaDownload className="mr-2" />
              Baixar {type}
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function RecoverPasswordDialog() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function forgotPassword() {
    if (!email) {
      setError("O email não pode ser vazio");
      setSuccess(null);
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return;
    }
    setLoading(true);
    await handleForgotPassword({ email: email.trimEnd().trimStart() })
      .then((res) => {
        setSuccess("Se o e-mail fornecido estiver cadastrado, você receberá instruções para redefinir a senha.");
        setError(null);
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.data) {
          setError(err.response.data.message);
          setSuccess(null);
        } else {
          setError("Ocorreu um erro, tente novamente mais tarde");
          setSuccess(null);
        }
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setError(null);
          setSuccess(null);
        }, 3000);
      });
  }
  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex items-start gap-2">
          <span>Esqueceu a senha? </span>
          <button
            className="text-sky-900 self-start cursor-pointer"
            type="button"
          >
            Clique aqui
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="mt-8">
          {error && (
            <div className="bg-green-500 text-white p-2 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500 text-white p-2 rounded mb-4">
              {success}
            </div>
          )}
        </div>
        <DialogHeader>
          <DialogTitle>Recuperar senha</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="email" className="text-right">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3 outline-none p-2 rounded border border-gray-400 focus:border-gray-600"
              placeholder="Insira seu email"
            />
          </div>
        </div>
        <DialogFooter className="flex">
          <button
            onClick={() => forgotPassword()}
            className={`${loading ? "bg-gray-300 rounded p-2 text-gray-500 cursor-not-allowed" : "bg-sky-700 text-white rounded p-2 cursor-pointer self-start hover:bg-sky-800"}`}
          >
            {loading ? "Aguarde..." : "Enviar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
