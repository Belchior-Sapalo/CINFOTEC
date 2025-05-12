import { Role } from "../types/auth";
import type { ILinks } from "../types/links";

export const links: ILinks[] = [
  { id: 1, to: "/", label: "Início", roles: [Role.PUBLIC] },
  { id: 2, to: "/courses", label: "Cursos", roles: [Role.PUBLIC] },
  { id: 3, to: "/about", label: "Sobre", roles: [Role.STUDENT] },
  { id: 4, to: "/dashboard", label: "Dashboard", roles: [Role.ADMIN] },
  { id: 5, to: "/enrollments", label: "Inscrições", roles: [Role.STUDENT] },
];