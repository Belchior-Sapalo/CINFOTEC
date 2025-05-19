import {
  handleGetInformation,
  handleGetInformationImage,
} from "@/api/informationsServices";
import { InformationCard } from "@/components/ui/Cards";
import { InfoCard } from "@/components/ui/information";
import { Loader } from "@/components/ui/Loader";
import NoContent from "@/components/ui/NoContent";
import { type IInformation } from "@/types/information";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import imagePath from "../../assets/images/news.jpg";

export default function Information() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [information, setInformation] = useState<IInformation | null>(null);
  const [image, setImage] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getInformation() {
      setLoading(true);
      await handleGetInformation(id!)
        .then((res) => {
          setInformation(res.data);
        })
        .catch((err) => {
          setInformation(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    getInformation();
    async function getInformationImage() {
      setLoading(true);
      await handleGetInformationImage(id!)
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
  }, [id]);

  if (loading) return <Loader label="Carregando informação..." />;
  if (!information)
    return (
      <NoContent
        title="Erro ao buscar informação"
        description="Ocorreu um erro ao buscar detalhes da informação"
      />
    );

  return (
    <div className="min-h-screen flex justify-center p-8">
      <InfoCard.Container className="max-w-200 border flex flex-col gap-8 justify-between border-gray-300 p-4 rounded-md shadow">
        <InfoCard.Header>
          <h1 className="text-3xl">{information.title}</h1>
        </InfoCard.Header>
        <InfoCard.Content className="">
          <div className="flex items-center justify-center">
            {loading ? (
              <h4>Carregando imagem...</h4>
            ) : (
              <img
                width={300}
                height={300}
                src={image || imagePath}
                alt="Anexo da informação"
                className="rounded-xl"
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            {information.body.split("\n").map((p, i) => <p className="text-justify" key={i}>{p}</p>)}
          </div>
        </InfoCard.Content>
      </InfoCard.Container>
    </div>
  );
}
