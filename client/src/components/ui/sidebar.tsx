import { NavLink } from "react-router";
import { Logo } from "./Logo";
import { MdDashboard, MdSecurity } from "react-icons/md";
import {
  FaArrowCircleLeft,
  FaArrowCircleRight,
  FaBars,
  FaBook,
  FaHome,
  FaInfo,
  FaPowerOff,
  FaUserCircle,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import FAB from "./FAB";
import { TooltipContent, TooltipProvider } from "./tooltip";
import { Tooltip, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Role } from "@/types/auth";
import type { ILinks } from "@/types/links";

const links: ILinks[] = [
  {id:1,  label: "Dashboard", to: "dashboard", roles: [Role.SUPER, Role.ADMIN]},
  {id:2, label: "Cursos", to: "gerencia/cursos", roles: [Role.SUPER, Role.ADMIN]},
  {id:3, label: "Informações", to: "gerencia/informacoes", roles: [Role.SUPER, Role.ADMIN]},
  {id:4, label: "Estudantes", to: "gerencia/estudantes", roles: [Role.SUPER, Role.ADMIN]},
  {id:5, label: "Inscrições", to: "gerencia/inscricoes", roles: [Role.SUPER, Role.ADMIN]},
  {id:6, label: "Administradores", to: "gerencia/administradores", roles: [Role.SUPER]},
  {id:7, label: "Perfil", to: "/perfil", roles: [Role.SUPER, Role.ADMIN] },
  //{ label: "Início", path: "/" },
];

const getIcon = (label: string) => {
  switch (label) {
    case "Início":
      return <FaHome />;
    case "Dashboard":
      return <MdDashboard />;
    case "Cursos":
      return <FaBook />;
    case "Informações":
      return <FaInfo />;
    case "Estudantes":
      return <FaUsers />;
    case "Inscrições":
      return <FaUserPlus />;
    case "Administradores":
      return <MdSecurity />;
    case "Perfil":
      return <FaUserCircle />;
  }
};

function LogoutButton({
  expanded,
  logout,
}: {
  expanded: boolean;
  logout: Function;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <button
            onClick={() => logout()}
            className="text-gray-700 flex items-center gap-2 cursor-pointer bg-gray-200 p-2 rounded-md hover:bg-gray-300"
          >
            {expanded ? (
              <span
                className={`${
                  expanded ? "flex" : "hidden"
                } text-gray-700 transition-all`}
              >
                Sair
              </span>
            ) : (
              ""
            )}
            <i>
              <FaPowerOff />
            </i>
          </button>
        </TooltipTrigger>
        <TooltipContent>Terminar sessão</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function SidebarHeader({ expanded }: { expanded: boolean }) {
  return (
    <div
      className={`${
        expanded ? "flex" : "hidden"
      } items-center transition-all duration-75`}
    >
      <Logo className="text-gray-600 text-2xl" />
    </div>
  );
}

function SidebarLinks({
  expanded,
  setExpanded,
  isMobile,
}: {
  expanded: boolean;
  setExpanded: Function;
  isMobile: boolean;
}) {
  const {state} = useAuth()

  return (
    <>
      {links.map((link) =>
        expanded ? (
          <NavLink
            onClick={() => setExpanded(false)}
            key={link.id}
            to={link.to}
            className={({ isActive }) =>
              `
            ${
              !link.roles.includes(state.user?.role!)
                ? "hidden"
                : "flex"
            }
            flex items-center ${
                expanded ? "" : "justify-center"
              } gap-2 p-2 rounded-md transition-all duration-75 ${
                isActive
                  ? "bg-gray-200 text-gray-700"
                  : "text-gray-500 hover:bg-gray-100"
              }`
            }
          >
            <i className={`text-[20px]`}>{getIcon(link.label)}</i>
            {isMobile && <span className={` text-gray-700`}>{link.label}</span>}
            {!isMobile && (
              <span
                className={`${expanded ? "block" : "hidden"} text-gray-700`}
              >
                {link.label}
              </span>
            )}
          </NavLink>
        ) : (
          <TooltipProvider key={link.label}>
            <Tooltip>
              <TooltipTrigger>
                <NavLink
                  onClick={() => setExpanded(false)}
                  key={link.label}
                  to={link.to}
                  className={({ isActive }) =>
                  `
                  ${
                    !link.roles.includes(state.user?.role!)
                      ? "hidden"
                      : "flex"
                  }
                  flex items-center ${
                      expanded ? "" : "justify-center"
                    } gap-2 p-2 rounded-md transition-all duration-75 ${
                      isActive
                        ? "bg-gray-200 text-gray-700"
                        : "text-gray-500 hover:bg-gray-100"
                    }`
                  }
                >
                  <i className={`text-[20px]`}>{getIcon(link.label)}</i>
                  {isMobile && (
                    <span className={` text-gray-700`}>{link.label}</span>
                  )}
                  {!isMobile && (
                    <span
                      className={`${
                        expanded ? "block" : "hidden"
                      } text-gray-700`}
                    >
                      {link.label}
                    </span>
                  )}
                </NavLink>
              </TooltipTrigger>
              <TooltipContent className="z-0">{link.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      )}
    </>
  );
}

export function MobileSidebar() {
  const { logout } = useAuth();
  const [expanded, setExpanded] = useState<boolean>(true);

  const toggleSidebar = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <aside
      className={`fixed lg:hidden min-h-screen flex-col gap-8 justify-between bg-white shadow-lg p-4 transition-all duration-75 w-60 ${
        expanded ? "left-0" : "left-[-100%]"
      }`}
    >
      <div className="">
        <div className="">
          <button
            className="relative left-[80%] cursor-pointer bg-gray-500 text-white p-1 rounded-md hover:bg-gray-600"
            onClick={toggleSidebar}
          >
            <FaArrowCircleLeft />
          </button>
        </div>
        <nav className="flex flex-col gap-4">
          <SidebarHeader expanded />
          <SidebarLinks
            expanded={expanded}
            setExpanded={setExpanded}
            isMobile={true}
          />
        </nav>
        <div
          className={`pt-10 flex items-center ${
            expanded ? "" : "justify-center"
          }`}
        >
          <LogoutButton expanded logout={logout} />
        </div>
      </div>
      {!expanded && (
        <FAB
          onClick={() => {
            setExpanded((prev) => !prev);
          }}
        >
          <FaBars />
        </FAB>
      )}
    </aside>
  );
}

export function DesktopSidebar() {
  const { logout } = useAuth();
  const [expanded, setExpanded] = useState<boolean>(true);

  const toggleSidebar = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <aside
      className={`hidden lg:flex flex-col min-h-screen gap-8 justify-between bg-white shadow-lg p-4 transition-all duration-75 ${
        expanded ? "w-50" : "w-16"
      }`}
    >
      <div className="">
        <div className="">
          <button
            className="relative left-[105%] cursor-pointer bg-gray-500 text-white p-1 rounded-md hover:bg-gray-600"
            onClick={toggleSidebar}
          >
            {expanded ? <FaArrowCircleLeft /> : <FaArrowCircleRight />}
          </button>
        </div>
        <nav className="flex flex-col gap-4">
          <SidebarHeader expanded={expanded} />
          <SidebarLinks
            expanded={expanded}
            setExpanded={setExpanded}
            isMobile={false}
          />
        </nav>
        <div
          className={`pt-10 flex items-center ${
            expanded ? "" : "justify-center"
          }`}
        >
          <LogoutButton expanded={expanded} logout={logout} />
        </div>
      </div>
    </aside>
  );
}

export function Sidebar() {
  return (
    <div>
      <MobileSidebar />
      <DesktopSidebar />
    </div>
  );
}
