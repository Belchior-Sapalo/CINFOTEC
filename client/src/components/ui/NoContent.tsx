import { MdInbox } from "react-icons/md";

type NoContentProps = {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
};

export default function NoContent({
  title = "Nada aqui por enquanto",
  description = "Nenhum conteúdo disponível para exibir.",
  icon,
}: NoContentProps) {
  return (
    <div className="flex min-h-[50%] flex-col items-center justify-center py-16 text-center text-muted-foreground">
      {icon && <div className="mb-4 text-4xl text-gray-500">{icon}</div>}
      {!icon && <div className="mb-4 text-4xl text-gray-500"><MdInbox/></div>}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm mt-2">{description}</p>
    </div>
  );
}
