import { handleGetStudentEnrollments } from "@/api/EnrollServices";
import { RenderEnrollments } from "@/components/RenderEnrollments";
import ScrollToTop from "@/components/ScrollToTop";
import { Loader } from "@/components/ui/Loader";
import NoContent from "@/components/ui/NoContent";
import { removeAccents } from "@/shared/functions";
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

  if (loading) return <Loader label="Carregango suas inscrições..." />;
  if (enrollments?.length === 0) return <NoContent title="Sem inscrições" />;

  const filteredEnrollments = enrollments?.filter((enrollment) => {
    const matchesFilter = filter ? enrollment.status === filter : true;

    const normalizedTitle = removeAccents(
      enrollment.course.title.toLowerCase()
    );
    const normalizedSearchKey = removeAccents(searchKey?.toLowerCase() || "");

    const matchesSearch = searchKey
      ? normalizedTitle.includes(normalizedSearchKey)
      : true;

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen  p-4">
      <ScrollToTop />

      <form className="flex gap-2 p-2 mb-4">
        <select
          className="bg-gray-500 pl-2 rounded-md text-white"
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
        <RenderEnrollments
          enrollments={filteredEnrollments!}
          onReload={getEnrollments}
          fromAdmin={false}
        />
      )}
    </div>
  );
}
