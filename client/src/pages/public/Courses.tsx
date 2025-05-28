import { useEffect, useState } from "react";
import { handleGelAllCourses } from "../../api/coursesServices";
import type { ICourse } from "../../types/course";
import { CourseCard } from "../../components/ui/Cards";
import { Loader } from "@/components/ui/Loader";
import NoContent from "@/components/ui/NoContent";
import { MdInbox, MdQuestionMark } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { removeAccents } from "@/shared/functions";

export default function Courses() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>("");

  useEffect(() => {
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

    getAllCourses();
  }, []);

  if (loading) return <Loader />;

  if (courses?.length === 0)
    return <NoContent title="Sem Cursos" icon={<MdInbox />} />;

  const filteredCourses = searchKey
  ? courses.filter((course) => {
      const normalizedTitle = removeAccents(course.title.toLowerCase());
      const normalizedSearch = removeAccents(searchKey.toLowerCase());
      return normalizedTitle.includes(normalizedSearch);
    })
  : courses;
  
  return (
    <main className="py-4 sm:p-8">
      <div className="px-4 flex gap-2 flex-col sm:flex-row sm:items-center">
          <h1 className="text-2xl">Cursos</h1>

          <form action="" className="">
            <div className="flex bg-gray-200 py-2 px-4 rounded-2xl justify-between">
              <input
                type="text"
                className="outline-none"
                placeholder="Pesquisar"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <i className="text-white bg-gray-500 p-2 rounded-full">
                <FaSearch />
              </i>
            </div>
          </form>
        </div>
      {filteredCourses.length !== 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-8 min-h-full">
          {filteredCourses?.map((course) => (
            <CourseCard key={course.id} course={course}/>
          ))}
        </div>
      ) : (
        <NoContent title="Sem Resultados" icon={<MdQuestionMark />} />
      )}
    </main>
  );
}
