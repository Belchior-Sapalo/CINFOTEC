import { NavLink } from "react-router";
import type { ILinks } from "../types/links";
import { Role } from "../types/auth";

const links: ILinks[] = [
    {id: 1, to: "/", label: "Início", roles: [Role.PUBLIC]},
    {id: 2, to: "/courses", label: "Cursos", roles: [Role.PUBLIC]},
    {id: 3, to: "/about", label: "Sobre", roles: [Role.PUBLIC]},
    {id: 4, to: "/profile", label: "Perfil", roles: [Role.ADMIN, Role.USER]},
    {id: 5, to: "/dashboard", label: "Dashboard", roles: [Role.ADMIN]},
    {id: 6, to: "/enrollments", label: "Inscrições", roles: [Role.USER]},
    {id: 7, to: "/auth", label: "Login", roles: [Role.PUBLIC]},
]

export function MobileNavBar() {
  return (
    <nav>
      <div>
        <h1>Logo</h1>
      </div>

      <ul>
        {links.map((link) => (
          <li key={link.id}>
            <NavLink to={link.to} className={({ isActive }) => (isActive ? "" : "")}>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
