import { Role } from "../types/auth";
import type { ILinks } from "../types/links";

export const links: ILinks[] = [
  { id: 1, to: "/", label: "Início", roles: [Role.PUBLIC] },
  { id: 2, to: "/cursos", label: "Cursos", roles: [Role.PUBLIC] },
  { id: 3, to: "/sobre", label: "Sobre", roles: [Role.STUDENT, Role.PUBLIC] },
  { id: 4, to: "/gerencia/inscricoes", label: "Dashboard", roles: [Role.SUPER, Role.ADMIN] },
  { id: 5, to: "/inscricoes", label: "Inscrições", roles: [Role.STUDENT] },
];