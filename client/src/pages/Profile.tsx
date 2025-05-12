import {
  handleGetProfile,
  handleUpdatePassword,
} from "@/api/userServices";

import { Loader } from "@/components/Loader";
import NoContent from "@/components/NoContent";
import { useAuth } from "@/contexts/AuthContext";
import type { IUser } from "@/types/auth";
import { useEffect, useState } from "react";
import { FaIdCard, FaPen, FaPhone, FaUser } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { DeleteAccountDialog, EditBiDialog, EditEmailDialog, EditNameDialog, EditPhoneDialog } from "@/components/Dialogs";

export default function Profile() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    setLoading(true);
    await handleGetProfile()
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) return <Loader label="Carregando perfil..." />;
  if (!user)
    return (
      <NoContent
        title="Você não está autenticado"
        description="Inicie sessão para aceder ao perfil"
      />
    );

  return (
    <div className="min-h-screen flex flex-col items-center pt-8">
      <div className="border w-[80%] sm:w-[50%] flex flex-col gap-4 justify-between border-gray-300 px-4 py-8 rounded-md shadow">
        <h1 className="text-2xl text-gray-900">{user.name}</h1>
        <div className="flex justify-between gap-4 items-center">
          <p className="flex items-center gap-2 text-gray-900">
            <i>
              <FaUser />
            </i>
            {user.name}
          </p>
          <EditNameDialog/>
        </div>
        <div className="flex justify-between gap-4 items-center">
          <p className="flex items-center gap-2 text-gray-900">
            <i>
              <FaIdCard />
            </i>
            {user.bi}
          </p>
          <EditBiDialog/>
        </div>
        <div className="flex justify-between gap-4 items-center">
          <p className="flex items-center gap-2 text-gray-900">
            <i>
              <FaPhone />
            </i>
            {user.phoneNumber}
          </p>
          <EditPhoneDialog/>
        </div>
        <div className="flex justify-between gap-4 items-center">
          <p className="flex items-center gap-2 text-gray-900">
            <i>
              <MdMail />
            </i>
            {user.email}
          </p>
          <EditEmailDialog/>
        </div>
        <form
          action=""
          className="flex flex-col gap-2 border border-gray-300 p-2 rounded-md my-2"
        >
          <input
            type="text"
            id="senha"
            className="outline-none p-2 rounded border border-gray-300 focus:border-gray-600"
            placeholder="Insira sua nova senha"
          />
          <input
            type="text"
            id="senha"
            className="outline-none p-2 rounded border border-gray-300 focus:border-gray-600"
            placeholder="Confirme a senha"
          />

          <button className="bg-sky-700 text-white p-2 self-start rounded hover:bg-sky-800 transition-all">
            Alterar senha
          </button>
        </form>
        <div className="flex gap-8">
          <DeleteAccountDialog/>
        </div>
      </div>
    </div>
  );
}
