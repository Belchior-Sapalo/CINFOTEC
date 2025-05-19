import { handleGelAllCourses } from "@/api/coursesServices";
import { CourseCard1 as CourseCard } from "@/components/ui/course";
import {
  CreateCourseDialog,
  DeleteCourseDialog,
  EditCourseDialog,
} from "@/components/ui/Dialogs";
import { Loader } from "@/components/ui/Loader";
import NoContent from "@/components/ui/NoContent";
import type { ICourse } from "@/types/course";
import { useEffect, useState } from "react";
import { FaMoneyBill, FaGift } from "react-icons/fa";

export default function Courses() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>("");

  useEffect(() => {
    getAllCourses();
  }, []);

  async function getAllCourses() {
    setLoading(true);
    await handleGelAllCourses()
      .then((res) => {
        setCourses(res.data);
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
    return filteredCourses.map((course) => (
      <CourseCard.Container key={course.id}>
        <CourseCard.Header>
          <h1 className="text-2xl">{course.title}</h1>
          <h4 className="border-l-2 border-l-sky-700 px-2 mb-2">
            {course.duration}
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
          <div className="flex flex-col gap-2">
            {course.description.split("\n").map((p, i) => (
              <p className="text-justify" key={i}>
                {p}
              </p>
            ))}
          </div>
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
    ));
  };

  let filteredCourses: ICourse[] = searchKey
    ? courses.filter((course) =>
        course.title.toLowerCase().includes(searchKey.toLowerCase())
      )
    : courses;

  return (
    <div className="flex flex-col gap-4">
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
