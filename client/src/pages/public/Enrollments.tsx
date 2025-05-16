import {
  handleDeleteEnrollment,
  handleGetStudentEnrollments,
} from "@/api/EnrollServices";
import { ConfirmActionDialog, ViewFileDialog } from "@/components/ui/Dialogs";
import { EnrollmentCard } from "@/components/ui/enrollment";
import { Loader } from "@/components/ui/Loader";
import NoContent from "@/components/ui/NoContent";
import { formatedDate, getStatus, getStyle } from "@/shared/functions";
import { type IEnrollment } from "@/types/enrollment";
import { useEffect, useState } from "react";

export default function Enrollemnts() {
  const [enrollments, setEnrollments] = useState<IEnrollment[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  useEffect(() => {
    getEnrollments();
  }, []);
  async function getEnrollments() {
    setLoading(true);
    await handleGetStudentEnrollments()
      .then((res) => {
        setEnrollments(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function deleteEnrollment(id: string) {
    setLoading(true);
    await handleDeleteEnrollment(id)
      .then((res) => {
        getEnrollments();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(true);
      });
  }

  if (loading) return <Loader label="Carregango suas inscrições..." />;
  if (enrollments?.length === 0) return <NoContent title="Sem inscrições" />;

  function RenderEnrolments() {
    return (
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 pb-8">
        {filteredEnrollments?.map((enrollment) => (
          <EnrollmentCard.Container className="flex flex-col gap-4 bg-white border-gray-300 rounded-md shadow-md shadow-gray-400">
            <EnrollmentCard.Header className="flex items-center justify-between bg-gray-500 p-2 text-white rounded-tl-md rounded-tr-md">
              <h1 className="text-2xl font-bold ">{enrollment.course.title}</h1>
              <span
                className={`p-0.5 px-1 text-[10px] rounded text-white font-extrabold ${getStyle(
                  enrollment.status
                )}`}
              >
                {getStatus(enrollment.status)}
              </span>
            </EnrollmentCard.Header>
            <EnrollmentCard.Content className="p-2">
              <h1>Data: {formatedDate(enrollment.createdAt)}</h1>
              <div className="flex items-center justify-between gap-2 px-2 mt-8">
                {enrollment.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex flex-col justify-center items-center"
                  >
                    <ViewFileDialog
                      key={file.id}
                      downloadLink={file.downloadLink}
                      type={file.type}
                    />
                  </div>
                ))}
              </div>
            </EnrollmentCard.Content>
            <EnrollmentCard.Footer className="p-2">
              <EnrollmentCard.ActionsContainer className="flex items-center gap-2 justify-end">
                {enrollment.status === "PENDING" && (
                  <EnrollmentCard.Action className="">
                    <ConfirmActionDialog
                      tooltipContent="Cancelar inscrição"
                      onConfirm={() => deleteEnrollment(enrollment.id)}
                    >
                      <button className="bg-red-500 hover:bg-red-700 transition-all cursor-pointer text-white  p-2 text-[14px] font-black rounded-md">
                        Cancelar
                      </button>
                    </ConfirmActionDialog>
                  </EnrollmentCard.Action>
                )}
              </EnrollmentCard.ActionsContainer>
            </EnrollmentCard.Footer>
          </EnrollmentCard.Container>
        ))}
      </div>
    );
  }

  const filteredEnrollments =
    filter || searchKey
      ? enrollments?.filter((enrollment) => {
          return filter
            ? enrollment.status === filter &&
                enrollment.course.title
                  .toLowerCase()
                  .includes(searchKey.toLowerCase())
            : enrollment.course.title
                .toLowerCase()
                .includes(searchKey.toLowerCase());
        })
      : enrollments;

  return (
    <div className="min-h-screen  p-4">
      <form className="flex gap-2 p-2 mb-4">
        <select
          className="bg-gray-500 p-2 rounded-md text-white"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Todas</option>
          <option value="PENDING">Pendentes</option>
          <option value="APPROVED">Aprovadas</option>
          <option value="REJECTED">Rejeitadas</option>
        </select>
        <input
          type="text"
          autoFocus
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          className="border border-gray-500 focus:border-gray-900 p-1 outline-none rounded"
          placeholder="Pesquisar"
        />
      </form>
      {filteredEnrollments?.length === 0 ? (
        <NoContent
          title="Não existem inscrições com o estado seleccionado"
          description=""
        />
      ) : (
        <RenderEnrolments />
      )}
    </div>
  );
}
