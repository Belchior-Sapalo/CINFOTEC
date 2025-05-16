import { useEffect, useState } from "react";
import type { IInformation } from "../../types/information";
import { formatedDate } from "../../shared/functions";
import { handleGetInformationImage } from "../../api/informationsServices";
import type { ICourse } from "../../types/course";
import { FaGift, FaMoneyBill } from "react-icons/fa";
import imagePath from "../../assets/images/news.jpg";
import { CourseCard1 } from "./course";
import { Link } from "react-router";

export function InformationCard({
  information,
  expanded,
}: {
  information: IInformation;
  expanded: boolean;
}) {
  const maxInfoBodyLength = 200;
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>();

  useEffect(() => {
    async function getInformationImage() {
      setLoading(true);
      await handleGetInformationImage(information.id)
        .then(async (res) => {
          const blob = res.data;
          const reader = new FileReader();

          reader.onloadend = () => {
            setImage(reader.result as string);
          };

          reader.readAsDataURL(blob);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    getInformationImage();
  }, [information]);

  return (
    <div className="border flex flex-col gap-4 justify-between border-gray-300 p-4 rounded-md shadow">
      <div>
        {loading ? (
          <h4>Carregando imagem...</h4>
        ) : (
          <img src={image ? image : imagePath} alt="Anexo da informação" />
        )}
      </div>
      <div>
        <h1 className="text-2xl mb-2">{information.title}</h1>
        <h5 className="border-l-2 border-green-600 px-2 mb-2">
          Data de publicação: {formatedDate(information.createdAt)}
        </h5>
        <h5 className="border-l-2 border-red-600 px-2 mb-2">
          Categoria: {information.category}
        </h5>
        <p>
          {expanded
            ? information.body
            : information.body.length < maxInfoBodyLength
            ? information.body
            : `${information.body.substring(0, maxInfoBodyLength)}...`}
        </p>

        <div className="mt-4">
          <button className="bg-gray-700 hover:bg-gray-800 transition-all cursor-pointer p-2 text-gray-50 rounded-md">
            mais...
          </button>
        </div>
      </div>
    </div>
  );
}

export function CourseCard({
  course,
  expanded,
}: {
  course: ICourse;
  expanded: boolean;
}) {
  const maxInfoBodyLength = 100;
  return (
    <CourseCard1.Container>
      <CourseCard1.Header>
        <h1 className="text-2xl">{course.title}</h1>
        <h4 className="border-l-2 border-l-sky-700 px-2 mb-2">
          {course.duration}
        </h4>
      </CourseCard1.Header>
      <CourseCard1.Content>
        <p>
          {expanded
            ? course.description
            : course.description.length < maxInfoBodyLength
            ? course.description
            : `${course.description.substring(0, maxInfoBodyLength)}...`}
        </p>
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
      </CourseCard1.Content>
      <CourseCard1.Footer>
        <div className="mt-4">
          <Link to={`/inscrever-se?id=${course.id}`}  className="bg-gray-700 hover:bg-gray-800 transition-all cursor-pointer p-2 text-gray-50 rounded-md">
            mais...
          </Link>
        </div>
      </CourseCard1.Footer>
    </CourseCard1.Container>
  );
}
