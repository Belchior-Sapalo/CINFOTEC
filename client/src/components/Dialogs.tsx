import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaPen } from "react-icons/fa";

import {
  handleUpdateName,
  handleUpdateEmail,
  handleUpdateBI,
  handleUpdatePhone,
  handleDeleteAccount,
} from "@/api/userServices";
import { useState } from "react";

export function EditNameDialog() {
  const [name, setName] = useState<string>("");

  async function updateName() {
    await handleUpdateName({ name: name })
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {});
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-sky-700 text-white rounded p-2 cursor-pointer hover:bg-sky-800 transition-all">
          <FaPen />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
            className="bg-sky-700 text-white rounded p-2 cursor-pointer self-start hover:bg-sky-800"
          >
            Salvar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditEmailDialog() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function updateEmail() {
    await handleUpdateEmail({ email: email, password: password })
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {});
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-sky-700 text-white rounded p-2 cursor-pointer hover:bg-sky-800 transition-all">
          <FaPen />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
              type="text"
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
        <DialogFooter className="flex">
          <button
            onClick={() => updateEmail()}
            className="bg-sky-700 text-white rounded p-2 cursor-pointer self-start hover:bg-sky-800"
          >
            Salvar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditBiDialog() {
  const [bi, setBi] = useState<string>("");
  async function updateBi() {
    await handleUpdateBI({ bi: bi })
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {});
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-sky-700 text-white rounded p-2 cursor-pointer hover:bg-sky-800 transition-all">
          <FaPen />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
            className="bg-sky-700 text-white rounded p-2 cursor-pointer self-start hover:bg-sky-800"
          >
            Salvar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditPhoneDialog() {
  const [phone, setPhone] = useState<string>("");
  async function updatePhone() {
    await handleUpdatePhone({ phoneNumber: phone })
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {});
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-sky-700 text-white rounded p-2 cursor-pointer hover:bg-sky-800 transition-all">
          <FaPen />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
            className="bg-sky-700 text-white rounded p-2 cursor-pointer self-start hover:bg-sky-800"
          >
            Salvar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteAccountDialog() {
  async function deleteAccount() {
    await handleDeleteAccount()
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {});
  }
  return (
    <Dialog>
      <DialogTrigger>
        <button className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-all cursor-pointer">
          Eliminar conta
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mt-8">Tem certeza que deseja continuar?</DialogTitle>
          <DialogDescription>
            Esta acção não pode ser desfeita. Isso irá eliminar permanentemente
            a sua conta e seus dados do servidor.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex">
          <button
            onClick={() => deleteAccount()}
            className="bg-red-600 text-white rounded p-2 cursor-pointer self-start hover:bg-red-700"
          >
            Eliminar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
