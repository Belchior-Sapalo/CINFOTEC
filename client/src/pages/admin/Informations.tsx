import { handleGetAllInformations } from "@/api/informationsServices";
import ScrollToTop from "@/components/ScrollToTop";
import {
  CreateInfoDialog,
  DeleteInfoDialog,
  EditInfoDialog,
  RenderInfoDescriptionDialog,
} from "@/components/ui/Dialogs";
import { InfoCard } from "@/components/ui/information";
import { Loader } from "@/components/ui/Loader";
import NoContent from "@/components/ui/NoContent";
import { formatDateFromISOParts, removeAccents } from "@/shared/functions";
import { type IInformation } from "@/types/information";
import { useEffect, useState } from "react";

export default function Informations() {
  const [informations, setInformations] = useState<IInformation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchKey, setSearchKey] = useState<string>("");

  useEffect(() => {
    getInformations();
  }, []);

  async function getInformations() {
    setLoading(true);
    await handleGetAllInformations()
      .then((res) => {
        setInformations(res.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function RenderInformations() {
    const maxInfoLength = 100;
    return (
      <div className="grid md:grid-cols-3 gap-2">
        {filteredInformations.map((information) => (
          <InfoCard.Container>
            <InfoCard.Header>
              <h1 className="text-2xl mb-2">{information.title}</h1>
              <h5 className="border-l-2 border-green-600 px-2 mb-2">
                Data de publicação: {formatDateFromISOParts(information.createdAt)}
              </h5>
              <h5 className="border-l-2 border-red-600 px-2 mb-2">
                Categoria: {information.category}
              </h5>
            </InfoCard.Header>
            <InfoCard.Content className="">
              <p className="text-justify mb-2">
                {information.body.length <= maxInfoLength
                  ? information.body
                  : `${information.body.substring(0, maxInfoLength)}...`}
              </p>
              <RenderInfoDescriptionDialog information={information} />
            </InfoCard.Content>
            <InfoCard.Footer>
              <div className="flex items-center gap-2">
                <DeleteInfoDialog
                  id={information.id}
                  onReload={() => getInformations()}
                />
                <EditInfoDialog
                  data={information}
                  onReload={() => getInformations()}
                />
              </div>
            </InfoCard.Footer>
          </InfoCard.Container>
        ))}
      </div>
    );
  }

  if (loading) return <Loader label="Carregando informações..." />;
  if (informations.length === 0)
    return (
      <NoContent
        title="Sem informações"
        description="Não existem informações publicadas"
      />
    );

  let filteredInformations: IInformation[] = searchKey
    ? informations.filter((info) =>
        removeAccents(info.title).toLowerCase().includes(removeAccents(searchKey).toLowerCase())
      )
    : informations;

  return (
    <div className="flex flex-col gap-4 justify-center">
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
        <CreateInfoDialog onReload={() => getInformations()} />
      </div>
      {filteredInformations.length === 0 ? (
        <NoContent title="Sem resultados" />
      ) : (
        <RenderInformations />
      )}
    </div>
  );
}
