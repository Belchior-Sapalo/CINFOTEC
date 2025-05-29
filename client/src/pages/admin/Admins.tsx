import { handleGetAllAdmins, handleGetAllStudents } from "@/api/userServices";
import ScrollToTop from "@/components/ScrollToTop";
import {
  DeleteAdminAccountDialog,
  RegisterAdminDialog,
} from "@/components/ui/Dialogs";
import { Loader } from "@/components/ui/Loader";
import NoContent from "@/components/ui/NoContent";
import { UserCard } from "@/components/ui/user";
import { type IUser } from "@/types/auth";
import { useEffect, useState } from "react";
import { FaIdCard, FaPhone } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { Link } from "react-router";

export default function Admins() {
  const [loading, setLoading] = useState<boolean>(false);
  const [admins, setAdmins] = useState<IUser[]>([]);
  const [searchKey, setSearchKey] = useState<string>("");

  useEffect(() => {
    getAdmins();
  }, []);

  async function getAdmins() {
    setLoading(true);
    await handleGetAllAdmins()
      .then((res) => {
        setAdmins(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  if (loading) return <Loader label="Carregando estudantes..." />;

  const filteredAdmins = searchKey
    ? admins.filter(
        (admin) =>
          admin.name?.toLocaleLowerCase().includes(searchKey.toLowerCase()) ||
          admin.email?.toLocaleLowerCase().includes(searchKey.toLowerCase()) ||
          admin.bi?.toLocaleLowerCase().includes(searchKey.toLowerCase())
      )
    : admins;

  function RenderAdmins() {
    return (
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
        {filteredAdmins.map((admin) => (
          <UserCard.Container
            key={admin.id}
            className="flex flex-col gap-4 bg-white border-gray-300 rounded-md shadow-md shadow-gray-400 p-4"
          >
            <UserCard.Header className="">
              <h1 className="text-2xl font-bold">{admin.name}</h1>
            </UserCard.Header>
            <UserCard.Content className="">
              <h4 className="flex items-center gap-2 text-gray-500">
                <i>
                  <MdMail />
                </i>
                {admin?.email}
              </h4>
              <h4 className="flex items-center gap-2 text-gray-500">
                <i>
                  <FaPhone />
                </i>
                {admin?.phoneNumber}
              </h4>
              <h4 className="flex items-center gap-2 text-gray-500">
                <i>
                  <FaIdCard />
                </i>
                {admin?.bi}
              </h4>
            </UserCard.Content>
            <UserCard.Footer className="">
              <UserCard.ActionsContainer className="flex justify-end">
                <UserCard.Action className="">
                  <DeleteAdminAccountDialog
                    id={admin.id!}
                    onReload={() => getAdmins()}
                  />
                </UserCard.Action>
              </UserCard.ActionsContainer>
            </UserCard.Footer>
          </UserCard.Container>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ScrollToTop/>
      <div className="flex items-center gap-2">
        <form className="flex gap-2 py-2">
          <input
            type="text"
            autoFocus
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="border border-gray-500 focus:border-gray-900 p-1 outline-none rounded"
            placeholder="Pesquisar"
          />
        </form>
        <RegisterAdminDialog onReload={() => getAdmins()} />
      </div>

      {admins.length === 0 ? (
        <NoContent
          title="Sem administradores"
          description="Não existem mais administradores"
        />
      ) : (
        <RenderAdmins />
      )}
    </div>
  );
}
