import { handleGelAllCourses } from "@/api/coursesServices";
import ScrollToTop from "@/components/ScrollToTop";
import { CourseCard1 as CourseCard } from "@/components/ui/course";
import {
  CreateCourseDialog,
  DeleteCourseDialog,
  EditCourseDialog,
  RenderCourseCreatorDialog,
  RenderCourseDescriptionDialog,
} from "@/components/ui/Dialogs";
import { Loader } from "@/components/ui/Loader";
import NoContent from "@/components/ui/NoContent";
import { useAuth } from "@/contexts/AuthContext";
import { removeAccents } from "@/shared/functions";
import type { ICourse } from "@/types/course";
import { useEffect, useState } from "react";
import { FaGift, FaMoneyBill } from "react-icons/fa";

export default function Courses() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>("");
  const {state} = useAuth()

  useEffect(() => {
    getAllCourses();
  }, []);

  async function getAllCourses() {
    setLoading(true);
    await handleGelAllCourses()
      .then((res) => {
        setCourses(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  if (loading) return <Loader label="Carregando cursos..." />;
  if (courses.length === 0)
    return (
      <NoContent
        title="Sem cursos"
        description="Não existem cursos resgistrados"
      />
    );

  const RenderCourses = () => {
    const maxCourseLength = 100;

    return (
      <div className="grid md:grid-cols-3 gap-2">
        {filteredCourses.map((course) => (
          <CourseCard.Container key={course.id}>
            <CourseCard.Header>
              <h1 className="text-2xl my-2">{course.title}</h1>
              {state.user?.isSuperAdmin && <RenderCourseCreatorDialog author={course.createdBy!} />}
              <h4 className="border-l-2 border-l-sky-700 px-2 mb-2">
                Duração: <span>{course.duration}</span>
              </h4>
              <h4 className="border-l-2 border-l-sky-700 px-2 mb-2">
                Vagas: <span>{course.vacancies}</span>
              </h4>
              {!course.payed && (
                <p className="flex items-center gap-2">
                  {" "}
                  <i className="text-amber-600">
                    <FaGift />
                  </i>{" "}
                  Gratuito
                </p>
              )}
              {course.payed && (
                <p className="flex items-center gap-2">
                  {" "}
                  <i className="text-green-800">
                    <FaMoneyBill />
                  </i>{" "}
                  {course.price} Kz
                </p>
              )}
            </CourseCard.Header>
            <CourseCard.Content>
              <p className="mb-2">
                {course.description.length <= maxCourseLength
                  ? course.description
                  : `${course.description.substring(0, maxCourseLength)}...`}
              </p>
              <RenderCourseDescriptionDialog course={course} />
            </CourseCard.Content>
            <CourseCard.Footer>
              <div className="flex items-center gap-2">
                <DeleteCourseDialog
                  id={course.id}
                  onReload={() => getAllCourses()}
                />
                <EditCourseDialog
                  id={course.id}
                  data={course}
                  onReload={() => getAllCourses()}
                />
              </div>
            </CourseCard.Footer>
          </CourseCard.Container>
        ))}
      </div>
    );
  };

  let filteredCourses: ICourse[] = searchKey
    ? courses.filter((course) =>
        removeAccents(course.title).toLowerCase().includes(removeAccents(searchKey).toLowerCase())
      )
    : courses;

  return (
    <div className="flex flex-col gap-4">
      <ScrollToTop/>
      <div className="flex gap-2">
        <form action="">
          <input
            type="text"
            autoFocus
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="border border-gray-500 focus:border-gray-900 p-1 outline-none rounded"
            placeholder="Pesquisar"
          />
        </form>
        <CreateCourseDialog onReload={() => getAllCourses()} />
      </div>
      {filteredCourses.length === 0 ? (
        <NoContent title="Sem resultados" />
      ) : (
        <RenderCourses />
      )}
    </div>
  );
}
