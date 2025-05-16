import { handleGetAllStudents } from "@/api/userServices";
import { Loader } from "@/components/ui/Loader";
import NoContent from "@/components/ui/NoContent";
import { UserCard } from "@/components/ui/user";
import { type IStudent } from "@/types/enrollment";
import { useEffect, useState } from "react";
import { FaIdCard, FaPhone } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { Link } from "react-router";

export default function Students() {
  const [loading, setLoading] = useState<boolean>(false);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [searchKey, setSearchKey] = useState<string>("");

  useEffect(() => {
    getStudents();
  }, []);

  async function getStudents() {
    setLoading(true);
    await handleGetAllStudents()
      .then((res) => {
        console.log(res);
        setStudents(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  if (loading) return <Loader label="Carregando estudantes..." />;
  if (students.length === 0)
    return (
      <NoContent
        title="Sem estudantes"
        description="Não existem estudantes inscritos"
      />
    );

  const filteredStudents = searchKey
    ? students.filter(
        (student) =>
          student.name?.toLocaleLowerCase().includes(searchKey.toLowerCase()) ||
          student.email
            ?.toLocaleLowerCase()
            .includes(searchKey.toLowerCase()) ||
          student.bi?.toLocaleLowerCase().includes(searchKey.toLowerCase())
      )
    : students;

  function RenderStudents() {
    return (
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
        {filteredStudents.map((student) => (
          <UserCard.Container
            key={student.id}
            className="flex flex-col gap-4 bg-white border-gray-300 rounded-md shadow-md shadow-gray-400 p-4"
          >
            <UserCard.Header className="">
              <h1 className="text-2xl font-bold">{student.name}</h1>
            </UserCard.Header>
            <UserCard.Content className="">
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
            </UserCard.Content>
            <UserCard.Footer className="">
              <UserCard.ActionsContainer className="">
                <UserCard.Action className="">
                  <Link
                    to={`/gerencia/inscricoes?bi=${student.bi}`}
                    className="font-bold text-gray-600"
                  >
                    Ver inscrições
                  </Link>
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
      <RenderStudents />
    </div>
  );
}
