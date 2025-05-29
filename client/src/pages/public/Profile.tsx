import { handleGetProfile } from "@/api/userServices";

import { Loader } from "@/components/ui/Loader";
import NoContent from "@/components/ui/NoContent";
import type { IUser } from "@/types/auth";
import { useEffect, useState } from "react";
import { FaIdCard, FaPhone, FaUser } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import {
  DeleteAccountDialog,
  EditBiDialog,
  EditEmailDialog,
  EditNameDialog,
  EditPasswordDialog,
  EditPhoneDialog,
} from "@/components/ui/Dialogs";
import { Avatar } from "@/components/Avatar";
import ScrollToTop from "@/components/ScrollToTop";

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
        console.log(res)
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
      <ScrollToTop/>
      <div className="border w-[80%] sm:w-[50%] flex flex-col gap-4 justify-between border-gray-300 px-4 py-8 rounded-md shadow">
        <div className="flex items-center justify-center">
          <Avatar name={user.name} className="text-white text-2xl h-15 w-15 sm:text-4xl font-extrabold bg-sky-800 hover:bg-sky-900 transition-all p-2 rounded-full cursor-pointer flex items-center justify-center sm:h-20 sm:w-20"/>
        </div>
        <div className="flex justify-between gap-4 items-center">
          <p className="flex items-center gap-2 text-gray-600">
            <i>
              <FaUser />
            </i>
            {user.name}
          </p>
          <EditNameDialog
            onReload={() => getProfile()}
            currentValue={user.name}
          />
        </div>
        <div className="flex justify-between gap-4 items-center">
          <p className="flex items-center gap-2 text-gray-600">
            <i>
              <FaIdCard />
            </i>
            {user.bi}
          </p>
          <EditBiDialog onReload={() => getProfile()} currentValue={user.bi} />
        </div>
        <div className="flex justify-between gap-4 items-center">
          <p className="flex items-center gap-2 text-gray-600">
            <i>
              <FaPhone />
            </i>
            {user.phoneNumber}
          </p>
          <EditPhoneDialog
            onReload={() => getProfile()}
            currentValue={user.phoneNumber}
          />
        </div>
        <div className="flex justify-between gap-4 items-center">
          <p className="flex items-center gap-2 text-gray-600">
            <i>
              <MdMail />
            </i>
            {user.email}
          </p>
          <EditEmailDialog
            onReload={() => getProfile()}
            currentValue={user.email}
          />
        </div>
        <div className="flex gap-2 border border-gray-300 p-2 rounded-md my-2">
          <EditPasswordDialog />
          <DeleteAccountDialog />
        </div>
      </div>
    </div>
  );
}
