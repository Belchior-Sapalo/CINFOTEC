import { useEffect, useState } from "react";
import { handleGetAllInformations } from "../api/informationsServices";
import type { IInformation } from "../types/information";
import PaginatedInformations from "@/components/PaginetedInformations";
import { Loader } from "@/components/Loader";
import NoContent from "@/components/NoContent";
import { MdInbox } from "react-icons/md";

export default function Home() {
  const [informations, setInformations] = useState<IInformation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
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
    getInformations();
  }, []);

  if (loading) return <Loader />;

  if (informations?.length === 0)
    return <NoContent title="Sem informações" icon={<MdInbox />} />;

  return (
    <div>
      <div className="mt-8">
        <h1 className="text-2xl px-8">Notícias</h1>
        <PaginatedInformations informations={informations} />
      </div>
    </div>
  );
}
