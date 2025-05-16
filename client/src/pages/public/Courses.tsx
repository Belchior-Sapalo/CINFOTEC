import { useEffect, useState } from "react";
import { handleGelAllCourses } from "../../api/coursesServices";
import type { ICourse } from "../../types/course";
import { CourseCard } from "../../components/ui/Cards";
import { Loader } from "@/components/ui/Loader";
import NoContent from "@/components/ui/NoContent";
import { MdInbox } from "react-icons/md";

export default function Courses() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-8 min-h-full">
      {courses?.map((course) => (
        <CourseCard key={course.id} course={course} expanded={false} />
      ))}
    </div>
  );
}
