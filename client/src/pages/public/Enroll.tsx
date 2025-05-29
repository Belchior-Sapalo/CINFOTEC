import { handleGelCourse } from "@/api/coursesServices";
import ScrollToTop from "@/components/ScrollToTop";
import { CourseCard1 as CourseCard } from "@/components/ui/course";
import { RegisterEnrollDialog } from "@/components/ui/Dialogs";
import { Loader } from "@/components/ui/Loader";
import { useAuth } from "@/contexts/AuthContext";
import { type ICourse } from "@/types/course";
import { useEffect, useState } from "react";
import { FaGift, FaMoneyBill } from "react-icons/fa";
import { useSearchParams } from "react-router";

export default function Enroll() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState<boolean>(false);
  const [course, setCourse] = useState<ICourse | null>(null);
  const { state } = useAuth();

  useEffect(() => {
    async function getCourse() {
      setLoading(true);
      await handleGelCourse(id!)
        .then((res) => {
          setCourse(res.data);
        })
        .catch((err) => {})
        .finally(() => {
          setLoading(false);
        });
    }
    getCourse();
  }, [id]);

  if (loading) return <Loader label="Carregando curso..." />;

  return (
    <div className="flex justify-center p-4">
      <ScrollToTop/>
      <CourseCard.Container className="border border-gray-200 p-4 rounded-md transition-all shadow shadow-gray-100">
        <CourseCard.Header>
          <h1 className="text-2xl">{course?.title}</h1>
          <h4 className="border-l-2 border-l-sky-700 px-2 mb-2">
            {course?.duration}
          </h4>
          {!course?.payed && (
            <p className="flex items-center gap-2">
              {" "}
              <i className="text-amber-600">
                <FaGift />
              </i>{" "}
              Gratuito
            </p>
          )}
          {course?.payed && (
            <p className="flex items-center gap-2">
              {" "}
              <i className="text-green-800">
                <FaMoneyBill />
              </i>{" "}
              {course?.price} Kz
            </p>
          )}
        </CourseCard.Header>
        <CourseCard.Content>
          <div className="flex flex-col gap-2">
            {course?.description.split("\n").map((p, i) => (
              <p key={i} className="text-justify">
                {p}
              </p>
            ))}
          </div>
        </CourseCard.Content>
        <CourseCard.Footer className="mt-4">
          {state.user?.role === "STUDENT" && course?.vacancies! > 0 && (
            <RegisterEnrollDialog id={course?.id!} />
          )}
          {(!state.isAuthenticated && course?.vacancies! > 0 ) && (
            <h4 className="text-gray-400">Inicie sessão para se inscrever</h4>
          )}
          {course?.vacancies! <= 0 && (
            <h4 className="text-gray-400">
              Já não existem vagas para esse curso
            </h4>
          )}
        </CourseCard.Footer>
      </CourseCard.Container>
    </div>
  );
}
