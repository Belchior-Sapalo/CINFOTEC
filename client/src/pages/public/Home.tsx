import { useEffect, useState } from "react";
import { handleGetAllInformations } from "../../api/informationsServices";
import type { IInformation } from "../../types/information";
import PaginatedInformations from "@/components/PaginetedInformations";
import { Loader } from "@/components/ui/Loader";
import NoContent from "@/components/ui/NoContent";
import { MdInbox, MdQuestionMark } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { removeAccents } from "@/shared/functions";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  const [informations, setInformations] = useState<IInformation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [searchKey, setSearchKey] = useState<string>("");

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

  const normalizedSearchKey = removeAccents(searchKey?.toLowerCase() || "");

  const filteredInformations = searchKey
    ? informations.filter((info) => {
        const normalizedTitle = removeAccents(info.title.toLowerCase());
        const normalizedCategory = removeAccents(info.category.toLowerCase());

        return (
          normalizedTitle.includes(normalizedSearchKey) ||
          normalizedCategory.includes(normalizedSearchKey)
        );
      })
    : informations;

  return (
    <div>
      <ScrollToTop/>
      <div className="py-4 sm:p-8">
        <div className="px-4 flex gap-2 flex-col sm:flex-row sm:items-center">
          <h1 className="text-2xl">Notícias</h1>

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
        {filteredInformations.length !== 0 ? (
          <PaginatedInformations informations={filteredInformations} />
        ) : (
          <NoContent title="Sem Resultados" icon={<MdQuestionMark />} />
        )}
      </div>
    </div>
  );
}
