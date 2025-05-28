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
  className = "border flex flex-col gap-4 justify-between border-gray-300 p-4 rounded-md shadow",
}: {
  information: IInformation;
  expanded: boolean;
  className?: string;
}) {
  const maxInfoBodyLength = 100;
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
    <div className={className}>
      <div>
        <h1 className="text-2xl mb-2">{information.title}</h1>
        <h5 className="border-l-2 border-green-600 px-2 mb-2">
          Data de publicação: {formatedDate(information.createdAt)}
        </h5>
        <h5 className="border-l-2 border-red-600 px-2 mb-2">
          Categoria: {information.category}
        </h5>
      </div>
      <div className="flex items-center justify-center">
        {loading ? (
          <h4>Carregando imagem...</h4>
        ) : (
          <img
            width={300}
            height={300}
            src={image ? image : imagePath}
            alt="Anexo da informação"
          />
        )}
      </div>
      <div>
        <p>
          {expanded
            ? information.body
            : information.body.length < maxInfoBodyLength
            ? information.body
            : `${information.body.substring(0, maxInfoBodyLength)}...`}
        </p>

        {!expanded && (
          <div className="mt-4">
            <Link
              to={`/informacao?id=${information.id}`}
              className="text-gray-600"
            >
              Ler mais...
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export function CourseCard({
  course
}: {
  course: ICourse
}) {
  const maxInfoBodyLength = 100;
  return (
    <CourseCard1.Container>
      <CourseCard1.Header>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">{course.title}</h1>
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
        </div>
        <h4 className="border-l-2 border-l-sky-700 px-2 mb-2">
          {course.duration}
        </h4>
      </CourseCard1.Header>
      <CourseCard1.Content>
        <p className="text-justify">
          {course.description.length <= maxInfoBodyLength
            ? course.description
            : `${course.description.substring(0, maxInfoBodyLength)}...`}
        </p>
      </CourseCard1.Content>
      <CourseCard1.Footer>
        <div className="mt-4">
          <Link
            to={`/inscrever-se?id=${course.id}`}
            className="text-gray-600"
          >
            Ver mais...
          </Link>
        </div>
      </CourseCard1.Footer>
    </CourseCard1.Container>
  );
}
